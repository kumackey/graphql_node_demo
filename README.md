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
mutation {
  post(url: "www.prisma.io", description: "Prisma replaces traditional ORMs") {
    id
  }
}

mutation {
  delete(id: 2) {
    id
  }
}

query {
  feed{
    id
    url
    description
  }
}
```