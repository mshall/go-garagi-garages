import { API_ROOT, APP_ROOT } from '../shared/appPaths.ts';
import { createGarageApiApp } from './app.ts';

const port = Number(process.env.GARAGE_API_PORT || process.env.PORT || 8787);
const app = createGarageApiApp();

app.listen(port, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(
    `[garage-api] listening on http://localhost:${port}${API_ROOT} (web root ${APP_ROOT}/)`,
  );
});
