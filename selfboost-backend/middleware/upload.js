const multer = require("multer");
const path = require("path");

//ファイルの保存先とファイル名の指定
const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        let uploadPath = "uploads/";
        //画像がuploadされるパスを場合分け
        switch (file.fieldname){
            case "postImage":
                uploadPath += "posts/";
                break;
            case "avatar":
                uploadPath += "avatars/"
                break;
            case "background":
                uploadPath += "backgrounds/";
                break;
            default:
                uploadPath += "misc/";
        }

        cb(null,uploadPath);
    },
    //アップロードされるファイル名を作成
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null,file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // ファイルのMIMEタイプが以下のいずれかの場合のみファイルアップロードを許可
    if(file.mimetype.startsWith("image/")){
        cb(null,true);
    }else{
        cb(new Error("無効なファイル形式です"),false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits:{
        fileSize: 5 * 1024 *1024 //5MB
    }
});

module.exports = upload;