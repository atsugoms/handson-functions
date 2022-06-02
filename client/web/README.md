# App Service へのデプロイ

前提

* Visual Studio Code を使ってデプロイ
* Visual Studio Code に [Azure App Service プラグイン](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) の追加が必要

作業手順

1. Azure上で App Service を作成（＝デプロイ先を作成）
1. Visual Studio Code で `F1` キー 押下（コマンドパレットを起動）
1. `Azure App Service: Deploy to Web App...` を検索、選択
    1. `Select the folder to deploy` は、現在のプロジェクト（ `/client/web/` ）を選択
    1. `Select a resource` は、作成済みの App Service を選択
    1. 「Are you sure you want to ... (上書きしてよいか)」に対して `Deploy` を選択
1. App Service を開いて必要な[環境変数](#設定が必要な環境変数)を追加、再起動


# 設定が必要な環境変数

|項目名|説明|
|---|---|
| `REQUEST_URL` | リクエスト先URL。デフォルト `/` 。 |
| `PORT` | アプリの受付ポート番号。デフォルト `3000` 。 |

