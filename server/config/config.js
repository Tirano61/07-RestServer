//=====================
//  Puerto
//=====================
process.env.PORT = process.env.PORT || 3000;

//=====================
//  Entorno
//=====================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
//=====================
//  Vencimiento del token
//=====================
process.env.CADUCIDAD_TOKEN =  60*60*24*30;
//=====================
//  Seed de autenticacion
//=====================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//=====================
//  Base de datos
//=====================

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//=====================
//  Google client ID
//=====================

process.env.CLIENT_ID = process.env.CLIENT_ID || '366595017830-p74c7gvr0mr2e8fmf7noa9k71hbsaj5d.apps.googleusercontent.com';

// usuario
// QPDn4Bt8939a9R7x
// MongoDB URL
//mongodb+srv://usuario:QPDn4Bt8939a9R7x@cluster0.rygsb.mongodb.net/cafe