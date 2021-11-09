import { object, string } from 'zod';

const payload = {
  body: object({
    email: string({
      required_error: 'Email is required'
    }),
    password: string({
      required_error: 'Password is required'
    })
  })
};

export const createSessionSchema = object({ ...payload });
