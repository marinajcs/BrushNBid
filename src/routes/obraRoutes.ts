// src/routes/obrasRoutes.ts
import { Router } from 'express';
import { getAllObras, getObraById, getObrasByUser, createObra, updateObra, deleteObra } from '../controllers/obraController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Obras
 *   description: Endpoints para gestionar las obras
 */

/**
 * @swagger
 * /obras:
 *   get:
 *     summary: Obtiene todas las obras
 *     tags: [Obras]
 *     responses:
 *       200:
 *         description: Lista de obras obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Obra'
 */
router.get('/obras', getAllObras);

/**
 * @swagger
 * /obras/{id}:
 *   get:
 *     summary: Obtiene una obra por su ID
 *     tags: [Obras]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la obra
 *     responses:
 *       200:
 *         description: Obra obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Obra'
 *       404:
 *         description: Obra no encontrada
 */
router.get('/obras/:id', getObraById);

/**
 * @swagger
 * /obras/user/{id}:
 *   get:
 *     summary: Obtiene las obras de un usuario específico
 *     tags: [Obras]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario propietario de las obras
 *     responses:
 *       200:
 *         description: Obras obtenidas con éxito para el usuario especificado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Obra'
 *       404:
 *         description: Obras no encontradas para el usuario
 */
router.get('/obras/user/:id', getObrasByUser);

/**
 * @swagger
 * /obras:
 *   post:
 *     summary: Crea una nueva obra
 *     tags: [Obras]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ObraInput'
 *     responses:
 *       201:
 *         description: Obra creada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Obra'
 *       400:
 *         description: Datos faltantes o inválidos
 */
router.post('/obras', createObra);

/**
 * @swagger
 * /obras/{id}:
 *   put:
 *     summary: Actualiza una obra existente
 *     tags: [Obras]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la obra a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ObraInput'
 *     responses:
 *       200:
 *         description: Obra actualizada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Obra'
 *       404:
 *         description: Obra no encontrada
 */
router.put('/obras/:id', updateObra);

/**
 * @swagger
 * /obras/{id}:
 *   delete:
 *     summary: Elimina una obra por su ID
 *     tags: [Obras]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la obra a eliminar
 *     responses:
 *       200:
 *         description: Obra eliminada correctamente
 *       404:
 *         description: Obra no encontrada
 */
router.delete('/obras/:id', deleteObra);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Obra:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la obra
 *         titulo:
 *           type: string
 *           description: Título de la obra
 *         autoria_id:
 *           type: integer
 *           description: ID del autor de la obra
 *         propiedad_id:
 *           type: integer
 *           description: ID del propietario de la obra
 *         tipo:
 *           type: string
 *           description: Tipo de obra (pintura, escultura, etc.)
 *         descripcion:
 *           type: string
 *           description: Descripción de la obra
 *         imagen:
 *           type: string
 *           description: URL de la imagen de la obra
 *       example:
 *         id: 1
 *         titulo: "La Noche Estrellada"
 *         autoria_id: 2
 *         propiedad_id: 3
 *         tipo: "Pintura"
 *         descripcion: "Una famosa obra de Van Gogh."
 *         imagen: "http://example.com/imagen.jpg"
 *     ObraInput:
 *       type: object
 *       properties:
 *         titulo:
 *           type: string
 *         autoria_id:
 *           type: integer
 *         propiedad_id:
 *           type: integer
 *         tipo:
 *           type: string
 *         descripcion:
 *           type: string
 *         imagen:
 *           type: string
 *       required:
 *         - titulo
 *         - autoria_id
 *         - propiedad_id
 *         - tipo
 *       example:
 *         titulo: "Nueva Obra"
 *         autoria_id: 1
 *         propiedad_id: 2
 *         tipo: "Escultura"
 *         descripcion: "Descripción de la nueva obra."
 *         imagen: "http://example.com/nueva-imagen.jpg"
 */

