import { Log } from './logger';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJoaW1hbnNodXNpbmdoYXN3YWwuMjIwMTEyNzc3QGdlaHUuYWMuaW4iLCJleHAiOjE3NTI1NTczMjIsImlhdCI6MTc1MjU1NjQyMiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjIzN2RlNWM5LTQ0OWMtNDgzMC1iMmY2LTFkOTcyYWRhNzYxMyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImhpbWFuc2h1IHNpbmdoIGFzd2FsIiwic3ViIjoiMDQzYzEyYTAtN2E5Yi00YmNiLWI1ZjEtMzQ3MWJiODI5NWY5In0sImVtYWlsIjoiaGltYW5zaHVzaW5naGFzd2FsLjIyMDExMjc3N0BnZWh1LmFjLmluIiwibmFtZSI6ImhpbWFuc2h1IHNpbmdoIGFzd2FsIiwicm9sbE5vIjoiMjIxODg1OCIsImFjY2Vzc0NvZGUiOiJRQWhEVXIiLCJjbGllbnRJRCI6IjA0M2MxMmEwLTdhOWItNGJjYi1iNWYxLTM0NzFiYjgyOTVmOSIsImNsaWVudFNlY3JldCI6InZERWR3VmJFV1lZUEhLU3UifQ.aGsjv1jmDaskmlPy4vtSkm4id-u0-ZB7NVTjLIeQf0M';

(async () => {
  try {
    await Log('backend', 'info', 'middleware', 'Logger test message', token);
    // If no error, log was sent successfully
  } catch (err) {
    // Handle error if needed
  }
})(); 