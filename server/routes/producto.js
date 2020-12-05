const express = require('express');
const _ = require('underscore');
const app = express();
const Producto = require('../models/producto');


app.get('/producto', function (req, res) {
    let desde = req.query.desde || 0;
    let hasta = req.query.hasta || 5;

    Producto.find({disponible: true})
    .skip(Number(desde))
    .limit(Number(hasta))
    .populate ('usuario', 'email nombre')
    .populate('categoria', 'descripcion')
    .exec ((err, productos) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: 'ocurrio error al listr',
                err
            });
        }
        res.json({
            ok: true,
            msg: 'listados con exito',
            conteo: productos.length,
            productos
        });
    });
});
app.post('/producto', (req, res) => {
    let body = req.body;
    let product = new Producto ({

        nombre: body.nombre,
        precioUni: body.precioUni,
        categoria: body.categoria,
        disponible: body.disponible,
        usuario: body.usuario
    });

    product.save((err, productDB) => {
      if(err) {
        return res.status(400).json({
          ok: false,
          msg: 'ocurrio un error',
          err
        });
      }

      res.json({
        ok: true,
        msg: 'producto fue insertado con exito',
        productDB
        });
    });
});

app.put('/producto/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni']);
  
    Producto.findByIdAndUpdate(id, body, { context: 'query' }, 
    (err, productDB) => {
      if(err) {
        return res.status(400).json({
          ok: false,
          msg: 'ocurrio un error al momento de actualizar',
          err
        });
      }
      res.json({
        ok: true,
        msg: 'producto fue actualizado con exito',
        productDB
      });
  
    });
  });
  app.delete('/producto/:id', function(req, res) {
      let id = req.params.id;
      Producto.findByIdAndUpdate(id, { disponible: false }, 
        {new: true, runValidators: true, context: 'query'}, (err, productDB) => {
          if(err) {
                return res.status(400).json({
                  ok: false,
                  msg: 'ocurrio un error al tratar de eliminar',
                  err
                });
              }
      
              res.json({
                ok: true,
                msg: 'el producto fue eliminado con exito',
                productDB
              });
      });
});
module.exports = app;
