// var readOut = async function (req) {
//   return new Promise((resolve, reject) => {
//     var raw = "";
//     req.on("data", (chunk) => {
//       raw += chunk;
//     });
//     req.on("finish", () => {
//       console.log(raw);
//       resolve(raw);
//     });
//     req.on("error", (err) => {
//       reject(err);
//     });
//   });
// };

// module.exports = async function (context, req) {
//   context.log('JavaScript HTTP trigger function processed a request.');

//   // const name = (req.query.name || (req.body && req.body.name));
//   // const responseMessage = name
//   //     ? "Hello, " + name + ". This HTTP triggered function executed successfully."
//   //     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

//   // context.bindings.outImageBlob = "";
//   console.log(`rawBody : ${req.rawBody}`);
//   var raw = await readOut(req);

//   return {
//     status: 200,
//     body: "Hello World !"
//   };
// }

// -----------------------------------------------------------------
// https://www.sergevandenoever.nl/Processing-multipart-form-data-in-nodejs-azure-function-with-httptrigger/
// -----------------------------------------------------------------
const bosboy = require("busboy");
const MemoryStream = require("memorystream");
const fs = require("fs");
const path = require("path");

module.exports = async function (context, req) {
  const bb = bosboy({ headers: req.headers });
  const stream = new MemoryStream(req.body);

  bb.on("file", (name, buffer, info) => {
    console.log(`file: ${name}`);
    buffer.pipe(fs.createWriteStream(path.join("C:\\work", info.filename)));
  });
  bb.on("field", (name, value, info) => {
    console.log(`name: ${name}  --> value: ${value}`);
  });
  bb.on("close", () => {
    context.res = {
      status: 200,
      body: "OK"
    };
  });

  stream.pipe(bb);
};


// -----------------------------------------------------------------
// https://qiita.com/amay077/items/9aa0893e2e1a53234c3f
// -----------------------------------------------------------------
// const multer = require("multer");
// const streams = require("memory-streams");
// const upload = multer({ storage: multer.memoryStorage() })

// module.exports = function (context, req) {
//   context.log('JavaScript HTTP trigger function processed a request.');
//   const stream = new streams.ReadableStream(req.body);
//   for (const key in req) {
//     if (req.hasOwnProperty(key)) {
//       stream[key] = req[key];
//     }
//   }
//   context.stream = stream;

//   upload.any()(stream, null, (err) => {
//     const f = context.stream.files[0]
//     const p = path.join(__dirname, `./${f.originalname}`);
//     fs.writeFileSync(p, f.buffer);
//     context.res = { body: `Upload ${f.originalname} done.` };
//     context.done();
//   });
// };