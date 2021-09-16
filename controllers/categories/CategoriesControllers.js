const express = require('express')
const router = express.Router()
const Category = require('../../models/Category')

//biblioteca para otimizar a string para a rota, remove espaços e acentos
const slugify = require('slugify')


router.get('/admin/categories/new', (req, res) => {
    res.render('admin/categories/new')
})

router.post('/categories/save', (req, res) => {
    var title = req.body.title;

    if(title != undefined){
        Category.create({
            title: title,
            slug: slugify(title),
        }).then(()=> {
            res.redirect('/admin/categories')
        })
    } else {
        res.redirect('/admin/categories/new')
    }
})


router.get('/admin/categories', (req, res) => {
    Category.findAll().then(categories => {
        if(categories){
            
        res.render('admin/categories/index', { categories: categories })
        } else {
            res.send(json({
                error: status(404),
                message: 'Não há categorias cadastradas no banco de dados. Por favor tente mais tarde'
            }))
            console.log('Não há categorias cadastradas no banco de dados. Por favor tente mais tarde')
        }
    })
})

router.post('/categories/delete', (req, res) => {
    const id = req.body.id
    if (id != undefined){
        if(!isNaN(id)){
            Category.destroy({ 
                where: {id}
                }).then(()=> {
                    res.redirect('/admin/categories')
            })

        }else { //se não for um número
        res.redirect('/admin/categories')

        }
    } else { //se for null
        res.redirect('/admin/categories')

    }
})

router.get('/admin/categories/edit/:id', (req, res) => {
    const id = req.params.id
    if(isNaN(id)){
        res.redirect('/admin/categories')
    }
    Category.findByPk(id).then(category => {
        if(category != undefined){
            res.render('admin/categories/edit', { category: category})
        } else {
            res.redirect('/admin/categories')
        }
    }).catch(erro => {
        res.redirect('/admin/categories')
    })
})

router.post('/categories/update', (req, res) => {
    const id = req.body.id 
    const title = req.body.title
    const slug = slugify(title) 

    Category.update({title: title, slug: slug},{
        where:{ 
            id:id 
        }
    }).then(() => {
        res.redirect('/admin/categories')
    })
})

module.exports = router