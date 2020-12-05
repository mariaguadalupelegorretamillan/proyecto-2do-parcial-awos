const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productoSchema = new Schema ({
    
    nombre: {
        type: String,
        unique: true,
        required: [true, 'la descripcion es necesaria']
    },
    precioUni: {
        type: Number,
        required: [true, 'el precio es necesario']
    },
    categoria:{
        type: Schema.ObjectId,
        ref: 'Categoria'
    },
    disponible: {
        type: Boolean,
        default: true
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

module.exports = mongoose.model('Producto', productoSchema);