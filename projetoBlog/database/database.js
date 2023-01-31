const Sequelize = require("sequelize");

//objeto de conexão

const connection = new Sequelize('blog','root','1919',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: "-03:00"
});

module.exports = connection;