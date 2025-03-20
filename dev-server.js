import express from 'express';
import { createServer as createViteServer } from 'vite';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Create Vite server in middleware mode for hot-reloading
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
    root: path.resolve(__dirname),
  });

  // Use Vite's connect instance as middleware
  app.use(vite.middlewares);

  // Start the backend server as a child process on a different port
  const serverProcess = spawn('node', ['index.js'], {
    cwd: path.join(__dirname, 'server'),
    stdio: 'inherit',
    env: { ...process.env, PORT: 3001 } // Changed to 3001 to avoid port conflict
  });

  // Handle server process exit
  serverProcess.on('exit', (code) => {
    console.log(`Backend server exited with code ${code}`);
    process.exit(code);
  });

  // Handle process termination (Ctrl+C)
  process.on('SIGINT', () => {
    serverProcess.kill('SIGINT');
    vite.close();
    process.exit(0);
  });

  // Start the development server
  app.listen(PORT, () => {
    console.log(`Development server running at http://localhost:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Error starting development server:', err);
  process.exit(1);
});