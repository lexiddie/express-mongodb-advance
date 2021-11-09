import HttpException from './http.exception';

class AuthenticationTokenException extends HttpException {
  constructor() {
    super(401, `Authentication Token's Missing!🤒`);
  }
}

export default AuthenticationTokenException;
