// server.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { setupSwagger } from './swagger';
import userRoutes from './routes/userRoutes';
import obraRoutes from './routes/obraRoutes';
import subastaRoutes from './routes/subastaRoutes';

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:9000',
    credentials: true
  })
);
app.use('/', userRoutes);
app.use('/', obraRoutes);
app.use('/', subastaRoutes);

setupSwagger(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
});

export default app;


