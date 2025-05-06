import { Router } from "express";
import { db_pool } from "../../db-pool.js";
 

const router = Router();

// In-memory "database"
let resources = [
  { id: 1, name: "sand", unit: "m" },
  { id: 2, name: "cement", unit: "kg" },
 
];

// GET all resources
router.get("/", async (req, res) => {
let client;
  try {
    client = await db_pool.connect();
    const result = await client.query('SELECT * from cerpschema.items');
    console.log("resources:", result.rows[0]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query:', err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (client) client.release();
 
  }
 
  
});
 

// GET single user
router.get("/:aid", async (req, res) => {
let client;
  try {
    client = await db_pool.connect();
    const result = await client.query('SELECT * from cerpschema.items where item_id = $1', [req.params.aid]);
    console.log("resources:", result.rows[0]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query:', err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (client) client.release();
 
  }
});

// POST create new res
router.post("/", (req, res) => {
  const newres = {
    id: resources.length + 1,
    name: req.body.name,
    unit: req.body.unit,
  };
  resources.push(newres);
  res.status(201).json(newres);
});

// PUT update user
router.put("/:id", (req, res) => {
  const resource = resources.find((u) => u.id === parseInt(req.params.id));
  if (!resource) return res.status(404).json({ message: "User not found" });

  resource.name = req.body.name || resource.name;
  resource.unit = req.body.email || resource.email;

  res.json(resource);
});

// DELETE user
router.delete("/:id", (req, res) => {
  resources = resources.filter((u) => u.id !== parseInt(req.params.id));
  res.json({ message: "resource deleted" });
});

export default router;
