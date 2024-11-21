import { Request, Response } from 'express';
import pool from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const logger = require('../logger');
const SECRET_KEY = 'clave_segura';

// Obtener todos los usuarios
export const getUsers = async (req: Request, res: Response) => {
    try {
        logger.info('Inicio de getUsers');
        const result = await pool.query('SELECT * FROM artists');
        logger.info(`Usuarios obtenidos con éxito. Total: ${result.rows.length}`);
        res.json(result.rows);
    } catch (error) {
        logger.error(`Error en getUsers: ${error}`);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener un usuario por ID
export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        logger.info(`Inicio de getUserById con id: ${id}`);
        const result = await pool.query('SELECT * FROM artists WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            logger.warn(`Usuario no encontrado con id: ${id}`);
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        logger.info(`Usuario obtenido con éxito: ${JSON.stringify(result.rows[0])}`);
        res.json(result.rows[0]);
    } catch (error) {
        logger.error(`Error en getUserById con id ${req.params.id}: ${error}`);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Crear un nuevo usuario
export const createUser = async (req: Request, res: Response) => {
    try {
        logger.info(`Inicio de createUser con datos: ${JSON.stringify(req.body)}`);
        const { full_name, username, rol, email, password, wallet } = req.body;

        if (!full_name || !username || !rol || !email || !password || wallet === undefined) {
            logger.warn('Campos obligatorios faltantes en createUser');
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO artists (full_name, username, rol, email, password, wallet, created_at) 
             VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
             RETURNING *`,
            [full_name, username, rol, email, hashedPassword, wallet]
        );

        logger.info(`Usuario creado con éxito: ${JSON.stringify(result.rows[0])}`);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        logger.error(`Error en createUser: ${error}`);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Actualizar un usuario
export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        logger.info(`Inicio de updateUser con id: ${id} y datos: ${JSON.stringify(req.body)}`);
        const { full_name, username, rol, email, password, wallet } = req.body;

        const userResult = await pool.query('SELECT * FROM artists WHERE id = $1', [id]);
        if (userResult.rows.length === 0) {
            logger.warn(`Usuario no encontrado para actualización con id: ${id}`);
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = userResult.rows[0];

        const updatedFullName = full_name || user.full_name;
        const updatedUsername = username || user.username;
        const updatedRol = rol || user.rol;
        const updatedEmail = email || user.email;
        const updatedWallet = wallet !== undefined ? wallet : user.wallet;
        const updatedPassword = password
            ? await bcrypt.hash(password, 10)
            : user.password;

        const result = await pool.query(
            `UPDATE artists
             SET full_name = $1, username = $2, rol = $3, email = $4, password = $5, wallet = $6 
             WHERE id = $7 
             RETURNING *`,
            [updatedFullName, updatedUsername, updatedRol, updatedEmail, updatedPassword, updatedWallet, id]
        );

        logger.info(`Usuario actualizado con éxito: ${JSON.stringify(result.rows[0])}`);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        logger.error(`Error en updateUser con id ${req.params.id}: ${error}`);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Eliminar un usuario
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        logger.info(`Inicio de deleteUser con id: ${id}`);
        const result = await pool.query('DELETE FROM artists WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            logger.warn(`Usuario no encontrado para eliminación con id: ${id}`);
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        logger.info(`Usuario eliminado con éxito con id: ${id}`);
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        logger.error(`Error en deleteUser con id ${req.params.id}: ${error}`);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Inicio de sesión
export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    logger.info(`Inicio de login con username: ${username}`);
    if (!username || !password) {
        logger.warn('Datos de login incompletos');
        return res.status(400).json({ message: 'Faltan datos de usuario o contraseña' });
    }

    try {
        const result = await pool.query('SELECT * FROM artists WHERE username = $1', [username]);

        if (result.rows.length === 0) {
            logger.warn(`Usuario no encontrado con username: ${username}`);
            return res.status(401).json({ message: 'Usuario no existe' });
        }

        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            logger.warn(`Contraseña incorrecta para username: ${username}`);
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

        logger.info(`Usuario autenticado con éxito: ${username}`);
        res.status(200).json({ token, message: 'Inicio de sesión exitoso' });
    } catch (error) {
        logger.error(`Error en login con username ${username}: ${error}`);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Cerrar sesión
export const logout = (_: Request, res: Response) => {
    logger.info('Sesión cerrada con éxito');
    res.status(200).json({ message: 'Sesión cerrada correctamente' });
};
