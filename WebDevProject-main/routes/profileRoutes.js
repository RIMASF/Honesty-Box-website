// routes/profileRoutes.js
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const User = require("../models/User");
const Answer = require("../models/Answer");

// GET /api/profile
router.get("/profile", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    const answers = await Answer.find({ userId });

    const days = answers.length;

    const totalDepth = answers.reduce(
      (sum, a) => sum + (a.depth || 0),
      0
    );
    const totalHonestyWords = answers.reduce(
      (sum, a) => sum + (a.honestyCount || 0),
      0
    );

    const avgDepth =
      answers.length > 0 ? Math.round(totalDepth / answers.length) : 0;

    const rate =
      answers.length > 0 ? Math.round((answers.length / 100) * 100) : 0;

    let honestyScore = avgDepth * 0.6 + totalHonestyWords * 4;
    if (honestyScore > 100) honestyScore = 100;

    return res.json({
      name: user?.name || "User",
      days,
      rate,
      avgDepth,
      totalHonestyWords,
      honestyScore: Math.round(honestyScore),
    });
  } catch (error) {
    console.error("Error in GET /api/profile:", error.message);
    return res.status(500).json({ msg: "Server error." });
  }
});

module.exports = router;
