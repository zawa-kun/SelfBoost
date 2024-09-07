const router = require("express").Router();

router.get("/",(req,res) => {
    res.send("challenges");
});

module.exports = router;