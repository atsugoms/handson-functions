const path = require("path");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const { format } = require("path");
const HOST = "http://localhost:7071";
// const HOST = "https://holfunctionsdevfacadefunc.azurewebsites.net";

console.log("Start process ...");

(async () => {
  var buf, data, res;

  // ファイル読み込み
  console.log("Read image file ...");
  buf = fs.createReadStream(path.join(__dirname, "./images/Hemlock/hemlock_1.jpg"));
  data = new FormData();
  data.append("file1", buf);

  // リクエスト
  console.log("Post http request ...");
  try {
    res = await axios({
      method: "POST",
      // url: `http://localhost:8080/api/images`,
      url: `${HOST}/api/trainings`,
      headers: {
        ...data.getHeaders()
      },
      data
    });
    var { status, statusText, data } = res;
    console.log({ status, statusText, data });
  } catch (err) {
    console.log(err);
  }

})();

