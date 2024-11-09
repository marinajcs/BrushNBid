// src/controllers/obraController.ts
import { Request, Response } from 'express';
import pool from '../db';

const SECRET_KEY = 'clave_segura';

export const getAllObras = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM obras');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const getObraById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM obras WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Obra no encontrada' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const getObrasByUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM obras WHERE propiedad_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Obras no encontradas' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const createObra = async (req: Request, res: Response) => {
    try {
        const { titulo, autoria, propiedad, tipo, descripcion, imagen } = req.body;

        if (!titulo || !autoria || !propiedad || !tipo) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }


        const result = await pool.query(
            'INSERT INTO obras (id, titulo, autoria, propiedad, tipo, descripcion, imagen) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [
                titulo,
                autoria,
                propiedad,
                tipo,
                descripcion,
                imagen
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear obra:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const updateObra = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { titulo, autoria, propiedad, tipo, descripcion, imagen } = req.body;

        const obraResult = await pool.query('SELECT * FROM obras WHERE id = $1', [id]);
        if (obraResult.rows.length === 0) {
            return res.status(404).json({ message: 'Obra no encontrada' });
        }

        const obra = obraResult.rows[0];

        const updatedTitulo = titulo || obra.titulo;
        const updatedAutoria = autoria || obra.username;
        const updatedPropiedad = propiedad || obra.propiedad;
        const updatedTipo = tipo || obra.tipo;
        const updatedDescripcion = descripcion || obra.descripcion;
        const updatedImagen = imagen || obra.imagen;

        const query = `
        UPDATE obras
        SET titulo = $1, autoria = $2, propiedad = $3, tipo = $4, descripcion = $5, imagen = $6
        WHERE id = $7
        RETURNING *
      `;
        const values = [
            updatedTitulo,
            updatedAutoria,
            updatedPropiedad,
            updatedTipo,
            updatedDescripcion,
            updatedImagen,
            id
        ];

        const result = await pool.query(query, values);

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar obra:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const deleteObra = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM obras WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Obra no encontrada' });
        res.json({ message: 'Obra eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};