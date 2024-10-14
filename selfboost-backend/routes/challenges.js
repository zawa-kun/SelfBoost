const router = require("express").Router();
const Challenge = require("../models/Challenge");
const { verifyToken } = require("../middleware/auth");

//チャレンジ作成
router.post("/", verifyToken, async (req, res) => {
  try {
    const newChallenge = new Challenge({
      ...req.body,
      creator: req.userId,
    });

    const savedChallenge = await newChallenge.save();
    return res.status(201).json(savedChallenge);
  } catch (err) {
    console.error("チャレンジ登録エラー:", err);
    return res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});


//チャレンジ一覧取得
router.get("/", async (req, res) => {
  try {
    const challenges = await Challenge.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .populate("creator", "username");

    return res.status(200).json(challenges);
  } catch (err) {
    console.error("チャレンジ一覧取得エラー:", err);
    return res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});


//特定のチャレンジ取得
router.get("/:id", async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate("creator", "username")
      .populate("participants.user", "username");

    if (!challenge) {
      return res.status(404).json({ message: "チャレンジが見つかりません" });
    }

    return res.status(200).json(challenge);
  } catch (err) {
    console.error("チャレンジ取得エラー:", err);
    return res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});


//チャレンジ更新
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: "チャレンジが見つかりません" });
    }

    if (challenge.creator.toString() !== req.userId) {
      return res.status(403).json({ message: "更新権限がありません" });
    }

    const updatedChallenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    return res.status(200).json(updatedChallenge);
  } catch (err) {
    console.error("チャレンジ更新エラー:", err);
    return res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});


//チャレンジ削除
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: "チャレンジが見つかりません" });
    }

    if (challenge.creator.toString() !== req.userId) {
      return res.status(403).json({ message: "削除権限がありません" });
    }

    await Challenge.findByIdAndDelete(req.userId);

    return res.status(200).json({ message: "チャレンジを削除しました" });
  } catch (err) {
    console.error("チャレンジ削除エラー:", err);
    return res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});


//チャレンジの参加
router.put("/:id/join", verifyToken, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: "チャレンジが見つかりません" });
    }

    if (
      challenge.participants.some((p) => {
        p.user.toString() === req.userId;
      })
    ) {
      return res.status(400).json({ message: "既に参加しています" });
    }

    const result = await Challenge.findByIdAndUpdate(
      req.prams.id,
      { $push: { participants: { user: req.userId } } },
      { new: true, runValidators: true }
    );

    if (!result) {
      return res
        .status(404)
        .json({ message: "チャレンジの更新に失敗しました" });
    }

    return res.status(200).json({
      message: "チャレンジの参加に成功しました",
      challengeId: result._id,
    });
  } catch (err) {
    console.error("チャレンジ参加エラー:", err);
    return res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});


// 進捗更新
router.put("/:id/progress", verifyToken, async (req, res) => {
  try {
    const { progress } = req.body;
    const challengeId = req.params.id;

    //進捗管理は数字で行うから
    if (typeof progress !== "number" || progress < 0) {
      return res.status(400).json({ message: "無効な進捗値です" });
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "チャレンジが見つかりません" });
    }

    const participantIndex = challenge.participants.findIndex(
      (p) => p.user.toString() === req.userId
    );
    if (participantIndex === -1) {
      return res.status(400).json({ message: "このチャレンジに参加していません" });
    }

    const participant = challenge.participants[participantIndex];

    // 進捗の更新
    participant.progress = progress;
    participant.lastUpdateDate = new Date();

    // 日次進捗の更新
    const today = new Date().toISOString().split('T')[0];
    const dailyProgressIndex = participant.dailyProgress.findIndex(
      (dp) => dp.date.toISOString().split('T')[0] === today
    );

    if (dailyProgressIndex !== -1) {
      participant.dailyProgress[dailyProgressIndex].value = progress;
    } else {
      participant.dailyProgress.push({ date: new Date(), value: progress });
    }

    // ストリークの更新
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const hasUpdatedYesterday = participant.dailyProgress.some(
      (dp) => dp.date.toISOString().split('T')[0] === yesterday
    );

    if (hasUpdatedYesterday || participant.dailyProgress.length === 1) {
      participant.streak += 1;
    } else {
      participant.streak = 1;
    }

    // チャレンジの保存
    await challenge.save();

    return res.status(200).json({
      message: "進捗が更新されました",
      progress: participant.progress,
      streak: participant.streak
    });
  } catch (err) {
    console.error("進捗更新エラー:", err);
    return res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});

module.exports = router;
