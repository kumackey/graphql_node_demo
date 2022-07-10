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
  delete(id: 2) {
    id
  }
}

query {
  users{
    id
    url
    description
  }
}
```