const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "./tmp" });

router.get("/", (req, res, next) => {
  res.render("./index.ejs");
});

router.post("/", upload.single("file1"), (req, res, next) => {
  res.render("./index.ejs");
});

module.exports = router;