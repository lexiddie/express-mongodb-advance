import 'dotenv/config';
import App from './app';
import HealthController from './controllers/health.controller';
import SessionController from './controllers/session.controller';
import UserController from './controllers/user.controller';
import ProductController from './controllers/product.controller';
import validateEnv from './utils/validate-env.utils';
import { startMetricsServer } from './utils/metrics.utils';

validateEnv();

const app = new App([new HealthController(), new UserController(), new SessionController(), new ProductController()]);

app.listen();

startMetricsServer();
