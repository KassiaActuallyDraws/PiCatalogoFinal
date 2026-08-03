using Microsoft.Data.SqlClient;

public class ConexionDB
{
    private readonly string cadenaConexion;

    public ConexionDB(IConfiguration configuration)
    {
        cadenaConexion = configuration.GetConnectionString("DuckEE");
    }

    public SqlConnection GetConexion()
    {
        return new SqlConnection(cadenaConexion);
    }
}