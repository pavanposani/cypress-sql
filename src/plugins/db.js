/*
Plugin files to conect to DB and query for the results
*/

const sql = require('mssql');
const poolManager = require('../utils/poolManager.js');

async function getConnectionPool(config){
    let pool;
    try{
        pool = await poolManager.connect(config);
    }
    catch(err){

        throw Error(`${err}\n Check your configuration: ${JSON.stringify(config)}`);
    }
    return pool;
}

function dbConnection(default_dbConfig){

        const all_methods = {
            queryDb : async function queryDb(args){
                try{
                    let config;
                    if(args.connectionConfig == null){
                        config = default_dbConfig
                    }else{
                        config = args.connectionConfig;
                    }
                    let pool = await getConnectionPool(config);
                    const result = await pool.request().query(args.query);
                    return result;
                }
                catch(err){
                    console.log(err);
                    throw new Error(err, query);
                }
            },
            storedProcedureDb: async function executeStoredProc(args){
                let config;
                if(args.connectionConfig == null){
                    config = default_dbConfig
                }else{
                    config = args.connectionConfig;
                }
                let pool = await getConnectionPool(config);
                const result = await pool.request().execute(procedure_name);
                return result; 
            }
        };
        return all_methods
}

module.exports = dbConnection;