import { loadEnvConfig } from '@next/env'
 
const projectDir = process.cwd()
const { combinedEnv } = loadEnvConfig(projectDir);
export const envConfig = combinedEnv;