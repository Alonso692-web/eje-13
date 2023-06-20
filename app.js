const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const port = process.env.PORT || 3000;

//Rutsa personalizadas
const rutasCategoriasAPI = require('./src/routes/categorias-routes-api');
const rutasUsuariosAPI = require('./src/routes/usuarios-routes-api');
const rutasAuthAPI = require('./src/routes/auth-routes-api');
const app = express();

app.set('view engine','hbs');
hbs.registerPartials(__dirname + '/views/partials',()=>{});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());
app.use(cors());
//Definir rutas: login, categorias, index y NotFound
//GET o POST
app.get('/',(req,res)=>{
    res.render('index');
})

app.get('/login',(req,res)=>{
    res.render('signin-one');
})

//Me regresa en formato JSON los datos de categoria
app.use('/categorias/api',rutasCategoriasAPI);
//app.use('/productos/api',rutasProductosAPI);
app.use('/usuarios/api',rutasUsuariosAPI);
app.use('/auth/api',rutasAuthAPI);

//Me regresa en formato HTML la vista
app.get('/categorias',(req,res)=>{
    res.render('advance-table');
})

app.get('/productos',(req,res)=>{
    res.render('productos');
})

app.get('*',(req,res)=>{
    res.render('404');
})

app.listen(port,()=>{
    console.log('El servidor corriendo en el puerto: ',port);
})