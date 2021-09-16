const Sequelize = require('sequelize')
const Category = require('./Category')
const connection = require('../database/database')

const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    },
})


Category.hasMany(Article)//criando relacionamento 1 para muitos
Article.belongsTo(Category)//criado o relacionamento entre os dois arquivos. Relacionamento 1 para 1 nesse caso

// Article.sync({ force: true})

module.exports = Article