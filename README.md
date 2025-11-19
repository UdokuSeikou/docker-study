# Docker Study Project

Vite + React + Node.js/Express + PostgreSQL + Nginx を使用した学習用フルスタック Web アプリケーション。

## 技術スタック

- **フロントエンド**: Vite + React
- **バックエンド**: Node.js + Express
- **データベース**: PostgreSQL
- **リバースプロキシ**: Nginx
- **コンテナ化**: Docker + Docker Compose

## プロジェクト構成

```
docker_study/
├── frontend/              # Vite + React フロントエンド
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── ...
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── dockerfile
├── backend/               # Node.js + Express バックエンド
│   ├── src/
│   │   └── index.js
│   ├── package.json
│   ├── nodemon.json
│   └── dockerfile
├── db/                    # PostgreSQL データベース
├── nginx/                 # Nginx リバースプロキシ設定
│   └── nginx.conf
├── docker-compose.yaml    # Docker Compose 設定
├── .gitignore             # Git 除外ファイル
├── .env.example           # 環境変数テンプレート
└── README.md              # このファイル
```

## セットアップ

### 前提条件

- Docker Desktop がインストールされていること
- Docker Compose がインストールされていること

### 1. リポジトリをクローン

```bash
git clone <repository-url>
cd docker_study
```

### 2. 環境変数を設定

`.env.example` をコピーして `.env` を作成：

```bash
cp .env.example .env
```

必要に応じて `.env` ファイルを編集してください。

### 3. コンテナをビルド・起動

```bash
docker compose up --build
```

初回起動には数分かかります。

### 4. アプリケーションにアクセス

- **Nginx（推奨）**: http://localhost
- **フロントエンド直接**: http://localhost:5173
- **バックエンド API**: http://localhost:3000/api/hello
- **データベース**: localhost:5432 (PostgreSQL)

## 開発

### ローカル環境での開発

#### フロントエンド

```bash
cd frontend
npm install
npm run dev
```

Vite 開発サーバーが http://localhost:5173 で起動します。

#### バックエンド

別のターミナルで：

```bash
cd backend
npm install
npm run dev
```

nodemon がファイル変更を監視し、自動再起動します。

### Docker 環境での開発

```bash
docker compose up --build
```

すべてのサービスが起動します。ホットリロード機能により、ファイル変更は自動で反映されます。

#### ログを確認

```bash
# 特定サービスのログをフォロー
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

#### コンテナの停止

```bash
docker compose down
```

ボリュームも削除する場合：

```bash
docker compose down -v
```

## API エンドポイント

### GET /api/hello

サーバーの現在時刻をデータベースから取得します。

**レスポンス例：**

```json
{
  "message": "Hello from backend!",
  "time": "2025-11-19T14:16:57.599Z"
}
```

## ホットリロード設定

### バックエンド（nodemon）

`backend/nodemon.json` で監視設定を制御：

```json
{
  "watch": ["src"],
  "ext": "js,json",
  "polling": true,
  "pollInterval": 1000
}
```

- Windows + Docker Desktop 環境でのファイル変更検出を可能にするため、ポーリングモードを使用しています。

### フロントエンド（Vite）

`frontend/vite.config.js` でホットモジュールリロード（HMR）が有効になっています。

## トラブルシューティング

### API が接続できない（ENOTFOUND backend）

**原因**: ローカル開発環境で Vite proxy が Docker 内の `backend` ホスト名に接続しようとしている。

**解決**:
- Docker で実行: `docker compose up` を使用
- ローカル実行: `frontend/vite.config.js` の proxy を `http://localhost:3000` に変更

### ホットリロードが反応しない

Windows + Docker Desktop の場合、以下を確認：

1. `backend/nodemon.json` に `polling: true` が設定されているか
2. `docker compose down -v` でボリュームをリセットしてから `docker compose up --build` を実行

### データベース接続エラー

- PostgreSQL が起動しているか確認: `docker compose ps`
- ログで詳細を確認: `docker compose logs db`
- 接続文字列が `.env` で正しく設定されているか確認

## 環境変数

主な設定値は `.env` ファイルで管理します。`.env.example` をテンプレートとして使用してください。

| 変数 | デフォルト値 | 説明 |
|------|----------|------|
| `DATABASE_URL` | `postgres://postgres:password@db:5432/postgres` | PostgreSQL 接続文字列 |
| `PORT` | `3000` | バックエンド ポート |
| `VITE_API_URL` | `http://localhost/api` | フロントエンドから見た API URL |
| `API_TARGET` | `http://backend:3000` | Vite proxy の対象（Docker）|

## Git 設定

### コミット前に確認すること

1. `.env` ファイルが `.gitignore` に含まれていることを確認
2. `node_modules/` がコミットに含まれていないことを確認

```bash
# ステージングされるファイルを確認
git diff --cached --name-only
```

### 推奨される .gitignore パターン

`.gitignore` ファイルが既に設定されています。確認：

```bash
cat .gitignore
```

## ライセンス

このプロジェクトは **MIT ライセンス** の下で公開されています。詳細は [LICENSE](LICENSE) ファイルを参照してください。

**MIT ライセンスについて：**
- ✅ 自由に使用、修正、配布できます
- ✅ 商用利用も可能です
- ⚠️ ただし、著作権表示とライセンス表示は必須です
