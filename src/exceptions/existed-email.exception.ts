import HttpException from './http.exception';

class ExistedEmailException extends HttpException {
  constructor(email: string) {
    super(400, `User with an email ${email} already exists`);
  }
}

export default ExistedEmailException;
