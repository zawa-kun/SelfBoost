const express = require("express");
const app = express();
const mongoose = require("mongoose");
require('dotenv').config();
const PORT = 3000;

console.log('MONGODB_URI:', process.env.MONGODB_URI);

//ルーティングファイルの読み込み
const authRoute = require("./routes/auth.js");
const challengeRoute = require("./routes/challenges.js");
const postRoute = require("./routes/posts.js");
const userRoute = require("./routes/users.js");

//DB接続
mongoose
    .connect(process.env.MONGOURL)
    .then( () => {
        console.log("DBと接続中");
    })
    .catch( (err) => {
        console.log(err);
    });



//ルート設定
app.use(express.json());
app.use("/api/auth",authRoute);
app.use("/api/challenges",challengeRoute);
app.use("/api/posts",postRoute);
app.use("/api/users",userRoute);

app.get("/",(req,res) => {
    res.send ("hello express");
});


app.listen(PORT, () => console.log ("サーバーが起動しました"));