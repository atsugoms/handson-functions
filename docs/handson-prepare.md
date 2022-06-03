# 事前準備

## 目次

1. リソースグループの作成
1. WebClient のリリース
1. Cognitive Service の作成

---

## 作業手順

#### 環境準備

1. 以下をインストール
    * [Visual Studio Code](https://code.visualstudio.com/download)
      * Azure Functions プラグイン
      * Azurite プラグイン
    * [Azure Storage Explorer](https://azure.microsoft.com/ja-jp/features/storage-explorer/)


### リソースグループ作成

1. Azure ポータルを開いてリソースグループ作成

### WebClient 用の App Service 準備

1. Azure ポータルを開く
1. App Service のリソースを作成
    1. 基本
        |項目|設定内容|
        |---|---|
        |リソースグループ|（最初に作成したもの）|
        |公開|コード|
        |ランタイム| `Node 14 LTS` |
        |OS| `Linux` |
        |地域(リージョン)|（リソースグループに合わせる）|
        |App Service プラン|（任意）|

    1. デプロイ、ネットワーク、監視、タグ

        （特に設定なし。デフォルトのママ）

    1. 確認および作成

        内容を確認して `確認および作成` を選択


### Custom Vision 用のリソース準備

1. Azure ポータルを開く
1. `Cognitive Services` へ移動
1. [Vision]-[Cusom Vision] へ移動
1. 「作成」を選択
    1. 基本
        |項目|設定内容|
        |---|---|
        |作成オプション|両方（名前をキレイに設定したい場合、「予測」と「トレーニング」を個別に作成する）|
        |リソースグループ|（最初に作成したもの）|
        |地域(リージョン)|（リソースグループに合わせる）|
        |名前|（任意）|

    1. ネットワーク、タグ

        （特に設定なし。デフォルトのママ）

    1. 確認および作成

        内容を確認して `確認および作成` を選択


