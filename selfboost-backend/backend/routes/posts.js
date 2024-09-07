const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//投稿を作成する
// router.post("/", async (req, res) => {
//   try {
//     const newPost = new Post(req.body);
//     const savedPost = await newPost.save();
//     return res.status(200).json(savedPost);
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// });

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
