const fs = require("fs");
const path = require("path");
const PROJECT_ID = process.env.CV_PROJECT_ID;
const TRAINING_KEY = process.env.CV_TRAINING_KEY;
const TRAINING_ENDPOINT = process.env.CV_TRAINING_ENDPOINT;

const TrainingApi = require("@azure/cognitiveservices-customvision-training");
const msRest = require("@azure/ms-rest-js");

const trainer_credentials = new msRest.ApiKeyCredentials({ inHeader: { "Training-key": TRAINING_KEY } });
const trainer = new TrainingApi.TrainingAPIClient(trainer_credentials, TRAINING_ENDPOINT);

var getOrCreateTagId = async function (tagName) {
  if (!tagName) {
    return null;
  }

  var tags, tag;

  // タグ一覧取得
  tags = await trainer.getTags(PROJECT_ID) || [];

  // タグの存在確認
  for (let item of tags) {
    if (item.name === tagName) {
      tag = item;
      break;
    }
  }

  // タグがなければ登録
  if (!tag) {
    tag = await trainer.createTag(PROJECT_ID, tagName);
    console.log(`Tag [${tagName}] not found and created."`)
  }

  // タグのID取得
  return tag.id;
};

var createTrainingImage = async function (binary, tagId) {
  var res;
  res = await trainer.createImagesFromData(
    PROJECT_ID,
    binary,
    { tagIds: (tagId ? [tagId] : []) }
  );
  return res.isBatchSuccessful;
};

module.exports = async function (context, message) {
  context.log('JavaScript queue trigger function processed work item', message);
  var tagId, tagName = message.tag, isSuccess;

  // Blob からファイル取得
  var binary = context.bindings.inImageBlob;
  // await fs.promises.writeFile(path.join(__dirname, "./sample.jpg"), binary);

  // Custom Vision のタグを確認
  tagId = await getOrCreateTagId(tagName);

  // Custom Vision へ教師画像を登録
  isSuccess = await createTrainingImage(binary, tagId);
  console.log(isSuccess ? `Training image tagged "${tagName}" is registered.` : `Can't registered "${message.guid}"`);
};
