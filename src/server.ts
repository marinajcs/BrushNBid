// server.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
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
app.use('/api', userRoutes);
app.use('/api', obraRoutes);
app.use('/api', subastaRoutes);

export default app;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
}
