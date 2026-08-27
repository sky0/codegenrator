import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { generatePreparation } from '../services/aiService.js';
import { saveSession, getAllSessions, getSessionById, deleteSession } from '../services/storageService.js';

const router = Router();

router.post('/generate', async (req, res) => {
  try {
    const { doubts, questionPaper, studyPlan, subject, examDate } = req.body;

    if (!doubts?.trim() && !questionPaper?.trim() && !studyPlan?.trim()) {
      return res.status(400).json({
        error: 'Please provide at least one of: doubts, questionPaper, or studyPlan.',
      });
    }

    const preparation = await generatePreparation({
      doubts,
      questionPaper,
      studyPlan,
      subject,
      examDate,
    });

    const session = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      input: { doubts, questionPaper, studyPlan, subject, examDate },
      preparation,
    };

    saveSession(session);

    res.json(session);
  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate preparation.' });
  }
});

router.get('/sessions', (_req, res) => {
  const sessions = getAllSessions().map(({ id, createdAt, input, preparation }) => ({
    id,
    createdAt,
    subject: input.subject || 'Untitled',
    title: preparation.title,
    postcardCount: preparation.postcards?.length || 0,
    demo: preparation.demo || false,
  }));
  res.json(sessions);
});

router.get('/sessions/:id', (req, res) => {
  const session = getSessionById(req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found.' });
  }
  res.json(session);
});

router.delete('/sessions/:id', (req, res) => {
  const session = getSessionById(req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found.' });
  }
  deleteSession(req.params.id);
  res.json({ success: true });
});

export default router;
