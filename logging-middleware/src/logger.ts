import axios from 'axios';

// Allowed values
const stacks = ['backend', 'frontend'] as const;
const levels = ['debug', 'info', 'warn', 'error', 'fatal'] as const;
const backendPackages = ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'] as const;
const frontendPackages = ['api', 'component', 'hook', 'page', 'state', 'style'] as const;
const commonPackages = ['auth', 'config', 'middleware', 'utils'] as const;

export type Stack = typeof stacks[number];
export type Level = typeof levels[number];
export type BackendPackage = typeof backendPackages[number];
export type FrontendPackage = typeof frontendPackages[number];
export type CommonPackage = typeof commonPackages[number];
export type Package = BackendPackage | FrontendPackage | CommonPackage;

interface LogParams {
  stack: Stack;
  level: Level;
  package: Package;
  message: string;
  token: string;
}

function isValidStack(stack: string): stack is Stack {
  return stacks.includes(stack as Stack);
}
function isValidLevel(level: string): level is Level {
  return levels.includes(level as Level);
}
function isValidPackage(pkg: string, stack: Stack): pkg is Package {
  if (commonPackages.includes(pkg as CommonPackage)) return true;
  if (stack === 'backend' && backendPackages.includes(pkg as BackendPackage)) return true;
  if (stack === 'frontend' && frontendPackages.includes(pkg as FrontendPackage)) return true;
  return false;
}

export async function Log(stack: string, level: string, pkg: string, message: string, token: string): Promise<void> {
  if (!isValidStack(stack)) throw new Error(`Invalid stack: ${stack}`);
  if (!isValidLevel(level)) throw new Error(`Invalid level: ${level}`);
  if (!isValidPackage(pkg, stack as Stack)) throw new Error(`Invalid package: ${pkg} for stack: ${stack}`);
  if (!message) throw new Error('Message is required');
  if (!token) throw new Error('Token is required');

  try {
    await axios.post(
      'http://20.244.56.144/evaluation-service/logs',
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    // Optionally, handle/log error locally (but do not use console.log)
    // For now, just rethrow
    throw error;
  }
} 