import { Request, Response } from 'express';
import pool from '../db';

// Obtener todas las subastas
export const getAllSubastas = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM subastas`);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener subastas activas:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener todas las subastas activas
export const getActiveSubastas = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT * 
            FROM subastas
            WHERE 
                (NOW() BETWEEN fecha_inicio AND fecha_fin) OR 
                (fecha_fin IS NULL)
        `);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener subastas activas:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Crear una nueva subasta
export const createSubasta = async (req: Request, res: Response) => {
    try {
        const { obra_id, vendedor_id, precio_inicial = 0, incremento = 0, precio_reserva = 0, fecha_inicio, duracion } = req.body;

        if (!obra_id || !vendedor_id) {
            return res.status(400).json({ message: 'Obra y vendedor son obligatorios' });
        }

        const result = await pool.query(
            `INSERT INTO subastas (obra_id, vendedor_id, precio_inicial, incremento, precio_reserva, fecha_inicio, duracion)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [obra_id, vendedor_id, precio_inicial, incremento, precio_reserva, fecha_inicio || new Date(), duracion || null]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear subasta:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener una subasta por ID
export const getSubastaById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM subastas WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Subasta no encontrada' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener subasta:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener una subasta por ID
export const getPujas = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM pujas WHERE subasta_id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Pujas no encontradas' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener subasta:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Registrar una nueva puja
export const addPuja = async (req: Request, res: Response) => {
    try {
        const { subasta_id, user_id, cantidad } = req.body;

        if (!subasta_id || !user_id || !cantidad) {
            return res.status(400).json({ message: 'Subasta, usuario y cantidad son obligatorios' });
        }

        // Validar que la puja sea válida
        const subasta = await pool.query(
            `SELECT COALESCE(MAX(p.cantidad), s.precio_inicial) AS precio_actual
             FROM subastas s
             LEFT JOIN pujas p ON s.id = p.subasta_id
             WHERE s.id = $1
             GROUP BY s.precio_inicial`,
            [subasta_id]
        );

        if (cantidad <= subasta.rows[0].precio_actual) {
            return res.status(400).json({ message: 'La puja debe ser mayor al precio actual' });
        }

        const result = await pool.query(
            `INSERT INTO pujas (subasta_id, user_id, cantidad)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [subasta_id, user_id, cantidad]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al registrar puja:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Adjudicar una subasta
export const adjudicarSubasta = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const pujaResult = await pool.query(
            `SELECT p.user_id, p.cantidad
             FROM pujas p
             WHERE p.subasta_id = $1
             ORDER BY p.cantidad DESC
             LIMIT 1`,
            [id]
        );

        if (pujaResult.rows.length === 0) {
            return res.status(400).json({ message: 'No hay pujas registradas en esta subasta' });
        }

        const mejorPuja = pujaResult.rows[0];

        // Transferir propiedad de la obra al mejor postor
        await pool.query(
            `UPDATE obras
             SET propiedad_id = $1
             WHERE id = (SELECT obra_id FROM subastas WHERE id = $2)`,
            [mejorPuja.user_id, id]
        );

        res.status(200).json({ message: 'Subasta adjudicada al mejor postor', mejorPuja });
    } catch (error) {
        console.error('Error al adjudicar subasta:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Eliminar una subasta
export const deleteSubasta = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM subastas WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Subasta no encontrada' });
        }

        res.json({ message: 'Subasta eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar subasta:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
