const { BlobServiceClient } = require("@azure/storage-blob");
const readFormData = require("../lib/readFormData");
const fs = require("fs");
const path = require("path");
const STORAGE_CONNECTION_STRING = process.env.QUEUE_STORAGE_ACCOUNT;
const STORAGE_CONTAINER_NAME = "images";

/**
 * 
 * クイックリファレンス
 * https://docs.microsoft.com/ja-jp/azure/storage/blobs/storage-quickstart-blobs-nodejs?tabs=environment-variable-linux
 * 
 * APIリファレンス
 * https://docs.microsoft.com/ja-jp/javascript/api/@azure/storage-blob/?view=azure-node-latest
 * 
 * @param {*} context 
 * @param {*} req 
 * @returns 
 */
module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');
  var form, blobName, res, filepath;

  try {
    // フォームデータの読み取り
    form = await readFormData(context, req);

    // Blobへ接続
    const blobServiceClient = BlobServiceClient.fromConnectionString(STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(STORAGE_CONTAINER_NAME);
    if (await containerClient.exists() === false) {
      await containerClient.create();
    }

    // アップロード
    blobName = form.guid;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(form["file1"].buffer);

    // 一覧表示
    for await (let blob of containerClient.listBlobsFlat()) {
      console.log(`\t ${blob.name}`);
    }

    // ダウンロード
    filepath = path.join(__dirname, "./sample.jpg")
    res = await blockBlobClient.download();
    res.readableStreamBody.pipe(fs.createWriteStream(filepath));

    return {
      status: 200,
      body: "Hello World!"
    };
  } catch (err) {
    return {
      status: 500,
      body: err.message
    };
  }
}