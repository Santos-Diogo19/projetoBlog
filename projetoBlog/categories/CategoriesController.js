const express = require("express");
const router = express.Router();
const slugfy = require("slugify");
const Category = require("./Categorie");
const adminAuth = require("../middleware/adminAuth");

router.get("/admin/categories/new",adminAuth,(req,res)=>{
    res.render("admin/categories/new");
})

router.post("/categories/save",adminAuth,(req,res)=>{
    let titulo = req.body.title;
    if(titulo != undefined){
        
        Category.create({
            title: titulo,
            slug: slugfy(titulo)
        }).then(() =>{
            res.redirect("/admin/categories");
        })
    }else{
        res.redirect("/admin/categories/new");
    }
});

router.get("/admin/categories",adminAuth, (req,res)=>{
    Category.findAll().then(categories =>{
        res.render("admin/categories/index", {categories: categories});    
    })
    
})

router.post("/categories/delete",adminAuth,(req,res)=>{
    let id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Category.destroy({
                where: {
                    id: id
                }
            }).then(()=>{
                res.redirect("/admin/categories")
            })
        }else{
            res.redirect("/admin/categories");
        }
    }else{
        res.redirect("/admin/categories");
    }
})

router.get("/admin/categories/edit/:id", (req,res)=>{
    let id = req.params.id;

    if(isNaN(id)){
        res.redirect("/admin/categories");
    }
    Category.findByPk(id).then(categoria =>{
        if(categoria != undefined){
            res.render("admin/categories/edit",{categoria: categoria})


        }else{
            res.redirect("/admin/categories");
        }
    }).catch(erro => {
        res.redirect("/admin/categories");
    })
})

router.post("/categories/update", (req,res)=>{
    let id = req.body.id;
    let title = req.body.title;

    Category.update({title: title, slug: slugfy(title)},{
        where:{
            id:id
        }
    }).then(()=>{
        res.redirect("/admin/categories");
    })

})

module.exports = router;

