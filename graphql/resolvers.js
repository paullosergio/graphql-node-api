const { ApolloError } = require('apollo-server');

module.exports = {
  Query: {
    getExtract: async (_, { id }, { db }) => {
      const userId = Number(id);

      const user = await db.collection('users').findOne(
        { id: userId },
        { projection: { balance: 1, limit: 1, last_transactions: 1 } }
      );

      if (!user) {
        throw new ApolloError("Client not found", "CLIENT_NOT_FOUND", { statusCode: 404 });
      }

      return {
        balance: {
          total: user.balance,
          extract_date: new Date().toISOString(),
          limit: user.limit,
        },
        last_transactions: user.last_transactions,
      };
    }
  },
  Mutation: {
    createTransaction: async (_, { id, type, value, description }, { db }) => {
      const userId = Number(id);

      const user = await db.collection('users').findOne(
        { id: userId },
        { projection: { balance: 1, limit: 1, last_transactions: 1 } }
      );

      if (!user) {
        throw new ApolloError("Client not found", "CLIENT_NOT_FOUND", { statusCode: 404 });
      }

      validateTransactionData(type, value, description, user);

      const transaction = {
        value: value,
        type: type,
        description: description,
        realized_in: new Date().toISOString(),
      };

      const updatePipeline = [
        {
          $set: {
            last_transactions: {
              $slice: [
                {
                  $concatArrays: [[transaction], "$last_transactions"],
                },
                10,
              ],
            },
          },
        },
      ];

      if (type === 'd') {
        updatePipeline.unshift({
          $set: {
            balance: {
              $cond: [
                {
                  $gte: [
                    { $subtract: ["$balance", value] },
                    { $subtract: [0, "$limit"] },
                  ],
                },
                { $subtract: ["$balance", value] },
                "$balance",
              ],
            },
          },
        });
      } else {
        updatePipeline.unshift({
          $set: { balance: { $add: ["$balance", value] } },
        });
      }

      const updateResult = await db.collection('users').findOneAndUpdate(
        { id: userId },
        updatePipeline,
        { returnDocument: "after", projection: { balance: 1, limit: 1 } }
      );

      return {
        limit: user.limit,
        balance: updateResult.balance,
      };
    },
  },
};

function validateTransactionData(type, value, description, user) {
  if (!["d", "c"].includes(type)) {
    const error = new ApolloError("Invalid transaction type", "INVALID_TRANSACTION_TYPE", { statusCode: 422 });
    throw error;
  }
  if (!Number.isInteger(value) || value <= 0) {
    const error = new ApolloError("Invalid transaction value", "INVALID_TRANSACTION_VALUE", { statusCode: 422 });
    throw error;
  }
  if (!description || (description.length > 10 || description.length < 1)) {
    const error = new ApolloError("Invalid transaction description", "INVALID_TRANSACTION_DESCRIPTION", { statusCode: 422 });
    throw error;
  }
  if (type === 'd' && user.balance - value < -user.limit) {
    const error = new ApolloError("Insufficient funds", "INSUFFICIENT_FUNDS", { statusCode: 422 });
    throw error;
  }
}
