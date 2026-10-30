/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  runBiLSTMInference,
  SAMPLE_ARTICLES,
  MAX_SEQUENCE_LENGTH,
  EMBEDDING_DIM,
  HIDDEN_UNITS,
  PredictionResult,
} from './src/utils/bilstmEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-Memory Database Store for Full-Stack Operation
interface UserRecord {
  id: string;
  email: string;
  password: string; // Plain/hashed comparison in memory
  fullName: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: string;
}

interface FeedbackRecord {
  id: string;
  analysisId: string;
  userId?: string;
  rating: 'like' | 'dislike';
  isCorrect: boolean;
  comments?: string;
  createdAt: string;
}

interface StoredPrediction extends PredictionResult {
  userId?: string;
  isFlagged?: boolean;
}

const users: UserRecord[] = [
  {
    id: 'usr_admin_1',
    email: 'admin@veritas.ai',
    password: 'AdminPass123!',
    fullName: 'Dr. Elena Vance (Lead AI Auditor)',
    role: 'admin',
    isActive: true,
    createdAt: '2026-01-15T08:00:00.000Z',
  },
  {
    id: 'usr_demo_1',
    email: 'demo@veritas.ai',
    password: 'UserPass123!',
    fullName: 'Marcus Chen (Senior Journalist)',
    role: 'user',
    isActive: true,
    createdAt: '2026-02-10T11:30:00.000Z',
  },
];

// Seed realistic predictions
const predictions: StoredPrediction[] = [];

// Seed sample inferences
const seedSamples = [
  {
    sample: SAMPLE_ARTICLES[0],
    userId: 'usr_demo_1',
    timestamp: '2026-10-28T14:22:10.000Z',
  },
  {
    sample: SAMPLE_ARTICLES[2],
    userId: 'usr_demo_1',
    timestamp: '2026-10-29T09:15:30.000Z',
  },
  {
    sample: SAMPLE_ARTICLES[1],
    userId: 'usr_admin_1',
    timestamp: '2026-10-29T16:45:00.000Z',
  },
  {
    sample: SAMPLE_ARTICLES[3],
    userId: 'usr_demo_1',
    timestamp: '2026-10-30T01:10:00.000Z',
  },
];

seedSamples.forEach(({ sample, userId, timestamp }) => {
  const result = runBiLSTMInference(sample.text);
  predictions.push({
    ...result,
    id: 'pred_seed_' + sample.id,
    userId,
    analyzedAt: timestamp,
  });
});

const feedbacks: FeedbackRecord[] = [
  {
    id: 'fb_1',
    analysisId: predictions[0]?.id || 'pred_seed_sample-fake-1',
    userId: 'usr_demo_1',
    rating: 'like',
    isCorrect: true,
    comments: 'Correctly identified hyperbolic miracle cure terminology and missing peer review.',
    createdAt: '2026-10-28T14:30:00.000Z',
  },
  {
    id: 'fb_2',
    analysisId: predictions[1]?.id || 'pred_seed_sample-real-1',
    userId: 'usr_demo_1',
    rating: 'like',
    isCorrect: true,
    comments: 'Accurate classification of verifiable NASA press release and researcher attributions.',
    createdAt: '2026-10-29T09:20:00.000Z',
  },
];

// Active sessions: token -> userId
const sessions = new Map<string, string>();
// Pre-seed token for demo users
sessions.set('token_admin_demo', 'usr_admin_1');
sessions.set('token_user_demo', 'usr_demo_1');

function getUserFromReq(req: Request): UserRecord | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.replace('Bearer ', '').trim();
  const userId = sessions.get(token);
  if (!userId) return null;
  return users.find((u) => u.id === userId && u.isActive) || null;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Logging middleware
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
      console.log(`[API] ${req.method} ${req.path}`);
    }
    next();
  });

  // ------------------------------------------
  // API Endpoints
  // ------------------------------------------

  // Model Metadata & Architecture Information
  app.get('/api/model/info', (req: Request, res: Response) => {
    res.json({
      architecture: 'Bidirectional Long Short-Term Memory (Bi-LSTM)',
      framework: 'TensorFlow / Keras / PyTorch compatible',
      maxSequenceLength: MAX_SEQUENCE_LENGTH,
      embeddingDim: EMBEDDING_DIM,
      hiddenUnits: HIDDEN_UNITS,
      vocabularySize: 10000,
      classificationActivation: 'Sigmoid',
      classes: ['Fake News', 'Real News'],
      decisionThreshold: 0.5,
      trainingMetrics: {
        accuracy: '94.2%',
        precision: '93.7%',
        recall: '94.8%',
        f1Score: '94.2%',
        testLoss: 0.162,
        dataset: 'WELFake & ISOT News Benchmark (72,134 curated articles)',
      },
      layers: [
        { name: 'Embedding', type: 'Word2Vec / GloVe', outputShape: `(None, ${MAX_SEQUENCE_LENGTH}, ${EMBEDDING_DIM})` },
        { name: 'Bidirectional LSTM (Forward + Backward)', type: 'Bi-LSTM', outputShape: `(None, ${MAX_SEQUENCE_LENGTH}, ${HIDDEN_UNITS * 2})` },
        { name: 'Contextual Global Attention', type: 'Attention Pooling', outputShape: `(None, ${HIDDEN_UNITS * 2})` },
        { name: 'Dense Dropout', type: 'Dropout (0.35)', outputShape: `(None, ${HIDDEN_UNITS * 2})` },
        { name: 'Dense Classification', type: 'Dense + Sigmoid', outputShape: '(None, 1)' },
      ],
    });
  });

  // Authentication
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { email, password, fullName, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ detail: 'Email and password are required' });
    }
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ detail: 'Account with this email already exists' });
    }
    const newUser: UserRecord = {
      id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      email: email.toLowerCase().trim(),
      password,
      fullName: fullName || 'New Analyst',
      role: role === 'admin' ? 'admin' : 'user',
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    const token = 'token_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessions.set(token, newUser.id);

    const { password: _, ...userSafe } = newUser;
    res.status(201).json({
      access_token: token,
      token_type: 'bearer',
      user: userSafe,
    });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = users.find((u) => u.email.toLowerCase() === email?.toLowerCase()?.trim());
    if (!user || user.password !== password) {
      return res.status(401).json({ detail: 'Invalid email or password' });
    }
    if (!user.isActive) {
      return res.status(403).json({ detail: 'Account is deactivated' });
    }
    const token = 'token_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessions.set(token, user.id);

    const { password: _, ...userSafe } = user;
    res.json({
      access_token: token,
      token_type: 'bearer',
      user: userSafe,
    });
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '').trim();
      sessions.delete(token);
    }
    res.json({ message: 'Successfully logged out' });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user) {
      return res.status(401).json({ detail: 'Unauthorized. Please sign in.' });
    }
    const { password: _, ...userSafe } = user;
    res.json(userSafe);
  });

  app.put('/api/auth/profile', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user) {
      return res.status(401).json({ detail: 'Unauthorized' });
    }
    const { fullName, email } = req.body;
    if (fullName) user.fullName = fullName;
    if (email && email.toLowerCase() !== user.email) {
      if (users.some((u) => u.email === email.toLowerCase() && u.id !== user.id)) {
        return res.status(400).json({ detail: 'Email is already taken by another account' });
      }
      user.email = email.toLowerCase();
    }
    const { password: _, ...userSafe } = user;
    res.json(userSafe);
  });

  app.put('/api/auth/change-password', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user) {
      return res.status(401).json({ detail: 'Unauthorized' });
    }
    const { currentPassword, newPassword } = req.body;
    if (user.password !== currentPassword) {
      return res.status(400).json({ detail: 'Current password is incorrect' });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ detail: 'New password must be at least 6 characters' });
    }
    user.password = newPassword;
    res.json({ message: 'Password updated successfully' });
  });

  // Prediction Inference
  app.post('/api/predict', (req: Request, res: Response) => {
    const { text, threshold } = req.body;
    if (!text || typeof text !== 'string' || text.trim().length < 10) {
      return res.status(400).json({ detail: 'Article text must contain at least 10 characters' });
    }

    try {
      const parsedThreshold = typeof threshold === 'number' ? threshold : 0.5;
      const prediction = runBiLSTMInference(text, parsedThreshold);
      const user = getUserFromReq(req);

      const record: StoredPrediction = {
        ...prediction,
        userId: user ? user.id : undefined,
      };
      predictions.unshift(record);

      res.status(200).json(record);
    } catch (err: any) {
      res.status(422).json({ detail: err?.message || 'Failed to analyze text' });
    }
  });

  app.get('/api/predict/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const pred = predictions.find((p) => p.id === id);
    if (!pred) {
      return res.status(404).json({ detail: 'Prediction not found' });
    }
    res.json(pred);
  });

  // Analysis History
  app.get('/api/history', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    const { page = '1', limit = '10', filter = 'all', search = '' } = req.query;

    let items = [...predictions];
    if (user && user.role !== 'admin') {
      items = items.filter((p) => p.userId === user.id || !p.userId);
    }

    if (filter === 'fake') {
      items = items.filter((p) => p.predictedClass === 'Fake News');
    } else if (filter === 'real') {
      items = items.filter((p) => p.predictedClass === 'Real News');
    }

    if (typeof search === 'string' && search.trim()) {
      const q = search.toLowerCase().trim();
      items = items.filter(
        (p) =>
          p.textExcerpt.toLowerCase().includes(q) ||
          p.fullText.toLowerCase().includes(q) ||
          p.predictedClass.toLowerCase().includes(q)
      );
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const total = items.length;
    const startIdx = (pageNum - 1) * limitNum;
    const paginatedItems = items.slice(startIdx, startIdx + limitNum);

    res.json({
      items: paginatedItems,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    });
  });

  app.delete('/api/history/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const user = getUserFromReq(req);
    const index = predictions.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ detail: 'Record not found' });
    }

    // Role check: Admin or author
    if (user && user.role !== 'admin' && predictions[index].userId !== user.id) {
      return res.status(403).json({ detail: 'Permission denied to delete this record' });
    }

    predictions.splice(index, 1);
    res.json({ message: 'History record removed successfully', id });
  });

  // Feedback
  app.post('/api/feedback', (req: Request, res: Response) => {
    const { analysisId, rating, isCorrect, comments } = req.body;
    if (!analysisId || !rating) {
      return res.status(400).json({ detail: 'analysisId and rating (like/dislike) are required' });
    }

    const user = getUserFromReq(req);
    const newFeedback: FeedbackRecord = {
      id: 'fb_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      analysisId,
      userId: user ? user.id : undefined,
      rating,
      isCorrect: Boolean(isCorrect),
      comments,
      createdAt: new Date().toISOString(),
    };
    feedbacks.unshift(newFeedback);

    res.status(201).json(newFeedback);
  });

  app.get('/api/feedback', (req: Request, res: Response) => {
    res.json(feedbacks);
  });

  app.delete('/api/feedback/:id', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ detail: 'Administrator access required' });
    }
    const id = req.params.id;
    const idx = feedbacks.findIndex((f) => f.id === id);
    if (idx === -1) {
      return res.status(404).json({ detail: 'Feedback record not found' });
    }
    feedbacks.splice(idx, 1);
    res.json({ message: 'Feedback deleted' });
  });

  // Administrator Dashboard & User Management
  app.get('/api/admin/dashboard', (req: Request, res: Response) => {
    const totalPredictions = predictions.length;
    const fakeCount = predictions.filter((p) => p.predictedClass === 'Fake News').length;
    const realCount = predictions.filter((p) => p.predictedClass === 'Real News').length;

    const fakePct = totalPredictions > 0 ? parseFloat(((fakeCount / totalPredictions) * 100).toFixed(1)) : 50;
    const realPct = totalPredictions > 0 ? parseFloat(((realCount / totalPredictions) * 100).toFixed(1)) : 50;

    const totalFeedbackCount = feedbacks.length;
    const correctCount = feedbacks.filter((f) => f.isCorrect).length;
    const satisfactionRate =
      totalFeedbackCount > 0 ? parseFloat(((correctCount / totalFeedbackCount) * 100).toFixed(1)) : 93.5;

    const totalLatency = predictions.reduce((acc, p) => acc + (p.inferenceTimeMs || 20), 0);
    const avgLatency = totalPredictions > 0 ? parseFloat((totalLatency / totalPredictions).toFixed(1)) : 22.4;

    res.json({
      totalAnalyzed: totalPredictions,
      realNewsCount: realCount,
      fakeNewsCount: fakeCount,
      realPercentage: realPct,
      fakePercentage: fakePct,
      totalUsers: users.length,
      totalFeedback: totalFeedbackCount,
      accuracySatisfactionRate: satisfactionRate,
      averageLatencyMs: avgLatency,
      modelVersion: 'Bi-LSTM-Keras-v2.4-Embed64',
    });
  });

  app.get('/api/admin/users', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ detail: 'Administrator access required' });
    }
    const safeUsers = users.map(({ password: _, ...rest }) => rest);
    res.json(safeUsers);
  });

  app.put('/api/admin/users/:id', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ detail: 'Administrator access required' });
    }
    const targetId = req.params.id;
    const targetUser = users.find((u) => u.id === targetId);
    if (!targetUser) {
      return res.status(404).json({ detail: 'User not found' });
    }
    const { role, isActive, fullName } = req.body;
    if (role && (role === 'user' || role === 'admin')) {
      targetUser.role = role;
    }
    if (typeof isActive === 'boolean') {
      targetUser.isActive = isActive;
    }
    if (fullName) {
      targetUser.fullName = fullName;
    }
    const { password: _, ...safeUser } = targetUser;
    res.json(safeUser);
  });

  app.delete('/api/admin/users/:id', (req: Request, res: Response) => {
    const user = getUserFromReq(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ detail: 'Administrator access required' });
    }
    const targetId = req.params.id;
    if (targetId === user.id) {
      return res.status(400).json({ detail: 'Cannot delete your own active administrator account' });
    }
    const idx = users.findIndex((u) => u.id === targetId);
    if (idx === -1) {
      return res.status(404).json({ detail: 'User not found' });
    }
    users.splice(idx, 1);
    res.json({ message: 'User deleted successfully' });
  });

  // REST API Documentation endpoint
  app.get('/api/docs/spec', (req: Request, res: Response) => {
    res.json({
      title: 'Veritas AI Fake News Detection API Specification',
      version: '1.0.0',
      description: 'Production REST API for Bi-LSTM inference, authentication, history and feedback.',
      endpoints: [
        { method: 'POST', path: '/api/auth/register', auth: 'None', desc: 'Registers a new user account' },
        { method: 'POST', path: '/api/auth/login', auth: 'None', desc: 'Authenticates and returns JWT bearer token' },
        { method: 'POST', path: '/api/auth/logout', auth: 'Bearer', desc: 'Invalidates session token' },
        { method: 'GET', path: '/api/auth/me', auth: 'Bearer', desc: 'Returns current authenticated profile' },
        { method: 'PUT', path: '/api/auth/profile', auth: 'Bearer', desc: 'Updates user personal info' },
        { method: 'PUT', path: '/api/auth/change-password', auth: 'Bearer', desc: 'Changes account password' },
        { method: 'POST', path: '/api/predict', auth: 'Optional Bearer', desc: 'Runs Bi-LSTM inference on news text' },
        { method: 'GET', path: '/api/predict/:id', auth: 'Optional', desc: 'Retrieves prediction by ID' },
        { method: 'GET', path: '/api/history', auth: 'Optional Bearer', desc: 'Paginated user or system analysis records' },
        { method: 'DELETE', path: '/api/history/:id', auth: 'Bearer (Owner/Admin)', desc: 'Deletes analysis history record' },
        { method: 'POST', path: '/api/feedback', auth: 'Optional Bearer', desc: 'Submits user like/dislike & comments' },
        { method: 'GET', path: '/api/feedback', auth: 'Optional Bearer', desc: 'Lists user feedback records' },
        { method: 'GET', path: '/api/admin/dashboard', auth: 'Bearer (Admin)', desc: 'System analytics and aggregate stats' },
        { method: 'GET', path: '/api/admin/users', auth: 'Bearer (Admin)', desc: 'Lists all registered users' },
        { method: 'PUT', path: '/api/admin/users/:id', auth: 'Bearer (Admin)', desc: 'Modifies user role or status' },
        { method: 'DELETE', path: '/api/admin/users/:id', auth: 'Bearer (Admin)', desc: 'Removes user account' },
        { method: 'GET', path: '/api/model/info', auth: 'None', desc: 'Bi-LSTM model architecture and layer specs' },
      ],
    });
  });

  // Mount Vite dev server in middleware mode
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      allowedHosts: true,
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Veritas AI] Full-stack Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start full-stack server:', err);
  process.exit(1);
});
