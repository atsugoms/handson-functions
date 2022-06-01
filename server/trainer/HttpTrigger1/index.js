const fs = require("fs");
const path = require("path");

module.exports = async function (context, req) {
  var data;

  // ファイル読み込み
  try {
    data = await fs.promises.readFile(path.join(__dirname, "./test_image.jpg"));
  } catch (err) {
    console.log(err);
    return {
      status: 500,
      body: "ERROR"
    };
  }

  // Blobへ登録
  context.bindings.outputBlob = data;

  // Queueへ登録
  context.bindings.outputQueueItem = {
    id: req.body.id,
    tag: "SampleTag"
  };

  return {
    status: 200,
    body: "Hello World"
  };
}