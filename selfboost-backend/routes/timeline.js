const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const { verifyToken } = require("../middleware/auth");

//メインのタイムライン：自分とフォローしているユーザーの投稿を取得
router.get("/", verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    if (!currentUser) {
      return res.status(404).json({ message: "ユーザーが見つかりません" });
    }

    const userIds = [currentUser._id, ...currentUser.followings];

    const posts = await Post.find({ userId: { $in: userIds } })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate({
        path: "userId",
        select: "username profilePicture",
      });

    return res.status(200).json(posts);
  } catch (err) {
    console.error("タイムライン取得エラー：", err);
    return res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});

// すべての投稿を取得するタイムライン
router.get("/all", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate({
        path: "userId",
        select: "username profilePicture",
      });

    return res.status(200).json(posts);
  } catch (err) {
    console.error("すべての投稿取得エラー：", err);
    return res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});

//ユーザーの投稿を取得
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "ユーザーが見つかりません" });
    }

    const posts = await Post.find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate({
        path: "userId",
        select: "username profilePicture",
      });
    
    return res.status(200).json(posts);
  } catch (err) {
    console.error("ユーザー投稿取得エラー", err);
    return res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});

module.exports = router;
