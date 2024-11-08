const request = require('supertest');
const chai = require('chai');
import app from '../src/server';

const { expect } = chai;

describe('User API', () => {

    let userId = 0;

    describe('POST /api/users', () => {
        it('Debe crear un nuevo usuario', async () => {
            const response = await request(app)
                .post('/api/users')
                .send({
                    full_name: 'Probando Pepe',
                    username: 'pepitoP',
                    rol: 'USER',
                    email: 'pepitoP@example.com',
                    password: 'password3',
                    wallet: 300
                });

            expect(response.status).to.equal(201);
            expect(response.body).to.be.an('object');
            expect(response.body).to.have.property('id');
            expect(response.body).to.have.property('username', 'pepitoP');

            userId = response.body.id;
        });
    });

    describe('GET /api/users/:id', () => {
        it('Debe obtener un usuario existente', async () => {
            const response = await request(app).get(`/api/users/${userId}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('object');
            expect(response.body).to.have.property('id', userId);
            expect(response.body).to.have.property('username');
        });
    });

    describe('PUT /api/users/:id', () => {
        it('Debe actualizar un usuario existente', async () => {
            const response = await request(app)
                .put(`/api/users/${userId}`)
                .send({ username: 'updatedPepito' });

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('object');
            expect(response.body).to.have.property('username', 'updatedPepito');
        });
    });

    describe('DELETE /api/users/:id', () => {
        it('Debe eliminar un usuario existente', async () => {
            const response = await request(app).delete(`/api/users/${userId}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('message', 'Usuario eliminado correctamente');
        });
    });

});
