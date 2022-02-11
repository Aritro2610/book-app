// if(process.env.NODE_ENV == 'production'){
//     require('dotenv').config({ path: "config.env" })
// }
require('dotenv').config();

const express = require('express');
const app = express()
const path = require('path')
const layouts = require('express-ejs-layouts')
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/author')
const bookRouter = require('./routes/books')
const bodyParser = require('body-parser')
const cors = require('cors')
const methodOverride = require('method-override')

app.set('view engine','ejs');
app.set('views',__dirname+'/views')
app.set('layout', 'layouts/layout')
app.use(layouts)
app.use('/',express.static(path.join(__dirname,'/extras')));
app.use(bodyParser.urlencoded({limit: '10mb' , extended:false}))
app.use(cors())
app.use(methodOverride('_method'))

// if(process.env.NODE_ENV == 'production'){
//     app.use('/',express.static(path.join(__dirname,'/views')));

// }else{
//     app.get("/",(req,res)=>{
//         res.send("Api running")
//     })
// }

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI ,{
    useNewUrlParser: true
})



const db = mongoose.connection
db.on('error',error=> console.error(error));
db.once('open',()=> console.log('connected to Mongoose'));

app.use('/',indexRouter)
app.use('/authors',authorRouter)
app.use('/books',bookRouter)

const PORT = process.env.PORT || 8000
app.listen(PORT,()=>{
    console.log(`server ruuning on port ${PORT}`)
})