# cypress-sql

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/your-username/cypress-sql/blob/main/LICENSE)
[![npm version](https://badge.fury.io/js/cypress-sql.svg)](https://www.npmjs.com/package/cypress-sql)
[![Build Status](https://travis-ci.org/your-username/cypress-sql.svg?branch=main)](https://travis-ci.org/your-username/cypress-sql)

cypress-sql is a plugin that allows you to connect with MS SQL database, perform SQL queries, and execute stored procedures using a connection pool. It is specifically designed for use with the Cypress testing framework.

## Features

- Connect to MS SQL database using a connection pool
- Execute SQL queries and retrieve results
- Execute stored procedures and retrieve output
- Execute large SELECT batch queries 
- Automatic connection pooling for efficient resource management

- Designed for seamless integration with Cypress testing framework

## Installation

You can install Cypress-SQL using npm:

```bash
npm install cypress-sql --save
```

## Usage

To use Cypress-SQL plugin, you need to invoke it through `cypress.config.js` in your <b>Cypress Project</b>.
### 1. Connection Configuration 
    
Connect with the MS SQL database with below configuration , for more help look into `node-mssql` configuration, 

In `cypress.env.json` file, create the configuration for db as shown

```javascript
    "db":{
        "server": "your-server",
        "database": "your-database",
        "user": "your-username",
        "password": "your-password",
    }
```

###  2. Plugin Initalization 
In your `cypress.config.js` file, Import the Cypress-SQL module:

   ```javascript
   const { sql } = require('cypress-sql');

   module.exports = defineConfig({
    
        e2e:{
            setupNodeEvents(on, config) {
                on('task', sql.loadDBPlugin(config.db));
            },
        }
   })
   ```

### 3. Commands Initalization
    
In `cypress/support/e2e.js`. Register the commands in the support file as shown below:

```javascript
import sqlServer from 'cypress-sql';
sqlServer.loadDBCommands();
```

### 4. Commands Usage: 
This plugin provides three commands to use it for the tests

1. Execution of stored procedures and queries - `cy.sql(query) or cy.sql(stored_procedure)`
2. Execution of Batch queries - `cy.sqlBatch(query, batch_size)`
3. Backward compatibility for tests using `cypress-sql-server` package  - `cy.sqlServer(query)`

In your cypress tests

```javascript
it('test case with cypress-sql', ()=>{
    let query = "select HELLO_WORLD";
    cy.sql(query).then((response)=>{
        expect(response).to.equal('HELLO_WORLD');
    })
});

it('test case with cypress-sql', ()=>{
    /* the select query needs to follow certian format for batch processing */ 
    let query = "select * FROM 'TABLE_NAME' order by id ";
    cy.sqlBatch(query, 100).then((response)=>{
        expect(response).to.equal('HELLO_WORLD');
    })
});


it('test case with backward compatibility for existing cypress-sql-server package', ()=>{
    let query = "select HELLO_WORLD";
    cy.sqlServer(query).then((response)=>{
        expect(response[0]).to.equal('HELLO_WORLD');
    })
});
```
## Configuration

Cypress-SQL can be configured using the following options:

- `maxConnections`: Maximum number of connections in the pool (default: 10)
- `minConnections`: Minimum number of connections in the pool (default: 0)
- `idleTimeoutMillis`: Maximum time (in milliseconds) that a connection can be idle before being removed from the pool (default: 30000)
- `acquireTimeoutMillis`: Maximum time (in milliseconds) to wait for a connection from the pool (default: 30000)

You can configure these options by passing an object to the `connect` method:

```javascript
const connectionConfig = {
  server: 'your-server',
  database: 'your-database',
  user: 'your-username',
  password: 'your-password',
};

const poolConfig = {
  maxConnections: 5,
  minConnections: 2,
  idleTimeoutMillis: 60000,
  acquireTimeoutMillis: 60000,
};

```

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/your-username/cypress-sql/blob/main/LICENSE) file for details.

## Contributing

Contributions are welcome! Please refer to the [CONTRIBUTING.md](https://github.com/your-username/cypress-sql/blob/main/CONTRIBUTING.md) file for guidelines.

## Acknowledgements

Cypress-SQL is inspired by [node-mssql](https://github.com/tediousjs/node-mssql).

## Support

If you have any questions, issues, or feature requests, please [open an issue](https://github.com/your-username/cypress-sql/issues).