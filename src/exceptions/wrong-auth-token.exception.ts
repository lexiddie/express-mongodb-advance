import HttpException from './http.exception';

class WrongAuthTokenException extends HttpException {
  constructor() {
    super(401, `Wrong Authentication Token`);
  }
}

export default WrongAuthTokenException;
