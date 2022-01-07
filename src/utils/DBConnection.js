const { Client } = require("pg");
const path = require('path');

require('dotenv').config({path: path.join(__dirname, '../../.env')});

const isProduction = process.env.NODE_ENV == "production";
const client = new Client({
    host: isProduction ? process.env.DB_HOST : process.env.DB_DEV_HOST,
    port: 5432,
    user: isProduction ? process.env.DB_USR : process.env.DB_DEV_USR,
    password: isProduction ? process.env.DB_PW : process.env.DB_DEV_PW,
    database: isProduction ? process.env.DB_NAME : process.env.DB_DEV_NAME,
    ssl: isProduction ? {rejectUnauthorized: false} : undefined
});

client.on("end", () => {
    console.log("\rConnection end\n");
});

module.exports = client;