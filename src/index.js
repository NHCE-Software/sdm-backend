import schema from './schema';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import { authentication } from './middleware/authentication';

async function startApolloServer() {
    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        schema,
        context: authentication,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();
    server.applyMiddleware({
        app,
        path: '/api/api/graphql',
        bodyParserConfig: {
            limit: '100mb',
        },
    });
    await new Promise((resolve) =>
        httpServer.listen({ port: process.env.PORT || 2024 }, resolve)
    );
    console.log(
        `🚀 Server ready at http://localhost:${process.env.PORT || 2024}${
            server.graphqlPath
        }`
    );
}
startApolloServer();
