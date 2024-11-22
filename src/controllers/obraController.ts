import { Request, Response } from 'express';
import pool from '../db';
const logger = require('../logger');

const SECRET_KEY = 'clave_segura';

export const getAllObras = async (req: Request, res: Response) => {
    try {
        logger.info('Inicio de getAllObras');
        const result = await pool.query('SELECT * FROM obras');
        logger.info(`Obras obtenidas con éxito. Total: ${result.rows.length}`);
        res.json(result.rows);
    } catch (error) {
        logger.error(`Error en getAllObras: ${error}`);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const getObraById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        logger.info(`Inicio de getObraById con id: ${id}`);
        const result = await pool.query('SELECT * FROM obras WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            logger.warn(`Obra no encontrada con id: ${id}`);
            return res.status(404).json({ message: 'Obra no encontrada' });
        }
        logger.info(`Obra obtenida con éxito: ${JSON.stringify(result.rows[0])}`);
        res.json(result.rows[0]);
    } catch (error) {
        logger.error(`Error en getObraById con id ${req.params.id}: ${error}`);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const getObrasByUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        logger.info(`Inicio de getObrasByUser con propiedad_id: ${id}`);
        const result = await pool.query('SELECT * FROM obras WHERE propiedad_id = $1', [id]);
        if (result.rows.length === 0) {
            logger.warn(`No se encontraron obras para propiedad_id: ${id}`);
            return res.status(404).json({ message: 'Obras no encontradas' });
        }
        logger.info(`Obras obtenidas con éxito para propiedad_id ${id}`);
        res.json(result.rows);
    } catch (error) {
        logger.error(`Error en getObrasByUser con propiedad_id ${req.params.id}: ${error}`);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const createObra = async (req: Request, res: Response) => {
    try {
        const { titulo, autoria_id, propiedad_id, tipo, descripcion, imagen } = req.body;
        logger.info(`Inicio de createObra con datos: ${JSON.stringify(req.body)}`);

        if (!titulo || !autoria_id || !propiedad_id || !tipo) {
            logger.warn('Campos faltantes en createObra');
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const result = await pool.query(
            'INSERT INTO obras (titulo, autoria_id, propiedad_id, tipo, descripcion, imagen) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [titulo, autoria_id, propiedad_id, tipo, descripcion, imagen]
        );

        logger.info(`Obra creada con éxito: ${JSON.stringify(result.rows[0])}`);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        logger.error(`Error en createObra: ${error}`);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const updateObra = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { titulo, autoria_id, propiedad_id, tipo, descripcion, imagen } = req.body;
        logger.info(`Inicio de updateObra con id: ${id} y datos: ${JSON.stringify(req.body)}`);

        const obraResult = await pool.query('SELECT * FROM obras WHERE id = $1', [id]);
        if (obraResult.rows.length === 0) {
            logger.warn(`Obra no encontrada para actualización con id: ${id}`);
            return res.status(404).json({ message: 'Obra no encontrada' });
        }

        const obra = obraResult.rows[0];

        const updatedTitulo = titulo || obra.titulo;
        const updatedAutoria = autoria_id || obra.autoria_id;
        const updatedPropiedad = propiedad_id || obra.propiedad_id;
        const updatedTipo = tipo || obra.tipo;
        const updatedDescripcion = descripcion || obra.descripcion;
        const updatedImagen = imagen || obra.imagen;

        const query = `
        UPDATE obras
        SET titulo = $1, autoria_id = $2, propiedad_id = $3, tipo = $4, descripcion = $5, imagen = $6
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
            id,
        ];

        const result = await pool.query(query, values);

        logger.info(`Obra actualizada con éxito: ${JSON.stringify(result.rows[0])}`);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        logger.error(`Error en updateObra con id ${req.params.id}: ${error}`);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const deleteObra = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        logger.info(`Inicio de deleteObra con id: ${id}`);
        const result = await pool.query('DELETE FROM obras WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            logger.warn(`Obra no encontrada para eliminación con id: ${id}`);
            return res.status(404).json({ message: 'Obra no encontrada' });
        }
        logger.info(`Obra eliminada con éxito con id: ${id}`);
        res.json({ message: 'Obra eliminada correctamente' });
    } catch (error) {
        logger.error(`Error en deleteObra con id ${req.params.id}: ${error}`);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
