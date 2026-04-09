// Models/Registro.cs
namespace PW_Ejercicios.Models
{
    public class Registro
    {
        public double numero { get; set; } = 0;
        public double total { get; set; } = 0;
        public string? mensaje { get; set; }

        public void Calcular()
        {
            if (numero < 50)
            {
                total = numero * 3;
                mensaje = "Menor a 50";
            }
            else
            {
                total = numero / 4;
                mensaje = "Mayor o igual a 50";
            }
        }
    }
}
