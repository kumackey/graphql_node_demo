const {ApolloServer} = require('apollo-server');
const {PrismaClient} = require('@prisma/client')
const fs = require('fs');
const path = require('path');

const resolvers = {
    Query: {
        users: async (parent, args, context) => {
            const where = args.filter
                ? {
                    OR: [
                        {description: {contains: args.filter}},
                        {username: {contains: args.filter}},
                    ],
                }
                : {}

            return await context.prisma.user.findMany({
                where,
            })
        },
    },
    Mutation: {
        addUser: async (parent, args, context, info) => {
            return await context.prisma.user.create({
                data: {
                    username: args.username,
                    description: args.description,
                },
            })
        },
        changeName: async (parent, args, context, info) => {
            const id = parseInt(args.id)
            await context.prisma.user.update({
                where: {
                    id,
                },
                data: {
                    username: args.username,
                    modifiedAt: new Date(Date.now()),
                },
            })
            return await context.prisma.user.findUnique({
                where: {
                    id
                },
            })
        },
        deleteUser: async (parent, args, context, info) => {
            const user = await context.prisma.user.findUnique({
                where: {
                    id: parseInt(args.id),
                },
            })
            await context.prisma.user.delete({
                where: {
                    id: parseInt(args.id),
                },
            })
            return user
        },
        comment: async (parent, args, context, info) => {
            return await context.prisma.comment.create({
                data: {
                    content: args.content,
                    user: {
                        connect: {
                            id: parseInt(args.userId),
                        },
                    },
                },
                include: {
                    user: true,
                },
            })
        },
    },
    User: {
        id: (parent) => parent.id,
        description: (parent) => parent.description,
        username: (parent) => parent.username,
        createdAt: (parent) => parent.createdAt.toTimeString(),
        modifiedAt: (parent) => parent.modifiedAt.toTimeString(),
        comments: async (parent) => {
            const user = await prisma.user.findUnique({
                where: {
                    id: parseInt(parent.id),
                },
                include: {
                    comments: true,
                }
            })
            return user.comments
        },
    },
    Comment: {
        id: (parent) => parent.id,
        content: (parent) => parent.content,
        createdAt: (parent) => parent.createdAt.toTimeString(),
        modifiedAt: (parent) => parent.modifiedAt.toTimeString(),
    }
}

const prisma = new PrismaClient()

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context: {
        prisma,
    }
})

server
    .listen()
    .then(({url}) =>
        console.log(`Server is running on ${url}`)
    );