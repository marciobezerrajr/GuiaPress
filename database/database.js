const Sequelize = require('sequelize')

const connection = new Sequelize('guiapress', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00',
    //não mostrar as queries no terminal
    logging: false
})

connection.authenticate().then(() => {
    console.log('conexão com o banco estabelecida com sucesso')
}).catch((err) => {
    console.log('Erro ao se conectar ao mysql' + err)
})

module.exports = connection