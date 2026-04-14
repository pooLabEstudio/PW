using Evaluacion1.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace Evaluacion1.Controllers
{
    public class HomeController : Controller
    {
        private static List<Alumno> listaAlumnos = new List<Alumno>();

        public IActionResult Ingreso()
        {
            return View();
        }

        public IActionResult IngresoAlumno(string txtNombres, string txtApellidos, string txtRut, string txtId, string txtFecha, double txtNota)
        {
            //ES OTRA FORMA 
            Alumno alumno = new Alumno(txtNombres, txtApellidos, txtRut, txtId, txtFecha, txtNota);
            //VALIDANDO RUT 
            string rutValido = alumno.ValidarRut();
            // 3. Condición: Solo agregar si es válido
            if (rutValido == "RUT válido")
            {
                listaAlumnos.Add(alumno);
                //listaAlumnos.Add(new Alumno(txtNombres, txtApellidos, txtRut, txtId, txtFecha, txtNota));
            }
            ViewBag.listaAlumnos = listaAlumnos;
            ViewBag.mensaje = rutValido;
            return View("Ingreso");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}