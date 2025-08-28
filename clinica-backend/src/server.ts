import { app } from './app';
import { env } from './env';
app.listen(env.port, () => {
  console.log(`API running on http://localhost:${env.port}`);
});
