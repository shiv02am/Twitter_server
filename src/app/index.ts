import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser, { BodyParser } from 'body-parser';
import { prismaClient } from '../clients/db';
import cors from "cors"



import { User } from './user';
import { GraphqlContext } from '../interfaces';
import JWTService from '../services/jwt';


export async function initServer(){

    const app = express();
    app.use(bodyParser.json());
    app.use(cors());



    const graphqlServer=new ApolloServer({
        typeDefs:`
          ${User.types}
        type Query {
          ${User.queries}

        }`,
        resolvers:{
            Query:{...User.resolvers.queries,},
        },
    });

    await graphqlServer.start();
    app.use("/graphql", expressMiddleware(graphqlServer,
     
));
    return app;
}
