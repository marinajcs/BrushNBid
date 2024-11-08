// src/controllers/userController.ts
import { Request, Response } from 'express';
import pool from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'clave_segura';

// Obtener todos los usuarios
export const getUsers = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM artists');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener un usuario por ID
export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM artists WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Crear un nuevo usuario
export const createUser = async (req: Request, res: Response) => {
    try {
        const { full_name, username, rol, email, password, wallet } = req.body;

        if (!full_name || !username || !rol || !email || !password || wallet === undefined) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO artists (full_name, username, rol, email, password, wallet, created_at) 
             VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
             RETURNING *`,
            [full_name, username, rol, email, hashedPassword, wallet]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Actualizar un usuario
export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { full_name, username, rol, email, password, wallet } = req.body;

        const userResult = await pool.query('SELECT * FROM artists WHERE id = $1', [id]);
        if (userResult.rows.length === 0) {
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

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Eliminar un usuario
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM artists WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Faltan datos de usuario o contraseña' });
    }

    try {
        const result = await pool.query('SELECT * FROM artists WHERE username = $1', [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Usuario no existe' });
        }

        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ token, message: 'Inicio de sesión exitoso' });
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const logout = (_: Request, res: Response) => {
    res.status(200).json({ message: 'Sesión cerrada correctamente' });
};

