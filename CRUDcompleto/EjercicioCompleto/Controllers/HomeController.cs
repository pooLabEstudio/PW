using EjercicioCompleto.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace EjercicioCompleto.Controllers
{
    public class HomeController : Controller
    {
        //lista en memoria para almacenar los datos de los usuarios, esta lista se utiliza para simular una base de datos, ya que no se esta utilizando una base de datos real en este ejercicio, por lo cual los datos se pierden al cerrar la aplicación, pero mientras la aplicación esta abierta se pueden agregar, editar y eliminar usuarios en esta lista
        static List<Datos> listado = new List<Datos>();
        //llamada a la vista Index (Inicio sesión)
        public IActionResult Index()
        {
            return View();
        }
        // llamada a la funcion validar, que se encarga de validar el usuario y contraseña ingresados en la pantalla Index, luego muestra un mensaje dependiendo del resultado de la validación
        public IActionResult validar(string txtUsuario, string txtContraseña)
        {
            // aqui validamos no nulos
            if (txtUsuario != null && txtContraseña != null)
            {
                //recuperanoms listado en memoria y buscamos el usuario ingresado, si no lo encuentra trae null
                var traeDatos = listado.Find(l => l.usuario_ == txtUsuario);
                //si hay datos en listado
                if (traeDatos == null)
                {
                    //retorna mensaje de usuario no encontrado con ViewBag.respuesta = 
                    ViewBag.respuesta = "Usuario ingresado no existe en el sistema";
                }
                //valida contraseña correcta, si no es correcta retorna mensaje de contraseña incorrecta
                else if (traeDatos.contraseña_ != txtContraseña)
                {
                    ViewBag.respuesta = "Contraseña incorrecta";
                }
                //valida si el usuario esta habilitado, si no esta habilitado retorna mensaje de usuario no habilitado
                else if (traeDatos.habilitado_ != "on")
                {
                    ViewBag.respuesta = "Usuario no se encuentra HABILITADO";
                }
                //sizeof paso todo lo anterior y el usuario esta habilitado, retorna mensaje de bienvenida con el nombre del usuario
                else
                {
                    ViewBag.respuesta = "Bienvenido usuario: " + txtUsuario;
                }                    
            }
            //si los campos de usuario o contraseña son nulos, retorna mensaje de usuario vacio
            else
            {
                ViewBag.respuesta = "usuario vacio";
            }
            return View("Index");
        }
        //llamada a la vista Agregar
        public IActionResult Agregar()
        {
            //retorna listado en memoria para mostrarlo en la pantalla Agregar
            ViewBag.respuesta = listado;
            return View();
        }
        //Añade un usuario nuevo a la lista
        public IActionResult Nuevo(string txtUsuarioNuevo, string txtContraseñaNuevo, string chkHabilitado)
        {
            //Agrega en la lista de memoria el objeto con los datos ingresados en la pantalla Agregar, luego retorna el listado actualizado para mostrarlo en la pantalla Agregar
            listado.Add(new Datos()
            {
                usuario_ = txtUsuarioNuevo, //campos tienen _ para diferenciar de los parametros de la funcion
                contraseña_ = txtContraseñaNuevo,
                habilitado_ = chkHabilitado
            });
            //retorna la lista actualizada para mostrarla en la pantalla Agregar
            ViewBag.respuesta = listado; //datos
            return View("Agregar");     // pantalla
        }
        //Al presionar el boton Editar en la pantalla Agregar, se envian los datos que luego muestra en la pantalla,
        //el usuario cumple el rol de indentificador por lo cual no puede ser editado
        public IActionResult Editar(string txtEditarUsuario, string txtEditarContraseña, string chkEditarHabilitado)
        {
            //obtiene de la memoria viewbag con los datos desde la pantalla Agregar, luego retorna esos datos para mostrarlos en la pantalla Editar
            ViewBag.UsuarioEditado = txtEditarUsuario;
            ViewBag.ContraseñaEditado = txtEditarContraseña;
            //configura el checkbox de habilitado dependiendo del valor que se envio desde la pantalla Agregar, si el valor es "on" el checkbox se muestra marcado, sino se muestra sin marcar
            if (chkEditarHabilitado=="on")
            {
                ViewBag.HabilitadoEditado = "checked";
            }
            else
            {
                ViewBag.HabilitadoEditado = "";
            }
            //retorna los datos para mostrarlos en la pantalla Editar
            //los datos ya estan en la memoria de viewbag, por lo cual se pueden mostrar en la pantalla Editar, y luego al presionar el boton Editar registro se envian los datos editados a la funcion EditarDatos para modificar los datos en la lista
            return View();
        }
        //Al presionar el boton Editar registro, modifica los datos de la lista en base al usuario
        public IActionResult EditarDatos(string txtUsuarioNuevo, string txtContraseñaNuevo, string chkHabilitadoNuevo)
        {
            //aqui editamos
            //del listado en memoria en viewbag, buscamos el usuario que se envio desde la pantalla Editar, luego modificamos los datos de ese usuario con los datos editados que se enviaron desde la pantalla Editar, luego retorna el listado actualizado para mostrarlo en la pantalla Agregar
            var editaDatos = listado.Find(l => l.usuario_ == txtUsuarioNuevo);
            //la variable editaDatos es un objeto de la clase Datos,
            //por lo cual se pueden modificar sus propiedades para modificar los datos en la lista,
            editaDatos.contraseña_ = txtContraseñaNuevo;
            editaDatos.habilitado_ = chkHabilitadoNuevo;

            //luego retorna el listado actualizado para mostrarlo en la pantalla Agregar
            ViewBag.respuesta = listado;
            return View("Agregar");
        }
        //llamada a la vista Eliminar
        public IActionResult Eliminar(string txtUsuarioEliminar)
        {
            //retorna la vista con el usuario que se desea eliminar para mostrarlo en la pantalla Eliminar, este usuario se muestra en la pantalla Eliminar para confirmar que se desea eliminar ese usuario, y luego al presionar el boton Confirmar eliminar se envia el usuario a la funcion confirmaEliminar para eliminar el registro de la lista,
            ViewBag.datoUsuario = txtUsuarioEliminar;
            //y luego retorna el listado actualizado para mostrarlo en la pantalla Agregar
            //luego al presionar el boton Confirmar eliminar se envia el usuario a la funcion confirmaEliminar para eliminar el registro de la lista, y luego retorna el listado actualizado para mostrarlo en la pantalla Agregar
            return View();
        }

        //si se presiona cancelar en la pantalla Eliminar vuelve a la pantalla Agregar
        public IActionResult confirmaVolver() {
            //mantiene los datos en la lista sin eliminar nada, y retorna el listado para mostrarlo en la pantalla Agregar
            ViewBag.respuesta = listado;
            return View("Agregar");
        }
        //si se presiona confirmar en la pantalla Eliminar vuelve a la pantalla Agregar luego de eliminar el registro de la lista
        public IActionResult confirmaEliminar(string txtUsuarioDatoEliminar)
        {
            //aqui eliminamos el objeto de la lista
            var eliminaDatos = listado.Find(l => l.usuario_ == txtUsuarioDatoEliminar);
            //en la lista se remueve el objeto que se encontro con el usuario enviado desde la pantalla Eliminar, luego retorna el listado actualizado para mostrarlo en la pantalla Agregar
            listado.Remove(eliminaDatos);
            //luego retorna el listado actualizado para mostrarlo en la pantalla Agregar
            ViewBag.respuesta = listado;
            return View("Agregar"); //pantalla de donde proviene
        }
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
