const { createPool } = require('mysql2/promise')

const conexion = createPool({
    host : process.env.MYSQLHOST || 'localhost',
    port : process.env.MYSQLPORT || '3306',
    user : process.env.MYSQLUSER || 'root',
    password : process.env.MYSQLPASSWORD || '',
    database : process.env.MYSQLDATABASE || 'siveo'
})

const getConexion = () =>{
    return conexion;
}

module.exports.miConexion=getConexion;