const router = require("express").Router();
const User = require("../models/User");

//ユーザー情報の取得
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    return res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//ユーザー情報の更新(簡易検証版)
router.put("/:id", async (req, res) => {
  //リクエストボディのidとパラメータのidが一致する場合
  if (req.body.id === req.params.id || req.body.isAdmin) {
    try {
      const updateduser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      return res.status(200).json(updateduser);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("自分のアカウントの時だけ情報を更新できます");
  }
});

//ユーザー削除（簡易検証版）
router.delete("/:id", async (req, res) => {
  //リクエストボディのidとパラメータのidが一致する場合
  if (req.body.id === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      return res.status(200).json("ユーザーが削除されました");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("自分のアカウントの時だけ情報を削除できます");
  }
});

//ユーザーのフォロー
router.put("/:id/follow", async (req, res) => {
  if (req.params.id != req.body.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.id);
      //フォロワーに自分がいなかったら
      if (!user.followers.includes(req.body.id)) {
        await user.updateOne({
          $push: {
            followers: req.body.id,
          },
        });
        await currentUser.updateOne({
          $push: {
            followings: req.params.id,
          },
        });
        return res.status(200).json("フォローしました");
      } else {
        return res.status(403).json("あなたはこのユーザーをフォローしています");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("自分をフォローすることは出来ません");
  }
});

//ユーザーのフォローを外す
router.put("/:id/unfollow", async (req, res) => {
  if (req.params.id != req.body.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.id);
      //フォロワーに自分がいたら
      if (user.followers.includes(req.body.id)) {
        await user.updateOne({
          $pull: {
            followers: req.body.id,
          },
        });
        await currentUser.updateOne({
          $pull: {
            followings: req.params.id,
          },
        });
        return res.status(200).json("フォローを解除しました");
      } else {
        return res.status(403).json("このユーザーはフォロー解除できません");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("自分自身をフォロー解除することは出来ません");
  }
});

module.exports = router;
