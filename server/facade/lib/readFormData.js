const busboy = require("busboy");

/**
 * マルチパートフォームデータの読み取り
 * @param {*} context 
 * @param {*} req 
 * @returns 
 */
module.exports = async function (context, req) {
  return new Promise((resolve, reject) => {
    var form = {};
    var bb = busboy({ headers: req.headers });

    bb.on("file", (name, file, info) => {
      var bytes = [];
      file.on("data", (chunk) => {
        bytes.push(chunk);
      });
      file.on("end", () => {
        form[name] = {
          buffer: Buffer.concat(bytes),
          ...info
        };
      });
      file.resume();
    });
    bb.on("field", (name, value, info) => {
      form[name] = value;
    });
    bb.on("error", (err) => {
      reject(err);
    });
    bb.on("finish", () => {
      resolve(form);
    });

    bb.end(req.body);
  });
};