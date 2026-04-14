using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace Evaluacion1.Models
{
    public class Alumno
    {
        public string? Nombres { get; set; }
        public string? Apellidos { get; set; }
        public string? Rut { get; set; }
        public string? Id { get; set; }
        public string? Fecha { get; set; }
        public double? Nota { get; set; }
        public Alumno(string nombres, string apellidos, string rut, string id, string fecha, double nota)
        {
            this.Nombres = nombres;
            this.Apellidos = apellidos;
            this.Rut = rut;
            this.Id = id;
            this.Fecha = fecha;
            this.Nota = nota;
        }
        // FALTA VALIDAR RUT
        public string ValidarRut()
        {
            if (string.IsNullOrWhiteSpace(this.Rut) || string.IsNullOrWhiteSpace(this.Id))
            {
                return "RUT no válido";
            }
            try
            {
                string rutCompleto = this.Rut + this.Id;
                string rutLimpio = rutCompleto.Replace(".", "").Replace("-", "").Replace(" ", "").ToUpper();
                if (rutLimpio.Length < 8) return "RUT no válido";
                string cuerpo = rutLimpio.Substring(0, rutLimpio.Length - 1);
                char dvIngresado = rutLimpio[rutLimpio.Length - 1];
                int suma = 0;
                int multiplicador = 2;
                for (int i = cuerpo.Length - 1; i >= 0; i--)
                {
                    if (!char.IsDigit(cuerpo[i])) return "RUT no válido";
                    suma += (int)char.GetNumericValue(cuerpo[i]) * multiplicador;
                    multiplicador = (multiplicador == 7) ? 2 : multiplicador + 1;
                }

                int resto = 11 - (suma % 11);
                char dvEsperado;
                if (resto == 11) dvEsperado = '0';
                else if (resto == 10) dvEsperado = 'K';
                else dvEsperado = char.Parse(resto.ToString());
                return (dvIngresado == dvEsperado) ? "RUT válido" : "RUT no válido";
            }
            catch
            {
                return "RUT no válido";
            }
        }

        public string CalculoNota()
        {
            if (this.Nota >= 4.0)
            {
                return "APROBADO";
            }
            else
            {
                return "REPROBADO";
            }
        }
        public string Estado => Nota >= 4.0 ? "APROBADO" : "REPROBADO";
    }
}