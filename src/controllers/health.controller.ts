import { Request, Response, Router } from 'express';
import { getSuccessResponse } from '../utils/response.utils';
import Controller from '../interfaces/controller.interface';

class HealthController implements Controller {
  public path = '/health';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  /**
   * @openapi
   * /health:
   *  get:
   *     tags:
   *     - health
   *     description: Responds if the app is up and running
   *     responses:
   *       200:
   *         description: App is up and running
   *         content:
   *          application/json:
   *           schema:
   *            type: object
   *            properties:
   *             status:
   *              type: integer
   *              default: 200
   *             message:
   *              type: string
   *              default: success
   *             data:
   *              type: object
   *              default: ok
   */

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.checkHealthHandler);
  }

  private checkHealthHandler = (req: Request, res: Response) => {
    return res.json(getSuccessResponse('Ok'));
  };
}

export default HealthController;
