const express = require('express')
const router = express.Router()
const Category = require('../../models/Category')
const Article = require('../../models/Article')
const slugify = require('slugify')


router.get('/admin/articles', (req, res) => {
    Article.findAll({ include: [{ model: Category }] }).then(articles => {
        res.render('admin/articles/index', { articles })
    })
})


router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new', { categories })
    })
})

router.post('/articles/save', (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles")
    })
})

/////////////////////////////////////////////
router.post('/articles/delete', (req, res) => {
    const id = req.body.id
    if (id != undefined) {
        if (!isNaN(id)) {
            Article.destroy({
                where: { id }
            }).then(() => {
                res.redirect('/admin/articles')
            })

        } else { //se não for um número
            res.redirect('/admin/articles')

        }
    } else { //se for null
        res.redirect('/admin/articles')

    }
})

router.post('/articles/update', (req, res) => {
    const id = req.body.id
    const title = req.body.title
    const body = req.body.body
    const categoryId = req.body.category
    const slug = slugify(title)

    Article.update({ title, body, categoryId, slug }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/articles')
    }).catch((err) => {
        res.redirect('/')
    })
})

router.get('/admin/articles/edit/:id', (req, res) => {
    const id = req.params.id

    Article.findByPk(id).then(article => {
        if (article != undefined) {

            Category.findAll().then(categories => {
                res.render('admin/articles/edit', { categories, article })
            })

        } else {
            res.redirect('/')
        }

    }).catch((err) => {
        console.log('Houve um erro durante a pesquisa')
        res.redirect('/')
    })
})


router.get('/articles/page/:num', (req, res) => {
    const page = req.params.num
    const limit = 4
    var offset = 0;
    var next

    if (isNaN(page) || page == 1) {
        offset = 0;
    } else {
        offset = (parseInt(page) - 1) * limit
    }
    /*configuração da paginação que será feita:
    offset 1 = exibe de 0 a 3
    offset 2 = vai exibir de 4 a 7
    offset 3 = exibira de 8 a 11
    offset 4 = exibe de 12 a 15 e etc */

    Article.findAndCountAll({ //retornará a quantidade e as rows
        limit: limit,   //limita a 4 resultados 
        offset: offset,  //retorna dados a partir de um valor ex: quero que o seja retornados os artigos a partir do 10° artigo, ai o vlaor do offset seria 10
        order: [['id', 'DESC']]
    }).then(articles => {

        //definindo a variavel de controle next para saber se há uma nova pagina a ser exibida depois da atual
        if (offset + 4 >= articles.count) {
            next = false
        } else {
            next = true
        }

        const result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        Category.findAll().then((categories)=> {
            res.render('admin/articles/page', {categories: categories, result: result})
        })
    })
})

module.exports = router