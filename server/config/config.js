//=====================
//  Puerto
//=====================
process.env.PORT = process.env.PORT || 3000;

//=====================
//  Entorno
//=====================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
//=====================
//  Base de datos
//=====================

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://usuario:QPDn4Bt8939a9R7x@cluster0.rygsb.mongodb.net/cafe';
}

process.env.URLDB = urlDB;


// usuario
// QPDn4Bt8939a9R7x
// MongoDB URL
//mongodb+srv://usuario:QPDn4Bt8939a9R7x@cluster0.rygsb.mongodb.net/cafe