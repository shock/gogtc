import bcrypt from 'bcrypt';
import { Request, Response, Router } from 'express';
import { BAD_REQUEST, OK, UNAUTHORIZED } from 'http-status-codes';

// import UserDao from '../daos/User/UserDao.mock';
import User from '../models/User';
import { JwtService } from '../shared/JwtService';
import { paramMissingError, loginFailedErr, cookieProps } from '../shared/constants';


const router = Router();
const jwtService = new JwtService();


/******************************************************************************
 *                      Login User - "POST /api/auth/login"
 ******************************************************************************/

router.post('/login', async (req: Request, res: Response) => {
  // Check email and password present
  const { email, password } = req.body;
  if (!(email && password)) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  // Fetch user
  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(UNAUTHORIZED).json({
      error: loginFailedErr,
    });
  }
  // Check password
  const pwdPassed = await bcrypt.compare(password, user.pwdHash);
  if (!pwdPassed) {
    return res.status(UNAUTHORIZED).json({
      error: loginFailedErr,
    });
  }
  // Setup Admin Cookie
  const jwt = await jwtService.getJwt({
    id: user.id,
    role: user.role,
  });
  const { key, options } = cookieProps;
  res.cookie(key, jwt, options);
  // Return
  delete user.password
  return res.status(OK).json({ user });
});


/******************************************************************************
 *                      Logout - "GET /api/auth/logout"
 ******************************************************************************/

router.get('/logout', async (req: Request, res: Response) => {
  const { key, options } = cookieProps;
  res.clearCookie(key, {
    path: options.path,
    domain: options.domain
  });
  console.log(res);
  return res.status(OK).end();
});


/******************************************************************************
 *                                 Export Router
 ******************************************************************************/

export default router;
