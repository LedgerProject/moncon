import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import registerRoutes from './routes/registerRoutes.js';
import publisherRoutes from './routes/publisherRoutes.js';
import userRoutes from './routes/userRoutes.js';
import nftRoutes from './routes/nftRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import jsRoutes from './routes/jsRoutes.js';
import { checkIfAdmin, checkIfPublisher, checkIfUser } from './middlewares/authMiddleware.js';

const app = express();
const port = process.env.PORT;

app.use(cors({ origin: process.env.CORS }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the moncon API!');
});

app.use('/v1/register', registerRoutes);
app.use('/v1/publisher', checkIfPublisher, publisherRoutes);
app.use('/v1/user', checkIfUser, userRoutes);
app.use('/v1/nft', nftRoutes);
app.use('/v1/admin', checkIfAdmin, adminRoutes);
app.use('/v1/js', jsRoutes);

app.listen(port, async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true });

    console.log(`Server started and listening on port ${port}`);
  } catch (err) {
    console.log('Error starting server: ', err.message);
  }
});
