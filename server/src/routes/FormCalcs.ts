import { Request, Response, Router } from 'express'
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes'
import { ParamsDictionary } from 'express-serve-static-core'

import FormCalc from '../models/FormCalc'
import { paramMissingError } from '../shared/constants'
import { userMW } from './middleware'


// Init shared
const router = Router().use(userMW)


/******************************************************************************
 *                      Get All FormCalcs - "GET /api/form_calcs/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
  const formCalcs = await FormCalc.findAll().where('preset', true)
  return res.status(OK).json({ formCalcs })
})


/******************************************************************************
 *              Get FormCalcs by user id - "GET /api/form_calcs/user"
 ******************************************************************************/

router.get('/user', async (req: Request, res: Response) => {
  const user_id = parseInt(res.locals.userId)
  const formCalcs = await FormCalc.query().where('preset', true).orWhere('user_id', user_id).orderBy('form_calcs.id', 'ASC')
  return res.status(OK).json({ formCalcs })
})


/******************************************************************************
 *                Create Calc - "POST /api/form_calcs/create"
 ******************************************************************************/

router.post('/create', async (req: Request, res: Response) => {
  // Check parameters
  const formCalc = new FormCalc
  formCalc.name = req.body.name
  formCalc.json = req.body.json
  const user_id = res.locals.userId
  formCalc.user_id = user_id
  try {
    formCalc.$validate()
  } catch (err) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    })
  }
  const newFormCalc = await FormCalc.create(formCalc)
  return res.status(CREATED).json(newFormCalc)
})


/******************************************************************************
 *                       Update - "PUT /api/form_calcs/update/:id"
 ******************************************************************************/

router.put('/update/:id', async (req: Request, res: Response) => {
  // Check Parameters
  const { id } = req.params as ParamsDictionary
  const formCalc = req.body
  if (!formCalc) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    })
  }
  if(formCalc.id) { formCalc.id = Number(formCalc.id) }
  if(formCalc.user_id) { formCalc.user_id = Number(formCalc.user_id) }
  try {
    const rowsUpdated = await FormCalc.patch(Number(id), formCalc)
    return res.status(OK).json(rowsUpdated)
  } catch(err) {
    return res.status(BAD_REQUEST).json({
      error: err.toString(),
    })
  }
})


/******************************************************************************
 *                    Delete - "DELETE /api/form_calcs/delete/:id"
 ******************************************************************************/

router.delete('/delete/:id', async (req: Request, res: Response) => {
  const { id } = req.params as ParamsDictionary
  await FormCalc.delete(Number(id))
  return res.status(OK).end()
})


/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router
