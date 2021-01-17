if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')

const flash = require('express-flash');
const session = require('express-session');

const indexRouter = require('./routes/index'); 


app.set('view engine', 'ejs');
app.set('views', __dirname+ '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));

app.use(bodyParser.urlencoded({limit: '10mb', extended:false}));
app.use('/', indexRouter);
app.use('/signin', indexRouter);
app.use('/verify', indexRouter);
app.use(methodOverride('_method'));


app.use(express.urlencoded({extended: false}))
app.use(flash())

app.listen(process.env.PORT || 3030);