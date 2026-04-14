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