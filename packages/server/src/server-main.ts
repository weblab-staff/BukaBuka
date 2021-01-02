import { createHttpServer } from './http-server';
import { startSockets } from './socket';
import dotenv from 'dotenv';

dotenv.config({});

const PORT = process.env.PORT || 3000;

const app = createHttpServer();
startSockets(app);

app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`Listening on:`);
  console.log(`  http://localhost:${PORT}/ - client only rendering`);
  console.log(`  http://localhost:${PORT}/server - ssr with hydration`);
  /* eslint-enable no-console */
});

export default app;
