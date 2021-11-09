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
