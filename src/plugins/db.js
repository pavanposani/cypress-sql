/*
Plugin files to conect to DB and query for the results
*/

const sql = require('mssql');

async function getConnectionPool(config){
    let pool;
    try{
        pool = await sql.connect(config);
    }
    catch(err){

        throw Error(`${err}\n Check your configuration: ${JSON.stringify(config)}`);
    }
    return pool;
}

function dbConnection(default_dbConfig){

        const all_methods = {
            queryDb : async function queryDb(query, config){
                try{
                    config = config == null ? default_dbConfig: config;
                    let pool = await getConnectionPool(config);
                    const result = await pool.request().query(query);
                    return (result.recordsets.length > 1)?  result.recordsets: result.recordset;
                }
                catch(err){
                    console.log(err);
                    throw new Error(err, query);
                }
            },
            storedProcedureDb: async function executeStoredProc(procedure_name, config){
                config = config == null ? default_dbConfig: config;
                let pool = await getConnectionPool(config);
                const result = await pool.request().execute(procedure_name);
                return result; 
            }
        };
        return all_methods
}

module.exports = dbConnection;