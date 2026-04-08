using Microsoft.AspNetCore.Mvc;
using proyectoDecimas.Models;
using System.Diagnostics;

namespace proyectoDecimas.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {

            return View();
        }

        [HttpPost] //solo se activará cuando el usuario aprete el boton Calcular
        public IActionResult Calcular(int? minutos) //int? minutos podría venir en 0 pese al required
        {
            //PASO 1: validar el paquete
            if(minutos == null)
            {
                ViewBag.Error = "Error. El campo minutos no puede estar vacío"; //si minutos viene nulo le arrojamos error
                return View("Index"); //devolvemos al usuario al inicio
            }
            //PASO 2: proceso matemático
            int totalPagar = 0; 

            //estuvo menos de 25 minutos
            if(minutos <= 25)
            {
                totalPagar = 1850; 
            }
            else
            {
                int minutosExtra = minutos.Value - 25; //aquí calcularemos los minutos adicionales despues de los 25
                totalPagar = 1850 + (minutosExtra * 23); //sumamos los 25 base más cada minuto extra por 23
            }
            //PASO 3: Guardar el resultado en viewbag
            ViewBag.Total = totalPagar;
            return View("Index"); 
        }
        public IActionResult Carrera()
        {
            return View();
        }
        [HttpPost]
        public IActionResult CalcularVelocidad(double? metros, double? minutos, double? segundos, double? centesimas)
        {
            //PASO 1:validacion
            if(metros == null || minutos == null || segundos == null || centesimas == null)
            {
                ViewBag.Error = "Error. Faltan datos por ingresar";
                return View("Carrera");
            }
            //PASO 2: matematicas
            //Ocuparemos 1000.0 para obligar a c# a trabajar con decimales
            double distanciakilometros = metros.Value / 1000.0;

            //convertir tiempo a horas
            double horasDesdeMinutos = minutos.Value / 60.0;
            double horaDesdeSegundos = minutos.Value / 3600.0;
            double horaDesdeCentesimas = minutos.Value / 360000.0;

            //sumamos todo para ver una sola hora
            double totalHoras = horasDesdeMinutos + horaDesdeSegundos + horaDesdeCentesimas;

            //calcular la velocidad final
            double velocidadFinal = 0; 

            //pequeña validación
            if(totalHoras > 0)
            {
                velocidadFinal = distanciakilometros / totalHoras; 
            }
            //PASO 3 salida
            //math.round arrojará solo dos decimales 
            ViewBag.Velocidad = Math.Round(velocidadFinal, 2);

            //devolvemos la vista
            return View("Carrera"); 
        }
        private static List<RegistroOperacion> _historial = new List<RegistroOperacion>(); 
        //al ser static la memoria no se borra

        //puerta de entrada
        public IActionResult Numeros()
        {
            ViewBag.Historial = _historial;
            return View();
        }
        //matematicas y guardado
        [HttpPost]
        public IActionResult CalcularGrilla(double? numero)
        {
            //validacion
            if(numero == null)
            {
                ViewBag.Historial = _historial; //devolvemos la lista para que la grilla siga ahí
                return View("Numeros");
            }

            //matematicas
            double resultado = 0;

            //si el numero es menor de 50 se triplica
            if(numero < 50)
            {
                resultado = numero.Value * 3; 
            }
            else //sino lo divide en 4
            {
                resultado = numero.Value / 4.0; 
            }
            //guardar en la memoria
            RegistroOperacion nuevoRegistro = new RegistroOperacion();
            nuevoRegistro.NumeroIngresado = numero.Value;
            nuevoRegistro.ResultadoCalculado = resultado;

            //agregamos el registro a la lista
            _historial.Add(nuevoRegistro);

            //metemos la lista completa y actualizada al viewbag 
            ViewBag.Historial = _historial;

            return View("Numeros");

        }
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
    //este será el molde para cada fila de la grilla
    public class RegistroOperacion
    {
        public double NumeroIngresado { get; set;  }
        public double ResultadoCalculado { get; set; }
    } 
}
