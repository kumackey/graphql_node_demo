const {ApolloServer} = require('apollo-server');
const {PrismaClient} = require('@prisma/client')
const fs = require('fs');
const path = require('path');

const resolvers = {
    Query: {
        feed: async (parent, args, context) => {
            const where = args.filter
                ? {
                    OR: [
                        {description: {contains: args.filter}},
                        {url: {contains: args.filter}},
                    ],
                }
                : {}

            return await context.prisma.link.findMany({
                where,
            })
        },
    },
    Mutation: {
        post: async (parent, args, context, info) => {
            return await context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description,
                },
            })
        },
        update: async (parent, args, context, info) => {
            const id = parseInt(args.id)
            await context.prisma.link.update({
                where: {
                    id,
                },
                data: {
                    url: args.url,
                    modifiedAt: args.modifiedAt
                },
            })
            return await context.prisma.link.findUnique({
                where: {
                    id
                },
            })
        },
        delete: async (parent, args, context, info) => {
            const link = await context.prisma.link.findUnique({
                where: {
                    id: parseInt(args.id),
                },
            })
            await context.prisma.link.delete({
                where: {
                    id: parseInt(args.id),
                },
            })
            return link
        },
        add_comment: async (parent, args, context, info) => {
            console.log(args)
            const comment = await context.prisma.comment.create({
                data: {
                    content: args.content,
                    link: {
                        connect: {
                            id: parseInt(args.linkID),
                        },
                    },
                },
                include: {
                    link: true,
                },
            })
            return comment
        },
    },
    Link: {
        id: (parent) => parent.id,
        description: (parent) => parent.description,
        url: (parent) => parent.url,
        createdAt: (parent) => parent.createdAt.toTimeString(),
        modifiedAt: (parent) => parent.modifiedAt.toTimeString(),
        comments: async (parent) => {
            const link = await prisma.link.findUnique({
                where: {
                    id: parseInt(parent.id),
                },
                include: {
                    comments: true,
                }
            })
            return link.comments
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