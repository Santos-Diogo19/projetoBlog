const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session")
const connection = require("./database/database");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const UsersController = require("./user/UserController");

const Article = require("./articles/Article");
const Category = require("./categories/Categorie");
const User= require("./user/User");


//View engine com ejs
app.set('view engine','ejs');

//Redis = banco de dados focados em salvamento de sessões

//Sessions
app.use(session({
    secret: "qualquercoisa", cookie: {maxAge: 300000}
}))

//Static
app.use(express.static('public'));

//Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Database
connection.authenticate().then(()=>{
        console.log("Conexão feita com sucesso");
    }).catch((error)=>{
        console.log("erro" + error);
    });

//acessando as rotas criadas na pasta categories
app.use("/",categoriesController);

//acessando as rotas criadas na pasta articles
app.use("/",articlesController);

app.use("/",UsersController)

/* app.get("/session", (req,res)=>{ // sessão é global na aplicação
    req.session.treinamento = "Formação Node.js";
    req.session.ano = "2022";
    req.session.email = "teste@gmail.com";
    req.session.user = {
        username: "DiogoSantos",
        email: "teste@gmail.com",
        id: 10
    }
    res.send("Sessão gerada");
});

app.get("/leitura", (req,res)=>{
    res.json({
        treinamento: req.session.treinamento,
        ano: req.session.ano,
        email: req.session.email,
        user: req.session.user

    })
}) */

app.get("/",(req,res)=>{
    Article.findAll({
        order:[
            ['id','DESC']
        ],
        limit: 4
    }).then(articles =>{

        Category.findAll().then(categorias=>{
            res.render("index", {articles: articles, categories: categorias});
        })

        
    })
    
});

app.get("/:slug",(req,res)=>{
    let slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article=>{
        if(article != undefined){
            Category.findAll().then(categorias=>{
                res.render("article", {article: article, categories: categorias});
            })
        }else{
            res.redirect("/");
        }
    }).catch(err=>{
        res.redirect("/");
    })
})

app.get("/categoria/:slug",(req,res)=>{
    let slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category =>{
        if(category != undefined){
            Category.findAll().then(categories =>{
                res.render("index",{articles: category.articles, categories: categories});
            });
        }else{
            res.redirect("/")
        }
    }).catch(err =>{
        res.redirect("/");
    })
})


app.listen(8080,()=>{
    console.log("App rodando"); 

});

//cd Programação\ESTUDO SÉRIO\BACKEND\projetoBlog