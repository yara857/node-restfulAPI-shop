const express = require('express')
const router = express.Router();

const checkAuth= require("../middleware/check-auth")
const OrdersController = require('../controller/orders')

router.get('/',checkAuth , OrdersController.orders_getAll)
router.post('/', checkAuth,OrdersController.orderPost)
router.get('/:orderId', checkAuth, OrdersController.getOrderId)
router.delete('/:orderId', checkAuth, OrdersController.deleteOrder)

module.exports = router