using Evaluacion1.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace Evaluacion1.Controllers
{
    public class HomeController : Controller
    {
        public static List<Alumno> listaAlumnos = new List<Alumno>();

        public IActionResult Ingreso()
        {
            return View();
        }

        public IActionResult IngresoAlumno(string txtNombres, string txtApellidos, string txtRut, string txtId, string txtFecha, double txtNota)
        {
            listaAlumnos.Add(new Alumno(txtNombres, txtApellidos, txtRut, txtId, txtFecha, txtNota));

            // Enviamos la lista a la vista mediante ViewBag
            ViewBag.listaAlumnos = listaAlumnos;

            return View("Ingreso");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}