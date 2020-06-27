import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import bcrypt from 'bcrypt';

// import UserDao from '../daos/User/UserDao.mock';
import User from '../models/User';
import { paramMissingError } from '../shared/constants';
import { adminMW } from './middleware';
import { UserRoles } from '../client_server/interfaces/User';


// Init shared
const router = Router().use(adminMW);


/******************************************************************************
 *                      Get All Users - "GET /api/users/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
    const users = await User.findAll();
    return res.status(OK).json({users});
});


/******************************************************************************
 *                       Add One - "POST /api/users/add"
 ******************************************************************************/

router.post('/add', async (req: Request, res: Response) => {
    // Check parameters
    const { user } = req.body;
    if (!user) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    // Add new user
    user.role = UserRoles.Standard;
    const newUser = await User.create(user)
    return res.status(CREATED).json(newUser)
});


/******************************************************************************
 *                       Update - "PUT /api/users/update/:id"
 ******************************************************************************/

router.put('/update/:id', async (req: Request, res: Response) => {
    // Check Parameters
    const { id } = req.params as ParamsDictionary;
    const { user } = req.body;
    if (!user) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    await User.patch(Number(id), user);
    return res.status(OK).end();
});


/******************************************************************************
 *                    Delete - "DELETE /api/users/delete/:id"
 ******************************************************************************/

router.delete('/delete/:id', async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary;
    await User.delete(Number(id));
    return res.status(OK).end();
});


/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
