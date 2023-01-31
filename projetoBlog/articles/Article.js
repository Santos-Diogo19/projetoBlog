const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Categorie");


const Article = connection.define('articles',{
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },slug:{
        type: Sequelize.STRING,
        allowNull: false
    },body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Category.hasMany(Article); // Relacionamento um para Muitos
Article.belongsTo(Category); //Relacionamento um para um



module.exports = Article;