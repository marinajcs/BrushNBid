// src/routes/userRoutes.ts
import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser, login, logout} from '../controllers/userController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para la gestión de usuarios
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 */
router.get('/users', getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/users/:id', getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioInput'
 *     responses:
 *       201:
 *         description: Usuario creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Datos faltantes o inválidos
 */
router.post('/users', createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualiza un usuario existente
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioInput'
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/users/:id', updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Elimina un usuario por su ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/users/:id', deleteUser);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Inicia sesión con credenciales de usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: usuario123
 *               password: contraseñaSegura
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 message:
 *                   type: string
 *                   example: Inicio de sesión exitoso
 *       400:
 *         description: Datos incompletos
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/login', login);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Cierra sesión del usuario actual
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 */
router.post('/logout', logout);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del usuario
 *         full_name:
 *           type: string
 *           description: Nombre completo del usuario
 *         username:
 *           type: string
 *           description: Nombre de usuario
 *         rol:
 *           type: string
 *           description: Rol del usuario (admin, artista, comprador, etc.)
 *         email:
 *           type: string
 *           description: Correo electrónico
 *         wallet:
 *           type: number
 *           description: Saldo en la billetera
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del usuario
 *       example:
 *         id: 1
 *         full_name: "Juan Pérez"
 *         username: "juanperez"
 *         rol: "artista"
 *         email: "juan@example.com"
 *         wallet: 150.50
 *         created_at: "2024-02-01T10:30:00Z"
 *
 *     UsuarioInput:
 *       type: object
 *       properties:
 *         full_name:
 *           type: string
 *         username:
 *           type: string
 *         rol:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         wallet:
 *           type: number
 *       required:
 *         - full_name
 *         - username
 *         - rol
 *         - email
 *         - password
 *         - wallet
 *       example:
 *         full_name: "Ana Gómez"
 *         username: "anagomez"
 *         rol: "comprador"
 *         email: "ana@example.com"
 *         password: "claveSegura123"
 *         wallet: 200.00
 */

