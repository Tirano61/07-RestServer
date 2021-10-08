const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'],
        unique: true,
    },
    usuario:{
        type: Schema.Types.ObjectId, ref: 'Usuario'
    }
    

});


categoriaSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser único' });

module.exports = mongoose.model('Categoria', categoriaSchema);