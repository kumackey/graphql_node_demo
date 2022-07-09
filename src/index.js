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

            const links = await context.prisma.link.findMany({
                where,
            })

            return links
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
    },
    // 3
    Link: {
        id: (parent) => parent.id,
        description: (parent) => parent.description,
        url: (parent) => parent.url,
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