// Environment validation and configuration
export const env = {
  SUPABASE_URL: "https://ymfejiadehbsezxmgtuq.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltZmVqaWFkZWhic2V6eG1ndHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMTMyMzgsImV4cCI6MjA2ODY4OTIzOH0.dOyY92Jzgy1_AG4O1klOcFQ5YcwuAFjHbbzwEUDcLzY",
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

// Validate required environment variables
function validateEnv() {
  const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'] as const;
  
  for (const key of required) {
    if (!env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}

// Run validation on module load
validateEnv();

export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';