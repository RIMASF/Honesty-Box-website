// routes/answerRoutes.js
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const Answer = require("../models/Answer");

// POST /api/answer
// Body: { question, answer, depth, honestyCount }
router.post("/answer", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { question, answer, depth, honestyCount } = req.body;

    if (!question || !answer) {
      return res
        .status(400)
        .json({ ok: false, msg: "Question and answer are required." });
    }

    const doc = await Answer.create({
      userId,
      question,
      answer,
      depth: depth || 0,
      honestyCount: honestyCount || 0,
      date: new Date(),
    });

    return res.json({ ok: true, id: doc._id });
  } catch (error) {
    console.error("Error in POST /api/answer:", error.message);
    return res.status(500).json({ ok: false, msg: "Server error." });
  }
});

// GET /api/answers
router.get("/answers", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const answers = await Answer.find({ userId }).sort({ date: 1 });

    return res.json({
      ok: true,
      answers: answers.map((a) => ({
        question: a.question,
        answer: a.answer,
        depth: a.depth,
        honestyCount: a.honestyCount,
        date: a.date.toISOString().slice(0, 10), // YYYY-MM-DD
      })),
    });
  } catch (error) {
    console.error("Error in GET /api/answers:", error.message);
    return res.status(500).json({ ok: false, msg: "Server error." });
  }
});

module.exports = router;
