const jwt = require('jsonwebtoken');
require("dotenv").config();


//トークン検証ミドルウェア
exports.verifyToken = (req,res,next) => {
    const token = req.header('Authorization');
    if(!token) return res.status(401).json({message:アクセスが拒否されました});

    try {
        const verified = jwt.verify(token,process.env.JWT_SECRET);
        req.userId = verified.userId;
        next();
    } catch (err) {
        res.status(400).json({message:"無効なトークンです"});
    }

};

