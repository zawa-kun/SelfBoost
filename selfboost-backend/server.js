const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = 5000;

//ルーティングファイルの読み込み
const authRoute = require("./routes/auth.js");
const challengeRoute = require("./routes/challenges.js");
const postRoute = require("./routes/posts.js");
const userRoute = require("./routes/users.js");
const timelineRoute = require("./routes/timeline.js");

//DB接続
mongoose
    .connect(process.env.MONGOURL)
    .then( () => {
        console.log("DBと接続中");
    })
    .catch( (err) => {
        console.log("DB接続エラー",err);
    });


//ミドルウェア
app.use(express.json());


//ルート設定
app.use("/api/auth",authRoute);
app.use("/api/challenges",challengeRoute);
app.use("/api/posts",postRoute);
app.use("/api/timeline",timelineRoute);
app.use("/api/users",userRoute);


//ベースルート
app.get("/",(req,res) => {
    res.send ("Welcome to SelfBoost API");
});


app.listen(PORT, () => console.log ("サーバーが起動しました"));
