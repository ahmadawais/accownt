import { NextFunction, Response, Request } from 'express';
import { startRegistration } from 'lib/register/start';

export function api_startRegistration(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  startRegistration(req.body.email, req.body.pass, req.body.recaptcha)
    .then(() => res.status(200).json({}))
    .catch(next);
}
