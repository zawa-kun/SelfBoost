const router = require("express").Router();

//タイムラインのAPI
router.get("/",(req,res) => {
    res.send("timeline API");
});

// //タイムラインの投稿を取得する(自分＋フォロー)
// router.get("/timeline/:userId", async (req, res) => {
//   try {
//     const currentUser = await User.findById(req.params.userId);
//     if (!currentUser) {
//       return res.status(404).json({ message: "ユーザーが見つかりません" });
//     }
//     //自分＋フォロー
//     const userIds = [currentUser._id, ...currentUser.followings];

//     const posts = await Post.find({ userId: { $in: userIds } })
//       .sort({ createdAt: -1 })
//       .limit(50)
//       .populate("userId", "username profilePicture");

//     return res.status(200).json(posts);
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// });

module.exports = router;