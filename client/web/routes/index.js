require("dotenv").config();
const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "./tmp" });
const { v4: uuid } = require("uuid");

router.get("/", (req, res, next) => {
  var url = process.env.REQUEST_URL || "/";
  var guid = uuid();

  res.render("./index.ejs", { url, guid });
});

// router.post("/", upload.single("file1"), (req, res, next) => {
//   res.render("./index.ejs");
// });

router.post("/", (req, res, next) => {
  const fs = require("fs");
  const path = require("path");
  const busboy = require("busboy");
  const bb = busboy({ headers: req.headers });
  bb.on("file", (name, file, info) => {
    var filepath = path.join(__dirname, info.filename);
    file.pipe(fs.createWriteStream(filepath));
  });
  bb.on("error", (err) => {
    next(err);
  });
  bb.on("close", () => {
    res.redirect("/");
  });
  req.pipe(bb);
});

module.exports = router;