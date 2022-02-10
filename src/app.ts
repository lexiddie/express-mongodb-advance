import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import config from 'config';
import responseTime from 'response-time';
import log from './logger';
import connectDb from './db/connect';
import Controller from './interfaces/controller.interface';
import { errorMiddleware, deserializeUser } from './middleware';
import helmet from 'helmet';
import { restResponseTimeHistogram } from './utils/metrics.utils';
import swaggerDocs from './utils/swagger';

const port = config.get('port') as number;
const host = config.get('host') as string;

class App {
  public app: Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    connectDb();

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(port, host, () => {
      log.info(`Server listing at http://${host}:${port}`);
      swaggerDocs(this.app, port);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(helmet());
    this.app.use(deserializeUser);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

    this.app.use(
      responseTime((req: Request, res: Response, time: number) => {
        if (req?.route?.path) {
          restResponseTimeHistogram.observe(
            {
              method: req.method,
              route: req.route.path,
              status_code: res.statusCode
            },
            time * 1000
          );
        }
      })
    );
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/api', controller.router);
    });
  }
}

export default App;
