# 出席管理アプリケーション (Class Attendance)

出席管理を効率的に行うためのWebアプリケーションです。クリックで簡単に出席状況を記録でき、クラス管理や名簿のインポート機能を備えています。

## 特徴

- 🎯 **直感的なUI**: クリックで出席状況を記録
- 📊 **出席管理**: 出席・欠席・遅刻・早退の4つのステータスを管理
- 📁 **クラス管理**: 複数のクラスを作成・切り替え可能
- 📥 **名簿インポート**: Excelファイルから名簿を一括インポート
- 🎨 **黒板風デザイン**: 親しみやすい黒板をモチーフにしたUI
- 📱 **レスポンシブ対応**: PC・タブレット・スマートフォンに対応

## 技術スタック

### フロントエンド
- **React 19** - UIライブラリ
- **TypeScript** - 型安全性
- **Vite** - ビルドツール
- **Wouter** - ルーティング
- **Radix UI** - UIコンポーネント
- **Tailwind CSS** - スタイリング
- **date-fns** - 日付処理
- **xlsx** - Excelファイル処理

### バックエンド
- **Express** - Webサーバー
- **Node.js** - ランタイム

### 開発ツール
- **pnpm** - パッケージマネージャー
- **Prettier** - コードフォーマッター
- **TypeScript** - 型チェック

## セットアップ

### 前提条件

- Node.js (v18以上推奨)
- pnpm (v10.4.1以上)

### pnpmのインストール

pnpmがインストールされていない場合、以下のいずれかの方法でインストールできます。

#### 方法1: Voltaを使用している場合

```bash
# Voltaでpnpmをインストール
volta install pnpm@10.4.1
```

#### 方法2: npmを使用してインストール

```bash
# npmでpnpmをグローバルにインストール
npm install -g pnpm@10.4.1
```

#### 方法3: Homebrewを使用（macOS）

```bash
# Homebrewでpnpmをインストール
brew install pnpm
```

#### 方法4: Corepackを使用（Node.js 16.10以降）

```bash
# Corepackを有効化
corepack enable

# pnpmを有効化
corepack prepare pnpm@10.4.1 --activate
```

### 依存関係のインストール

```bash
# 依存関係のインストール
pnpm install
```

### 開発サーバーの起動

```bash
# 開発モードで起動（フロントエンドのみ）
pnpm dev
```

開発サーバーは `http://localhost:3000` で起動します。

### ビルド

```bash
# 本番用ビルド
pnpm build
```

### 本番サーバーの起動

```bash
# ビルド後、本番サーバーを起動
pnpm start
```

## プロジェクト構造

```
classAttendance/
├── client/                 # フロントエンドアプリケーション
│   ├── src/
│   │   ├── components/     # Reactコンポーネント
│   │   │   ├── ui/        # UIコンポーネント（Radix UI）
│   │   │   ├── AttendanceBoard.tsx
│   │   │   ├── ClassManagerModal.tsx
│   │   │   ├── RosterImportModal.tsx
│   │   │   └── ...
│   │   ├── contexts/      # React Context
│   │   ├── hooks/         # カスタムフック
│   │   ├── pages/         # ページコンポーネント
│   │   ├── types/         # TypeScript型定義
│   │   └── lib/           # ユーティリティ関数
│   └── index.html
├── server/                 # バックエンドサーバー
│   └── index.ts
├── shared/                 # 共有コード
├── dist/                   # ビルド出力
└── package.json
```

## 使用方法

### クラスの作成

1. サイドバーの「クラス管理」ボタンをクリック
2. 「新規クラス作成」を選択
3. クラス名を入力して作成

### 名簿のインポート

1. サイドバーの「名簿インポート」ボタンをクリック
2. Excelファイル（.xlsx）をドラッグ&ドロップまたは選択
3. ファイルが読み込まれると、学生リストが自動的に追加されます

### 出席状況の記録

1. 出席ボードに表示されている学生カードをクリック
2. クリックするたびに出席状況が順番に切り替わります（出席 → 欠席 → 遅刻 → 早退 → 出席...）
3. 自動的に出席状況が記録されます

### 日付の変更

サイドバーから日付を選択して、異なる日付の出席状況を確認・編集できます。

## 開発コマンド

```bash
# 開発サーバー起動
pnpm dev

# 型チェック
pnpm check

# コードフォーマット
pnpm format

# ビルド
pnpm build

# プレビュー（ビルド後の確認）
pnpm preview

# 本番サーバー起動
pnpm start
```

## 環境変数

現在、環境変数の設定は不要です。必要に応じて `.env` ファイルを作成して設定できます。

## ブラウザサポート

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## ライセンス

MIT

## 貢献

プルリクエストやイシューの報告を歓迎します。

## 作者

yamalogsite
