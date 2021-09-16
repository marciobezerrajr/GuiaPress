const express = require('express')
const connection = require('./database/database')
const session = require('express-session')
const cors = require('cors')

//models
const Article = require('./models/Article')
const Category = require('./models/Category')
const User = require('./models/User')


//controllers
const categoriesController = require('./controllers/categories/CategoriesControllers')
const articlesController = require('./controllers/articles/ArticlesControllers')
const usersController = require('./controllers/users/UsersControllers')

const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: false}))
app.use(express.json())

app.set('view engine', 'ejs')
app.use(express.static('public'))


//Sessões
app.use(session({
    secret: 'Guiapress', cookie: { maxAge: 30000 } //uma palavra qualquer para aumentar a segunça das sessões
}))

/*exemplo de dados guardados na sessão e como ler
app.use('/session', (req, res) => {
    req.session.treinamento = "Formação node",
    req.session.ano = 2021,
    req.session.qualquerCoisa = 'posso definir qualquer coisa nas sessõess',
    req.session.user = {
        email: 'marcio@email.com',
        id: 10
    }
    res.send('sessão criada')
})

app.use('/readsession', (req, res) => {
    res.send(req.session.treinamento),
    res.send(req.session.ano),
    res.send(req.session.qualquerCoisa),
    res.send(req.session.user)
    )
})*/

app.get('/', (req, res) => {
    Article.findAll({
        limit: 5,
        order:[['id','DESC']]})
        .then(articles => {
            //pegando as categorias para a navbar
            Category.findAll().then(categories => {
                res.render("index", { articles, categories})
            })
    })
})

app.get('/:slug', (req, res) => {
    const slug = req.params.slug
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render('article', { article, categories })   
            })
        } else {
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/')
    })
})


app.get('/category/:slug', (req, res) => {
    const slug = req.params.slug

//pego todas as categorias, filtro pelo slug e o include faz o join
    Category.findOne({where: {slug}, include: [{model: Article}] })
    .then((category) => {
        if(category != undefined){

            //filtro as categorias para o navbar
            Category.findAll().then(categories => {

                //renderiza os dados do join e as categorias da navbar
                res.render('index', { articles: category.articles, categories })   
            })            
        } else {
            res.redirect('/')
        }
    })
})

//rotas controllers
app.use('/', categoriesController)
app.use('/', articlesController)
app.use('/', usersController)



app.listen(3000, ()=> {
    console.log('Servidor on')
})