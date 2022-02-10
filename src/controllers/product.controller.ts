import { Request, Response, NextFunction, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import { requireUser, validateResource } from '../middleware';
import { CreateProductInput, UpdateProductInput, createProductSchema, updateProductSchema, deleteProductSchema, getProductSchema } from '../schemas/product.schema';
import { createProduct, deleteProduct, findAndUpdateProduct, findProduct } from '../services/product.services';
import { getSuccessResponse } from '../utils/response.utils';
import NotAuthorizedException from '../exceptions/not-authorized.exception';
import ProductNotFoundException from '../exceptions/product-not-found.exception';

class ProductController implements Controller {
  public path = '/products';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @openapi
     * /products:
     *  post:
     *     tags:
     *     - Products
     *     summary: creat a product
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *              $ref: '#/components/schemas/CreateProductInput'
     *     responses:
     *       401:
     *          description: Token Authentication Token's Missing
     *       403:
     *          description: You're not authorized
     *       200:
     *         description: create product is successful
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
     *              default: Success
     *             data:
     *              type: object
     *              properties:
     *                _id:
     *                 type: string
     *                 default: 620472c3827c94a75690d050
     *                user:
     *                 type: string
     *                 default: 620472b7827c94a75690d04a
     *                productId:
     *                 type: string
     *                 default: product_y5du6tlmuf
     *                title:
     *                 type: string
     *                 default: Canon EOS 1500D DSLR Camera with 18-55mm Lens
     *                price:
     *                 type: double
     *                 default: 879.99
     *                description:
     *                 type: string
     *                 default: Designed for first-time DSLR owners who want impressive results straight out of the box
     *                image:
     *                 type: string
     *                 default: https://i.imgur.com/QlRphfQ.jpg
     *                createdAt:
     *                 type: string
     *                 default: 2022-02-10T02:04:51.666Z
     *                updatedAt:
     *                 type: string
     *                 default: 2022-02-10T02:04:51.666Z
     */

    this.router.post(`${this.path}`, [requireUser, validateResource(createProductSchema)], this.createProductHandler);
    this.router.put(`${this.path}/:productId`, [requireUser, validateResource(updateProductSchema)], this.updateProductHandler);
    this.router.get(`${this.path}/:productId`, validateResource(getProductSchema), this.getProductHandler);
    this.router.delete(`${this.path}/:productId`, [requireUser, validateResource(deleteProductSchema)], this.deleteProductHandler);
  }

  private createProductHandler = async (req: Request<{}, {}, CreateProductInput['body']>, res: Response, next: NextFunction) => {
    const userId = res.locals.user._id;
    const body = req.body;

    const product = await createProduct({ ...body, user: userId });

    return res.json(getSuccessResponse(product));
  };

  private updateProductHandler = async (req: Request<UpdateProductInput['params']>, res: Response, next: NextFunction) => {
    const userId = res.locals.user._id;
    const productId = req.params.productId;
    const update = req.body;

    const product = await findProduct({ productId });

    if (!product) {
      return next(new ProductNotFoundException(productId));
    }

    if (String(product.user) !== String(userId)) {
      return next(new NotAuthorizedException());
    }

    const updateProduct = await findAndUpdateProduct({ productId }, update, { new: true });

    return res.json(getSuccessResponse(updateProduct));
  };

  private getProductHandler = async (req: Request<UpdateProductInput['params']>, res: Response, next: NextFunction) => {
    const productId = req.params.productId;
    const product = await findProduct({ productId });

    if (!product) {
      return next(new ProductNotFoundException(productId));
    }

    return res.json(getSuccessResponse(product));
  };

  private deleteProductHandler = async (req: Request<UpdateProductInput['params']>, res: Response, next: NextFunction) => {
    const userId = res.locals.user._id;
    const productId = req.params.productId;

    const product = await findProduct({ productId });

    if (!product) {
      return next(new ProductNotFoundException(productId));
    }

    if (String(product.user) !== String(userId)) {
      return next(new NotAuthorizedException());
    }

    await deleteProduct({ productId });

    return res.json(getSuccessResponse(`${productId} is deleted successful`));
  };
}

export default ProductController;
