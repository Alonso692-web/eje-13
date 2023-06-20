let idActualizarCategoria = 0;
let idEliminarCategoria = 0;

function getURL(){
  let URL = window.location.protocol + '//'+window.location.hostname;
  if(window.location.port){
    URL += ':'+window.location.port;
  }
  return URL;
}

function muestraUnaCategoria(id){
  let URL = getURL() + '/categorias/api/' + id;//params
  //alert(URL);
  $.ajax({
    method:'GET',
    url: URL,
    data: {},//Body
    success: function( result ) {
      if (result.estado == 1) {
        //Debemos mostrar la categoria en la ventana
        const categoria = result.categoria;
        //Inputs de la vetana modal
        document.getElementById('descripcionCategoriaVisualizar').value=categoria.descripcion;
        document.getElementById('observacionesCategoriaVisualizar').value=categoria.observaciones;
      }else{
        //Mostrar el mensaje de error
        alert(result.mensaje);
      }
    }
  });
}
function agregarCategoria() {
  const descripcion = document.getElementById('descripcionCategoriaAgregar').value;
  const observaciones = document.getElementById('observacionesCategoriaAgregar').value;
  let URL = getURL() + '/categorias/api';
  $.ajax({
    method: 'POST',//Método
    url: URL,//End Point
    data: {//Body
      descripcion: descripcion,
      observaciones: observaciones
    },
    success: function( result ) {
      if (result.estado==1) {
        //Agregar la categoria a la tabla
        const categoria = result.categoria;
        let tabla = $('#tabla-categorias').DataTable();
        let botones = generaBotones(categoria);
        let nuevoRenglon =tabla.row.add([categoria.descripcion,botones]).node();
        $(nuevoRenglon).find('td').addClass('table-td');
        tabla.draw(false);
        //Limpiar campos
        document.getElementById('descripcionCategoriaAgregar').value='';
        document.getElementById('observacionesCategoriaAgregar').value='';
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Categoria guardada',
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
function listaCategoriaFront(){
    //Usamos la libreria jquery para JS
    
    let URL = getURL()+'/categorias/api';
    $.ajax({
        //Verbo (get,put,delete,post)
        method: 'GET',
        url: URL,
        data: {},
        success: function( result ) {
            let estado = result.estado;
            let mensaje = result.mensaje;
            
            if (estado == 1) {
                //Mostramos las categorias
                let categorias = result.categorias;
                let tabla = $('#tabla-categorias').DataTable();
              
                categorias.forEach(categoria => {
                    let Botones = generaBotones(categoria);
                    let nuevoRenglon = tabla.row.add([categoria.descripcion,Botones]).node();
                    //Linea agregada
                    $(nuevoRenglon).attr('id','renglon_'+categoria.id);
                    $(nuevoRenglon).find('td').addClass('table-td');
                    tabla.draw( false );
                    
                }); 
            }else{
                alert(mensaje);
            }
        }
      });
}
function eliminarCategoriaById() {

  $.ajax({
    method: 'DELETE',
    url: getURL() + '/categorias/api/' + idEliminarCategoria,
    data: {},
    success: function( result ) {
      if(result.estado == 1){
        //1.- Si se eliminó de DB
        //2.- Debemos de eliminarlo de la tabla-----------------------------
        let tabla = $('#tabla-categorias').DataTable();
        tabla.row('#renglon_'+idEliminarCategoria).remove().draw();
        //Mostrar Mensaje de confirmacion-----------------------------------
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Categoria eliminada',
          showConfirmButton: false,
          timer: 1500
        })  
      }else{
        //Mostrar mensaje que no se eliminó-----
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Categoria NO eliminada',
          showConfirmButton: false,
          timer: 1500
        })
      }
    }
  });
}

function actualizarCategoriaById() {
  let descripcionCategoria = document.getElementById('nombreCategoriaActualizar').value;
  let observacionesCategoria = document.getElementById('observacionesCategoriaActualizar').value;
  $.ajax({
    method: 'PUT',
    url: getURL() + '/categorias/api/' + idActualizarCategoria,
    data: {
      descripcion: descripcionCategoria,
      observaciones: observacionesCategoria
    },
    success: function( result ) {
      if(result.estado == 1){
        //alert(result.mensaje);
        //1.- Si se actualizó de DB
        //2.- Debemos de actualizar la tabla-----------------------------
        let tabla = $('#tabla-categorias').DataTable();
        let renglonTemporal = tabla.row('#renglon_'+idActualizarCategoria).data();
        renglonTemporal[0] = descripcionCategoria;
        tabla
             .row('#renglon_'+idActualizarCategoria)
             .data(renglonTemporal)
             .draw();
        //Mostrar Mensaje de confirmacion-----------------------------------
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Categoria actualizada',
          showConfirmButton: false,
          timer: 1500
        })  
      }else{
        alert(result.mensaje);
      }
    }
  });
}

function generaBotones(categoria) {
  let Botones = '<div class="flex space-x-3 rtl:space-x-reverse">';
                  Botones += '<button onclick="muestraUnaCategoria('+categoria.id+');" data-bs-toggle="modal" data-bs-target="#viewModal" class="action-btn" type="button">'
                  Botones += '<iconify-icon icon="heroicons:eye"></iconify-icon>'
                  Botones += '</button>'

                  Botones += '<button onclick="identificaIdActualizar('+categoria.id+');" data-bs-toggle="modal" data-bs-target="#updateModal" class="action-btn" type="button">'
                  Botones += '<iconify-icon icon="heroicons:pencil-square"></iconify-icon>'
                  Botones += '</button>'

                  Botones += '<button onclick="identificaIdEliminar('+categoria.id+');" data-bs-toggle="modal" data-bs-target="#deleteModal" class="action-btn" type="button">'
                  Botones += '<iconify-icon icon="heroicons:trash"></iconify-icon>'
                  Botones += '</button>'
                  Botones += '</div>';
  return Botones;
}

function identificaIdEliminar(id) {
  idEliminarCategoria = id;
}
function identificaIdActualizar(id){
  idActualizarCategoria = id;
  //Necesitamos conectar con la base de datos para obtener los datos y mostrarlos
  //Esto lo hacemos con jquery
  $.ajax({
    method: 'GET',
    url: getURL() + '/categorias/api/' + idActualizarCategoria,
    data: {},
    success: function( result ) {
      if (result.estado == 1) {
        let categoria = result.categoria;
        document.getElementById('nombreCategoriaActualizar').value = categoria.descripcion;
        document.getElementById('observacionesCategoriaActualizar').value = categoria.observaciones;
        //alert(categoria.descripcion);
      }else{
        alert(result.mensaje);
      }
    }
  });
}

listaCategoriaFront();