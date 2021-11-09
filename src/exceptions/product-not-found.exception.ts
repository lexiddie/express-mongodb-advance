import HttpException from './http.exception';

class ProductNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Product with ID: ${id} not found!`);
  }
}

export default ProductNotFoundException;
