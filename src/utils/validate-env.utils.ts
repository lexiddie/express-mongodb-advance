import { cleanEnv, port, str } from 'envalid';

const validateEnv = () => {
  return cleanEnv(process.env, {
    DB_CONNECTION: str(),
    PORT: port()
  });
};

export default validateEnv;
