# GraphQL Server for Warrior Data

This project is a simple GraphQL server built with Express and `express-graphql`. It serves warrior data stored in an in-memory data structure, making it a great starting point for learning GraphQL or as a base for more complex applications.

## Features

- **Express Framework:** Utilizes Express for easy setup and routing.
- **GraphQL API:** Leverages `express-graphql` for creating GraphQL endpoints.
- **In-Memory Data Store:** Quick and easy data access without the need for external databases.
- **Cross-Origin Resource Sharing (CORS):** Configured to allow cross-origin requests.
- **GraphiQL:** An interactive in-browser GraphQL IDE to test your queries.

## Getting Started

### Prerequisites

Before you begin, ensure you have installed the latest version of [Node.js](https://nodejs.org/).

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Kotkoa/graphql-server.git
```

2. Navigate to the project directory:

```bash
cd graphql-server
```

3. Install the dependencies:

```bash
npm install
```

4. Start the server:

```bash
npm start
```

The server will be available at http://localhost:4000. You can access the GraphiQL interface at http://localhost:4000/graphql to interact with the GraphQL API.

## Using the GraphQL API

### Querying Warrior Data

To fetch the list of warriors, use the following query in the GraphiQL interface:

```graphql
query {
  warriors {
    id
    name
  }
}
```

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is open source and available under the MIT License.
