const { BlobServiceClient } = require("@azure/storage-blob");
const readFormData = require("../lib/readFormData");
const STORAGE_CONNECTION_STRING = process.env.QUEUE_STORAGE_ACCOUNT;
const STORAGE_CONTAINER_NAME = "images";

/**
 * Blobへ登録
 * @param {*} context 
 * @param {*} form 
 */
var registBlob = async function (context, form) {
  var blobServiceClient, containerClient, blockBlobClient;
  var blobName = form.guid;

  // Blobへ接続
  blobServiceClient = BlobServiceClient.fromConnectionString(STORAGE_CONNECTION_STRING);
  containerClient = blobServiceClient.getContainerClient(STORAGE_CONTAINER_NAME);
  if (await containerClient.exists() === false) {
    await containerClient.create();
  }

  // アップロード
  blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.uploadData(form["file1"].buffer);

  console.log("upload to " + blockBlobClient.url);
  return blockBlobClient.url;
};

/**
 * Queue へ登録
 * @param {*} context 
 * @param {*} form 
 */
var registQueue = async function (context, form) {
  context.bindings.outWaitingQueue = {
    guid: form.guid,
    tag: form.tag1
  };
};

module.exports = async function (context, req) {
  var form, blobServiceClient, containerClient, blockBlobClient;

  try {
    // マルチパートフォームの分解
    form = await readFormData(context, req);

    // Blob へ登録
    await registBlob(context, form);

    // Queue へ登録
    await registQueue(context, form);

    return { status: 200, body: "OK" };
  } catch (err) {
    return { status: 500, body: err.message };
  }
};
