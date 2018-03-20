var router = require('express').Router()
var faker = require('faker')
var Product = require('../models/product')

router.get('/add-product', function(req, res) {
    res.render('main/add-product')
})

router.post('/add-product', function(req, res) {
  // console.log(req);
    var product = new Product()

    product.category = req.body.category_name
    product.name = req.body.product_name
    product.price = req.body.product_price
    product.cover = faker.image.image()

    product.save(function(err) {
        if (err) throw err
        res.json('Sukses')
    })
})

router.get('/generate-fake-data', function(req, res) {
    for (var i = 0; i < 90; i++) {
        var product = new Product()

        product.category = faker.commerce.department()
        product.name = faker.commerce.productName()
        product.price = faker.commerce.price()
        product.cover = faker.image.image()

        product.save(function(err) {
            if (err) throw err
        })
    }
    res.redirect('/add-product')
})

router.get('/products/:page', function(req, res, next) {
    var perPage = 9
    var page = req.params.page || 1

    Product
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, products) {
            Product.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('main/products', {
                    products: products,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })
})

//Heraldo
router.post('/edit-product/:idProduct', function(req, res){

    let objProduct = {
        category: req.body.category_name,
        name: req.body.product_name,
        price: req.body.product_price,
        cover: faker.image.image(),
    }

    Product.findByIdAndUpdate(req.params.idProduct, { $set: objProduct}, function(err, data) {
        if (err) throw err
        res.json(data)
    })
})

router.get('/delete-product/:idProduct', function(req, res){
   console.log(req.params.idProduct)
    Product.remove({'_id': req.params.idProduct}, function(err){
        if(err) throw err
        res.json('Deleted')
    })
})

router.get('/', function(req, res, next) {
    res.render('index')
})

module.exports = router
