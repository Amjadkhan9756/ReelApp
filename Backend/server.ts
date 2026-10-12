import 'dotenv/config';
import app from './src/app.js';
import connectDB from './src/db/db.js';

async function startServer(): Promise<void> {
  await connectDB();
  app.listen(8080, () => {
    console.log('server is connected');
  });
}

startServer().catch((error: unknown) => {
  console.error('Server startup error:', error);
  process.exitCode = 1;
});
