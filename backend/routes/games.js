import express from 'express';
import GameScore from '../models/GameScore.js';
import User from '../models/User.js';

import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/games/score
 * Submit a completed game score (time taken)
 */
router.post('/score', protect, async (req, res, next) => {
  try {
    const { gameType, timeTakenSeconds } = req.body;
    const userId = req.user._id;

    if (!['memory', 'sudoku'].includes(gameType)) {
      return res.status(400).json({ success: false, message: 'Invalid game type' });
    }

    if (typeof timeTakenSeconds !== 'number' || timeTakenSeconds < 0) {
      return res.status(400).json({ success: false, message: 'Invalid time' });
    }

    // Enforce "One Puzzle Per Day"
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const existing = await GameScore.findOne({
      user: userId,
      gameType,
      createdAt: { $gte: startOfDay }
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already completed today\'s puzzle!' });
    }

    const newScore = new GameScore({
      user: userId,
      gameType,
      timeTakenSeconds,
    });

    await newScore.save();

    // Optionally update user's daily streak or stats here
    // For now, we'll just save the score

    res.json({ success: true, message: 'Score saved successfully' });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/games/leaderboard/:gameType
 * Get the top 10 fastest times for a specific game (optionally filter by today)
 */
router.get('/leaderboard/:gameType', async (req, res, next) => {
  try {
    const { gameType } = req.params;
    
    if (!['memory', 'sudoku'].includes(gameType)) {
      return res.status(400).json({ success: false, message: 'Invalid game type' });
    }

    // Get today's start date
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const topScores = await GameScore.find({
      gameType,
      createdAt: { $gte: startOfDay }
    })
      .sort({ timeTakenSeconds: 1 })
      .limit(10)
      .populate('user', 'name'); // fetch user name

    // Format the response
    const leaderboard = topScores.map(score => ({
      userId: score.user._id,
      name: score.user.name,
      timeTakenSeconds: score.timeTakenSeconds,
      createdAt: score.createdAt,
    }));

    res.json({ success: true, leaderboard });
  } catch (err) {
    next(err);
  }
});

export default router;
