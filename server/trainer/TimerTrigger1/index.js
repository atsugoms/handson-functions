const PROJECT_ID = process.env.CV_PROJECT_ID;
const TRAINING_KEY = process.env.CV_TRAINING_KEY;
const TRAINING_ENDPOINT = process.env.CV_TRAINING_ENDPOINT;

const TrainingApi = require("@azure/cognitiveservices-customvision-training");
const msRest = require("@azure/ms-rest-js");

const trainer_credentials = new msRest.ApiKeyCredentials({ inHeader: { "Training-key": TRAINING_KEY } });
const trainer = new TrainingApi.TrainingAPIClient(trainer_credentials, TRAINING_ENDPOINT);

module.exports = async function (context, myTimer) {
  var iterations, iteration;

  // 最新のイテレーションの状態を確認
  iterations = await trainer.getIterations(PROJECT_ID) || [];
  for (let item of iterations) {
    if (item.status === "Training") {
      context.log("There exists training iteration. Stop starting a new iteration.");
      return;
    }
  }

  // トレーニング中が1件もなければ新規トレーニングを開始
  try {
    iteration = await trainer.trainProject(PROJECT_ID);
    context.log(`Start a new iteration "${iteration.name}".`);
  } catch (err) {
    context.log(err.message);
  }
};