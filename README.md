# LINE連携ハンバーガーショップ注文システム

> Next.js 15 + Supabase + Prisma で構築した、LINE LIFF対応のリアルタイム注文管理システム

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## 🎯 デモ

- **🏪 店舗管理画面**: https://line-order-system.vercel.app/login
- **📱 顧客メニュー**: https://line-order-system.vercel.app/menu _(LINE認証が必要です)_

---

## 📋 プロジェクト概要

飲食店向けのLINE連携注文システムです。顧客はLINEアプリから商品を注文でき、店舗スタッフはリアルタイムで注文を管理できます。

モダンなフルスタック技術を使用し、**型安全性**、**リアルタイム性**、**保守性**を重視して開発しました。

### 開発情報

- **開発期間**: 2025年7月〜11月（約4ヶ月）
- **開発体制**: 個人開発
- **コード行数**: 約5,000行（TypeScript）

### 技術的な成果

- ✅ **型安全性**: TypeScript採用率100%、厳格な型チェック
- ✅ **コード品質**: ESLint・Prettier + Huskyによるコミット時自動チェック
- ✅ **CI/CD**: GitHub Actions による自動テスト・ビルド検証
- ✅ **設計**: カスタムフックによるロジック分離、再利用性の高いコンポーネント設計

### 主な機能

#### 👥 顧客側（LINE LIFF）

- ✅ **LINE認証** - LINE LIFFによる自動ログイン
- ✅ **商品閲覧** - カテゴリ別フィルタリング機能
- ✅ **カート機能** - 数量調整・削除・合計金額表示
- ✅ **注文確定** - トランザクション処理による確実な注文
- 🔄 **注文履歴** - 実装予定

#### 🏪 店舗管理側

- ✅ **認証システム** - Supabase Authによる安全なログイン
- ✅ **注文管理** - ステータス変更（pending→confirmed→preparing→ready→completed）
- ✅ **リアルタイム更新** - 注文状況の即時反映
- ✅ **支払い管理** - 支払いステータスの更新
- ✅ **商品管理** - 商品のCRUD操作（作成・編集・削除）
- ✅ **顧客管理** - LINE利用者の管理
- 🔄 **ダッシュボード** - UIレイアウト実装済み（データ集計機能は実装予定）

---

## 🛠 技術スタック

| カテゴリ           | 技術                         | 採用理由                                        |
| ------------------ | ---------------------------- | ----------------------------------------------- |
| **フロントエンド** | Next.js 15 (App Router)      | React Server Components・SSR対応、SEO最適化     |
| **バックエンド**   | Next.js API Routes           | フルスタック構成、エンドポイント管理の簡素化    |
| **データベース**   | Supabase PostgreSQL          | リアルタイム機能、認証との統合                  |
| **ORM**            | Prisma                       | 型安全なDB操作、マイグレーション管理            |
| **認証**           | Supabase Auth / LINE LIFF    | 管理者・顧客で異なる認証フロー                  |
| **状態管理**       | Zustand                      | 軽量・シンプルな設計、Reduxより学習コストが低い |
| **スタイリング**   | Tailwind CSS                 | ユーティリティファーストによる高速開発          |
| **テスト**         | Jest + React Testing Library | テスト環境構築済み                              |
| **CI/CD**          | GitHub Actions + Vercel      | 自動テスト・ビルド検証・デプロイ                |
| **コード品質**     | ESLint + Prettier + Husky    | コード品質の自動チェック                        |

---

## 💡 技術的なこだわり

### 1. カスタムフック設計

ロジックとUIを完全に分離し、テスタビリティとメンテナンス性を向上させました。

```typescript
// ロジックをカスタムフックに集約
const { isAuthenticated, customer, logout } = useLiffAuth();
const { products, selectedCategory, setSelectedCategory } = useProducts();
const { addingToCart, handleAddToCart } = useCart();
```

**実装例:**

- `useLiffAuth` - LINE LIFF認証管理
- `useCart` - カート操作・状態管理
- `useOrders` - 注文一覧取得・リアルタイム更新
- `useOrderActions` - 注文ステータス更新

### 2. リアルタイム更新

Supabase Realtimeを活用し、注文ステータスの即時反映を実現しました。

```typescript
// 注文テーブルの変更を監視
supabase
  .channel('orders')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'orders' },
    () => refetch()
  )
  .subscribe();
```

### 3. トランザクション処理

注文確定時、以下の処理を1トランザクションで実行し、データ整合性を保証しました。

1. カート内容のバリデーション
2. 注文レコード作成（`orders`テーブル）
3. 注文明細作成（`order_items`テーブル・スナップショット方式）
4. カート削除（`cart_items`テーブル）

### 4. エラーハンドリング

Zodによる入力バリデーションと、ユーザーフレンドリーな通知を実装しました。

- **Toast通知** - 一時的な成功/エラーメッセージ
- **Modal** - 重要な確認・エラー表示
- **型安全なバリデーション** - Zodスキーマによる実行時チェック

### 5. パフォーマンス最適化

- Next.js Image最適化（自動WebP変換、遅延読み込み）
- データベースインデックス設計（`customer_id`, `status`, `created_at`等）
- カスタムフックでのメモ化（`useCallback`、`useMemo`）によるレンダリング最適化

### 6. セキュリティ対策

- Row Level Security (RLS) ポリシーによるアクセス制御
- SQL Injectionを防ぐPrisma使用
- 環境変数による機密情報管理
- CORS設定

---

## 📊 データベース設計

```
customers (LINE利用者)
  ├── id: UUID
  ├── line_user_id: String (LINE固有ID)
  ├── display_name: String
  └── picture_url: String
      ↓ 1:N
cart_items (カート)
  ├── customer_id → customers
  ├── product_id → products
  └── quantity: Int
      ↓ 注文確定時にトランザクション処理
orders (注文)
  ├── order_number: String (ユニーク注文番号)
  ├── customer_id → customers
  ├── status: OrderStatus (pending/confirmed/preparing/ready/completed/cancelled)
  ├── payment_status: PaymentStatus (pending/paid)
  └── total_amount: Int
      ↓ 1:N
order_items (注文明細・スナップショット)
  ├── order_id → orders
  ├── product_id → products (参照のみ)
  ├── product_name: String (注文時の商品名)
  ├── product_price: Int (注文時の価格)
  └── quantity: Int
```

**設計のポイント:**

- `order_items`はスナップショット方式で商品情報を保存（商品削除・価格変更の影響を受けない）
- `cart_items`は`customer_id`と`product_id`のユニーク制約で重複防止
- 各テーブルに適切なインデックスを設定（検索パフォーマンス向上）

---

## 🚀 ローカル環境での起動

```bash
git clone https://github.com/Kenwork11/line-order-system.git
cd line-order-system
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

詳細なセットアップ手順（Docker、Supabase設定等）は [セットアップガイド](./docs/setup.md) を参照してください。

---

## 🔧 開発コマンド

```bash
npm run dev          # 開発サーバー起動
npm run build        # 本番ビルド
npm test             # テスト実行
npm run db:migrate   # データベースマイグレーション
```

その他のコマンドは `package.json` または [開発ガイド](./docs/development.md) を参照してください。

---

## 📁 プロジェクト構造

```
src/
├── app/
│   ├── (customer)/      # 顧客側ページ（LIFF）
│   ├── (store)/         # 店舗管理側ページ
│   └── api/             # API Routes
├── components/          # UIコンポーネント
├── hooks/               # カスタムフック
├── lib/                 # ユーティリティ・設定
├── store/               # Zustand状態管理
└── types/               # TypeScript型定義
```

詳細なディレクトリ構造は [プロジェクト構造ガイド](./docs/project-structure.md) を参照してください。

---

## 🔄 CI/CD パイプライン

GitHub Actionsで以下を自動実行しています：

**Pull Request時:**

1. 依存関係のインストール
2. Prismaクライアント生成
3. ESLintによるコードチェック
4. Jestによるテスト実行
5. Next.jsビルド検証

**mainブランチマージ時:**

- Vercel本番環境への自動デプロイ

ワークフローファイル: [.github/workflows/deploy-preview.yml](.github/workflows/deploy-preview.yml)

---

## 📝 開発の背景

### 課題

飲食店の注文プロセスには以下の課題がありました：

- 電話注文の取りこぼし・聞き間違い
- 手書きメモによる調理ミス
- 注文状況の可視化が困難
- 顧客の待ち時間が不透明

### 解決策

1. **LINE LIFFで利用障壁を低減** - アプリインストール不要、LINE経由で簡単注文
2. **リアルタイム更新で効率化** - 注文状況を即座に把握、調理フローの最適化
3. **Prisma + Supabaseで保守性向上** - 型安全な開発、スキーマ変更の容易さ
4. **トランザクション処理でデータ整合性保証** - カート削除・注文作成を確実に実行

### 実装の難所と解決策

#### 1. カート数量の整合性問題

**課題**: 注文確定時にカート数量が0になる商品が注文に含まれてしまう
**解決**: クライアント側でのバリデーション強化 + サーバー側での再検証を実装。`quantity > 0` の商品のみを注文対象とするフィルタリングロジックを追加。

#### 2. LIFF認証とSupabase認証の共存

**課題**: 顧客側（LINE LIFF）と管理者側（Supabase Auth）で異なる認証フローが必要
**解決**: カスタムフック（`useLiffAuth`、`useAuth`）で認証ロジックを抽象化。各認証方式に対応した統一的なインターフェースを提供。

#### 3. リアルタイム更新のパフォーマンス

**課題**: 注文が増えるとSupabase Realtimeのサブスクリプションが重くなる
**解決**: ステータスフィルタリングで必要な注文のみを購読。楽観的UI更新により体感速度を向上。

### 今後の拡張可能性

このシステムは以下の機能拡張が可能な設計になっています：

- プッシュ通知機能（LINE Messaging API連携）
- 売上分析ダッシュボード（データ可視化）
- 在庫管理機能（商品マスタ連携）
- QRコード注文（テーブルオーダー対応）
- 多言語対応（i18n対応）

---

## 🧪 テスト

Jest + React Testing Library によるテスト環境を構築済みです。

**現在の実装状況:**

- ✅ テスト環境・設定完了
- ✅ UIコンポーネント（Button）のテスト実装
- 🔄 カスタムフック・ページコンポーネントのテストは今後追加予定

---

## 🚢 デプロイ

本番環境は **Vercel** で自動デプロイしています。

- **自動デプロイ**: mainブランチへのプッシュで本番環境を自動更新
- **プレビュー環境**: Pull Requestごとにプレビュー環境を自動生成
- **データベース**: Supabase PostgreSQL（本番環境）
- **CI/CD**: GitHub Actionsによる自動テスト・ビルド検証

デプロイ方法や環境変数の設定など、詳細は [デプロイガイド](./docs/deployment.md) を参照してください。

---

## 🔗 関連リンク

- **デモアプリ**: [https://line-order-system.vercel.app/login](https://line-order-system.vercel.app/login)
- **GitHubリポジトリ**: [https://github.com/Kenwork11/line-order-system](https://github.com/Kenwork11/line-order-system)

開発者向けドキュメントは `docs/` フォルダを参照してください。

---

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

---

## 📚 このプロジェクトで学んだこと

- **Next.js 15 App Router**: Server ComponentsとClient Componentsの使い分け、データフェッチング戦略
- **Prisma**: マイグレーション管理、リレーション設計、トランザクション処理
- **Supabase Realtime**: WebSocket接続の管理、再接続処理、リアルタイム同期
- **LINE LIFF SDK**: OAuth認証フロー、プロフィール取得、LIFF環境の制約対応
- **トランザクション処理**: データ整合性の重要性、ロールバック処理、冪等性の実装
- **状態管理設計**: カスタムフックによるロジック分離、Zustandによる軽量な状態管理

---

## 👤 作成者

**Kenwork11**
**kudo-sho**

- GitHub: [@Kenwork11](https://github.com/Kenwork11)
- Portfolio:
  - 店舗管理画面: https://line-order-system.vercel.app/login
  - 顧客注文アプリ: https://line-order-system.vercel.app/menu
