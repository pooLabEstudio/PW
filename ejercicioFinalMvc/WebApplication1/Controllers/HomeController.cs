using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        //PRESENTA SOLO LA VISTA DEL FORMULARIO
        public IActionResult ViewCalculoEnvio()
        {
            return View();
        }

        // Esto guarda todos los envíos realizados
        private static List<Envio> historial = new List<Envio>();

        [HttpPost]
        public IActionResult CalculoEnvio(double distancia, double peso )
        {
            Envio paquete = new Envio();
            if (distancia <= 0 || peso <= 0)
            {
                ViewBag.ErrorMessage = "La distancia y el peso deben ser mayores que cero.";
                return View("ViewCalculoEnvio");
            }
            //CALCULO DE ENVIO
            double resultadoTotal = paquete.calculoTotal(peso, distancia);
            //CALCULO KMTRS EXTRA
            double kmExtras = paquete.calculoDistanciaExtra(distancia);
            //CALCULO PESO EXTRA
            double pesoExtra = paquete.calculoPesoExtra(peso);
            //ENVIAR RESULTADOS A LA VISTA
            ViewBag.distancia = distancia;
            ViewBag.peso = peso;
            ViewBag.Total = resultadoTotal;
            ViewBag.distanciaExtra = kmExtras;
            ViewBag.pesoExtra = pesoExtra;

            // --- CORRECCIÓN CLAVE: Guarda los datos en el objeto ---
            paquete.distancia = distancia;
            paquete.peso = peso;
            paquete.total = resultadoTotal;

            //AGREGAMOS EL ENVIO AL HISTORIAL
            historial.Add(paquete);
            ViewBag.Historial = historial; // Enviamos la lista a la vista

            return View("ViewCalculoEnvio");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
