const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuarios');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {


    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No files were uploaded.'
            }
        });
    }

    //Validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if(tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false,
            mensaje: 'Solo se permiten tipos : ' + tiposValidos.join(', '),
        });
    }

    let archivo = req.files.archivo;

    //Extenciones permitidas
    let extencionesImagen = ['png', 'jpg', 'gif', 'jpeg', 'bmp'];
    let nombreCortado = archivo.name.split('.');
    let extencion = nombreCortado[nombreCortado.length -1];
    if( extencionesImagen.indexOf( extencion ) < 0 ){
        return res.status(400).json({
            ok: false,
            mensaje: 'Solo se permiten imagenes : ' + extencionesImagen.join(', '),
        });
    }

    //Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencion}`;

    archivo.mv( `uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                err
            });

        if(tipo === 'usuarios'){
            imagenUsuario(id, res, nombreArchivo);    
        }else{
            imagenProducto(id, res, nombreArchivo);
        }    
       
    });
});

function imagenUsuario(id, res, nombreArchivo){
    Usuario.findById(id , (err, usurioDB) => {
        if (err){
            
            borrarArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                err
            });
        }

        if(!usurioDB){
            if (err){
                borrarArchivo(nombreArchivo, 'usuarios');
                return res.status(400).json({
                    err:{
                        message: 'El usuario no existe'
                    }
                });
            }
        }

        borrarArchivo(usurioDB.img, 'usuarios');

        usurioDB.img = nombreArchivo;
        usurioDB.save( (err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        });

    });
}
function imagenProducto( id, res, nombreArchivo ){
    Producto.findById(id , (err, productoDB) => {
        if (err){
            
            borrarArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                err
            });
        }

        if(!productoDB){
            if (err){
                borrarArchivo(nombreArchivo, 'productos');
                return res.status(400).json({
                    err:{
                        message: 'El usuario no existe'
                    }
                });
            }
        }

        borrarArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        productoDB.save( (err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        });

    });
}
function borrarArchivo(nombreImagen, tipo){
    let pathImagen = path.resolve( __dirname, `../../uploads/${ tipo }/${ nombreImagen }` );
    //Borra el archivo si ya hay uno para ese usuario
    if( fs.existsSync(pathImagen) ){
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;