// src/routes/obrasRoutes.ts
import { Router } from 'express';
import { getAllObras, getObraById, getObrasByUser, createObra, updateObra, deleteObra } from '../controllers/obraController';

const router = Router();

router.get('/obras', getAllObras);
router.get('/users/:id', getObraById);
router.get('/obras/user/:id', getObrasByUser);
router.post('/obras', createObra);
router.put('/obras/:id', updateObra);
router.delete('/obras/:id', deleteObra);

export default router;
