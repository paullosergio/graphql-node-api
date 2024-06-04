db.createCollection("users");
db.users.insertMany([
  { id: 1, limit: 100000, balance: 0, last_transactions: [] },
  { id: 2, limit: 80000, balance: 0, last_transactions: [] },
  { id: 3, limit: 1000000, balance: 0, last_transactions: [] },
  { id: 4, limit: 10000000, balance: 0, last_transactions: [] },
  { id: 5, limit: 500000, balance: 0, last_transactions: [] },
]);