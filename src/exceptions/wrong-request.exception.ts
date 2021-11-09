import HttpException from './http.exception';

class WrongRequestException extends HttpException {
  constructor(message: string) {
    super(401, `${message}`);
  }
}

export default WrongRequestException;
