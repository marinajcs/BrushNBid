import { expect } from 'chai';
import sinon from 'sinon';
import { Request, Response } from 'express';
import * as userController from '../src/controllers/userController';
import pool from '../src/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('User Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let mockQuery: sinon.SinonStub;

    beforeEach(() => {
        req = {};
        res = {
            json: sinon.stub(),
            status: sinon.stub().returnsThis(),
        };
        mockQuery = sinon.stub(pool, 'query');
        sinon.stub(console, 'error');
        sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
        sinon.stub(bcrypt, 'compare').resolves(true);
        sinon.stub(jwt, 'sign').callsFake(() => 'mockedToken');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return all users on getUsers', async () => {
        const mockUsers = [{ id: 1, username: 'User1' }, { id: 2, username: 'User2' }];
        mockQuery.resolves({ rows: mockUsers });
        await userController.getUsers(req as Request, res as Response);
        expect(mockQuery.calledOnceWith('SELECT * FROM artists')).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith(mockUsers)).to.be.true;
    });

    it('should handle errors in getUsers', async () => {
        mockQuery.rejects(new Error('Database error'));
        await userController.getUsers(req as Request, res as Response);
        expect(mockQuery.calledOnceWith('SELECT * FROM artists')).to.be.true;
        expect((res.status as sinon.SinonStub).calledOnceWith(500)).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith({ message: 'Error en el servidor' })).to.be.true;
    });

    it('should return a user by ID on getUserById', async () => {
        req.params = { id: '1' };
        const mockUser = { id: 1, username: 'User1' };
        mockQuery.resolves({ rows: [mockUser] });
        await userController.getUserById(req as Request, res as Response);
        expect(mockQuery.calledOnceWith('SELECT * FROM artists WHERE id = $1', ['1'])).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith(mockUser)).to.be.true;
    });

    it('should handle user not found in getUserById', async () => {
        req.params = { id: '99' };
        mockQuery.resolves({ rows: [] });
        await userController.getUserById(req as Request, res as Response);
        expect((res.status as sinon.SinonStub).calledOnceWith(404)).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith({ message: 'Usuario no encontrado' })).to.be.true;
    });

    it('should create a new user on createUser', async () => {
        req.body = { full_name: 'Test', username: 'test', rol: 'admin', email: 'test@test.com', password: '1234', wallet: 100 };
        const mockUser = { id: 1, ...req.body, password: 'hashedPassword' };
        mockQuery.resolves({ rows: [mockUser] });
        await userController.createUser(req as Request, res as Response);
        expect(mockQuery.calledOnce).to.be.true;
        expect((res.status as sinon.SinonStub).calledOnceWith(201)).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith(mockUser)).to.be.true;
    });

    it('should handle missing fields in createUser', async () => {
        req.body = {};
        await userController.createUser(req as Request, res as Response);
        expect((res.status as sinon.SinonStub).calledOnceWith(400)).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith({ message: 'Todos los campos son obligatorios' })).to.be.true;
    });

    it('should update an existing user on updateUser', async () => {
        req.params = { id: '1' };
        req.body = { full_name: 'Updated Name' };
        const existingUser = { id: 1, username: 'old', full_name: 'Old Name' };
        const updatedUser = { ...existingUser, ...req.body };
        mockQuery.onFirstCall().resolves({ rows: [existingUser] });
        mockQuery.onSecondCall().resolves({ rows: [updatedUser] });
        await userController.updateUser(req as Request, res as Response);
        expect(mockQuery.callCount).to.equal(2);
        expect((res.json as sinon.SinonStub).calledOnceWith(updatedUser)).to.be.true;
    });

    it('should delete an existing user on deleteUser', async () => {
        req.params = { id: '1' };
        mockQuery.resolves({ rows: [{ id: 1 }] });
        await userController.deleteUser(req as Request, res as Response);
        expect(mockQuery.calledOnceWith('DELETE FROM artists WHERE id = $1 RETURNING *', ['1'])).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith({ message: 'Usuario eliminado correctamente' })).to.be.true;
    });

    it('should handle user not found in deleteUser', async () => {
        req.params = { id: '99' };
        mockQuery.resolves({ rows: [] });
        await userController.deleteUser(req as Request, res as Response);
        expect((res.status as sinon.SinonStub).calledOnceWith(404)).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith({ message: 'Usuario no encontrado' })).to.be.true;
    });

    it('should log in a user on login', async () => {
        req.body = { username: 'testuser', password: 'password' };
        const mockUser = { id: 1, username: 'testuser', password: 'hashedPassword' };
        mockQuery.resolves({ rows: [mockUser] });
        await userController.login(req as Request, res as Response);
        expect(mockQuery.calledOnceWith('SELECT * FROM artists WHERE username = $1', ['testuser'])).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith({ token: 'mockedToken', message: 'Inicio de sesión exitoso' })).to.be.true;
    });

    it('should handle login with invalid credentials', async () => {
        req.body = { username: 'testuser', password: 'wrongpassword' };
        mockQuery.resolves({ rows: [] });
        await userController.login(req as Request, res as Response);
        expect((res.status as sinon.SinonStub).calledOnceWith(401)).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith({ message: 'Usuario no existe' })).to.be.true;
    });

    it('should log out a user on logout', async () => {
        await userController.logout(req as Request, res as Response);
        expect((res.status as sinon.SinonStub).calledOnceWith(200)).to.be.true;
        expect((res.json as sinon.SinonStub).calledOnceWith({ message: 'Sesión cerrada correctamente' })).to.be.true;
    });

    after(() => {
        const exitTimeout = 5000;
        setTimeout(() => {
            process.exit(0);
        }, exitTimeout);
    });
});
