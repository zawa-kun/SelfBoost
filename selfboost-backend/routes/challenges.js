const router = require("express").Router();
const Challenge = require("../models/Challenge");
const User = require("../models/User");
const { verifyToken } = require("../middleware/auth");

//チャレンジ作成
router.post("/", verifyToken, async (req, res) => {
  try {
    const newChallenge = new Challenge({
      ...req.body,
      creator: req.userId,
      participants: [{ user: req.userId }],
    });

    const savedChallenge = await newChallenge.save();
    await User.findByIdAndUpdate(req.userId, {
      $addToSet: { challenges: savedChallenge._id },
    });

    return res.status(201).json({
      message: "チャレンジが正常に作成されました",
      challenge: savedChallenge,
    });
  } catch (err) {
    console.error("チャレンジ作成エラー:", err);
    return res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});

//チャレンジ一覧取得(すべて)
router.get("/", verifyToken, async (req, res) => {
  try {
    const currentUserId = req.userId;
    const challenges = await Challenge.find({
      isPublic: true,
      "participants.user": { $ne: currentUserId }, // 現在参加していないチャレンジのみ
    })
      .sort({ "participants.length": -1 }) //参加者多い順
      .populate("creator", "username");

    return res.status(200).json(challenges);
  } catch (err) {
    console.error("チャレンジ一覧取得エラー:", err);
    return res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});

// おすすめのチャレンジを取得するための新しいルート
router.get('/recommended', verifyToken, async (req, res) => {
  try {
    const recommendedChallenges = await Challenge.aggregate([
      { $match: { isPublic: true } },
      { $addFields: { participantCount: { $size: "$participants" } } },
      { $sort: { participantCount: -1 } },
      { $limit: 3 },
      { $project: { 
        _id: 1, 
        title: 1, 
        description: 1, 
        goalType: 1, 
        goalValue: 1,
        participantCount: 1
      }}
    ]);

    res.status(200).json(recommendedChallenges);
  } catch (err) {
    console.error("おすすめチャレンジ取得エラー:", err);
    res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});

//特定のユーザーのチャレンジ進捗度上位３つを表示
router.get('/user/top', verifyToken, async (req, res) => {
  try {
    // ユーザーが参加しているすべてのチャレンジを取得
    const challenges = await Challenge.find({ 
      "participants.user": req.userId 
    });

    // チャレンジをメモリ上でソートし、上位3つを選択
    const topChallenges = challenges
      .map(challenge => {
        const userParticipation = challenge.participants.find(p => p.user.toString() === req.userId);
        return {
          _id: challenge._id,
          title: challenge.title,
          goalType: challenge.goalType,
          goalValue: challenge.goalValue,
          progress: userParticipation ? userParticipation.progress : 0,
          progressPercentage: userParticipation ? (userParticipation.progress / challenge.goalValue) * 100 : 0
        };
      })
      .sort((a, b) => b.progressPercentage - a.progressPercentage)
      .slice(0, 3);

    res.status(200).json(topChallenges);
  } catch (err) {
    console.error("トップチャレンジ取得エラー:", err);
    res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});

// ユーザーのチャレンジ詳細を取得
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const challenges = await Challenge.find({
      "participants.user": userId,
    }).populate("creator", "username");

    const detailedChallenges = challenges.map((challenge) => {
      const participant = challenge.participants.find(
        (p) => p.user.toString() === userId
      );
      return {
        id: challenge._id,
        title: challenge.title,
        description: challenge.description,
        goalType: challenge.goalType,
        goalValue: challenge.goalValue,
        creator: challenge.creator,
        isPublic: challenge.isPublic,
        createdAt: challenge.createdAt,
        updatedAt: challenge.updatedAt,
        userProgress: participant.progress,
        userJoinedAt: participant.joinedAt,
        userLastUpdateDate: participant.lastUpdateDate,
        progressPercentage: (participant.progress / challenge.goalValue) * 100,
        userStatus: challenge.participantStatus(userId),
      };
    });

    return res.status(200).json(detailedChallenges);
  } catch (err) {
    console.error("ユーザーのチャレンジ詳細取得エラー:", err);
    return res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});

//マイチャレンジの取得
router.get("/my-challenge", verifyToken, async (req, res) => {
  try {
    const myChallenges = await Challenge.find({
      "participants.user": req.userId,
    }).populate("creator", "username")
      .sort({updatedAt:-1});

    return res.status(200).json(myChallenges);
  } catch (err) {
    console.error("マイチャレンジ取得エラー:", err);
    return res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});

// 新しいエンドポイント: 特定のユーザーのチャレンジを取得
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;

    // ユーザーが存在するか確認
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "ユーザーが見つかりません" });
    }

    const userChallenges = await Challenge.find({
      "participants.user": userId,
    }).populate("creator", "username");

    return res.status(200).json(userChallenges);
  } catch (err) {
    console.error("ユーザーのチャレンジ取得エラー:", err);
    return res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});

//特定のチャレンジ取得
router.get("/:id", verifyToken, async (req, res) => {
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
      req.params.id,
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
      return res
        .status(400)
        .json({ message: "このチャレンジに参加していません" });
    }

    const participant = challenge.participants[participantIndex];

    // 進捗の更新
    participant.progress = progress;
    participant.lastUpdateDate = new Date();

    // チャレンジの保存
    await challenge.save();

    return res.status(200).json({
      message: "進捗が更新されました",
      progress: participant.progress,
    });
  } catch (err) {
    console.error("進捗更新エラー:", err);
    return res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});

//チャレンジ更新(テスト用)
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

    await Challenge.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "チャレンジを削除しました" });
  } catch (err) {
    console.error("チャレンジ削除エラー:", err);
    return res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});

module.exports = router;
