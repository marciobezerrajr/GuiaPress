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
            res.redirect('/admin/users/create')
        }
    })
})

    



module.exports = router
