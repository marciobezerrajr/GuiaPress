const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const User = require('../../models/User')

router.get('/admin/users', (req, res) => {
    
    User.findAll().then((users) => {
        res.render('admin/users/index', { users })
    })
})

router.get("/admin/users/create",(req, res) => {
    res.render("admin/users/create");
});

//cadastrar usuário no banco
router.post("/users/create",(req, res) => {

    const email = req.body.email
    const password = req.body.password

    User.findOne({ where: {email}}).then((user) => {
        if(user == undefined){

            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)

            User.create({
                email,
                password: hash
            }).then(() => {
                res.redirect('/')
            }).catch((err) => {
                res.redirect('/admin/categories')
                console.log(err)
            })
        } else {
            res.redirect('admin/users/create')
        }
    })
})


router.get("/login", (req, res) => {
    res.render("admin/users/login");
});


router.post('/authenticate', (req, res) => {
    const email = req.body.email
    const password = req.body.password

    User.findOne({
        where: {
            email: email
        }
    }). then((user) => {
        if(user != undefined){

            const credential = bcrypt.compareSync(password, user.password)
            
            if(credential) { //cria a sessão
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect('/admin/articles')
                

            } else {
                res.redirect('/login')
            }

        } else {
            res.redirect('/login')
        }
    })
})

router.get('/logout', (req, res) => {
    
    req.session.destroy(function(err) {})
    res.redirect('/')
})

module.exports = router
