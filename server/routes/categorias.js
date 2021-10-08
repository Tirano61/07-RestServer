const express = require('express');
const _ = require('underscore');

let { verificaToken, verificaAdminRole } = require('../middlewares/authentication');


let app = express();

let Categoria = require('../models/categoria');

//Mostrar todas las categorias
app.get('/categoria',  verificaToken, ( req, res) => {

    Categoria.find({})
        .sort('nombre') //que ordene por nombre
        .populate('usuario', 'nombre email') //trae los datos del usuario que lo creo
        .exec((err, categorias) => {
        
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
            });
        }

        Categoria.countDocuments ({}, (err, conteo) => {
            res.json({
                ok: true,
                categorias,
                total: conteo
            })
        })
    })

});

//Mostrar una categoria por id
app.get('/categoria/:id', verificaToken, (req, res ) => {

    let id = req.params.id;
    let body = req.body;

    Categoria.findById(id).exec((err, categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        res.json({
            ok: true,
            categoria: categoriaDB,
        });
    });

});

//Crear nueva categoria
app.post('/categoria', verificaToken, (req, res) => {
    //regresa la nueva categoria
    //req.usuario._id
    let body = req.body;
    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id,
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

app.put('/categoria/:id', (req,res) => {
    
    let id = req.params.id;
    let bodys = req.body;
    console.log(bodys);
    let descCategoria = {
        nombre: bodys.nombre
    };
    console.log(descCategoria);

    Categoria.findByIdAndUpdate( id, descCategoria, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

app.delete('/categoria/:id', [ verificaToken, verificaAdminRole ], (req, res) => {
    let id = req.params.id;


    Categoria.findByIdAndRemove (id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) { 
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        });

    });
});
module.exports = app;
