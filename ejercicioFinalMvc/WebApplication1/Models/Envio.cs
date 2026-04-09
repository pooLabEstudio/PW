using Microsoft.DotNet.Scaffolding.Shared.CodeModifier.CodeChange;

namespace WebApplication1.Models
{
    public class Envio
    {
        public double peso { get; set; }=0;
        public double distancia { get; set; }=0;
        public double pesoExtra { get; set; } = 0;
        public double distanciaExtra { get; set; } = 0;
        public double total { get; set; } = 0; 

        public double tarifaBase = 3500;
        public double distanciaBase = 50;
        public double kmExtra = 120;
        public double pesoLimite = 10;
        public double ValorPesoExtra = 2000;

        public double calculoDistanciaExtra(double distancia)
        {
            if(distancia <= distanciaBase)
            {

                distanciaExtra = 0;
            }
            else
            {
                distanciaExtra = distancia - distanciaBase;

            }
            return distanciaExtra;
        }
        public double calculoExcesoDistancia(double distancia)
        {
            double distanciaExtra = calculoDistanciaExtra(distancia);
            return (distanciaExtra * kmExtra);
        }

        public double calculoPesoExtra(double peso)
        {
            if(peso <= pesoLimite)
            {
                pesoExtra = 0;
            }
            else
            {
                pesoExtra = peso - pesoLimite;
            }
            return pesoExtra;
        }

        public double calculoExcesoPeso(double peso)
        {
            pesoExtra = calculoPesoExtra(peso);
            return (pesoExtra * ValorPesoExtra);
        }

        public double calculoTotal(double peso, double distancia)
        {
            distanciaExtra = calculoDistanciaExtra(distancia);
            pesoExtra = calculoPesoExtra(peso);
            double total = tarifaBase; // Empezamos con el mínimo
            // Sumamos recargos solo si existen
            total = total + (distanciaExtra * kmExtra);
            total = total + (pesoExtra * ValorPesoExtra);
            return total;
        }
    }
}
