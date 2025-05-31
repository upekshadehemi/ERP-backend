import  express  from "express";
import { db_pool } from "../../db-pool.js";
const normdetailsRouter=express.Router();
// GET all users

 normdetailsRouter.get("/get-all-data", async (req, res) => {
  let client;
    try {
      client = await db_pool.connect();
      const result = await client.query(`SELECT 
         norm_detail_id,
          norm_id,
          resource_id as resourceid,
          unit,
          quantity,
          wastage,
          unit_price as unitprice,
          amount,
          resource_type as resourcetype
         from cerpschema.norm_details`);

      console.log("normdetails:", result.rows);
      res.status(200).json({success:true , data:result.rows});
    } catch (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      if (client) client.release();
   
    }
  });

  // GET single user
  // normdetailsRouter.get("/:aid", async (req, res) => {
  // let client;
  //   try {
  //     client = await db_pool.connect();
  //     const result = await client.query('SELECT * from cerpschema.norm_details  where norm_detail_id = $1', [req.params.aid]);
  //     console.log("normdetails:", result.rows[0]);
  //     res.json(result.rows);
  //   } catch (err) {
  //     console.error('Error executing query:', err.stack);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   } finally {
  //     if (client) client.release();
   
  //   }
  // });

  // POST create new detail
  normdetailsRouter.post("/add", async(req, res) => {
    let client;
    const {newdetail} = req.body;
    console.log("req.body",req.body)
    
    try {
      client = await db_pool.connect();
      const result = await client.query(
        `INSERT INTO cerpschema.norm_details (norm_id, resource_id, unit, quantity, wastage, unit_price, amount, resource_type)
         VALUES ($1, $2,$3,$4,$5,$6,$7,$8) RETURNING *`,
        [ newdetail.normheaderid,newdetail.resourceid,newdetail.unit,newdetail.quantity,newdetail.wastage,newdetail.unitprice,newdetail.amount, newdetail.resourcetype]
      );
      console.log("normdetail:", result.rows[0]);
      res.json(result.rows);
    } catch (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      if (client) client.release();
   
    }
  });

   normdetailsRouter.put('/update', async(req, res) => {
    let client;
    console.log("req",req.body.resource_type)
     const { editeddetail } = req.params;
     const { norm_id, resource_type,resource_id,unit,quantity,wastage,unit_price,amount} = req.body;
     console.log("id",editeddetail)
    
     try {
        client = await db_pool.connect();
        const result = await client.query(
            "UPDATE cerpschema.norm_details  SET norm_id = $1, resource_type = $2,resource_id=$3,unit=$4,quantity=$5,wastage=$6,unit_price=$7,amount=$8 WHERE norm_detail_id = $9 RETURNING *",
           [editeddetail.normid, editeddetail.resourcetype,editeddetail.resourceid,editeddetail.unit,editeddetail.quantity,editeddetail.wastage,editeddetail.unitprice,editeddetail.amount]
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
  
  // normdetailsRouter.delete("/delete/:id",async (req, res) => {
  //   let client;
  //   const { id} = req.params; // Get ID from request parameters
  //   try {
  //     client = await db_pool.connect();
      
  //     const result = await client.query(
  //       "DELETE FROM cerpschema.norm_details  WHERE  norm_detail_id = $1 RETURNING *",
  //       [ id]
  //     );
  
  //     if (result.rows.length === 0) {
  //       return res.status(404).json({ error: "Group not found" });
  //     }
  
  //     console.log("Deleted Group:", result.rows[0]);
  //     res.json({ message: "Group deleted successfully", deletedGroup: result.rows[0] });
  //   } catch (err) {
  //     console.error("Error executing query:", err.stack);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   } finally {
  //     if (client) client.release();
  //   }
  // });

 normdetailsRouter.get("/get-id", async (req, res) => {
  let client;
  try {
    client = await db_pool.connect();
    const result = await client.query('SELECT norm_id FROM cerpschema.norms_header_table');
    console.log("normdetails:", result.rows);
    res.status(200).json({success:true ,  data:result.rows});
  } catch (err) {
    console.error('Error executing query:', err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (client) client.release();
  }
});
  
export default normdetailsRouter;