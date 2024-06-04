# GraphQL API

## Overview

This project is a GraphQL API built with Apollo Server and MongoDB. The API provides functionalities for managing user transactions, retrieving balance extracts, and updating user information. The core components include:

- **Apollo Server:** A fully-featured GraphQL server with a rich set of functionalities.
- **MongoDB:** A NoSQL database used for storing user data, including balances and transactions.
- **GraphQL:** A query language for APIs that allows clients to request only the data they need.

## Features

- **Get Extract:** Retrieve the user's current balance, credit limit, and last 10 transactions.
- **Create Transaction:** Create a new transaction (debit or credit) for a user, update the user's balance, and keep a record of transactions.

## Project Structure

- **`app.js`:** Entry point of the application. It sets up the MongoDB connection, initializes the Apollo Server, and defines the server's context and plugins.
- **`graphql/typeDefs.js`:** Contains the GraphQL schema definitions.
- **`graphql/resolvers.js`:** Contains the resolvers for handling GraphQL queries and mutations.

## Setup and Installation

### Prerequisites

- Node.js (v14 or later)
- MongoDB


Usage
-----

### GraphQL Schema

#### Queries

-   `getExtract(id: Int!): Extract!`
    -   Retrieves the balance extract for the specified user ID.
    -   Arguments:
        -   `id` (Int): The ID of the user.
    -   Returns:
        -   `Extract`: The balance extract, including the total balance, extract date, credit limit, and last transactions.

#### Mutations

-   `createTransaction(id: Int!, type: String!, value: Int!, description: String!): UserInfo`
    -   Creates a new transaction (debit or credit) for the specified user ID.
    -   Arguments:
        -   `id` (Int): The ID of the user.
        -   `type` (String): The type of transaction (`d` for debit, `c` for credit).
        -   `value` (Int): The value of the transaction.
        -   `description` (String): A brief description of the transaction.
    -   Returns:
        -   `UserInfo`: The updated user information, including the new balance and credit limit.

### Example Queries

#### Get Extract

graphql

Copy code

`query {
  getExtract(id: 1) {
    balance {
      total
      extract_date
      limit
    }
    last_transactions {
      value
      type
      description
      realized_in
    }
  }
}`

#### Create Transaction

graphql

Copy code

`mutation {
  createTransaction(id: 1, type: "d", value: 50, description: "Groceries") {
    limit
    balance
  }
}`

Error Handling
--------------

The API uses custom error handling to provide meaningful error messages and appropriate HTTP status codes. Some of the custom errors include:

-   Client Not Found: Returned when the user ID is not found in the database.
-   Invalid Transaction Type: Returned when the transaction type is not `d` or `c`.
-   Invalid Transaction Value: Returned when the transaction value is not a positive integer.
-   Invalid Transaction Description: Returned when the transaction description is not between 1 and 10 characters.
-   Insufficient Funds: Returned when a debit transaction exceeds the user's available balance and credit limit.

Conclusion
----------

This project provides a robust and flexible GraphQL API for managing user transactions and retrieving balance extracts. It leverages Apollo Server's features and MongoDB's scalability to deliver a performant and scalable solution. Feel free to contribute or customize the API to suit your needs.

## Paulo Sérgio
Email: paulomg1996@gmail.com

[Linkedin](https://www.linkedin.com/in/paulo-sergio-pereira-filho/)