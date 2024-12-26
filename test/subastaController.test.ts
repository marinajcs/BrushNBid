import { expect } from 'chai';
import sinon from 'sinon';
import { Request, Response } from 'express';
import * as subastasController from '../src/controllers/subastaController';
import pool from '../src/db';

describe('Subastas Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let mockQuery: sinon.SinonStub;
    let mockTransaction: sinon.SinonStub;

    beforeEach(() => {
        req = {};
        res = {
            json: sinon.stub(),
            
            status: sinon.stub().returnsThis(),
        };
        sinon.stub(console, 'error');
        mockQuery = sinon.stub(pool, 'query');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return all subastas on getAllSubastas', async () => {
        const mockSubastas = [{ id: 1, obra_id: 1, vendedor_id: 1 }, { id: 2, obra_id: 2, vendedor_id: 2 }];
        mockQuery.resolves({ rows: mockSubastas });

        await subastasController.getAllSubastas(req as Request, res as Response);

        expect(mockQuery.calledOnceWith('SELECT * FROM subastas')).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith(mockSubastas)).to.be.true;
    });

    it('should handle errors in getAllSubastas', async () => {
        mockQuery.rejects(new Error('Database error'));

        await subastasController.getAllSubastas(req as Request, res as Response);

        expect((res.status as sinon.SinonStub).calledOnceWith(500)).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith({ message: 'Error en el servidor' })).to.be.true;
    });

    it('should return active subastas on getActiveSubastas', async () => {
        const mockActiveSubastas = [{ id: 1, adjudicado: false }, { id: 2, adjudicado: false }];
        mockQuery.resolves({ rows: mockActiveSubastas });

        await subastasController.getActiveSubastas(req as Request, res as Response);

        expect(mockQuery.calledOnce).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith(mockActiveSubastas)).to.be.true;
    });

    it('should create a new subasta on createSubasta', async () => {
        req.body = { obra_id: 1, vendedor_id: 1, precio_inicial: 100 };
        mockQuery.onFirstCall().resolves({ rows: [] }); // No existing subasta
        mockQuery.onSecondCall().resolves({ rows: [{ id: 1, obra_id: 1, vendedor_id: 1, precio_inicial: 100 }] });

        await subastasController.createSubasta(req as Request, res as Response);

        expect(mockQuery.calledTwice).to.be.true;
        expect((res.status as sinon.SinonStub).calledOnceWith(201)).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith(sinon.match.object)).to.be.true;
    });

    it('should handle existing subasta on createSubasta', async () => {
        req.body = { obra_id: 1, vendedor_id: 1, precio_inicial: 100 };
        mockQuery.resolves({ rows: [{ id: 1 }] }); // Existing subasta

        await subastasController.createSubasta(req as Request, res as Response);

        expect((res.status as sinon.SinonStub).calledOnceWith(400)).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith({ message: 'Ya existe una subasta para esta obra' })).to.be.true;
    });

    it('should return a subasta by ID on getSubastaById', async () => {
        req.params = { id: '1' };
        const mockSubasta = { id: 1, obra_id: 1, vendedor_id: 1 };
        mockQuery.resolves({ rows: [mockSubasta] });

        await subastasController.getSubastaById(req as Request, res as Response);

        expect(mockQuery.calledOnceWith('SELECT * FROM subastas WHERE id = $1', ['1'])).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith(mockSubasta)).to.be.true;
    });

    it('should handle subasta not found on getSubastaById', async () => {
        req.params = { id: '1' };
        mockQuery.resolves({ rows: [] });

        await subastasController.getSubastaById(req as Request, res as Response);

        expect((res.status as sinon.SinonStub).calledOnceWith(404)).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith({ message: 'Subasta no encontrada' })).to.be.true;
    });

    it('should handle a new bid on addPuja', async () => {
        req.params = { id: '1' };
        req.body = { user_id: 1, cantidad: 200 };
        const mockClient = {
            query: sinon.stub(),
            release: sinon.stub(),
        };
    
        sinon.stub(pool, 'connect').resolves(mockClient as any);
    
        mockClient.query.onCall(0).resolves(); // BEGIN
        mockClient.query.onCall(1).resolves({ rows: [{ precio_actual: 100 }] }); // Get current price
        mockClient.query.onCall(2).resolves({ rows: [{ wallet: 500 }] }); // Get user's wallet
        mockClient.query.onCall(3).resolves({ rows: [{ cantidad: 0 }] }); // User's last bid
        mockClient.query.onCall(4).resolves(); // Update wallet
        mockClient.query.onCall(5).resolves({ rows: [{ id: 1, cantidad: 200 }] }); // Insert new bid
        mockClient.query.onCall(6).resolves(); // COMMIT
    
        await subastasController.addPuja(req as Request, res as Response);
    
        expect(mockClient.query.callCount).to.equal(7);
        expect((res.status as sinon.SinonStub).calledOnceWith(201)).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith(sinon.match.object)).to.be.true;
    });
    

    it('should adjudicate a subasta', async () => {
        req.params = { id: '1' };
        const mockClient = {
            query: sinon.stub(),
            release: sinon.stub(),
        };
    
        sinon.stub(pool, 'connect').resolves(mockClient as any);
    
        mockClient.query.onCall(0).resolves(); // BEGIN
        mockClient.query.onCall(1).resolves({ rows: [{ user_id: 1, cantidad: 300 }] }); // Get best bid
        mockClient.query.onCall(2).resolves(); // Update obra ownership
        mockClient.query.onCall(3).resolves({ rows: [{ user_id: 2, cantidad: 200 }] }); // Get losing bidders
        mockClient.query.onCall(4).resolves(); // Refund losing bidder
        mockClient.query.onCall(5).resolves(); // Mark subasta as adjudicated
        mockClient.query.onCall(6).resolves(); // COMMIT
    
        await subastasController.adjudicarSubasta(req as Request, res as Response);
    
        expect(mockClient.query.callCount).to.equal(7);
        expect((res.status as sinon.SinonStub).calledOnceWith(200)).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith(sinon.match.object)).to.be.true;
    });
    

    it('should delete a subasta', async () => {
        req.params = { id: '1' };
        mockQuery.resolves({ rows: [{ id: 1 }] });

        await subastasController.deleteSubasta(req as Request, res as Response);

        expect(mockQuery.calledOnceWith('DELETE FROM subastas WHERE id = $1 RETURNING *', ['1'])).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith({ message: 'Subasta eliminada correctamente' })).to.be.true;
    });

    it('should handle subasta not found on deleteSubasta', async () => {
        req.params = { id: '99' };
        mockQuery.resolves({ rows: [] });

        await subastasController.deleteSubasta(req as Request, res as Response);

        expect((res.status as sinon.SinonStub).calledOnceWith(404)).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith({ message: 'Subasta no encontrada' })).to.be.true;
    });

    it('should handle subasta not found on deleteSubasta', async () => {
        req.params = { id: '99' };
        mockQuery.resolves({ rows: [] });

        await subastasController.deleteSubasta(req as Request, res as Response);

        expect(mockQuery.calledOnceWith('DELETE FROM subastas WHERE id = $1 RETURNING *', ['99'])).to.be.true;
        expect((res.status as sinon.SinonStub).calledOnceWith(404)).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith({ message: 'Subasta no encontrada' })).to.be.true;
    });

    it('should handle errors in deleteSubasta', async () => {
        req.params = { id: '1' };
        mockQuery.rejects(new Error('Database error'));

        await subastasController.deleteSubasta(req as Request, res as Response);

        expect((res.status as sinon.SinonStub).calledOnceWith(500)).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith({ message: 'Error en el servidor' })).to.be.true;
    });

    it('should handle errors during adjudication', async () => {
        req.params = { id: '1' };
        const mockClient = {
            query: sinon.stub(),
            release: sinon.stub(),
        };
    
        sinon.stub(pool, 'connect').resolves(mockClient as any);
    
        mockClient.query.onCall(0).resolves(); // BEGIN
        mockClient.query.onCall(1).rejects(new Error('Transaction error')); // Simulate error during get best bid
        mockClient.query.onCall(2).resolves(); // ROLLBACK
    
        await subastasController.adjudicarSubasta(req as Request, res as Response);
    
        expect(mockClient.query.callCount).to.equal(3);
        expect((res.status as sinon.SinonStub).calledOnceWith(500)).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith({ message: 'Error en el servidor' })).to.be.true;
    });
    

    it('should handle errors during addPuja', async () => {
        req.params = { id: '1' };
        req.body = { user_id: 1, cantidad: 200 };
        const mockClient = {
            query: sinon.stub(),
            release: sinon.stub(),
        };
    
        sinon.stub(pool, 'connect').resolves(mockClient as any);
    
        mockClient.query.onCall(0).resolves(); // BEGIN
        mockClient.query.onCall(1).rejects(new Error('Transaction error')); // Simulate error during get current price
        mockClient.query.onCall(2).resolves(); // ROLLBACK
    
        await subastasController.addPuja(req as Request, res as Response);
    
        expect(mockClient.query.callCount).to.equal(3);
        expect((res.status as sinon.SinonStub).calledOnceWith(500)).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith({ message: 'Error en el servidor' })).to.be.true;
    });
    

    it('should handle pujas not found on getPujas', async () => {
        req.params = { id: '1' };
        mockQuery.resolves({ rows: [] });

        await subastasController.getPujas(req as Request, res as Response);

        expect(mockQuery.calledOnceWith('SELECT * FROM pujas WHERE subasta_id = $1', ['1'])).to.be.true;
        expect((res.status as sinon.SinonStub).calledOnceWith(404)).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith({ message: 'Pujas no encontradas' })).to.be.true;
    });

    it('should return pujas for a subasta on getPujas', async () => {
        req.params = { id: '1' };
        const mockPujas = [{ id: 1, cantidad: 100, user_id: 1 }, { id: 2, cantidad: 150, user_id: 2 }];
        mockQuery.resolves({ rows: mockPujas });

        await subastasController.getPujas(req as Request, res as Response);

        expect(mockQuery.calledOnceWith('SELECT * FROM pujas WHERE subasta_id = $1', ['1'])).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith(mockPujas)).to.be.true;
    });

    after(() => {
        const exitTimeout = 5000;
        setTimeout(() => {
            process.exit(0);
        }, exitTimeout);
    });
});
