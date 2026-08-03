public class Producto
{
    public int IdProducto { get; set; }

    public required string Nombre { get; set; }

    public required string Descripcion { get; set; }

    public decimal Precio { get; set; }

    public int Stock { get; set; }

    public required string Imagen { get; set; }

    public int IdCategoria { get; set; }

    public int IdMarca { get; set; }

    public int IdProveedor { get; set; }
}