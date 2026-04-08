// Models/Recorrido.cs
namespace PW_Ejercicios.Models
{
    public class Recorrido
    {
        public double horas { get; set; } = 0;
        public double minutos { get; set; } = 0;
        public double segundos { get; set; } = 0;
        public double centesimas { get; set; } = 0;
        public double distancia { get; set; } = 0;

        public double CalcularVelocidad()
        {
            double totalHoras = horas
                              + (minutos / 60)
                              + (segundos / 3600)
                              + (centesimas / 360000);

            double distKm = distancia / 1000;

            return distKm / totalHoras; //retorna: velocidad = distancia en km / tiempo en horas
        }
    }
}
