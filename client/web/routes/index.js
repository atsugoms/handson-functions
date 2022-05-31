const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "./tmp" });

router.get("/", (req, res, next) => {
  res.render("./index.ejs");
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
    res.render("./index.ejs");
  });
  req.pipe(bb);
});

module.exports = router;