import { Router } from "express";
import { db_pool } from "../../db-pool.js";

const normcatagoryRouter = Router();

// In-memory "database"
let normcatagory = [
  { id: 1, name: " Masonry", description: "Masonry" },
  { id: 2, name: "concrete", description: "concrete" },
  { id: 3, name: "wall", description: "wall" },
];

// GET all users

 normcatagoryRouter.get("/", async (req, res) => {
  let client;
    try {
      client = await db_pool.connect();
      const result = await client.query('SELECT * from cerpschema.norm_categories');
      console.log("normcatagory:", result.rows[0]);
      res.json(result.rows);
    } catch (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      if (client) client.release();
   
    }
   
    
  });


// GET single user
normcatagoryRouter.get("/:aid", async (req, res) => {
let client;
  try {
    client = await db_pool.connect();
    const result = await client.query('SELECT * from cerpschema.norm_categories where norm_category_id = $1', [req.params.aid]);
    console.log("normcatagory:", result.rows[0]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query:', err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (client) client.release();
 
  }
});

// POST create new user
normcatagoryRouter.post("/add", async(req, res) => {
  let client;
  const { newcategory} = req.body;
   console.log("req.body",req.body)
  
  try {
    client = await db_pool.connect();
    const result = await client.query(
      "INSERT INTO cerpschema.norm_categories(category_name, description) VALUES ($1, $2) RETURNING *",
      [ newcategory.name, newcategory.description]
    );
    console.log("normcatagory:", result.rows[0]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query:', err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (client) client.release();
 
  }
});


// PUT update user
normcatagoryRouter.put('/:id', async(req, res) => {
  let client;
  console.log("req",req.body.category_name)
  const { id } = req.params;
  const { category_name, description } = req.body;
  console.log("id", id)
  
  try {
      client = await db_pool.connect();
      const result = await client.query(
          "UPDATE cerpschema.norm_categories SET category_name= $1, description = $2 WHERE norm_category_id = $3 RETURNING *",
          [category_name, description, id]
      );
      
      if (result.rows.length === 0) {
          return res.status(404).json({ error: "Group not found" });
      }
      
      res.json(result.rows[0]);
  } catch (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).json({ error: "Internal Server Error" });
  } finally {
      if (client) client.release();
  }
});



// DELETE user
normcatagoryRouter.delete("/delete/:id",async (req, res) => {
  let client;
  const { id} = req.params; // Get ID from request parameters
  try {
    client = await db_pool.connect();
    
    const result = await client.query(
      "DELETE FROM cerpschema.norm_categories WHERE norm_category_id  = $1 RETURNING *",
      [ id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Group not found" });
    }

    console.log("Deleted Group:", result.rows[0]);
    res.json({ message: "Group deleted successfully", deletedGroup: result.rows[0] });
  } catch (err) {
    console.error("Error executing query:", err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (client) client.release();
  }
});
export default normcatagoryRouter;
