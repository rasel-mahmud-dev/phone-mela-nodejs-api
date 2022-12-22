import {NextFunction, Response, Request} from "express"
import {ObjectId} from "bson";
import Sales from "../models/Sales";
import Product from "../models/Product";
import Brand from "../models/Brand";

import Review from "../models/Review";
import path from "path";
import * as fs from "fs";
import ProductDetail from "../models/ProductDetail";


export const fetchProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let data = await Product.find();
        res.send(data);
    } catch (ex) {
        res.status(500).send([]);
    }
};


export const fetchReviews = async (req: Request, res: Response, next: NextFunction) => {

    const {pageNumber = 1, product_id} = req.query;


    try {

        let count = 0
        let pageSize = 10


        if (pageNumber == 1) {
            count = await Review.countDocuments();
        }

        let data = await Review.aggregate([
            // { $match: {
            //     product_id: new ObjectId(product_id)
            //     }
            // },

            {
                $lookup: {
                    from: "users",
                    localField: "customer_id",
                    foreignField: "_id",
                    as: "customer",
                }
            },
            {$unwind: {path: "$customer", preserveNullAndEmptyArrays: true}},
            {
                $project: {
                    title: 1,
                    summary: 1,
                    createdAt: 1,
                    rate: 1,
                    customerUploads: 1,
                    customer: {
                        first_name: 1,
                        avatar: 1
                    }
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {$skip: (Number(pageNumber) - 1) * pageSize},
            {$limit: pageSize},
        ])
        res.status(200).json({
            reviews: data,
            count: count
        });
    } catch (ex) {
        res.status(500).send([]);
    }
};


export const fetchQuestions = async (req: Request, res: Response, next: NextFunction) => {

    const {productId} = req.params;

    try {
        let data = await ProductDetail.aggregate([
            { $match: { productId: new ObjectId(productId)  } },
            // need to lookup for subdocument
            // {
            //     $lookup: {
            //         from: "users",
            //         foreignField: "_id",
            //         localField: "questions.customerId",
            //         as: "customer"
            //     }
            // },
            // { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    questions: 1,
                }
            }
        ]);

        if (data && data.length > 0) {
            res.status(200).send(data[0]?.questions || []);
        } else {
            next(Error("Detail not found"))
        }
    } catch (ex) {
        next(ex)
    }
};


export const fetchProduct = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;

    try {
        let data = await Product.aggregate([
            {
                $match: {
                    _id: new ObjectId(id as string),
                },
            },
            {
                $lookup: {
                    from: "reviews",
                    foreignField: "product_id",
                    localField: "_id",
                    as: "ratings",
                },
            },
            {
                $addFields: {
                    averageRate: {
                        $avg: "$ratings.rate",
                    },
                },
            },
            {
                $lookup: {
                    from: "brands",
                    foreignField: "_id",
                    localField: "brand_id",
                    as: "brand",
                },
            },
            {$unwind: {path: "$brand", preserveNullAndEmptyArrays: true}},
        ]);

        if (data[0]) {
            res.status(200).send(data[0]);
        }
    } catch (ex) {
        res.status(500).send({});
    }
};

export const fetchProductDetail = async (req: Request, res: Response, next: NextFunction) => {
    const {productId} = req.params;

    try {
        let data = await ProductDetail.aggregate([
            {
                $match: {
                    productId: new ObjectId(productId as string),
                },
            },
            {
                $project: {
                    questions: 0
                }
            }
        ]);
        if (data[0]) {
            res.status(200).send(data[0]);
        } else {
            next(Error("Detail not found"))
        }
    } catch (ex) {
        next(ex)
    }
};

export const addProduct = async (req: Request<any>, res: Response, next: NextFunction) => {

    try {
        const {attributes, brand_id, cover, description, discount, details, price, stock, tags, title} = req.body;

        let productData: any = {};
        if (attributes) productData.attributes = attributes;
        if (brand_id) productData.brand_id = brand_id;
        if (cover) productData.cover = cover;
        if (discount) productData.discount = discount;
        if (price) productData.price = price;
        if (stock) productData.stock = stock;
        if (tags) productData.tags = tags;
        if (title) productData.title = title;
        if (description) productData.description = description;

        let doc = new Product(productData);
        doc = await doc.save()
        if (doc) {
            let doc2 = new ProductDetail({
                productId: doc._id,
                detail: details,
                description: `
                Let go of the inhibitions and enjoy speed operation and flawless user experience with Redmi 10. This phone is powered by Snapdragon 680 processor with a savvy 6 nm architecture that makes juggling fun. This device is incorporated with 4 GB of RAM and 64 GB of internal storage that provides you with seamless efficiency. With the UFS 2.2 storage, you can experience an unmatched speed in the operation. This smartphone boasts a large 6000 mAh battery with an 18 W fast charging capability giving your phone a necessary boost to achieve optimal efficiency. With a mesmerising 17.04 cm (6.71) display and a 20.6:9 aspect ratio, Redmi 10 offers an immersive user experience. The Redmi 10 is equipped with a 50 MP camera and a 2 MP depth sensor allowing you to capture breathtaking pictures with enthralling imagery. 
                `,
                highlights: [
                    "4 GB RAM | 64 GB ROM | Expandable Upto 1 TB",
                    "17.02 cm (6.7 inch) HD+ Display",
                    "No cost EMI starting from 2300/month",
                    "50MP + 2MP | 5MP Front Camera",
                    "6000 mAh Lithium Polymer Battery",
                    "Qualcomm Snapdragon 680 Processor"
                ],
                ram: [4, 6, 8],
                storage: [64, 128],
                colors: ["blue", "black"]
            })

            doc2.save().then(() => {
                res.status(201).json(doc);
            }).catch(async (ex) => {
                await Product.deleteOne({_id: doc._id})
                next(Error("Product adding fail"))
            })

        } else {
            next(Error("Product adding fail"))
        }
    } catch (ex) {
        next(ex)
    }
};


export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const {productId} = req.params;


    try {
        const {attributes, brand_id, cover, description, discount, price, stock, tags, title, _id} = req.body;
        let updateProduct: any = {};
        if (attributes) updateProduct.attributes = attributes;
        if (brand_id) updateProduct.brand_id = brand_id;
        if (cover) updateProduct.cover = cover;
        if (discount) updateProduct.discount = discount;
        if (price) updateProduct.price = price;
        if (stock) updateProduct.stock = stock;
        if (tags) updateProduct.tags = tags;
        if (title) updateProduct.title = title;
        if (description) updateProduct.description = description;

        let doc = await Product.findByIdAndUpdate(productId, {
            $set: updateProduct,
        });

        if (doc) {
            res.status(201).json({message: "updated"});
        } else {
            next(Error("Product update fail"))
        }
    } catch (ex) {
        next(ex)
    }
};

interface BodyMy {
    type: "latest" | "top_discount" | "top_rating" | "top_sales";
}

interface HomePageProductResponse {
    _id: string;
    title: string;
    cover: string;
    brand_id: string;
    author_id: string;
    seller_id: string;
    details_id: string;
    discount: string;
    price: number;
    stock: number;
    attributes: object;
    tags: string[];
    updatedAt: Date;
    createdAt: Date;
}

export const fetchHomePageProducts = async (
    req: Omit<Request, "body"> & { body: BodyMy },
    res: Response<HomePageProductResponse[]>
) => {
    let products = [];
    const {type} = req.body;
    if (type === "latest") {
        products = await Product.find({}).sort({createdAt: "desc"}).limit(10);
    } else if (type === "top_discount") {
        products = await Product.find({}).sort({discount: "desc"}).limit(10);
    } else if (type === "top_rating") {
        products = await Product.aggregate([
            {
                $lookup: {
                    from: "reviews",
                    foreignField: "product_id",
                    localField: "_id",
                    as: "ratings",
                },
            },
            {
                $addFields: {
                    averageRate: {
                        $avg: "$ratings.rate",
                    },
                },
            },
            {
                $sort: {
                    averageRate: -1,
                },
            },
            {$limit: 10},
        ]);
    } else if (type === "top_sales") {
        products = await Sales.aggregate([
            {
                $group: {
                    _id: {
                        product_id: "$product_id",
                        order_id: "$order_id",
                    },
                    sold: {$sum: 1},
                },
            },
            {
                $addFields: {
                    product_id: "$_id.product_id",
                    order_id: "$_id.order_id",
                },
            },
            {$project: {_id: 0}},
            {
                $lookup: {
                    from: "products",
                    localField: "product_id",
                    foreignField: "_id",
                    as: "product",
                },
            },
            {$unwind: {path: "$product", preserveNullAndEmptyArrays: true}},
            {
                $addFields: {
                    cover: "$product.cover",
                    title: "$product.title",
                    price: "$product.price",
                    discount: "$product.discount",
                    _id: "$product._id",
                },
            },
            {
                $lookup: {
                    from: "orders",
                    localField: "order_id",
                    foreignField: "_id",
                    as: "order",
                },
            },
            {$unwind: {path: "$order", preserveNullAndEmptyArrays: true}},
            {
                $addFields: {
                    totalPrice: "$order.price",
                },
            },
            {
                $project: {
                    order: 0,
                    product: 0,
                },
            },
            {$sort: {sold: -1}},
            {$limit: 20},
        ]);
    }
    res.send(products);
};


function createCache(data) {
    fs.writeFile(path.resolve("static/data.json"), JSON.stringify(data, undefined, 4), {}, (err) => {
        console.log(err)
    })
}

function getCache() {
    let data = fs.readFileSync(path.resolve("static/data.json"), "utf8")
    return JSON.parse(data)
}

let cachedData;
export const fetchHomePageProductsV2 = async (
    req: Omit<Request, "body"> & {
        body: { data: ["latest" | "topFavorites" | "topSales" | "topDiscount" | "topRating" | "topBrands"] };
    },
    res: Response<HomePageProductResponse[]>, next: NextFunction
) => {
    const {data} = req.body;

    let products: any = {};


    try {
        // if not cache data then load data from local json files
        if (!cachedData) {
            let data = getCache()
            return res.send(data);
        }


        // if memory cache is undefined then find from redis cache
        // client = await redisConnect();
        // let p = await client.get("phone_mela_homepage_data");
        // cachedData = JSON.parse(p);

        // if (p) {
        //     return res.send(cachedData);
        // }

        // if redis cache also not found then fetch from mongodb
        for (let section of data) {
            if (section === "topBrands") {
                products[section] = await Brand.find({}).sort({createdAt: "desc"}).limit(50);
            }
            if (section === "latest") {
                products[section] = await Product.find({}).sort({createdAt: "desc"}).limit(10);
            }
            if (section === "topFavorites") {
                // products[section] = await  Product.find({}).sort({ createdAt: 'desc'}).limit(10)
            }
            if (section === "topDiscount") {
                products[section] = await Product.find({}).sort({discount: "desc"}).limit(10);
            }
            if (section === "topRating") {
                products[section] = await Product.aggregate([
                    {
                        $lookup: {
                            from: "reviews",
                            foreignField: "product_id",
                            localField: "_id",
                            as: "ratings",
                        },
                    },
                    {
                        $addFields: {
                            averageRate: {
                                $avg: "$ratings.rate",
                            },
                        },
                    },
                    {
                        $sort: {
                            averageRate: -1,
                        },
                    },
                    {$limit: 10},
                ]);
            }
            if (section === "topSales") {
                products[section] = await Sales.aggregate([
                    {
                        $group: {
                            _id: {
                                product_id: "$product_id",
                                order_id: "$order_id",
                            },
                            sold: {$sum: 1},
                        },
                    },
                    {
                        $addFields: {
                            product_id: "$_id.product_id",
                            order_id: "$_id.order_id",
                        },
                    },
                    {$project: {_id: 0}},
                    {
                        $lookup: {
                            from: "products",
                            localField: "product_id",
                            foreignField: "_id",
                            as: "product",
                        },
                    },
                    {$unwind: {path: "$product", preserveNullAndEmptyArrays: true}},
                    {
                        $addFields: {
                            cover: "$product.cover",
                            title: "$product.title",
                            price: "$product.price",
                            discount: "$product.discount",
                            _id: "$product._id",
                        },
                    },
                    {
                        $lookup: {
                            from: "orders",
                            localField: "order_id",
                            foreignField: "_id",
                            as: "order",
                        },
                    },
                    {$unwind: {path: "$order", preserveNullAndEmptyArrays: true}},
                    {
                        $addFields: {
                            totalPrice: "$order.price",
                        },
                    },
                    {
                        $project: {
                            order: 0,
                            product: 0,
                        },
                    },
                    {$sort: {sold: -1}},
                    {$limit: 20},
                ]);
            }
        }
        res.send(products);
        cachedData = products;


        // createCache(products)


        // await client.set("phone_mela_homepage_data", JSON.stringify(products));
    } catch (ex) {
        next(ex);
    } finally {
        // await client?.quit()
    }
};

export const topWishlistProducts = async (req: Request, res: Response, next: NextFunction) => {
};

type FilterProductIncomingData = {
    in: {
        // reserved keyword
        brand_id: string[];
        ram: number[];
        cores: number[];
        display: string[];
        network_type: string[];
        processor_brand: string[];
        resolution_type: string[];
        screen_size: number[];
        os_version: string[];
        operating_system: string[];
    };
    order: {
        field: "createdAt" | "price" | "title";
        by: "desc" | "asc";
    };
    pagination: { page_size: number; page_number: string };
    range: {
        internal_storage: [][];
        primary_camera: [][];
        secondary_camera: [][];
        battery: [][];
    };
    search: {
        title: string;
    } | null;
};

export const filterProducts = async (req: Request<FilterProductIncomingData>, res: Response, next: NextFunction) => {
    let {in: include, order, pagination, range, search} = req.body;

    try {
        let includeAttributes = {
            // "attributes.ram": {$in: [2]},
            // "attributes.cores": {$in: [2]},
            // "attributes.display": {$in: [2]},
            // "attributes.network_type": {$in: [2]},
            // "attributes.processor_brand": {$in: [2]},
            // "attributes.resolution_type": {$in: [2]},
            // "attributes.screen_size": {$in: [2]},
            // "attributes.os_version": {$in: [2]},
            // "attributes.operating_system": {$in: [2]},
        };

        for (let includeKey in include) {
            if (includeKey === "brand_id") {
                // convert all string _id to mongodb ObjectId
                let objectIds = [];
                include[includeKey] &&
                include[includeKey].length > 0 &&
                include[includeKey].map((id) => {
                    objectIds.push(new ObjectId(id));
                });

                if (objectIds.length > 0) {
                    // brand_id: { '$in': [ 1, 2, 3 ] },
                    includeAttributes[includeKey] = {$in: objectIds};
                }
            } else {
                let values = [];
                // all like attributes
                include[includeKey] &&
                include[includeKey].length > 0 &&
                include[includeKey].map((item) => {
                    if (typeof item === "string") {
                        values.push(item);
                    } else if (typeof item === "number") {
                        values.push(item);
                    }
                });
                if (values.length > 0) {
                    includeAttributes["attributes." + includeKey] = {$in: values};
                }
            }
        }

        let rangeFilter = [];
        // range: {internal_storage: [[64, 127], [128, 255]]}

        // [
        //   {"attributes.primary_camera": { $gt: 31, $lte: 64} },
        //   {"attributes.secondary_camera": { $gt: 31, $lte: 64} },
        // ]

        for (let rangeKey in range) {
            // { attributes.primary_camera: { '$gt': 64, '$lte': 108 } }
            let eachAttributePair = {};

            if (range[rangeKey] && range[rangeKey].length > 0) {
                let twoDimension = range[rangeKey];

                // { '$gte': 64, '$lte': 108 } }
                let gtLteCompare = {};

                for (let i = 0; i < twoDimension.length; i++) {
                    let eachValuePair = twoDimension[i];
                    gtLteCompare["$gte"] = eachValuePair[0];
                    gtLteCompare["$lte"] = eachValuePair[1];
                }
                eachAttributePair["attributes." + rangeKey] = gtLteCompare;
            }

            rangeFilter.push(eachAttributePair);
        }

        let andFilter;
        if (rangeFilter.length > 0) {
            andFilter = {$and: [...rangeFilter]};
        }

        let searchFilter;
        if (search) {
            for (let searchKey in search) {
                if (searchKey === "title") {
                    searchFilter = {};
                    searchFilter[searchKey] = {
                        $regex: new RegExp(search[searchKey], "i"),
                    };
                }
            }
        }

        let sorting;
        if (order) {
            sorting = {
                $sort: {
                    [order.field]: order.by === "asc" ? 1 : -1,
                },
            };
        }

        // console.log(includeAttributes)

        let data = await Product.aggregate([
            {
                $match: {
                    // brand_id: {$in: [new ObjectId("62a638e8bf617d070dc47301"), new ObjectId("62a638e8bf617d070dc47302")]},
                    ...includeAttributes,
                    ...andFilter,
                    // $and: [ { 'attributes.internal_storage': { '$gt': 10, '$lte': 127 } } ]

                    // title: { $regex: /gal/i},
                    ...searchFilter,

                    // $and: [
                    // {"attributes.primary_camera": { $gt: 31, $lte: 64} },
                    // {"attributes.secondary_camera": { $gt: 31, $lte: 64} },
                    // ]
                },
            },

            // { $unwind: {path: "$order", preserveNullAndEmptyArrays: true} },

            // { $addFields: {
            //     "totalPrice":  "$order.price"
            //   }},

            // { $project: {
            //     order: 0,
            //     product: 0
            //   } },

            {
                $lookup: {
                    from: "orders",
                    foreignField: "product_id",
                    localField: "_id",
                    as: "order",
                },
            },
            {
                $addFields: {
                    sold: {
                        $size: "$order",
                    },
                },
            },
            {
                $lookup: {
                    from: "brands",
                    foreignField: "_id",
                    localField: "brand_id",
                    as: "brand",
                },
            },
            {$unwind: {path: "$brand", preserveNullAndEmptyArrays: true}},
            {...sorting},
        ]);


        res.json({products: data});


    } catch (ex) {
        next(ex)
    }
};


export const addReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {title, summary, rate = 1, product_id} = req.body

        let review = await new Review({
            title,
            summary,
            product_id,
            rate,
            customer_id: req.auth._id,
            customerUploads: []
        })

        let doc = await (await review.save()).populate("customer_id", "first_name avatar")
        if (doc) {
            res.status(201).send(doc)
        } else {
            next(Error("Rating add fail"))
        }
    } catch (ex) {
        next(ex)
    }
};

export const addQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {question, answer = "", productId} = req.body

        let detail = await ProductDetail.findOne({productId: new ObjectId(productId)})
        if (detail) {
            let cp = detail.questions || []

            cp.push({question: question, answer: "", customerId: req.auth._id, createdAt: new Date()})
            let doc = await ProductDetail.updateOne({productId: new ObjectId(productId)},
                {$set: {questions: cp}})

            if (doc.modifiedCount) {
                res.status(201).send(cp)
            } else {
                next(Error("Question add fail"))
            }
        } else {
            next(Error("Question add fail"))
        }

    } catch (ex) {
        next(ex)
    }
};

