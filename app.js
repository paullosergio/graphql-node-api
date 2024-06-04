const { ApolloServer } = require('apollo-server');
const { MongoClient } = require('mongodb');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const uri = process.env.MONGO_URI || "mongodb://mongo:pass@mongo:27017/rbe?authSource=admin";

async function connectToMongoDB() {
  const client = new MongoClient(uri, {
    maxPoolSize: 30,
  });
  await client.connect();
  const db = client.db('rbe');
  console.log('Connected to MongoDB');
  return db;
}

async function startServer() {
  const db = await connectToMongoDB();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ db }),
    plugins: [{
      requestDidStart: () => ({
        willSendResponse({ response }) {
          if (response.errors && response.errors.length > 0) {
            const statusCode = response.errors[0].extensions.statusCode || 500;
            response.http.status = statusCode;
          }
        },
      }),
    }],
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
});

module.exports = startServer;
