# cypress-sql

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/pavanposani/cypress-sql/blob/main/LICENSE)
[![npm version](https://badge.fury.io/js/cypress-sql.svg)](https://www.npmjs.com/package/cypress-sql)
[![Build Status](https://travis-ci.org/pavanposani/cypress-sql.svg?branch=main)](https://travis-ci.org/pavanposani/cypress-sql)

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

## Whats New

Now supports querying multiple databases utilizing connection pool

```javascript
  let db1 = {
        "server": "your-server",
        "database": "your-database-1",
        "user": "your-username",
        "password": "your-password",
  }

  let db2 = {
    {
        "server": "your-server",
        "database": "your-database-2",
        "user": "your-username",
        "password": "your-password",
    }
  }
  it('multi database  querying test', () => {
    cy.sql("SELECT DB_NAME() AS current_database;", db1 ).then((response)=>{
      cy.log(response.current_database);
    })

    cy.sql("SELECT DB_NAME() AS current_database;", db2 ).then((response)=>{
      cy.log(response.current_database);
    })

    cy.sql("SELECT DB_NAME() AS current_database;").then((response)=>{
      /* use default database connection when initalized in  cypress.config.js 
       when no specific db is passed */
      cy.log((response.current_database));
    })
  })

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
If there are no parameters specified for connection pool, it will take the default connection pool. 
Look at the configuration section for the example



###  2. Plugin Initalization 
In your `cypress.config.js` file, Import the Cypress-SQL module:

   ```javascript
   const sql  = require('cypress-sql');

   module.exports = defineConfig({
    
        e2e:{
            setupNodeEvents(on, config) {
                on('task', sql.loadDBPlugin(config.env.db));
            },
        }
   })
   ```

### 3. Commands Initalization
    
In `cypress/support/e2e.js`. Register the commands in the support file as shown below:

```javascript
const sql  = require('cypress-sql');

sql.loadDBCommands();
```

### 4. Commands Usage: 
This plugin provides three commands to use it for the tests

1. Execution of stored procedures and queries - `cy.sql(query) or cy.sql(stored_procedure)`
2. Execution of Batch queries - `cy.sqlBatch(query, batch_size)`
3. Backward compatibility for tests using `cypress-sql-server` package  - `cy.sqlServer(query)`

In your cypress tests

```javascript
it('test case with cypress-sql', ()=>{
    let query = "select 'HELLO_WORLD' as dummy_record";
    cy.sql(query).then((response)=>{
        expect(response.dummy_record).to.equal('HELLO_WORLD');
    })
});

#### Note - Batch query response processing will be different
it('test case with cypress-sql batch', ()=>{
    /* the select query needs to follow certian format for batch processing */ 
    let query = "select * FROM 'TABLE_NAME' order by id ";
     let db2 = {
      {
        "server": "your-server",
        "database": "your-database-2",
        "user": "your-username",
        "password": "your-password",
      }
    }
    cy.sqlBatch(query, 100, db2, (response)=>{
      // response will be an array of records

    })
});

it('test case with cross compatibility for existing cypress-sql-server package', ()=>{
    let query = "select 'HELLO_WORLD' as dummy_record";
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
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
    acquireTimeoutMillis: 30000
  },
};



```

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/pavanposani/cypress-sql/blob/main/LICENSE) file for details.

## Contributing

Contributions are welcome! Please refer to the [CONTRIBUTING.md](https://github.com/pavanposani/cypress-sql/blob/main/CONTRIBUTING.md) file for guidelines.
## Acknowledgements

Cypress-SQL is inspired by [node-mssql](https://github.com/tediousjs/node-mssql) and [cypress-sql-server](https://www.npmjs.com/package/cypress-sql-server).

## Support

If you have any questions, issues, or feature requests, please [open an issue](https://github.com/pavanposani/cypress-sql/issues).