const express = require('express')
const router = express.Router();

const multer = require("multer")
const checkAuth= require("../middleware/check-auth")
const productController = require("../controller/products")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    // reject file 
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024//limiting the size of
    },
    fileFilter: fileFilter
})


router.get("/", productController.prodductsGetAll)
router.post("/" , checkAuth , upload.single('productImage') , productController.postProduct)
router.get("/:productId", productController.getByID)
router.patch("/:productId" , checkAuth , productController.productUpdate)
router.delete("/:productId", checkAuth , productController.productDelete)

module.exports = router