// Environment variables imported from .env file

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  NODE_PORT: process.env.NODE_PORT || process.env.SERVER_PORT || 8080
}
