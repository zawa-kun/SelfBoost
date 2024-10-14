const router = require("express").Router();
const Post = require("../models/Post");
const { verifyToken } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

// Multerの設定
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// 新規投稿作成
router.post("/", verifyToken, upload.single('image'), async (req, res) => {
  try {
    // 必要なフィールドのみ取得
    const { text, challengeId } = req.body;

    const newPost = new Post({
      userId: req.userId,
      text: text,
      challengeId: challengeId,
      imgUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });

    const savedPost = await newPost.save();
    // ユーザー情報含めて返す
    const populatedPost = await Post.findById(savedPost._id).populate("userId", "username profilePicture");
    return res.status(201).json(populatedPost);
  } catch (err) {
    console.error("投稿作成エラー:", err);
    return res.status(500).json({ message: "投稿の作成中にエラーが発生しました", error: err.message });
  }
});

//投稿の編集
router.put("/:id", verifyToken, async (req, res) => {
  try {
    //投稿の存在確認
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "投稿が見つかりません" });

    //編集権限の確認
    if (!post.userId.equals(req.userId)) {
      return res
        .status(403)
        .json({ message: "あなたはほかの人の投稿を編集できません" });
    }

    //更新可能なフィールドの制限
    const { text, imgUrl, challengeId } = req.body;
    const updateData = {};
    if (text !== undefined) updateData.text = text;
    if (imgUrl !== undefined) updateData.imgUrl = imgUrl;
    if (challengeId !== undefined) updateData.challengeId = challengeId;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "編集に成功しました", post: updatedPost });
  } catch (err) {
    console.error("投稿編集エラー:", err);
    return res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});

// 特定の投稿取得
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

//投稿削除
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "投稿が見つかりません" });

    // 投稿の所有者であるかの確認
    if (!post.userId.equals(req.userId)) {
      return res
        .status(403)
        .json({ message: "あなたはこの投稿を削除する権限がありません" });
    }

    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "投稿が削除されました" });
  } catch (err) {
    console.error("投稿編集エラー:",err);
    return res.status(500).json({message:"サーバーエラーが発生しました"});
  }
});

//投稿にいいね
router.put("/:id/like",verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if(!post){
      return res.status(404).json({message: "投稿が見つかりません"});
    }

    //まだ投稿にいいねをしていなければいいね
    if (!post.likes.includes(req.userId)) {
      await post.updateOne({
        $push: {
          likes: req.userId,
        },
      });
      return res.status(200).json({message:"投稿にいいねを押しました"});
      //投稿にいいねが押されていたらいいねを外す
    } else {
      await post.updateOne({
        $pull: {
          likes: req.userId,
        },
      });
      return res.status(200).json({message:"いいねを取り消しました"});
    }
  } catch (err) {
    console.error("いいね操作エラー:",err);
    return res.status(500).json({message:"サーバーエラーが発生しました"});
  }
});

module.exports = router;
