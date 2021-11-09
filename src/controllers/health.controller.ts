import { Request, Response, Router } from 'express';
import { getSuccessResponse } from '../utils/response.utils';
import Controller from '../interfaces/controller.interface';

class HealthController implements Controller {
  public path = '/health';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.checkHealthHandler);
  }

  private checkHealthHandler = (req: Request, res: Response) => {
    return res.json(getSuccessResponse('Ok'));
  };
}

export default HealthController;
