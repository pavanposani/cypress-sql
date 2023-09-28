// ***********************************************
// These are custom commands which can be used to interact with the database from cypress
// ***********************************************

module.exports = ()=>{

  Cypress.Commands.add("sql", (query, connectionConfig) => {
    // validate query
    const sqlRegex = /(select|insert|update|delete|create|drop)\s+/i;
    // if query is an object
    if (!query) {
      throw new Error("Query must be sent, Empty Query was given");
    } else if (!sqlRegex.test(query)) {
      cy.task("storedProcedureDb", ({query, connectionConfig})).then((response) => {
        return response;
      });
    } else {
      cy.task("queryDb", ({query, connectionConfig})).then((response) => {
        if(response.length == 0){
          return "";
        }
        else if(response.length == 1){
          return response[0]; // flatten result
        }
        else{
          return response;
        } 
      });
    }
  });
  
  Cypress.Commands.add("sqlServer", (query, connectionConfig) => {
    // This command is just to facilitate backward compatibility of the existing scripts
    cy.task("queryDb", ({query, connectionConfig})).then((response) => {
      let result = [];
      for (let record in response) {
        result.push(Object.values(response[record]));
      }
      return result.length == 1 ? result[0] : result; // flatten result
    });
  });
  
  Cypress.Commands.add("sqlBatch", (query, batch_size, connectionConfig, callback) => {
    const sqlSelectRegex = /^select\s+.*\s+from\s+.*\s+order\s+by\s+\w+$/i;
    if (!query || !sqlSelectRegex.test(query)) {
      throw new Error(
        `Invalid Query for batch processing,\n Query should follow the format of SELECT column1,...columnN FROM table ORDER BY column_name or SELECT * FROM table ORDER BY column_name`
      );
    }
  
    let offset = 0;
    let remainingRows = true;
  
    function getNextBatch() {
      if (!remainingRows) {
        return;
      }
  
      const batchQuery =`${query} OFFSET ${offset} ROWS FETCH NEXT ${batch_size} ROWS ONLY`;
      cy.task("queryDb", ({query, connectionConfig})).then((response) => {
        if (response.length === batch_size) {
          offset += batch_size;
          callback(response);
          getNextBatch();
        } else {
          remainingRows = false;
          if (response.length > 0) {
            callback(response);
          }
        }
      });
    }
    getNextBatch();
  });
  
}