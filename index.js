// if(process.env.NODE_ENV == 'production'){
//     require('dotenv').config({ path: "config.env" })
// }
require('dotenv').config();

import express, { static } from 'express';
const app = express()
import { join } from 'path';
import layouts from 'express-ejs-layouts';
import indexRouter from './routes/index';
import authorRouter from './routes/author';
import bookRouter from './routes/books';
import { urlencoded } from 'body-parser';
import cors from 'cors';
import methodOverride from 'method-override';

// const express = require('express');
// const app = express()
// const path = require('path')
// const layouts = require('express-ejs-layouts')
// const indexRouter = require('./routes/index')
// const authorRouter = require('./routes/author')
// const bookRouter = require('./routes/books')
// const bodyParser = require('body-parser')
// const cors = require('cors')
// const methodOverride = require('method-override')

app.set('view engine','ejs');
app.set('views',__dirname+'/views')
app.set('layout', 'layouts/layout')
app.use(layouts)
app.use('/',static(join(__dirname,'/public')));
app.use(urlencoded({limit: '10mb' , extended:false}))
app.use(cors())
app.use(methodOverride('_method'))

// if(process.env.NODE_ENV == 'production'){
//     app.use('/',express.static(path.join(__dirname,'/views')));

// }else{
//     app.get("/",(req,res)=>{
//         res.send("Api running")
//     })
// }
import { connect, connection } from 'mongoose';
// const mongoose = require('mongoose');
connect(process.env.MONGODB_URI ,{
    useNewUrlParser: true
})



const db = connection
db.on('error',error=> console.error(error));
db.once('open',()=> console.log('connected to Mongoose'));

app.use('/',indexRouter)
app.use('/authors',authorRouter)
app.use('/books',bookRouter)

const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`server ruuning on port ${PORT}`)
})