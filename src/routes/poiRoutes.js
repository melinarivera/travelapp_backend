import express from 'express';
import { crearLugarPOI, votarPOI, listarPOIsPorViaje, eliminarPOI } from '../controllers/poiController.js';
import { verifySession } from '../middleware/authMiddleware.js'; 


const router = express.Router();

router.use(verifySession); // Aplicando a proteção correta

router.get('/viaje/:viajeId', listarPOIsPorViaje);
router.post('/nuevo', crearLugarPOI);
router.post('/votar', votarPOI);
router.delete('/:poiId', eliminarPOI);

export default router;