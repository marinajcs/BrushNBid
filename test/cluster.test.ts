import request from 'supertest';
import { expect } from 'chai';
import app from '../src/server';
import pool from '../src/db';

describe('User API endpoints', () => {
    it('GET /api/users should return all users', async () => {
        const response = await request(app).get('/api/users');
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.gte(2);
    });

    it('GET /api/users/:id should return a user by ID', async () => {
        const response = await request(app).get('/api/users/1');
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('username', 'mjcs163');
        expect(response.body).to.have.property('rol', 'ADMIN');
        expect(response.body).to.have.property('full_name', 'Marina J. Carranza Sánchez');
        expect(response.body).to.have.property('email', 'mjcs@gmail.com');
    });
});

describe('Obra API endpoints', () => {
    it('GET /api/obras should return all obras', async () => {
        const response = await request(app).get('/api/obras');
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.gte(2);
    });

    it('GET /api/obras/:id should return a obra by ID', async () => {
        const response = await request(app).get('/api/obras/1');
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('titulo', 'El amanecer');
        expect(response.body).to.have.property('autoria_id', 2);
        expect(response.body).to.have.property('tipo', 'pintura');
        expect(response.body).to.have.property('descripcion', 'Óleo sobre lienzo, 30x40.');
    });
});

describe('Subasta API endpoints', () => {
    it('GET /api/subastas should return all subastas', async () => {
        const response = await request(app).get('/api/subastas');
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.gte(1);
    });

    it('GET /api/subastas/:id should return a subasta by ID', async () => {
        const response = await request(app).get('/api/subastas/1');
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('obra_id', 2);
        expect(response.body).to.have.property('vendedor_id', 1);
        expect(response.body).to.have.property('precio_inicial', '20.00');
    });

    it('GET /api/subastas/:id/pujas should return all pujas from a subasta by ID', async () => {
        const response = await request(app).get('/api/subastas/1/pujas');
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.gte(6);

        expect(response.body[0]).to.have.property('subasta_id', 1);
        expect(response.body[0]).to.have.property('user_id', 2);
        expect(response.body[0]).to.have.property('cantidad', '25.00');
    });

    it('GET /api/subastas/activas should return all subastas activas', async () => {
        const response = await request(app).get('/api/subastas/activas');
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.equal(0);
    });
});

