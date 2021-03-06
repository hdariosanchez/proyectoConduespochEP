/**
 * Created by darioh on 11/07/15.
 */

var config = require('../server/config.js');
var inspect = require('util').inspect;
var Client = require('mariasql');
var client = new Client();

exports.connect = function() {        //Funcion para crear la conexion a la BD.

  client.connect({                   //Genera una conexion.
    host: config.mariadb.host,
    user: config.mariadb.user,
    password: config.mariadb.password,
    db: config.mariadb.db
  });

  client
    .on('connect', function() { console.log('Client connected'); })
    .on('error', function(err) { console.log('Client error: ' + err);})
    .on('close', function(hadError) { console.log('Client closed'); });
};


exports.get = function(cb) {      //Funcion que forma el modelo de Pregunta: contexto-> Todas las preguntas.
  var data = [];
  //console.log('OBJETO QUE LLEGO AL MODEL '+ JSON.stringify(objFiltrar));
  client.query("SELECT intId, intIdTipoPregunta, intIdAsignatura, intNumero, strBase, dtFechaCreacion, fltValor, lgbImagen, " +
  "strEstado FROM tblExmPregunta;")
    .on('result', function(res) {
      res.on('row', function(row) {
        data.push(row);
      })
        .on('error', function(err) {
          console.log('Result error: ' + inspect(err));
        })
        .on('end', function(info) {
          console.log('Result finished successfully');
        });
    })
    .on('end', function() {
      cb(data);
      console.log('Funcion get() desde modelExmPregunta .on.End de get: OK' + data);
    });
};



// obtiene todos los elementos de la tabla "producto"
exports.db_get_ultimo_id = function(cb) {
  var data = [];
  client.query("SELECT int_id FROM pregunta ORDER BY int_id DESC LIMIT 1;")
    .on('result', function(res) {
      res.on('row', function(row) {
        data.push(row);
      })
        .on('error', function(err) {
          console.log('Result error: ' + inspect(err));
        })
        .on('end', function(info) {
          console.log('Result finished successfully');
        });
    })
    .on('end', function() {
      cb(data);
      console.log('desde conexion a datos :D!!!');
      //console.log(data);
    });
};



// inserta un nuevo producto en la tabla "producto"
//exports.db_insertar = function(id_grupo, desc_producto, cb) {
exports.db_insertar = function(preguntaNueva, cb) {
  var tipoPregunta = null;
  var obligatoriedad = null;
  if(preguntaNueva.type === 'checkbox'){
    tipoPregunta = 4;
  }
  if(preguntaNueva.type === 'radio'){
    tipoPregunta = 3;
  }
  if(preguntaNueva.type === 'text'){
    tipoPregunta = 1;
  }
  if(preguntaNueva.type === 'range'){
    tipoPregunta = 5;
  }
  if(preguntaNueva.type === 'date'){
    tipoPregunta = 6;
  }
  if(preguntaNueva.type === 'time'){
    tipoPregunta = 7;
  }
  if(preguntaNueva.obligatoriedad){
    obligatoriedad = 1;
  }
  if(!preguntaNueva.obligatoriedad){
    obligatoriedad = 0;
  }
  client.query("INSERT INTO pregunta (int_id_encuesta, int_id_variable, int_id_tipo_pregunta, int_numero, str_enunciado, str_ayuda, int_obligatoria) VALUES (?, ?, ?, ?, ?, ?, ?);",
    [preguntaNueva.id_encuesta, preguntaNueva.section, tipoPregunta, preguntaNueva.numId, preguntaNueva.title, preguntaNueva.ayuda, obligatoriedad])
    .on('error', function(err) {
      console.log('Result error: ' + inspect(err));
    })
    .on('end', function() {
      console.log('Result finished successfully');
      cb(true);
    });
};

// elimina un elemento de la tabla "producto" de acuerdo a su "id_producto"
exports.db_eliminar = function(id_producto, cb) {
  //client.query("DELETE FROM producto WHERE int_id = :var_id_producto;",
  client.query("UPDATE producto SET str_estado = ? WHERE int_id = ?;",
    ["Inactivo" ,id_producto])
    //{var_id_producto: id_producto})
    .on('error', function(err) {
      console.log('Result error: ' + inspect(err));
    })
    .on('end', function() {
      console.log('Result finished successfully');
      cb(true);
    });
}

// obtiene un elemento de la tablas "producto" join "producto" a partir de "id_producto"
exports.db_get_elemento_by_id = function(id_producto, cb) {
  var data = [];
  client.query("SELECT id_producto, desc_producto, num_grupo FROM producto INNER JOIN grupo "+
  "ON producto.id_grupo = grupo.id_grupo WHERE id_producto = :id;",{id: id_producto})
    .on('result', function(res) {
      res.on('row', function(row) {
        data.push(row);
      })
        .on('error', function(err) {
          console.log('Result error: ' + inspect(err));
        })
        .on('end', function(info) {
          console.log('Result finished successfully');
        });
    })
    .on('end', function() {
      cb(data);
    });
}

exports.db_actualizar = function (productoEditar, cb){
  console.log("SI LLEGA!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  client.query("UPDATE producto SET int_id_grupo = ?, int_id_unidad = ?, str_descripcion = ?, flt_min = ?, flt_max = ? WHERE int_id = ?;",
    [productoEditar._num_grupo, productoEditar._num_unidad, productoEditar._descripcion, productoEditar._flt_min, productoEditar._flt_max, productoEditar._id])
    .on('error', function(err) {
      console.log('Result error: ' + inspect(err));
    })
    .on('end', function() {
      console.log('Result finished successfully');
      cb(true);
    });
}

// desconecta la base de datos
exports.disconnect = function() {
  client.end();
};
