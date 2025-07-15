"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = Log;
const axios_1 = __importDefault(require("axios"));
// Allowed values
const stacks = ['backend', 'frontend'];
const levels = ['debug', 'info', 'warn', 'error', 'fatal'];
const backendPackages = ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'];
const frontendPackages = ['api', 'component', 'hook', 'page', 'state', 'style'];
const commonPackages = ['auth', 'config', 'middleware', 'utils'];
function isValidStack(stack) {
    return stacks.includes(stack);
}
function isValidLevel(level) {
    return levels.includes(level);
}
function isValidPackage(pkg, stack) {
    if (commonPackages.includes(pkg))
        return true;
    if (stack === 'backend' && backendPackages.includes(pkg))
        return true;
    if (stack === 'frontend' && frontendPackages.includes(pkg))
        return true;
    return false;
}
function Log(stack, level, pkg, message, token) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!isValidStack(stack))
            throw new Error(`Invalid stack: ${stack}`);
        if (!isValidLevel(level))
            throw new Error(`Invalid level: ${level}`);
        if (!isValidPackage(pkg, stack))
            throw new Error(`Invalid package: ${pkg} for stack: ${stack}`);
        if (!message)
            throw new Error('Message is required');
        if (!token)
            throw new Error('Token is required');
        try {
            yield axios_1.default.post('http://20.244.56.144/evaluation-service/logs', {
                stack,
                level,
                package: pkg,
                message,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
        }
        catch (error) {
            // Optionally, handle/log error locally (but do not use console.log)
            // For now, just rethrow
            throw error;
        }
    });
}
