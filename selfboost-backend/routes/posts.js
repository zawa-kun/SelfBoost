const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const { verifyToken } = require("../middleware/auth");


// 投稿作成ルート
router.post("/", async (req, res) => {
  try {
    //必要なフィールドのみ取得
    const { userId, text } = req.body;

    const newPost = new Post({
      userId: userId,
      text: text,
    });

    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// 特定の投稿を取得する
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});


//タイムラインの投稿を取得する(自分＋フォロー)
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    if(!currentUser){
      return res.status(404).json({message:"ユーザーが見つかりません"});
    }
    //自分＋フォロー
    const userIds = [currentUser._id, ...currentUser.followings];

    const posts = await Post.find({ userId: { $in : userIds} })
      .sort({createdAt : -1 })
      .limit(50)
      .populate('userId', 'username profilePicture');

    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// 投稿を編集する
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("投稿が見つかりません");

    //new ObjectId('66db22e689101f7345c2b9f0')
    console.log(new mongoose.Types.ObjectId(req.body.userId));
    if (post.userId.equals(new mongoose.Types.ObjectId(req.body.userId))) {
      await Post.updateOne({ _id: req.params.id }, { $set: req.body });
      return res.status(200).json("編集に成功しました");
    } else {
      return res.status(403).json("あなたはほかの人の投稿を編集できません");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
