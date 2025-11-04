
import pkg from "pg";
import dotenv from "dotenv";

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const { Pool } = pkg;

// Cria o pool de conexões com o PostgreSQL
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_DATABASE || "lorenzo",
  password: process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD) : "",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  ssl: false, // desative se for local
});

// Teste rápido de conexão
pool
  .connect()
  .then((client) => {
    console.log("✅ Conectado ao PostgreSQL com sucesso!");
    client.release();
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar ao PostgreSQL:", err.message);
  });

// Exporta o pool para ser usado em outras partes do projeto
export default pool;
