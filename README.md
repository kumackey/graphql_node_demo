# GraphQLとは

[Learn GraphQL Fundamentals with Fullstack Tutorial](https://www.howtographql.com/basics/0-introduction/)
[GraphQLの基礎 チュートリアル](https://goodeatcompany.notion.site/GraphQL-dc01d9e8ccb64b0b9a66cfd3091deee3)

APIのクエリ言語。発想としては「APIをSQLっぽく書ければ便利じゃね？」
用途はBackend for Frontend。

良いところ
・スキーマ(Schema Definition Language, SDL)による組織間コミュニケーション
・フロントエンド側で使うフィールドを限定できる。オーバーフェッチが少ない
・スキーマ駆動開発
・単一エンドポイント(複数リクエストを送る必要がなくなったりする)

# 環境構築(未検証)

```text
npm install

npx prisma migrate dev
prisma generate
```

# 参考になったチュートリアル

https://www.howtographql.com/graphql-js/1-getting-started/

# 開発

GraphQLサーバ立ち上げ

```text
node src/index.js   
```

migration

```text
npx prisma migrate dev
prisma generate
```

SQliteのクライアント

```text
npx prisma studio
```

# サンプルクエリ

```text
query {
  users{
    id
    username
    description
    comments {
      id
      content
      createdAt
    }
  }
}

mutation {
  addUser(username: "kumaki", description: "エンジニアです") {
    id,
    description,
    createdAt,
    modifiedAt
  }
}

mutation {
  addUser(username: "詳細不明さん") {
    id,
    description,
    createdAt,
    modifiedAt
  }
}

mutation {
  changeName(id:2, username: "updated username") {
    id
    username
    createdAt
    modifiedAt
  }
}

mutation {
  deleteUser(id: 1) {
    id,
    username
  }
}

mutation {
  comment(userId: 2, content:"こんにちは") {
    id,
    content,
    createdAt,
  }
}
```

curl
```text
curl -X POST -H 'content-type: application/json' -d '{"query":"{users { id, username }}"}' http://localhost:4000/
```