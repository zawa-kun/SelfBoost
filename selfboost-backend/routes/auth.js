const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { verifyToken } = require("../middleware/auth");

router.get("/", (req, res) => {
  res.send("auth");
});

//ユーザー登録
router.post("/register", async (req, res) => {
  try {
    // パスワードのハッシュ化
    const salt = await bcrypt.genSalt(10);
    let hashPassword = await bcrypt.hash(req.body.password, salt);

    //新しいユーザー作成
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
    });

    //JWTの生成
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    //DBに保存
    const user = await newUser.save();
    return res
      .status(201)
      .json({
        message: "ユーザーが正常に登録されました",
        userId: user._id,
        token,
      });
  } catch (err) {
    if (err.code === 11000) {
      // 重複キーエラーの処理
      const field = Object.keys(err.keyPattern)[0]; //エラーが発生したフィールド
      res.status(409).json({ message: `この${field}は既に使用されています。` });
    } else {
      console.error(err);
      res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
  }
});

//ログイン
router.post("/login", async (req, res) => {
  try {
    //ユーザーをメールアドレスで検索
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("ユーザーが見つかりません");

    //パスワード照合
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(400).json("パスワードが違います");

    //JWTの生成
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    const { password, ...userWithoutPassword } = user.toObject();

    return res.status(200).json({
      message: "ログイン成功",
      user: userWithoutPassword,
      token: token,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

//ログアウト
router.post("/logout", verifyToken, (req, res) => {
  try {
    //クライアント側でトークンを削除することでログアウトする
    return res.status(200).json({ message: "ログアウトしました" });
  } catch (err) {
    return res.status(500).json(err);
  }
});

// トークン検証（オプショナル：保護されたルートのテスト用）
router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "This is a protected route", userId: req.userId });
});

module.exports = router;
