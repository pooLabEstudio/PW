namespace EjercicioCompleto.Models
{
    public class Datos
    {   
        
        public string? usuario_ { get; set; } 
        //los campos tienen_ y el signo de interrogacion porque pueden ser nulos, ya que en la base de datos pueden ser nulos
        public string? contraseña_ { get; set; } 
        //geters y setters para cada campo
        public string? habilitado_ { get; set; } 
        //habilitado es un string porque en la base de datos es un char, y el char se puede convertir a string
    }
}
