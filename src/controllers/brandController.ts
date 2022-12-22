import mongoose from "mongoose";
import {Request, Response} from "express";


export const fetchBrands = async (req: Request, res: Response)=> {
  
  try {
    const Brand = mongoose.model("Brand")
    // const connection = connect()
    // connection.execute("SELECT * from brands", function(err, rows, fields) {
    //   rows.forEach(item=>{
    //     const {
    //       created_at,
    //       name,
    //     } = item
    //     let p: BrandType = {
    //       name,
    //       createdAt: created_at,
    //     }
    //     let brand = new Brand(p)
    //     let a = Brand.insertMany(p)
    //     console.log(a)
    //   })
    // })
  
    let brands = await Brand.find({})
    res.send(brands)
  } catch (ex){
    res.send([])
  }
}