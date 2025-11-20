import express from 'express';
import { createWaitlist } from '../controllers/WaitListController';

const router = express.Router();

router.post("/", createWaitlist);

export default router;