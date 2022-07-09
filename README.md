# 開発

GraphQLサーバ立ち上げ

```text
node src/index.js   
```

migration

```text
npx prisma migrate dev
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