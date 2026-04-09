namespace PW_Ejercicios.Models  // Models/Parquimetro.cs
{
    public class Parquimetro
    {
        public int valorBase { get; set; } = 1850;
        public int valorMinuto { get; set; } = 23;
        public int minutos { get; set; } = 0;
        public int Calcular()
        {
            if (minutos <= 25)
            {
                return valorBase;
            }
            else
            {
                return valorBase + ((minutos - 25) * valorMinuto);
            }
        }
    }
}
