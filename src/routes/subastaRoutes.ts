import { Router } from 'express';
import { 
  getAllSubastas, 
  getActiveSubastas, 
  createSubasta, 
  getSubastaById, 
  addPuja, 
  getPujas, 
  adjudicarSubasta,
  deleteSubasta
} from '../controllers/subastaController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Subastas
 *   description: Endpoints para gestionar subastas y pujas
 */

/**
 * @swagger
 * /subastas:
 *   get:
 *     summary: Obtiene todas las subastas
 *     tags: [Subastas]
 *     responses:
 *       200:
 *         description: Lista de subastas obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subasta'
 */
router.get('/subastas', getAllSubastas);

/**
 * @swagger
 * /subastas/activas:
 *   get:
 *     summary: Obtiene todas las subastas activas
 *     tags: [Subastas]
 *     responses:
 *       200:
 *         description: Lista de subastas activas obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subasta'
 */
router.get('/subastas/activas', getActiveSubastas);

/**
 * @swagger
 * /subastas:
 *   post:
 *     summary: Crea una nueva subasta
 *     tags: [Subastas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubastaInput'
 *     responses:
 *       201:
 *         description: Subasta creada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subasta'
 *       400:
 *         description: Datos faltantes o inválidos
 */
router.post('/subastas', createSubasta);

/**
 * @swagger
 * /subastas/{id}:
 *   get:
 *     summary: Obtiene una subasta por su ID
 *     tags: [Subastas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la subasta
 *     responses:
 *       200:
 *         description: Subasta obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subasta'
 *       404:
 *         description: Subasta no encontrada
 */
router.get('/subastas/:id', getSubastaById);

/**
 * @swagger
 * /subastas/{id}/pujas:
 *   get:
 *     summary: Obtiene todas las pujas de una subasta
 *     tags: [Subastas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la subasta
 *     responses:
 *       200:
 *         description: Pujas obtenidas con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Puja'
 *       404:
 *         description: Pujas no encontradas para la subasta especificada
 */
router.get('/subastas/:id/pujas', getPujas);

/**
 * @swagger
 * /subastas/{id}/pujas:
 *   post:
 *     summary: Añade una puja a una subasta
 *     tags: [Subastas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la subasta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PujaInput'
 *     responses:
 *       201:
 *         description: Puja añadida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Puja'
 *       400:
 *         description: Datos faltantes o inválidos
 *       404:
 *         description: Subasta no encontrada
 */
router.post('/subastas/:id/pujas', addPuja);

/**
 * @swagger
 * /subastas/{id}/adjudicar:
 *   post:
 *     summary: Adjudica la subasta al mejor postor
 *     tags: [Subastas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la subasta a adjudicar
 *     responses:
 *       200:
 *         description: Subasta adjudicada con éxito
 *       400:
 *         description: No hay pujas registradas para la subasta
 *       404:
 *         description: Subasta no encontrada
 */
router.post('/subastas/:id/adjudicar', adjudicarSubasta);

/**
 * @swagger
 * /subastas/{id}:
 *   delete:
 *     summary: Elimina una subasta por su ID
 *     tags: [Subastas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la subasta a eliminar
 *     responses:
 *       200:
 *         description: Subasta eliminada correctamente
 *       404:
 *         description: Subasta no encontrada
 */
router.delete('/subastas/:id', deleteSubasta);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Subasta:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         obra_id:
 *           type: integer
 *         vendedor_id:
 *           type: integer
 *         precio_inicial:
 *           type: number
 *         incremento:
 *           type: number
 *         precio_reserva:
 *           type: number
 *         fecha_inicio:
 *           type: string
 *           format: date-time
 *         duracion:
 *           type: integer
 *         adjudicado:
 *           type: boolean
 *       example:
 *         id: 1
 *         obra_id: 2
 *         vendedor_id: 3
 *         precio_inicial: 100.00
 *         incremento: 10.00
 *         precio_reserva: 150.00
 *         fecha_inicio: "2024-02-20T12:00:00Z"
 *         duracion: 48
 *         adjudicado: false
 *
 *     SubastaInput:
 *       type: object
 *       properties:
 *         obra_id:
 *           type: integer
 *         vendedor_id:
 *           type: integer
 *         precio_inicial:
 *           type: number
 *         incremento:
 *           type: number
 *         precio_reserva:
 *           type: number
 *         fecha_inicio:
 *           type: string
 *           format: date-time
 *         duracion:
 *           type: integer
 *       required:
 *         - obra_id
 *         - vendedor_id
 *       example:
 *         obra_id: 2
 *         vendedor_id: 3
 *         precio_inicial: 100.00
 *         incremento: 10.00
 *         precio_reserva: 150.00
 *         fecha_inicio: "2024-02-20T12:00:00Z"
 *         duracion: 48
 *
 *     Puja:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         subasta_id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         cantidad:
 *           type: number
 *       example:
 *         id: 1
 *         subasta_id: 2
 *         user_id: 4
 *         cantidad: 120.00
 *
 *     PujaInput:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *         cantidad:
 *           type: number
 *       required:
 *         - user_id
 *         - cantidad
 *       example:
 *         user_id: 4
 *         cantidad: 130.00
 */

