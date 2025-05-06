import  express  from "express";
import { db_pool } from "../../db-pool.js";
const normsRouter = express.Router();

// GET all users
normsRouter.get("/", async (req, res) => {
let client;
  try {
    client = await db_pool.connect();
    const result = await client.query('SELECT * from cerpschema.norms_header_table');
    console.log("norms", result.rows[0]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query:', err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (client) client.release();
 
  }
});

normsRouter.get("/:aid", async (req, res) => {
let client;
  try {
    client = await db_pool.connect();
    const result = await client.query('SELECT * from cerpschema.norms_header_table where norm_id = $1', [req.params.aid]);
    console.log("norms:", result.rows[0]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query:', err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (client) client.release();
 
  }
});

// POST create new user
normsRouter.post("/", async(req, res) => {
  let client;
  const {norm_group_id,norm_category_id, norm_title,description,norm_unit,remark,source} = req.body;
  console.log("data", req.body)
  try {
    client = await db_pool.connect();
    const result = await client.query(
      `INSERT INTO cerpschema.norms_header_table(norm_group_id,norm_category_id, norm_title,description,norm_unit,remark,source) 
      VALUES ($1, $2,$3,$4,$5,$6,$7) RETURNING *`,
      [ norm_group_id,norm_category_id,norm_title,description,norm_unit,remark,source]
    );
    console.log("norms:", result.rows[0]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query:', err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (client) client.release();
 
  }
});




export default normsRouter;