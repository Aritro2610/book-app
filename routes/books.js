const express = require('express')
const router = express.Router()
const Books = require('../models/book')
const Author = require('../models/author')
const author = require('../models/author')

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'images/gif']

router.get('/', async (req,res)=>{
    let query = Books.find()
    if(req.query.title != null && req.query.title !=' '){
        query = query.regex('title',RegExp(req.query.title,'i'))
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore !=' '){
        query = query.lte('PublishDate',req.query.publishedBefore)
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter !=' '){
        query = query.gte('PublishDate',req.query.publishedAfter)
    }
    try{
        const books = await query.exec()
        res.render("books/index",{
            books:books,
            searchOptions:req.query
        })
    }
    catch{
        res.redirect('/')
    }
})
router.get('/new', async (req,res)=>{
    renderNewPage(res, new Books())
})


router.post('/', async (req,res)=>{
    // console.log(req.body)
    const book = new Books({
        title: req.body.title,
        description: req.body.description,
        pageno: req.body.pageno,
        PublishDate: new Date(req.body.PublishDate),
        author: req.body.author
    })
    saveCover(book,req.body.cover)
    // console.log(typeof book.coverImageType)
    // console.log(typeof book.coverImage)
    try{
        const newbook = await book.save()
        res.redirect(`books/${newbook.id}`);
        console.log("sucess");
    }
    catch(err){
        renderNewPage(res, book , true)
    }
})

router.get('/:id', async (req,res)=>{
    try{
        const book = await Books.findById(req.params.id).populate('author').exec()
        res.render('books/show',{book:book})
    }
    catch{
        res.redirect('/')
    }
})

router.get('/:id/edit',async (req,res)=>{
    const book = await Books.findById(req.params.id)
    try {
        // res.send("Edit Book" + req.params.id)
        res.render('books/edit',{book:book})
    } catch{
        res.redirect('/')
        
    }
})

router.put('/:id', async (req,res)=>{
    try{
        const book = await Books.findById(req.params.id)
        book.title = req.body.title
        await book.save()
        res.redirect(`/books/${book.id}`)
    }
    catch{
        res.redirect('/books')
    }
})
router.delete('/:id', async (req,res)=>{
    let book
    try {
        book = await Books.findById(req.params.id)
        await book.remove()
        res.redirect('/books')
    } catch{
        res.redirect('/books')
    }
})

async function renderNewPage(res, book, hasError = false){
    try{
        const authors = await Author.find({})
        const params = {
            authors:authors,
            book:book
        }
        if(hasError) params.errorMessage = 'Error creating book'
        res.render("books/new", params)
    }
    catch(err){
        console.log(err)
        res.redirect('books')
    }
}

function saveCover(book, coverEncoded){
    if(coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    // console.log("ryt now",cover.type)
    if(cover != null && imageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data,'base64')
        // console.log(cover.data)
        book.coverImageType = cover.type
    }
}

module.exports = router