const express = require('express')
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios');

async function startServer() {
    const app = express()
    const server = new ApolloServer({
        typeDefs: `
            type User {
                id: ID!
                name: String!
                username: String!
                email: String!
                phone: String!
                website: String!
            }

            type Todo {
                id: ID!
                title: String!
                completed: Boolean
                userId: ID!
                user: User
            }
                
            type Query {
                getTodos: [Todo]
                getAllUsers: [User]
                getUser(id: ID!): User
            }
        `,
        resolvers: {
            Query: {
                getTodos: async () => (await axios.get('https://jsonplaceholder.typicode.com/todos')).data,
                getAllUsers: async() => (await axios.get('https://jsonplaceholder.typicode.com/users')).data,
                getUser: async(_, { id }) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data
            },
            Todo: {
                user: async(parent) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${parent.userId}`)).data
            }
        }
    })

    app.use(bodyParser.json())
    app.use(cors())

    await server.start()

    app.use('/graphql', expressMiddleware(server))

    app.listen(8000, () => {
        console.log('Server started on PORT: 8000')
    })
}

startServer()

// query ExampleQuery($getUserId: ID!) {
//     getTodos {
//       title
//       completed
//       user {
//         email
//         name
//         phone
//       }
//     }
//     getAllUsers {
//       name
//       email
//     }
//     getUser(id: $getUserId) {
//       name
//       id
//       email
//     }
//   }
