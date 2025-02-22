import { Router } from 'express';
import { 
  getAllSubastas, 
  getActiveSubastas, 
  createSubasta, 
  getSubastaById, 
  addPuja, 
  getPujas, 
  adjudicarSubasta,
  deleteSubasta
} from '../controllers/subastaController';

const router = Router();

router.get('/subastas', getAllSubastas);
router.get('/subastas/activas', getActiveSubastas);
router.post('/subastas', createSubasta);
router.get('/subastas/:id', getSubastaById);
router.post('/subastas/:id/pujas', addPuja);
router.get('/subastas/:id/pujas', getPujas);
router.post('/subastas/:id/adjudicar', adjudicarSubasta);
router.delete('/subastas/:id', deleteSubasta);

export default router;
