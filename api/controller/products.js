const express = require('express')
const router = express.Router();
const Product = require('../models/product')
const mongoose = require("mongoose");
const multer = require("multer")
const checkAuth= require("../middleware/check-auth")

exports.prodductsGetAll = (req, res, next) => {
    Product.find()
        .select("name price _id productImage")
        .exec()
        .then(docs => {
            console.log(docs)
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage : doc.productImage,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }
            // if(docs.length >= 0){
            res.status(200).json(response)
            // }else{
            //     res.status(404).json({
            //         message:"No Entry Found"
            //     })
            // }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
}

exports.postProduct = (req, res, next) => {
    console.log(req.file)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })
    product.save().then(result => {
        console.log(result)
        res.status(201).json({
            message: "Created Object",
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: "GET",
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        })
    })
        .catch(err => console.log(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        }));

}

exports.getByID = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            console.log(doc)
            res.status(200).json(doc)
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/'
                    }
                })
            } else {
                res.status(404).json({
                    message: "Not Found"
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        });

}


exports.productUpdate = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log({
                message: "Products Updated",
                request: {
                    type: "GET",
                    url: 'http://localhost:3000/products/' + id
                }
            })
            res.status(200).json(result);

        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
}

exports.productDelete = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({
        _id: id
    }).exec().then(result => {
        res.status(200).json({
            message: "Product Deleted successfully!",
            request: {
                type: "GET",
                url: "http://localhost:3000/products/",
                body: {
                    name: "String",
                    price: "Number"
                }
            }
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
}