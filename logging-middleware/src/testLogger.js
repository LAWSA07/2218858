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
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJoaW1hbnNodXNpbmdoYXN3YWwuMjIwMTEyNzc3QGdlaHUuYWMuaW4iLCJleHAiOjE3NTI1NTczMjIsImlhdCI6MTc1MjU1NjQyMiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjIzN2RlNWM5LTQ0OWMtNDgzMC1iMmY2LTFkOTcyYWRhNzYxMyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImhpbWFuc2h1IHNpbmdoIGFzd2FsIiwic3ViIjoiMDQzYzEyYTAtN2E5Yi00YmNiLWI1ZjEtMzQ3MWJiODI5NWY5In0sImVtYWlsIjoiaGltYW5zaHVzaW5naGFzd2FsLjIyMDExMjc3N0BnZWh1LmFjLmluIiwibmFtZSI6ImhpbWFuc2h1IHNpbmdoIGFzd2FsIiwicm9sbE5vIjoiMjIxODg1OCIsImFjY2Vzc0NvZGUiOiJRQWhEVXIiLCJjbGllbnRJRCI6IjA0M2MxMmEwLTdhOWItNGJjYi1iNWYxLTM0NzFiYjgyOTVmOSIsImNsaWVudFNlY3JldCI6InZERWR3VmJFV1lZUEhLU3UifQ.aGsjv1jmDaskmlPy4vtSkm4id-u0-ZB7NVTjLIeQf0M';
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, logger_1.Log)('backend', 'info', 'middleware', 'Logger test message', token);
        // If no error, log was sent successfully
    }
    catch (err) {
        // Handle error if needed
    }
}))();
