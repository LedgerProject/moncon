import express from 'express';
import NFTModel from '../models/nft.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, description, image } = req.body;

    const nft = await NFTModel.create({ name, description, image });

    return res.status(201).json({ url: `${process.env.API_URL}/nft/${nft._id}` });
  } catch (err) {
    console.error('Error creating nft', err);
    return res.status(500).json({ error: 'Error creating nft' });
  }
});

router.get('/:tokenId', async (req, res) => {
  try {
    const { tokenId } = req.params;
    const nft = await NFTModel.findById(tokenId);

    return res.json({
      name: nft.name,
      description: nft.description,
      image: nft.image,
    });
  } catch (err) {
    console.error('Error fetching nft', err);
    return res.status(500).json({ error: 'Error fetching nft' });
  }
});

export default router;
