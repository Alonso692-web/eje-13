let idActualizarProductos = 0;
let idEliminarProductos = 0;

function getURL(){
  let URL = window.location.protocol + '//'+window.location.hostname;
  if(window.location.port){
    URL += ':'+window.location.port;
  }
  return URL;
}

function muestraUnaProductos(id){
  let URL = getURL() + '/productos/api/' + id;//params
  //alert(URL);
  $.ajax({
    method:'GET',
    url: URL,
    data: {},//Body
    success: function( result ) {
      if (result.estado == 1) {
        //Debemos mostrar la Productos en la ventana
        const productos = result.Productos;
        //Inputs de la vetana modal
        document.getElementById('descripcionProductosVisualizar').value=productos.descripcion;
        document.getElementById('observacionesProductosVisualizar').value=productos.observaciones;
      }else{
        //Mostrar el mensaje de error
        alert(result.mensaje);
      }
    }
  });
}
function agregarProductos() {
  const descripcion = document.getElementById('descripcionProductosAgregar').value;
  const observaciones = document.getElementById('observacionesProductosAgregar').value;
  let URL = getURL() + '/productos/api';
  $.ajax({
    method: 'POST',//Método
    url: URL,//End Point
    data: {//Body
      descripcion: descripcion,
      observaciones: observaciones
    },
    success: function( result ) {
      if (result.estado==1) {
        //Agregar la Productos a la tabla
        const productos = result.productos;
        let tabla = $('#tabla-productos').DataTable();
        let botones = generaBotones(productos);
        let nuevoRenglon =tabla.row.add([productos.descripcion,botones]).node();
        $(nuevoRenglon).find('td').addClass('table-td');
        tabla.draw(false);
        //Limpiar campos
        document.getElementById('descripcionProductosAgregar').value='';
        document.getElementById('observacionesProductosAgregar').value='';
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Productos guardada',
          showConfirmButton: false,
          timer: 1500
        })
      }else{
        alert(result.mensaje);
      }
    }
  });
}
//Funciones para comunicarnos con el back API - End Point
function listaProductosFront(){
    //Usamos la libreria jquery para JS
    
    let URL = getURL()+'/productos/api';
    $.ajax({
        //Verbo (get,put,delete,post)
        method: 'GET',
        url: URL,
        data: {},
        success: function( result ) {
            let estado = result.estado;
            let mensaje = result.mensaje;
            
            if (estado == 1) {
                //Mostramos las Productoss
                let productos = result.productos;
                let tabla = $('#tabla-productos').DataTable();
              
                Productoss.forEach(productos => {
                    let Botones = generaBotones(productos);
                    let nuevoRenglon = tabla.row.add([productos.descripcion,Botones]).node();
                    //Linea agregada
                    $(nuevoRenglon).attr('id','renglon_'+productos.id);
                    $(nuevoRenglon).find('td').addClass('table-td');
                    tabla.draw( false );
                    
                }); 
            }else{
                alert(mensaje);
            }
        }
      });
}
function eliminarProductosById() {

  $.ajax({
    method: 'DELETE',
    url: getURL() + '/productos/api/' + idEliminarProductos,
    data: {},
    success: function( result ) {
      if(result.estado == 1){
        //1.- Si se eliminó de DB
        //2.- Debemos de eliminarlo de la tabla-----------------------------
        let tabla = $('#tabla-productos').DataTable();
        tabla.row('#renglon_'+idEliminarProductos).remove().draw();
        //Mostrar Mensaje de confirmacion-----------------------------------
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Producto eliminada',
          showConfirmButton: false,
          timer: 1500
        })  
      }else{
        //Mostrar mensaje que no se eliminó-----
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Producto NO eliminada',
          showConfirmButton: false,
          timer: 1500
        })
      }
    }
  });
}

function actualizarProductosById() {
  let descripcionProductos = document.getElementById('nombreProductosActualizar').value;
  let observacionesProductos = document.getElementById('observacionesProductosActualizar').value;
  $.ajax({
    method: 'PUT',
    url: getURL() + '/productos/api/' + idActualizarProductos,
    data: {
      descripcion: descripcionProductos,
      observaciones: observacionesProductos
    },
    success: function( result ) {
      if(result.estado == 1){
        //alert(result.mensaje);
        //1.- Si se actualizó de DB
        //2.- Debemos de actualizar la tabla-----------------------------
        let tabla = $('#tabla-productos').DataTable();
        let renglonTemporal = tabla.row('#renglon_'+idActualizarProductos).data();
        renglonTemporal[0] = descripcionProductos;
        tabla
             .row('#renglon_'+idActualizarProductos)
             .data(renglonTemporal)
             .draw();
        //Mostrar Mensaje de confirmacion-----------------------------------
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Producto actualizado',
          showConfirmButton: false,
          timer: 1500
        })  
      }else{
        alert(result.mensaje);
      }
    }
  });
}

function generaBotones(productos) {
  let Botones = '<div class="flex space-x-3 rtl:space-x-reverse">';
                  Botones += '<button onclick="muestraUnaProductos('+productos.id+');" data-bs-toggle="modal" data-bs-target="#viewModal" class="action-btn" type="button">'
                  Botones += '<iconify-icon icon="heroicons:eye"></iconify-icon>'
                  Botones += '</button>'

                  Botones += '<button onclick="identificaIdActualizar('+productos.id+');" data-bs-toggle="modal" data-bs-target="#updateModal" class="action-btn" type="button">'
                  Botones += '<iconify-icon icon="heroicons:pencil-square"></iconify-icon>'
                  Botones += '</button>'

                  Botones += '<button onclick="identificaIdEliminar('+productosv.id+');" data-bs-toggle="modal" data-bs-target="#deleteModal" class="action-btn" type="button">'
                  Botones += '<iconify-icon icon="heroicons:trash"></iconify-icon>'
                  Botones += '</button>'
                  Botones += '</div>';
  return Botones;
}

function identificaIdEliminar(id) {
  idEliminarProductos = id;
}
function identificaIdActualizar(id){
  idActualizarProductos = id;
  //Necesitamos conectar con la base de datos para obtener los datos y mostrarlos
  //Esto lo hacemos con jquery
  $.ajax({
    method: 'GET',
    url: getURL() + '/productos/api/' + idActualizarProductos,
    data: {},
    success: function( result ) {
      if (result.estado == 1) {
        let productos = result.productos;
        document.getElementById('nombreProductosActualizar').value = productos.descripcion;
        document.getElementById('observacionesProductosActualizar').value = productos.observaciones;
        //alert(Productos.descripcion);
      }else{
        alert(result.mensaje);
      }
    }
  });
}

listaProductosFront();