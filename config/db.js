const Sequelize = require('sequelize');

// import values from variables.env
require('dotenv').config({ path: 'variables.env'});

const db = new Sequelize( 
    process.env.DB_NOMBRE,
    process.env.DB_USER,
    process.env.DB_PASS,
    
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',     //|'sqlite'|'postgres'|'mssql',
        port: process.env.DB_PORT,
        // operatorAliases: false,
        define: {
            timestamps: false
    },
 
    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000
    },
});

module.exports = db;