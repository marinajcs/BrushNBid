import { expect } from 'chai';
import sinon from 'sinon';
import { Request, Response } from 'express';
import * as obraController from '../src/controllers/obraController';
import pool from '../src/db';

describe('Obra Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let mockQuery: sinon.SinonStub;
    let mockLogger: sinon.SinonStub;

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

    it('should return all obras on getAllObras', async () => {
        const mockObras = [{ id: 1, titulo: 'Obra1' }, { id: 2, titulo: 'Obra2' }];
        mockQuery.resolves({ rows: mockObras });

        await obraController.getAllObras(req as Request, res as Response);

        expect(mockQuery.calledOnceWith('SELECT * FROM obras')).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith(mockObras)).to.be.true;
    });

    it('should handle errors in getAllObras', async () => {
        mockQuery.rejects(new Error('Database error'));

        await obraController.getAllObras(req as Request, res as Response);

        expect((res.status as sinon.SinonStub).calledOnceWith(500)).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith({ message: 'Error en el servidor' })).to.be.true;
    });

    it('should return an obra by ID on getObraById', async () => {
        req.params = { id: '1' };
        const mockObra = { id: 1, titulo: 'Obra1' };
        mockQuery.resolves({ rows: [mockObra] });

        await obraController.getObraById(req as Request, res as Response);

        expect(mockQuery.calledOnceWith('SELECT * FROM obras WHERE id = $1', ['1'])).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith(mockObra)).to.be.true;
    });

    it('should handle obra not found in getObraById', async () => {
        req.params = { id: '99' };
        mockQuery.resolves({ rows: [] });

        await obraController.getObraById(req as Request, res as Response);

        expect((res.status as sinon.SinonStub).calledOnceWith(404)).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith({ message: 'Obra no encontrada' })).to.be.true;
    });

    it('should return obras by user ID on getObrasByUser', async () => {
        req.params = { id: '1' };
        const mockObras = [{ id: 1, titulo: 'Obra1', propiedad_id: '1' }, { id: 2, titulo: 'Obra2', propiedad_id: '1' }];
        mockQuery.resolves({ rows: mockObras });

        await obraController.getObrasByUser(req as Request, res as Response);

        expect(mockQuery.calledOnceWith('SELECT * FROM obras WHERE propiedad_id = $1', ['1'])).to.be.true;
    });

    it('should handle obras not found in getObrasByUser', async () => {
        req.params = { id: '99' };
        mockQuery.resolves({ rows: [] });

        await obraController.getObrasByUser(req as Request, res as Response);

        expect((res.status as sinon.SinonStub).calledOnceWith(404)).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith({ message: 'Obras no encontradas' })).to.be.true;
    });

    it('should create a new obra on createObra', async () => {
        req.body = { titulo: 'Nueva Obra', autoria_id: 1, propiedad_id: 2, tipo: 'Pintura', descripcion: 'Arte abstracto', imagen: 'url' };
        const mockObra = { id: 1, ...req.body };
        mockQuery.resolves({ rows: [mockObra] });

        await obraController.createObra(req as Request, res as Response);

        expect(mockQuery.calledOnce).to.be.true;
        expect((res.status as sinon.SinonStub).calledOnceWith(201)).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith(mockObra)).to.be.true;
    });

    it('should handle missing fields in createObra', async () => {
        req.body = {};

        await obraController.createObra(req as Request, res as Response);

        expect((res.status as sinon.SinonStub).calledOnceWith(400)).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith({ message: 'Todos los campos son obligatorios' })).to.be.true;
    });

    it('should update an existing obra on updateObra', async () => {
        req.params = { id: '1' };
        req.body = { titulo: 'Obra Actualizada' };
        const existingObra = { id: 1, titulo: 'Obra Original', autoria_id: 1, propiedad_id: 2, tipo: 'Pintura', descripcion: 'Arte', imagen: 'url' };
        const updatedObra = { ...existingObra, titulo: 'Obra Actualizada' };
        mockQuery.onFirstCall().resolves({ rows: [existingObra] });
        mockQuery.onSecondCall().resolves({ rows: [updatedObra] });

        await obraController.updateObra(req as Request, res as Response);

        expect(mockQuery.callCount).to.equal(2);
        expect((res.json as sinon.SinonStub).calledOnceWith(updatedObra)).to.be.true;
    });

    it('should delete an existing obra on deleteObra', async () => {
        req.params = { id: '1' };
        mockQuery.resolves({ rows: [{ id: 1 }] });

        await obraController.deleteObra(req as Request, res as Response);

        expect(mockQuery.calledOnceWith('DELETE FROM obras WHERE id = $1 RETURNING *', ['1'])).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith({ message: 'Obra eliminada correctamente' })).to.be.true;
    });

    it('should handle obra not found in deleteObra', async () => {
        req.params = { id: '99' };
        mockQuery.resolves({ rows: [] });

        await obraController.deleteObra(req as Request, res as Response);

        expect((res.status as sinon.SinonStub).calledOnceWith(404)).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith({ message: 'Obra no encontrada' })).to.be.true;
    });

    after(() => {
        const exitTimeout = 5000;
        setTimeout(() => {
            process.exit(0);
        }, exitTimeout);
    });
});
