import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import prepareRoutes from './routes/prepare.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    aiEnabled: Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here'),
  });
});

app.use('/api/prepare', prepareRoutes);

app.listen(PORT, () => {
  console.log(`Exam Prep API running on http://localhost:${PORT}`);
});
