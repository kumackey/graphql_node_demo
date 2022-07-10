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

カンペ
```text
  findUser(id: ID!): User!
  findUser: async (parent, args, context) => {
            return await context.prisma.user.findUnique({
                where: {
                    id: parseInt(args.id),
                }
            })
        },
        
   kyouheikumaki@kyouheis-MacBook-Pro graphql-demo % curl -X POST -H 'content-type: application/json' -d '{"query":"{users { id, username }}"}' http://localhost:4000/
{"data":{"users":[{"id":"2","username":"updated username"},{"id":"3","username":"kumaki"},{"id":"4","username":"kumaki"},{"id":"5","username":"詳細不明さん"},{"id":"6","username":"詳細不明さん"}]}}
```