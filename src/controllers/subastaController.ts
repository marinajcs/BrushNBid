import { Request, Response } from 'express';
import pool from '../db';
const logger = require('../logger');

// Obtener todas las subastas
export const getAllSubastas = async (req: Request, res: Response) => {
    try {
        logger.info('Inicio de getAllSubastas');
        const result = await pool.query(`SELECT * FROM subastas`);
        logger.info(`Subastas obtenidas con éxito. Total: ${result.rows.length}`);
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error(`Error en getAllSubastas: ${error}`);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener todas las subastas activas
export const getActiveSubastas = async (req: Request, res: Response) => {
    try {
        logger.info('Inicio de getActiveSubastas');
        const result = await pool.query(`
            SELECT * 
            FROM subastas
            WHERE 
                (NOW() BETWEEN fecha_inicio AND fecha_fin) OR 
                (fecha_fin IS NULL) AND adjudicado = FALSE
        `);
        logger.info(`Subastas activas obtenidas con éxito. Total: ${result.rows.length}`);
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error(`Error en getActiveSubastas: ${error}`);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Crear una nueva subasta
export const createSubasta = async (req: Request, res: Response) => {
    try {
        logger.info(`Inicio de createSubasta con datos: ${JSON.stringify(req.body)}`);
        const { obra_id, vendedor_id, precio_inicial = 0, incremento = 0, precio_reserva = 0, fecha_inicio, duracion } = req.body;

        if (!obra_id || !vendedor_id) {
            logger.warn('Campos obligatorios faltantes en createSubasta');
            return res.status(400).json({ message: 'Obra y vendedor son obligatorios' });
        }

        const existingSubasta = await pool.query('SELECT * FROM subastas WHERE obra_id = $1', [obra_id]);
        if (existingSubasta.rows.length > 0) {
            logger.warn(`Ya existe una subasta para la obra_id: ${obra_id}`);
            return res.status(400).json({ message: 'Ya existe una subasta para esta obra' });
        }

        const result = await pool.query(
            `INSERT INTO subastas (obra_id, vendedor_id, precio_inicial, incremento, precio_reserva, fecha_inicio, duracion)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [obra_id, vendedor_id, precio_inicial, incremento, precio_reserva, fecha_inicio || new Date(), duracion || null]
        );

        logger.info(`Subasta creada con éxito: ${JSON.stringify(result.rows[0])}`);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        logger.error(`Error en createSubasta: ${error}`);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener una subasta por ID
export const getSubastaById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        logger.info(`Inicio de getSubastaById con id: ${id}`);
        const result = await pool.query('SELECT * FROM subastas WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            logger.warn(`Subasta no encontrada con id: ${id}`);
            return res.status(404).json({ message: 'Subasta no encontrada' });
        }

        logger.info(`Subasta obtenida con éxito: ${JSON.stringify(result.rows[0])}`);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        logger.error(`Error en getSubastaById con id ${req.params.id}: ${error}`);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener las pujas de una subasta
export const getPujas = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        logger.info(`Inicio de getPujas para subasta_id: ${id}`);
        const result = await pool.query('SELECT * FROM pujas WHERE subasta_id = $1', [id]);

        if (result.rows.length === 0) {
            logger.warn(`No se encontraron pujas para subasta_id: ${id}`);
            return res.status(404).json({ message: 'Pujas no encontradas' });
        }

        logger.info(`Pujas obtenidas con éxito para subasta_id ${id}`);
        res.status(200).json(result.rows);
    } catch (error) {
        logger.error(`Error en getPujas para subasta_id ${req.params.id}: ${error}`);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Añadir una nueva puja
export const addPuja = async (req: Request, res: Response) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        const { user_id, cantidad } = req.body;
        logger.info(`Inicio de addPuja con subasta_id: ${id} y datos: ${JSON.stringify(req.body)}`);

        if (!id || !user_id || !cantidad) {
            logger.warn('Campos obligatorios faltantes en addPuja');
            return res.status(400).json({ message: 'Subasta, usuario y cantidad son obligatorios' });
        }

        await client.query('BEGIN');

        const subasta = await client.query(
            `SELECT COALESCE(MAX(p.cantidad), s.precio_inicial) AS precio_actual
             FROM subastas s
             LEFT JOIN pujas p ON s.id = p.subasta_id
             WHERE s.id = $1
             GROUP BY s.precio_inicial`,
            [id]
        );

        if (subasta.rows.length === 0) {
            logger.warn(`Subasta no encontrada con id: ${id}`);
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Subasta no encontrada' });
        }

        const precioActual = subasta.rows[0].precio_actual;

        if (cantidad <= precioActual) {
            logger.warn(`La puja de cantidad ${cantidad} es menor o igual al precio actual (${precioActual})`);
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'La puja debe ser mayor al precio actual' });
        }

        const user = await client.query('SELECT wallet FROM artists WHERE id = $1', [user_id]);

        if (user.rows.length === 0) {
            logger.warn(`Usuario no encontrado con id: ${user_id}`);
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const wallet = user.rows[0].wallet;
        const ultimaPuja = await client.query(
            `SELECT MAX(cantidad) AS cantidad
             FROM pujas
             WHERE subasta_id = $1 AND user_id = $2`,
            [id, user_id]
        );

        const ultimaCantidad = ultimaPuja.rows[0].cantidad || 0;
        const diferencia = cantidad - ultimaCantidad;

        if (wallet < diferencia) {
            logger.warn(`Saldo insuficiente: usuario ${user_id} tiene ${wallet}, requiere ${diferencia}`);
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Saldo insuficiente para realizar la puja' });
        }

        await client.query('UPDATE artists SET wallet = wallet - $1 WHERE id = $2', [diferencia, user_id]);
        const result = await client.query(
            `INSERT INTO pujas (subasta_id, user_id, cantidad)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [id, user_id, cantidad]
        );

        await client.query('COMMIT');
        logger.info(`Puja registrada con éxito: ${JSON.stringify(result.rows[0])}`);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        logger.error(`Error en addPuja: ${error}`);
        await client.query('ROLLBACK');
        res.status(500).json({ message: 'Error en el servidor' });
    } finally {
        client.release();
    }
};

// Adjudicar subasta
export const adjudicarSubasta = async (req: Request, res: Response) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        logger.info(`Inicio de adjudicarSubasta con id: ${id}`);
        await client.query('BEGIN');

        const pujaResult = await client.query(
            `SELECT p.user_id, p.cantidad
             FROM pujas p
             WHERE p.subasta_id = $1
             ORDER BY p.cantidad DESC
             LIMIT 1`,
            [id]
        );

        if (pujaResult.rows.length === 0) {
            logger.warn(`No hay pujas registradas en la subasta ${id}`);
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'No hay pujas registradas en esta subasta' });
        }

        const mejorPuja = pujaResult.rows[0];
        logger.info(`Mejor puja: ${JSON.stringify(mejorPuja)}`);

        await client.query(
            `UPDATE obras
             SET propiedad_id = $1
             WHERE id = (SELECT obra_id FROM subastas WHERE id = $2)`,
            [mejorPuja.user_id, id]
        );

        const perdedoresResult = await client.query(
            `SELECT DISTINCT ON (p.user_id) p.user_id, p.cantidad
             FROM pujas p
             WHERE p.subasta_id = $1 AND p.user_id != $2
             ORDER BY p.user_id, p.cantidad DESC`,
            [id, mejorPuja.user_id]
        );

        for (const perdedor of perdedoresResult.rows) {
            await client.query(
                `UPDATE artists
                 SET wallet = wallet + $1
                 WHERE id = $2`,
                [perdedor.cantidad, perdedor.user_id]
            );
        }

        await client.query(
            `UPDATE subastas
             SET adjudicado = TRUE
             WHERE id = $1`,
            [id]
        );

        await client.query('COMMIT');
        logger.info(`Subasta adjudicada con éxito al usuario ${mejorPuja.user_id}`);
        res.status(200).json({
            message: 'Subasta adjudicada al mejor postor',
            mejorPuja,
            devoluciones: perdedoresResult.rows,
        });
    } catch (error) {
        logger.error(`Error en adjudicarSubasta: ${error}`);
        await client.query('ROLLBACK');
        res.status(500).json({ message: 'Error en el servidor' });
    } finally {
        client.release();
    }
};

// Eliminar subasta
export const deleteSubasta = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        logger.info(`Inicio de deleteSubasta con id: ${id}`);
        const result = await pool.query('DELETE FROM subastas WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            logger.warn(`Subasta no encontrada para eliminación con id: ${id}`);
            return res.status(404).json({ message: 'Subasta no encontrada' });
        }

        logger.info(`Subasta eliminada con éxito con id: ${id}`);
        res.json({ message: 'Subasta eliminada correctamente' });
    } catch (error) {
        logger.error(`Error en deleteSubasta con id ${req.params.id}: ${error}`);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
