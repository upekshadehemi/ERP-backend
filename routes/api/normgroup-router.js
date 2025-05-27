import express from "express";
import { db_pool } from "../../db-pool.js";

const normgroupRouter = express.Router();

// In-memory "database"
let normgroup = [
  { id: 1, name: " Buildings", description: "bulidings" },
  { id: 2, name: "road", description: "road" },
  { id: 3, name: "bridge", description: "brige" },
];

// GET all users
normgroupRouter.get("/all", async (req, res) => {
let client;
  try {
    console.log("helooooooooooooooo");

    client = await db_pool.connect();
    const result = await client.query("SELECT * from cerpschema.norm_groups");
    console.log("normgroup:", result.rows[0]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error executing query:", err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (client) client.release();
  }
});
normgroupRouter.get("/:aid", async (req, res) => {
  let client;
  try {
    client = await db_pool.connect();
    const result = await client.query(
      "SELECT * from cerpschema.norm_groups where norm_group_id = $1",
      [req.params.aid]
    );
    console.log("normgroup:", result.rows[0]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error executing query:", err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (client) client.release();
  }
});

// POST create new user
// normgroupRouter.post("/add", async (req, res) => {
//   let client;
//   const { name, description } = req.body;
//   console.log("req.body", req.body);
//   console.log("description",description , "name", name);
  

//   try {
//     client = await db_pool.connect();
//     const result = await client.query(
//       "INSERT INTO cerpschema.norm_groups(group_name, description) VALUES ($1, $2) RETURNING *",
//       [name, description]
//     );
//     // console.log("normgroup:", result);
//     res.json(result.rows);
//   } catch (err) {
//     console.error("Error executing query:", err.stack);
//     res.status(500).json({ error: "Internal Server Error" });
//   } finally {
//     if (client) client.release();
//   }
// });

normgroupRouter.post("/add", async (req, res) => {
  let client;
  const { newBuilding } = req.body;
  console.log("req.body",req.body)
  
  try {
    client = await db_pool.connect();
    const result = await client.query(
      "INSERT INTO cerpschema.norm_groups(group_name, description) VALUES ($1, $2) RETURNING *",
      [newBuilding.name, newBuilding.description]
    );
    console.log("normgroup:", result.rows[0]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error executing query:", err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (client) client.release();
  }
});


// PUT update user
normgroupRouter.put("/:id", async (req, res) => {
  let client;
  console.log("req", req.body.group_name);
  const { id } = req.params;
  const { group_name, description } = req.body;
  console.log("id", id);

  try {
    client = await db_pool.connect();
    const result = await client.query(
      "UPDATE cerpschema.norm_groups SET group_name = $1, description = $2 WHERE norm_group_id = $3 RETURNING *",
      [group_name, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error executing query:", err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (client) client.release();
  }
});

// DELETE user
normgroupRouter.delete("/delete/:id", async (req, res) => {
  let client;
  
  const { id } = req.params; // Get ID from request parameters

  try {
    client = await db_pool.connect();

    const result = await client.query(
      "DELETE FROM cerpschema.norm_groups WHERE  norm_group_id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Group not found" });
    }

    console.log("Deleted Group:", result.rows[0]);
    res.json({
      message: "Group deleted successfully",
      deletedGroup: result.rows[0],
    });
  } catch (err) {
    console.error("Error executing query:", err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (client) client.release();
  }
});




export default normgroupRouter;
