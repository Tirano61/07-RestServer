const express = require('express');

const { verificaToken } = require('../middlewares/authentication');


let app = express();

let Producto = require('../models/producto');

app.get('/producto', verificaToken, (req, res) => {
    //paginacion
    let desde = req.query.desde || 0;
    desde = Number(desde);


    Producto.find({disponible: true})
        .skip(desde)
        .limit(5)
        .populate( 'usuario', 'nombre email' )
        .populate( 'categoria', 'nombre' )
        .exec((err, productoDB) =>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    err    
                });
            }

            res.json({
                ok: true,
                producto: productoDB,
            });
        });
});

app.get('/producto/:id', verificaToken, ( req, res) => {

    let id = req.params.id;

    Producto.findById( {_id: id})
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre' )
        .exec((err, productoDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err:{
                    message: 'Id no encontrado'
                }
            });
        }
        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'El id del producto no existe'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB,
        });

    });
});
//============================
// Buscar producto
//============================
app.get('/producto/buscar/:termino', verificaToken, ( req, res ) =>  {

    let termino = req.params.termino;

    let regex = new RegExp( termino, 'i' );

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec(( err, productoDB ) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err:{
                        message: 'Id no encontrado'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB,
            });

        });    

});

app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id,
    });

    producto.save((err, productoDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB,
        });
    });



});

app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body
    Producto.findById(id, (err, productoDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El id de producto no existe'
                }
            });
        }
        
        productoDB.nombre = body.nombre
        productoDB.precioUni = body.precioUni
        productoDB.descripcion = body.descripcion
        productoDB.disponible = body.disponible
        productoDB.categoria = body.categoria

        productoDB.save( (err, productoGuardado) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'El id de producto no existe'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado,
            })
        });
    });
});

app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, ( err, productoDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El id de producto no existe'
                }
            });
        }
        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }
        productoDB.disponible = false;
        productoDB.save((err, productoBorrado) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'El id de producto no existe'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto borrado'
            });
        })
    });

});




module.exports = app;