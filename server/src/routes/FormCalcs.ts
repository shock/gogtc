import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import bcrypt from 'bcrypt';

import FormCalc from '../models/FormCalc';
import { paramMissingError } from '../shared/constants';
import { userMW } from './middleware';


// Init shared
const router = Router().use(userMW);


/******************************************************************************
 *                      Get All Users - "GET /api/form_calcs/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
    const formCalcs = await FormCalc.findAll();
    return res.status(OK).json({formCalcs});
});


/******************************************************************************
 *                       Add One - "POST /api/form_calcs/add"
 ******************************************************************************/

router.post('/add', async (req: Request, res: Response) => {
    // Check parameters
    console.log(req.body)
    const { formCalc } = req.body;
    if (!formCalc) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    // Add new formCalc
    await FormCalc.create(formCalc);
    return res.status(CREATED).end();
});


/******************************************************************************
 *                       Update - "PUT /api/form_calcs/update/:id"
 ******************************************************************************/

router.put('/update/:id', async (req: Request, res: Response) => {
    // Check Parameters
    const { id } = req.params as ParamsDictionary;
    const { formCalc } = req.body;
    if (!formCalc) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    await FormCalc.patch(Number(id), formCalc);
    return res.status(OK).end();
});


/******************************************************************************
 *                    Delete - "DELETE /api/form_calcs/delete/:id"
 ******************************************************************************/

router.delete('/delete/:id', async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary;
    await FormCalc.delete(Number(id));
    return res.status(OK).end();
});


/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
