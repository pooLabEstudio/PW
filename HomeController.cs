// Controllers/HomeController.cs
using Microsoft.AspNetCore.Mvc;
using PW_Ejercicios.Models;

namespace PW_Ejercicios.Controllers
{
    public class HomeController : Controller
    {
        // Lista estática para Ejercicio 3
        static List<Registro> listado = new List<Registro>();
        
        public IActionResult Index()                                //carga: Index.cs
        {
            return View();
        }
        public IActionResult Ejercicio1()                           //carga: Ejercicio1.cs
        {
            return View();
        }
        public IActionResult CalcularParquimetro(string txtMinutos) //input: txtMinutos
        {
            if (txtMinutos != null)
            {
                var parquimetro = new Parquimetro();                //crea: obteto parquimetro =instancia de la clase Parquimetro
                parquimetro.minutos = int.Parse(txtMinutos);    

                ViewBag.resultado = parquimetro.Calcular();         //calcula: resultado = parquimetro.Calcular() 
                ViewBag.minutos = parquimetro.minutos;              //minutos = parquimetro.minutos
            }
            else
            {
                ViewBag.resultado = "Debe ingresar los minutos";    //presenta: resultado = "Debe ingresar los minutos"
            }

            return View("Ejercicio1");
        }
        public IActionResult Ejercicio2()                           //carga: Ejercicio2.cs
        {
            return View();
        }

        // Recibe los datos del formulario,
        // crea un objeto Recorrido,
        // asigna los valores y calcula la velocidad
        public IActionResult CalcularVelocidad(string txtHoras, string txtMinutos, string txtSegundos, string txtCentesimas, string txtDistancia)
        {
            if (txtHoras != null && txtMinutos != null && txtSegundos != null && txtCentesimas != null && txtDistancia != null)
            {
                var recorrido = new Recorrido();                    // crea un objeto Recorrido
                recorrido.horas = double.Parse(txtHoras);           //asigna los valores
                recorrido.minutos = double.Parse(txtMinutos);
                recorrido.segundos = double.Parse(txtSegundos);
                recorrido.centesimas = double.Parse(txtCentesimas);
                recorrido.distancia = double.Parse(txtDistancia);

                ViewBag.resultado = Math.Round(recorrido.CalcularVelocidad(), 2);
            }
            else
            {
                ViewBag.resultado = "Debe completar todos los campos";
            }

            return View("Ejercicio2");
        }

        // ── EJERCICIO 3: Triplicar / Dividir ─────────────────
        public IActionResult Ejercicio3()
        {
            ViewBag.respuesta = listado;
            return View();
        }

        public IActionResult CalcularTriplicar(string txtNumero)
        {
            if (txtNumero != null)
            {
                var registro = new Registro();
                registro.numero = double.Parse(txtNumero);

                registro.Calcular();

                listado.Add(registro);
            }
            else
            {
                ViewBag.error = "Debe ingresar un número";
            }

            ViewBag.respuesta = listado;
            return View("Ejercicio3");
        }
    }
}
