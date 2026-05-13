import express from 'express';
import { crearLugarPOI, votarPOI, listarPOIsPorViaje } from '../controllers/poiController.js';
import { verifySession } from '../middleware/authMiddleware.js'; // Nome correto agora!

const router = express.Router();

router.use(verifySession); // Aplicando a proteção correta

router.get('/viaje/:viajeId', listarPOIsPorViaje);
router.post('/nuevo', crearLugarPOI);
router.post('/votar', votarPOI);

export default router;