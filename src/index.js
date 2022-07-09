const {ApolloServer} = require('apollo-server');
const {PrismaClient} = require('@prisma/client')
const fs = require('fs');
const path = require('path');

let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
}]

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
        post: (parent, args, context, info) => {
            const newLink = context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description,
                },
            })
            return newLink
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