// src/controllers/userController.ts
import { Request, Response } from 'express';
import pool from '../db';

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
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
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
        const { name, email } = req.body;
        const result = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Actualizar un usuario
export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        const result = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Eliminar un usuario
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    console.log("Datos de login:", { username, password });
    try {
        // Buscar el usuario por `username` en la tabla `artists`
        const result = await pool.query('SELECT * FROM artists WHERE username = $1', [username]);

        if (result.rows.length === 0) {
            // Usuario no encontrado
            return res.status(401).json({ message: 'Usuario no existe' });
        }

        const user = result.rows[0];

        if (user.password !== password) {
            // Contraseña incorrecta
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        res.status(200).json({ message: 'Inicio de sesión exitoso', username: user.username });
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

