import express from 'express';
import admin from '../services/firebaseService.js';

const router = express.Router();

router.get('/users', async (req, res) => {
  const response = await admin.auth().listUsers();
  res.json(response.users);
});

export default router;
