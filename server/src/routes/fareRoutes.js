import express from 'express';
import { calculateFare, getTariffRates } from '../controllers/fareController.js';

const router = express.Router();

router.post('/calculate', calculateFare);
router.get('/rates', getTariffRates);

export default router;
