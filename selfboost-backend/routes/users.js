const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post.js");
const { verifyToken } = require("../middleware/auth.js");
const bcrypt = require("bcrypt");

//ユーザー情報の取得
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "ユーザーが見つかりません" });

    //パスワードと更新日時の除外
    const { password, updatedAt, ...other } = user._doc;
    return res.status(200).json(other);
  } catch (err) {
    console.error("ユーザー情報取得エラー", err);
    return res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});

//ユーザー情報の更新
router.put("/:id", verifyToken, async (req, res) => {
  if (req.userId !== req.params.id) {
    return res
      .status(403)
      .json({ message: "自分のアカウントのみ編集できます" });
  }

  try {
    const { password, newPassword, email, ...updateData } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "ユーザーが見つかりません" });
    }

    //パスワード更新の処理
    if (newPassword) {
      if (!password) {
        return res.status(400).json({ message: "現在のパスワードが必要です" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "現在のパスワードが正しくありません" });
      }
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }

    //メールアドレス更新の処理
    if (email) {
      const existingUser = await User.findOne({ email });
      //ユーザーが存在しているかつそのメールアドレスが現在のユーザー以外のものである
      if (existingUser && existingUser._id.toString() !== req.userId) {
        return res
          .status(400)
          .json({ message: "このメールアドレスは既に使用されています" });
      }
      updateData.email = email;
    }

    //ユーザー情報更新の処理
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "ユーザー情報の更新に失敗しました" });
    }

    const { password: _, ...userDataToReturn } = updatedUser._doc;
    return res.status(200).json(userDataToReturn);
  } catch (err) {
    console.error("ユーザー情報更新エラー:", err);
    return res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});

//ユーザー削除
router.delete("/:id", verifyToken, async (req, res) => {
  if (req.params.id !== req.userId) {
    return res
      .status(403)
      .json({ message: "自分のアカウントのみ削除できます" });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(req.userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "ユーザーが見つかりません" });
    }

    //関連する投稿の削除
    await Post.deleteMany({ userId: req.userId });

    return res.status(200).json({ message: "ユーザーが正常に削除できました" });
  } catch (err) {
    console.error("ユーザー削除エラー:", err);
    return res.status(200).json({ message: "サーバーエラーが発生しました" });
  }
});



//ユーザーのフォロー
router.put("/:id/follow", verifyToken, async (req, res) => {
  if (req.params.id === req.userId) {
    return res
      .status(403)
      .json({ message: "自分をフォローすることは出来ません" });
  }
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.userId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "ユーザーが見つかりません" });
    }

    if (userToFollow.followers.includes(req.userId)) {
      return res.status(400).json({ message: "既にフォローしています" });
    }

    await User.findByIdAndUpdate(req.params.id, {
      $addToSet: { followers: req.userId },
    });
    await User.findByIdAndUpdate(req.userId, {
      $addToSet: { followings: req.params.id },
    });

    return res.status(200).json({ message: "フォローしました" });
  } catch (err) {
    console.error("フォローエラー:", err);
    return res.status(200).json({ message: "サーバーエラーが発生しました" });
  }
});



//ユーザーのフォロー解除
router.put("/:id/unfollow", verifyToken, async (req, res) => {
  if (req.params.id === req.userId) {
    return res
      .status(403)
      .json({ message: "自分自身をフォロー解除することは出来ません" });
  }
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.userId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: "ユーザーが見つかりません" });
    }

    if (!currentUser.followings.includes(req.params.id)) {
      return res.status(400).json({ message: "このユーザーをフォローしていません" });
    }

    await User.findByIdAndUpdate(req.params.id, {
      $pull: { followers: req.userId },
    });
    await User.findByIdAndUpdate(req.userId, {
      $pull: { followings: req.params.id },
    });

    return res.status(200).json({ message: "フォロー解除しました" });
  } catch (err) {
    console.error("フォロー解除エラー:", err);
    return res.status(200).json({ message: "サーバーエラーが発生しました" });
  }
});

module.exports = router;
