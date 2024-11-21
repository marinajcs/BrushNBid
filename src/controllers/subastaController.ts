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

export const createSubasta = async (req: Request, res: Response) => {
    try {
        const { obra_id, vendedor_id, precio_inicial = 0, incremento = 0, precio_reserva = 0, fecha_inicio, duracion } = req.body;

        if (!obra_id || !vendedor_id) {
            return res.status(400).json({ message: 'Obra y vendedor son obligatorios' });
        }

        const existingSubasta = await pool.query('SELECT * FROM subastas WHERE obra_id = $1', [obra_id]);
        if (existingSubasta.rows.length > 0) {
            return res.status(400).json({ message: 'Ya existe una subasta para esta obra' });
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

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener subasta:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const addPuja = async (req: Request, res: Response) => {
    const client = await pool.connect(); // Usamos un cliente para manejar transacciones
    try {
        const { id } = req.params; // ID de la subasta
        const { user_id, cantidad } = req.body; // Datos de la solicitud

        if (!id || !user_id || !cantidad) {
            return res.status(400).json({ message: 'Subasta, usuario y cantidad son obligatorios' });
        }

        // Iniciar una transacción
        await client.query('BEGIN');

        // Validar que la subasta exista y obtener el precio actual
        const subasta = await client.query(
            `SELECT COALESCE(MAX(p.cantidad), s.precio_inicial) AS precio_actual
             FROM subastas s
             LEFT JOIN pujas p ON s.id = p.subasta_id
             WHERE s.id = $1
             GROUP BY s.precio_inicial`,
            [id]
        );

        if (subasta.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Subasta no encontrada' });
        }

        const precioActual = subasta.rows[0].precio_actual;

        if (cantidad <= precioActual) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'La puja debe ser mayor al precio actual' });
        }

        // Verificar el saldo del usuario
        const user = await client.query('SELECT wallet FROM artists WHERE id = $1', [user_id]);

        if (user.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const wallet = user.rows[0].wallet;

        // Obtener la última (mayor) puja realizada por el usuario en esta subasta
        const ultimaPuja = await client.query(
            `SELECT MAX(cantidad) AS cantidad
             FROM pujas
             WHERE subasta_id = $1 AND user_id = $2`,
            [id, user_id]
        );

        const ultimaCantidad = ultimaPuja.rows[0].cantidad || 0;

        // Ajustar el saldo del usuario:
        // Devolver la última cantidad antes de restar la nueva puja
        const diferencia = cantidad - ultimaCantidad; // Diferencia a ajustar

        if (wallet < diferencia) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Saldo insuficiente para realizar la puja' });
        }

        // Actualizar el wallet del usuario
        await client.query('UPDATE artists SET wallet = wallet - $1 WHERE id = $2', [diferencia, user_id]);

        // Registrar la nueva puja
        const result = await client.query(
            `INSERT INTO pujas (subasta_id, user_id, cantidad)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [id, user_id, cantidad]
        );

        // Confirmar la transacción
        await client.query('COMMIT');

        res.status(201).json(result.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK'); // Revertir la transacción en caso de error
        console.error('Error al registrar puja:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    } finally {
        client.release();
    }
};


export const adjudicarSubasta = async (req: Request, res: Response) => {
    const client = await pool.connect(); // Usamos un cliente para manejar transacciones
    try {
        const { id } = req.params;

        // Iniciar una transacción
        await client.query('BEGIN');

        // Obtener la mejor puja
        const pujaResult = await client.query(
            `SELECT p.user_id, p.cantidad
             FROM pujas p
             WHERE p.subasta_id = $1
             ORDER BY p.cantidad DESC
             LIMIT 1`,
            [id]
        );

        if (pujaResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'No hay pujas registradas en esta subasta' });
        }

        const mejorPuja = pujaResult.rows[0];

        // Transferir la propiedad de la obra al mejor postor
        await client.query(
            `UPDATE obras
             SET propiedad_id = $1
             WHERE id = (SELECT obra_id FROM subastas WHERE id = $2)`,
            [mejorPuja.user_id, id]
        );

        // Devolver la última puja de cada usuario que no ganó
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

        // Confirmar la transacción
        await client.query('COMMIT');

        res.status(200).json({ 
            message: 'Subasta adjudicada al mejor postor', 
            mejorPuja,
            devoluciones: perdedoresResult.rows 
        });
    } catch (error) {
        await client.query('ROLLBACK'); // Revertir la transacción en caso de error
        console.error('Error al adjudicar subasta:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    } finally {
        client.release(); // Liberar el cliente
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
