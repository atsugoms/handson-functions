# Azure FUnctions Hands-On

## 概要

### 目的

ハンズオンを通してAzure Functions の基本的な実装、デプロイ、ネットワーク構成およびその実現方法を学びます。

### 対象

以下のような方を対象として想定しています。

* クラウド管理者​
* クラウドアーキテクト​
* ネットワークエンジニア​
* セキュリティ管理者​
* セキュリティアーキテクト

### 前提条件

* ネットワーク知識
* Node.js を使った開発基礎知識

### 目次

1. [Exercise1：ネットワーク作成](#exercise1ネットワーク作成)

* [事前準備](./handson-prepare.md)

---

## ハンズオン

### 事前準備

[事前準備](handson-prepare.md) が終わっているか確認。
終わっていない場合、事前準備を先に実施する。

### Httpトリガー作成（ローカル）

#### 環境準備

1. 以下をインストール
    * [Visual Studio Code](https://code.visualstudio.com/download)
      * Azure Functions プラグイン
      * Azurite プラグイン
    * [Azure Storage Explorer](https://azure.microsoft.com/ja-jp/features/storage-explorer/)

#### ローカルでHttpトリガー関数を作成

プロジェクトのひな形作成

1. 任意のフォルダを作成（プロジェクト用フォルダ作成）
1. 作成したフォルダを Visual Studio Code で開く
1. アクティビティバーにある「Azure」を開く
1. 「WORKSPACE」にある「＋」を開き「Create Function...」を選択
    1. `Select a language` は `JavaScript` を選択
    1. `Select a template for your project's first function` は `HTTP trigger` を選択
    1. `Provide a function name` は任意（デフォルトの `HttpTrigger1` でもOK）
    1. `承認レベル` は `Anonymous` を選択

Azurite の起動

1. アクティビティバーにある「Azure」を開く
1. 「WORKSPACE」にある「Attached Storage Accounts」を展開
1. 「Local Emulator」→「Blob Containers」および「Queues」をそれぞれ展開
1. `Start Blob Emulator` および `Start Queue Emulator` を選択

ストレージへの接続文字列を追加

1. `local.settings.json` を開く
1. `Values` に接続文字列用のキー `` を追加
    |キー|値|
    |--|--|
    | `SHARED_STORAGE_ACCOUNT` | `UseDevelopmentStorage=true` |

バインド設定の追加

1. 作成した関数フォルダにある `function.json` を右クリック
1. `Add binding...` を選択
  1. `Select binding direction` は `out` を選択
  1. `Select binding with direction "out"` は `Azure Queue Storage` を選択
  1. `バインド名` は任意（後の実装ではデフォルトの `outputQueueItem` を利用）
  1. `送信先キュー名` も任意
  1. `Select setting from "local.settings.json"` は `SHARED_STORAGE_ACCOUNT` を選択

Httpトリガーの実装

1. `index.js` を開く
1. 以下のように実装を修正
    ```jabascript
    module.exports = async function (context, req) {
        context.log('JavaScript HTTP trigger function processed a request.');

        const name = (req.query.name || (req.body && req.body.name));
        const responseMessage = name
            ? "Hello, " + name + ". This HTTP triggered function executed successfully."
            : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

        // 追記 -- START
        context.bindings.outputQueueItem = responseMessage;
        // 追記 -- END

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: responseMessage
        };
    }
    ```

Httpトリガーの実行/テスト

1. `F5` でデバッグ実行を開始
1. 表示されたリクエスト先へアクセス

    デフォルトだと以下のようなメッセージが出ているはず。
    表示に従って `http://localhost:7071/api/HttpTrigger1` をブラウザで開く

    ```
    Functions:

            HttpTrigger1: [GET,POST] http://localhost:7071/api/HttpTrigger1
    ```

1. 動作確認
    1. ブラウザにメッセージが表示されればリクエストはOK
    1. Azure Storage Explorer を開く
        1. 「ローカルで接続済み」-「(エミュレーター-既定のポート)」-「Queues」-「outqueue（設定した名称）」を開く
        1. ブラウザに出ているメッセージと同じメッセージが登録されていればOK


