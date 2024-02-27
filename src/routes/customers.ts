import { badRequest } from "@hapi/boom";
import { Router } from "express";
import { z } from "zod";
import { pool } from "../app";

const router = Router();

router.get(
	"/customers/:id",
	(req, _res, next) => {
		const reqParamCustomer = z.object({
		id: z.coerce.number(),
	});

	const { success } = reqParamCustomer.safeParse(req.params);

	if (success) {
		next();
	} else {
		next(badRequest("invalid param"));
	}
},
	async (req, res, next) => {
		try {
			const connection = await pool.getConnection();

			try {
				const result = await connection.query(`
            SELECT
                *
            FROM
                customers
            WHERE
                customers.id = "${req.params.id}"
            ;`);

				res.status(200).json({ result: result.at(0) });
			} catch (error) {
				next(error);
			} finally {
				connection.release();
			}
		} catch (error) {
			next(error);
		}
	},
);

export default router;
