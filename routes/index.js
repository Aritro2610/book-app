const express = require('express')
const router  = express.Router()
const Books = require('../models/book')
const Author = require('../models/author')

router.get('/', async (req,res)=>{
    let books
    let authors
    try {
        books  =await Books.find().sort({createdAt: 'desc'}).limit(10).exec()
        authors  =await Author.find().limit(10).exec()
    } catch {
        books = []
    }
    res.render('index',{books:books, authors:authors})
})

module.exports = router