using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;

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

app.UseStaticFiles();

app.MapPost("/api/subir-imagen",
async ([FromForm] IFormFile archivo) =>
{
    if (archivo == null || archivo.Length == 0)
    {
        return Results.BadRequest(new
        {
            mensaje = "No se recibió ninguna imagen."
        });
    }

    var carpeta = Path.Combine(
        Directory.GetCurrentDirectory(),
        "wwwroot",
        "galeria"
    );

    Directory.CreateDirectory(carpeta);

    var nombreArchivo =
        Guid.NewGuid().ToString() +
        Path.GetExtension(archivo.FileName);

    var rutaCompleta =
        Path.Combine(carpeta, nombreArchivo);

    using (var stream = File.Create(rutaCompleta))
    {
        await archivo.CopyToAsync(stream);
    }

    return Results.Ok(new
    {
        ruta = $"galeria/{nombreArchivo}"
    });
});

app.MapPost("/api/registro", (RegistroDTO usuario, ConexionDB db) =>
{
    try
    {
        using var conexion = db.GetConexion();

        conexion.Open();

        string verificar = @"

        SELECT COUNT(*)

        FROM Usuario

        WHERE Usuario=@Usuario

        OR Correo=@Correo";

        using var cmdVerificar =
            new SqlCommand(verificar, conexion);

        cmdVerificar.Parameters.AddWithValue("@Usuario", usuario.Usuario);

        cmdVerificar.Parameters.AddWithValue("@Correo", usuario.Correo);

        int existe = Convert.ToInt32(cmdVerificar.ExecuteScalar());

        if (existe > 0)
        {
            return Results.BadRequest(new
            {
                mensaje = "El usuario o el correo ya están registrados."
            });
        }

        string sql = @"

        INSERT INTO Usuario
        (

            Usuario,

            Correo,

            Contrasena,

            Rol,

            FotoPerfil,

            Activo,

            FechaRegistro

        )

        VALUES
        (

            @Usuario,

            @Correo,

            @Contrasena,

            'Cliente',

            'images/perfiles/default.png',

            1,

            GETDATE()

        )";

        using var cmd =
            new SqlCommand(sql, conexion);

        cmd.Parameters.AddWithValue("@Usuario", usuario.Usuario);

        cmd.Parameters.AddWithValue("@Correo", usuario.Correo);

        cmd.Parameters.AddWithValue("@Contrasena", usuario.Contrasena);

        cmd.ExecuteNonQuery();

        return Results.Ok(new
        {
            mensaje = "Cuenta creada correctamente."
        });

    }
    catch (Exception ex)
    {
        return Results.BadRequest(new
        {
            mensaje = ex.Message
        });
    }

});

app.MapPost("/api/login", (LoginDTO usuario, ConexionDB db) =>
{
    try
    {
        using var conexion = db.GetConexion();

        conexion.Open();

        string sql = @"

        SELECT

            IdUsuario,

            Usuario,

            Correo,

            Rol,

            FotoPerfil,

            Activo

        FROM Usuario

        WHERE Usuario=@Usuario

        AND Contrasena=@Contrasena";

        using var cmd =
            new SqlCommand(sql, conexion);

        cmd.Parameters.AddWithValue("@Usuario", usuario.Usuario);

        cmd.Parameters.AddWithValue("@Contrasena", usuario.Contrasena);

        using var lector = cmd.ExecuteReader();

        if (!lector.Read())
        {
            return Results.BadRequest(new
            {
                mensaje = "Usuario o contraseña incorrectos."
            });
        }

        bool activo = Convert.ToBoolean(lector["Activo"]);

        if (!activo)
        {
            return Results.BadRequest(new
            {
                mensaje = "La cuenta está desactivada."
            });
        }

        int idUsuario = Convert.ToInt32(lector["IdUsuario"]);

        string nombreUsuario = lector["Usuario"].ToString()!;

        string correo = lector["Correo"].ToString()!;

        string rol = lector["Rol"].ToString()!;

        string fotoPerfil = lector["FotoPerfil"].ToString()!;

        lector.Close();

        string actualizar = @"

        UPDATE Usuario

        SET UltimoAcceso = GETDATE()

        WHERE IdUsuario=@Id";

        using var cmdActualizar =
            new SqlCommand(actualizar, conexion);

        cmdActualizar.Parameters.AddWithValue("@Id", idUsuario);

        cmdActualizar.ExecuteNonQuery();

        return Results.Ok(new
        {
            id = idUsuario,

            usuario = nombreUsuario,

            correo = correo,

            rol = rol,

            fotoPerfil = fotoPerfil
        });

    }
    catch (Exception ex)
    {
        return Results.BadRequest(new
        {
            mensaje = ex.ToString()
        });
    }
});

app.MapGet("/api/productos", (ConexionDB db) =>
{
    try
    {
        List<object> productos = new();

        using var conexion = db.GetConexion();

        conexion.Open();

        string sql = @"

        SELECT

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

            ON P.IdCategoria=C.IdCategoria

        INNER JOIN Marcas M

            ON P.IdMarca=M.IdMarca

        WHERE P.Estado=1

        ORDER BY P.Nombre";

        using var cmd =
            new SqlCommand(sql, conexion);

        using var lector =
            cmd.ExecuteReader();

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
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new
        {
            mensaje = ex.Message
        });
    }

});

app.MapPost("/api/producto",

(ProductoDTO producto,
ConexionDB db) =>
{
    try
    {
        using var conexion = db.GetConexion();

        conexion.Open();

        string sql = @"

        INSERT INTO Productos
        (
            Nombre,
            Descripcion,
            Precio,
            Stock,
            Imagen,
            IdCategoria,
            IdMarca,
            IdProveedor,
            Estado
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
            @Proveedor,
            1
        )";

        using var cmd =
            new SqlCommand(sql, conexion);

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

    }
    catch (Exception ex)
    {
        return Results.BadRequest(new
        {
            mensaje = ex.Message
        });
    }

});

app.MapGet("/api/producto/{id}",

(int id, ConexionDB db) =>
{
    try
    {
        using var conexion = db.GetConexion();

        conexion.Open();

        string sql = @"

        SELECT

            IdProducto,
            Nombre,
            Descripcion,
            Precio,
            Stock,
            Imagen,
            IdCategoria,
            IdMarca,
            IdProveedor

        FROM Productos

        WHERE IdProducto=@Id";

        using var cmd = new SqlCommand(sql, conexion);

        cmd.Parameters.AddWithValue("@Id", id);

        using var lector = cmd.ExecuteReader();

        if (!lector.Read())
        {
            return Results.NotFound(new
            {
                mensaje = "Producto no encontrado."
            });
        }

    return Results.Ok(new
    {
        id = Convert.ToInt32(lector["IdProducto"]),
        nombre = lector["Nombre"].ToString(),
        descripcion = lector["Descripcion"].ToString(),
        precio = Convert.ToDecimal(lector["Precio"]),
        stock = Convert.ToInt32(lector["Stock"]),
        imagen = lector["Imagen"].ToString(),
        categoria = Convert.ToInt32(lector["IdCategoria"]),
        marca = Convert.ToInt32(lector["IdMarca"]),
        proveedor = Convert.ToInt32(lector["IdProveedor"])
    });
    }
    catch(Exception ex)
    {
        return Results.BadRequest(new
        {
            mensaje = ex.Message
        });
    }

});

app.MapPut("/api/producto/{id}",

(int id,
ProductoDTO producto,
ConexionDB db) =>
{
    try
    {
        using var conexion = db.GetConexion();

        conexion.Open();

        string sql = @"

        UPDATE Productos

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

        using var cmd =
            new SqlCommand(sql, conexion);

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

    }
    catch (Exception ex)
    {
        return Results.BadRequest(new
        {
            mensaje = ex.Message
        });
    }

});

app.MapDelete("/api/producto/{id}",

(int id,
ConexionDB db) =>
{
    try
    {
        using var conexion = db.GetConexion();

        conexion.Open();

        string sql = @"

        UPDATE Productos

        SET Estado=0

        WHERE IdProducto=@Id";

        using var cmd =
            new SqlCommand(sql, conexion);

        cmd.Parameters.AddWithValue("@Id", id);

        cmd.ExecuteNonQuery();

        return Results.Ok(new
        {
            mensaje = "Producto eliminado."
        });

    }
    catch (Exception ex)
    {
        return Results.BadRequest(new
        {
            mensaje = ex.Message
        });
    }

});

app.MapGet("/api/dashboard", (ConexionDB db) =>
{
    try
    {
        using var conexion = db.GetConexion();

        conexion.Open();

        int productos;
        int categorias;
        int marcas;
        int usuarios;

        using (var cmd = new SqlCommand(
            "SELECT COUNT(*) FROM Productos WHERE Estado = 1",
            conexion))
        {
            productos = Convert.ToInt32(cmd.ExecuteScalar());
        }

        using (var cmd = new SqlCommand(
            "SELECT COUNT(*) FROM Categorias",
            conexion))
        {
            categorias = Convert.ToInt32(cmd.ExecuteScalar());
        }

        using (var cmd = new SqlCommand(
            "SELECT COUNT(*) FROM Marcas",
            conexion))
        {
            marcas = Convert.ToInt32(cmd.ExecuteScalar());
        }

        using (var cmd = new SqlCommand(
            "SELECT COUNT(*) FROM Usuario WHERE Activo = 1",
            conexion))
        {
            usuarios = Convert.ToInt32(cmd.ExecuteScalar());
        }

        return Results.Ok(new
        {
            productos,
            categorias,
            marcas,
            usuarios
        });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new
        {
            mensaje = ex.Message
        });
    }
});

app.Run();