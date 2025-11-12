import pg from 'pg';
import dotenv from 'dotenv';
import parse from 'pg-connection-string';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from project root (one level up from server/)
dotenv.config({ path: join(__dirname, '..', '.env') });

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL?.trim() || '';

if (!connectionString) {
  console.error('❌ DATABASE_URL não encontrada no arquivo .env');
  console.error('💡 Certifique-se de que o arquivo .env existe na raiz do projeto');
  process.exit(1);
}

// Parse connection string to ensure password is handled correctly
let poolConfig: any;

try {
  // Parse the connection string
  const config = parse.parse(connectionString);
  
  // Ensure password is a string
  if (config.password === undefined || config.password === null) {
    throw new Error('Password not found in connection string');
  }
  
  // Build pool config
  poolConfig = {
    ...config,
    password: String(config.password), // Ensure password is a string
    ssl: connectionString.includes('neon.tech') ? {
      rejectUnauthorized: false
    } : false
  };
  
  console.log('🔗 Connecting to:', config.host);
} catch (parseError) {
  // Fallback to connection string if parsing fails
  console.log('⚠️  Could not parse connection string, using directly');
  poolConfig = {
    connectionString: connectionString.trim(),
    ssl: connectionString.includes('neon.tech') ? {
      rejectUnauthorized: false
    } : false
  };
}

const pool = new Pool(poolConfig);

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to database:', err);
    console.error('Connection string (masked):', connectionString.replace(/:[^:@]+@/, ':****@'));
  } else {
    console.log('✅ Connected to database successfully');
  }
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;

