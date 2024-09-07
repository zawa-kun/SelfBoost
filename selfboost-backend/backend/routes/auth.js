const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.get("/" , (req,res) => {
    res.send("auth");
})

//ユーザー登録
router.post("/register",async (req,res) => {
    try{
        // パスワードのハッシュ化
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        //新しいユーザー作成
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashPassword,
        });

        //DBに保存
        const user = await newUser.save();
        return res.status(200).json(user);   
    }catch(err){
        return res.status(500).json(err);
    }
});

//ログイン
router.post("/login",async (req,res) => {
    try{
        //ユーザーをメールアドレスで検索
        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(404).send("ユーザーが見つかりません");
        
        //パスワード照合
        const isMatch = await bcrypt.compare(req.body.password,user.password);
        if(!isMatch) return res.status(400).json("パスワードが違います");

        return res.status(200).json(user);
    }catch(err){
        return res.status(500).json(err);
    }
});

module.exports = router;