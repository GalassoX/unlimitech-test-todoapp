import { loadEnvFile } from "node:process";

loadEnvFile(".env");

export function getEnvVariable(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} must be defined in environment variables.`);
  }
  return value;
}

export const ENV = {
  MONGODB_URI: getEnvVariable('MONGODB_URI'),
  MONGODB_USERNAME: getEnvVariable('MONGODB_USERNAME'),
  MONGODB_PASSWORD: getEnvVariable('MONGODB_PASSWORD'),
  MONGODB_DATABASE: getEnvVariable('MONGODB_DATABASE'),
  BCRYPT_SALT_ROUNDS: parseInt(getEnvVariable('BCRYPT_SALT_ROUNDS'), 10),
  JWT_SECRET: getEnvVariable('JWT_SECRET'),
};