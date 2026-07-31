using Microsoft.Data.SqlClient;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<ConexionDB>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("DuckEE", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("DuckEE");

app.MapPost("/api/registro", (RegistroDTO usuario, ConexionDB db) =>
{
    using var conexion = db.GetConexion();
    conexion.Open();

    string verificar =
        "SELECT COUNT(*) FROM Usuario WHERE Correo = @Correo";

    using var cmdVerificar = new SqlCommand(verificar, conexion);

    cmdVerificar.Parameters.AddWithValue("@Correo", usuario.Correo);

    int existe = (int)cmdVerificar.ExecuteScalar();

    if (existe > 0)
    {
        return Results.BadRequest(new
        {
            mensaje = "Ese correo ya está registrado."
        });
    }

    string sql =
    @"INSERT INTO Usuario
    (
        Correo,
        Contrasena,
        Rol
    )

    VALUES

    (
        @Correo,
        @Contrasena,
        'Cliente'
    )";

    using var cmd = new SqlCommand(sql, conexion);

    cmd.Parameters.AddWithValue("@Correo", usuario.Correo);
    cmd.Parameters.AddWithValue("@Contrasena", usuario.Contrasena);

    cmd.ExecuteNonQuery();

    return Results.Ok(new
    {
        mensaje = "Cuenta creada correctamente."
    });

});

app.MapPost("/api/login", (LoginDTO usuario, ConexionDB db) =>
{
    using var conexion = db.GetConexion();

    conexion.Open();

    string sql =
    @"SELECT
        IdUsuario,
        Correo,
        Rol

      FROM Usuario

      WHERE Correo=@Correo
      AND Contrasena=@Contrasena
      AND Activo = 1";

    using var cmd = new SqlCommand(sql, conexion);

    cmd.Parameters.AddWithValue("@Correo", usuario.Correo);
    cmd.Parameters.AddWithValue("@Contrasena", usuario.Contrasena);

    using var lector = cmd.ExecuteReader();

    if (!lector.Read())
    {
        return Results.BadRequest(new
        {
            mensaje = "Correo o contraseña incorrectos."
        });
    }

    int idUsuario = Convert.ToInt32(lector["IdUsuario"]);
    string correo = lector["Correo"].ToString()!;
    string rol = lector["Rol"].ToString()!;

    lector.Close();

    string actualizar =
        @"UPDATE Usuario
          SET UltimoAcceso = GETDATE()
          WHERE IdUsuario = @Id";

    using var cmdActualizar = new SqlCommand(actualizar, conexion);

    cmdActualizar.Parameters.AddWithValue("@Id", idUsuario);

    cmdActualizar.ExecuteNonQuery();

    return Results.Ok(new
    {
        id = idUsuario,
        correo,
        rol
    });

});

app.MapGet("/api/productos", (ConexionDB db) =>
{
    List<object> productos = new();

    using var conexion = db.GetConexion();

    conexion.Open();

    string sql =
    @"SELECT
        P.IdProducto,
        P.Nombre,
        P.Descripcion,
        P.Precio,
        P.Stock,
        P.Imagen,
        C.Nombre AS Categoria,
        M.Nombre AS Marca

      FROM Productos P

      INNER JOIN Categorias C
        ON P.IdCategoria = C.IdCategoria

      INNER JOIN Marcas M
        ON P.IdMarca = M.IdMarca

      WHERE Estado = 1";

    using var cmd = new SqlCommand(sql, conexion);

    using var lector = cmd.ExecuteReader();

    while (lector.Read())
    {
        productos.Add(new
        {
            id = lector["IdProducto"],
            nombre = lector["Nombre"],
            descripcion = lector["Descripcion"],
            precio = lector["Precio"],
            stock = lector["Stock"],
            imagen = lector["Imagen"],
            categoria = lector["Categoria"],
            marca = lector["Marca"]
        });
    }

    return Results.Ok(productos);

});

app.MapPost("/api/producto", (ProductoDTO producto, ConexionDB db) =>
{
    using var conexion = db.GetConexion();

    conexion.Open();

    string sql =
    @"INSERT INTO Productos
    (
        Nombre,
        Descripcion,
        Precio,
        Stock,
        Imagen,
        IdCategoria,
        IdMarca,
        IdProveedor
    )

    VALUES
    (
        @Nombre,
        @Descripcion,
        @Precio,
        @Stock,
        @Imagen,
        @Categoria,
        @Marca,
        @Proveedor
    )";

    using var cmd = new SqlCommand(sql, conexion);

    cmd.Parameters.AddWithValue("@Nombre", producto.Nombre);
    cmd.Parameters.AddWithValue("@Descripcion", producto.Descripcion);
    cmd.Parameters.AddWithValue("@Precio", producto.Precio);
    cmd.Parameters.AddWithValue("@Stock", producto.Stock);
    cmd.Parameters.AddWithValue("@Imagen", producto.Imagen);
    cmd.Parameters.AddWithValue("@Categoria", producto.IdCategoria);
    cmd.Parameters.AddWithValue("@Marca", producto.IdMarca);
    cmd.Parameters.AddWithValue("@Proveedor", producto.IdProveedor);

    cmd.ExecuteNonQuery();

    return Results.Ok(new
    {
        mensaje = "Producto agregado correctamente."
    });

});

app.MapPut("/api/producto/{id}",

(int id,
ProductoDTO producto,
ConexionDB db) =>
{

    using var conexion = db.GetConexion();

    conexion.Open();

    string existeSql =
    "SELECT COUNT(*) FROM Productos WHERE IdProducto=@Id";

    using var existeCmd =
        new SqlCommand(existeSql, conexion);

    existeCmd.Parameters.AddWithValue("@Id", id);

    int existe = (int)existeCmd.ExecuteScalar();

    if (existe == 0)
    {
        return Results.NotFound(new
        {
            mensaje = "Producto no encontrado."
        });
    }

    string sql =
    @"UPDATE Productos

    SET

    Nombre=@Nombre,

    Descripcion=@Descripcion,

    Precio=@Precio,

    Stock=@Stock,

    Imagen=@Imagen,

    IdCategoria=@Categoria,

    IdMarca=@Marca,

    IdProveedor=@Proveedor

    WHERE IdProducto=@Id";

    using var cmd = new SqlCommand(sql, conexion);

    cmd.Parameters.AddWithValue("@Id", id);
    cmd.Parameters.AddWithValue("@Nombre", producto.Nombre);
    cmd.Parameters.AddWithValue("@Descripcion", producto.Descripcion);
    cmd.Parameters.AddWithValue("@Precio", producto.Precio);
    cmd.Parameters.AddWithValue("@Stock", producto.Stock);
    cmd.Parameters.AddWithValue("@Imagen", producto.Imagen);
    cmd.Parameters.AddWithValue("@Categoria", producto.IdCategoria);
    cmd.Parameters.AddWithValue("@Marca", producto.IdMarca);
    cmd.Parameters.AddWithValue("@Proveedor", producto.IdProveedor);

    cmd.ExecuteNonQuery();

    return Results.Ok(new
    {
        mensaje = "Producto actualizado."
    });

});

app.MapDelete("/api/producto/{id}",

(int id, ConexionDB db) =>
{

    using var conexion = db.GetConexion();

    conexion.Open();

    string existeSql =
    "SELECT COUNT(*) FROM Productos WHERE IdProducto=@Id";

    using var existeCmd =
        new SqlCommand(existeSql, conexion);

    existeCmd.Parameters.AddWithValue("@Id", id);

    int existe = (int)existeCmd.ExecuteScalar();

    if (existe == 0)
    {
        return Results.NotFound(new
        {
            mensaje = "Producto no encontrado."
        });
    }

    string sql =
    @"UPDATE Productos

      SET Estado = 0

      WHERE IdProducto=@Id";

    using var cmd =
        new SqlCommand(sql, conexion);

    cmd.Parameters.AddWithValue("@Id", id);

    cmd.ExecuteNonQuery();

    return Results.Ok(new
    {
        mensaje = "Producto eliminado."
    });

});

app.MapGet("/api/producto/{id}",

(int id, ConexionDB db) =>
{

    using var conexion = db.GetConexion();

    conexion.Open();

    string sql =
    @"SELECT *

      FROM Productos

      WHERE IdProducto=@Id

      AND Estado=1";

    using var cmd =
        new SqlCommand(sql, conexion);

    cmd.Parameters.AddWithValue("@Id", id);

    using var lector =
        cmd.ExecuteReader();

    if (!lector.Read())
    {
        return Results.NotFound(new
        {
            mensaje = "Producto no encontrado."
        });
    }

    return Results.Ok(new
    {
        id = lector["IdProducto"],
        nombre = lector["Nombre"],
        descripcion = lector["Descripcion"],
        precio = lector["Precio"],
        stock = lector["Stock"],
        imagen = lector["Imagen"],
        categoria = lector["IdCategoria"],
        marca = lector["IdMarca"],
        proveedor = lector["IdProveedor"]
    });

});

app.Run();