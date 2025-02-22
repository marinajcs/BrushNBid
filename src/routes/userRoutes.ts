// src/routes/userRoutes.ts
import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser, login, logout} from '../controllers/userController';

const router = Router();

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/login', login);
router.post('/logout', logout);


export default router;
