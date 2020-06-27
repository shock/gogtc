import { Request, Response, NextFunction } from 'express';
import { UNAUTHORIZED } from 'http-status-codes';

import { UserRoles } from '../client_server/interfaces/User';
import { cookieProps } from '../shared/constants';
import { JwtService } from '../shared/JwtService';



const jwtService = new JwtService();


// Middleware to verify if user is an admin
export const adminMW = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Get json-web-token
		const jwt = req.cookies[cookieProps.key];
		if (!jwt) {
			throw Error('JWT not present in signed cookie.');
		}
		// Make sure user role is an admin
		const clientData = await jwtService.decodeJwt(jwt);
		if (clientData.role === UserRoles.Admin) {
			res.locals.userId = clientData.id;
			next();
		} else {
			throw Error('JWT not present in signed cookie.');
		}
	} catch (err) {
		return res.status(UNAUTHORIZED).json({
			error: err.message,
		});
	}
};

// Middleware to verify if user is an admin
export const userMW = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Get json-web-token
		const jwt = req.cookies[cookieProps.key];

		if (!jwt) {
			throw Error('JWT not present in signed cookie.');
		}
		// we have a web token, set the userId in req.locals
		const clientData = await jwtService.decodeJwt(jwt);

		res.locals.userId = clientData.id;
		if (clientData.role === UserRoles.Admin) {
			res.locals.admin = true;
		}
		next();
	} catch (err) {
		return res.status(UNAUTHORIZED).json({
			error: err.message,
		});
	}
};
