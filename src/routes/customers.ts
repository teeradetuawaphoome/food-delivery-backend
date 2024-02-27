import { badRequest } from "@hapi/boom";
import { Router } from "express";
import mysql from "mysql2/promise";
import { z } from "zod";
import { pool } from "../app";

const router = Router();
const schema = z.object({
	id: z.coerce.number(),
});

router.get(
	"/customers/:id",
	(req, _res, next) => {
		const { success } = schema.safeParse(req.params);

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
			const sqlSelect = "SELECT *";
			const sqlFrom = "FROM customers";
			const sqlWhere = `WHERE customers.id = ${mysql.escape(req.params.id)}`;
			const sqlCommand = `${sqlSelect} ${sqlFrom} ${sqlWhere}`;

			const [data, _metaData] = await connection.query(sqlCommand);
			res.status(200).json({ result: data });
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
