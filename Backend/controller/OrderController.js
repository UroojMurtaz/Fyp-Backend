const Order = require("../models/OrderModel");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const OrderItem = require("../models/order-item");
const sendMail = require("../utils/sendMail");
var moment = require("moment");
var fs = require("fs");

//create order
exports.createOrder = catchAsyncErrors(async (req, res, next) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
        userOrderedPlaced: orderItem.userOrderedPlaced,
        shippingInfo: orderItem.shippingInfo,
        paymentInfo: orderItem.paymentInfo,
        shippingPrice: req.body.shippingPrice,
        totalPrice: req.body.totalPrice,
        paidAt: Date.now(),
      });
      newOrderItem = await newOrderItem.save();

      return newOrderItem;
    })
  );
  const orderItemsIdsRes = await orderItemsIds;

  const order = await Order.create({
    shippingInfo: req.body.shippingInfo,
    orderItems: orderItemsIdsRes,
    paymentInfo: req.body.paymentInfo,
    shippingPrice: req.body.shippingPrice,
    totalPrice: req.body.totalPrice,
    paidAt: Date.now(),
    user: req.body.user,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

//user get single order by order id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate({
      path: "orderItems",
      populate: "product",
    });
  if (!order) {
    return next(new ErrorHandler("Order not found with this id", 404));
  }
  res.status(201).json({
    success: true,
    order,
  });
});

//shopkeeper get All order by their seller id
exports.shopKeeperOrders = catchAsyncErrors(async (req, res, next) => {
  const seller = req.params.id;
  const ordersOfShopkeeper = await OrderItem.find()
    .populate({
      path: "product",
    })
    .populate("userOrderedPlaced");

  const orders = ordersOfShopkeeper.filter((e) => {
    // console.log(e.product.user);
    // console.log(seller);

    return e.product.user.toString() === seller.toString();
  });
  // console.log(orders);

  if (!orders) {
    return next(new ErrorHandler("Order not found with this id", 404));
  }
  res.status(201).json({
    success: true,
    orders,
  });
});

//get all orders of users using user id
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json({
    success: true,
    orders,
  });
});

// get all orders for Admin
exports.getAdminAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find()
    .populate("user")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: {
          path: "user",
        },
      },
    });

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    orders,
  });
});

exports.changeStatus = catchAsyncErrors(async (req, res, next) => {
  const orderId = req.params.id;
  let order = await OrderItem.findById(orderId);

  if (!order) {
    return next(new ErrorHandler("Order is not found with this id"));
  }
  order = await OrderItem.findByIdAndUpdate(
    orderId,
    {
      orderStatus: req.body.orderStatus,
    },
    {
      new: true,
      runValidators: true,
      useUnified: false,
    }
  );
  // console.log("hello")

  res.json({
    success: true,
    order,

    // console.log("complete")
  });
});

//Change Order Status Admin
exports.changeOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const orderId = req.params.id;
  const email = req.body.email;
  console.log(email);

  let order = await Order.findById(orderId)
    .populate("user")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: {
          path: "user",
        },
      },
    });
  // console.log("order", order);
  const a = order.trackigID;
  console.log(a)
  const name = order.user.name;
  const num = order.shippingInfo.phoneNo;
  const address = order.shippingInfo.address;
  const city = order.shippingInfo.city;
  const state = order.shippingInfo.state;
  const country = order.shippingInfo.country;


  const updateDoc = {
    $set: {
      AdminStatus:req.body.orderStatus
    },
  };

  const filter = { trackigID: a };
  const orderItem = await OrderItem.updateMany(filter, updateDoc);

  console.log("orderItem", orderItem);




  if (!order) {
    return next(new ErrorHandler("Order is not found with this id"));
  }

  let x = new Boolean(true);
  //Before completing order Check Status
  if (req.body.orderStatus == "Completed") {
    order.orderItems.filter((e) => {
      if (e.orderStatus !== "Completed") {
        x = false;
        console.log(x);
      }
      console.log(e.orderStatus);
    });
  }

  if (!x) {
    console.log("error");
    return next(
      new ErrorHandler(
        "You cant update Order Status to Complete because its not Delivered completely from ShopOwners"
      )
    );
  }

  order = await Order.findByIdAndUpdate(
    orderId,
    {
      orderStatus: req.body.orderStatus,
    },
    {
      new: true,
      runValidators: true,
      useUnified: false,
    }
  );
  // console.log("hello")

  const message = `Your Order has been shipped`;
  if (req.body.orderStatus == "Shipped") {
    await sendMail({
      email: email,
      subject: `Your Order has been Shipped`,
      message,
      html: `<div style="width:650px;margin: auto">
      <div style="background-color:#7451f8;text-align: center;justify-content: center;padding:10px;">
      <h1 style=" color:white;">Bare Beauty<h1>
      </div>
      <div style="background-color: white;">
      <h1 style=" text-align: center;font-size:40px">YOUR ORDER HAS BEEN SHIPPED</h1>
      <p style=" text-align: center;font-size:14px">Thank you for shopping with us,<strong>${name}</strong>. For any concerns related to a damaged order, 
      please call us on 021-38383838 within 12 hours of receiving your parcel to claim a replacement. 
      Please ensure to keep the packaging in-tact and the product unused.</p>

      <p style=" text-align: center;font-size:14px">For any other questions or concerns or feedback, you may contact us at 021-38383838 or write to us at care@bagallery.com.

      Interested in shopping our newest arrivals?</p>
      <br>
      <div style="background-color:#F5F5F5;padding:10px;">
      <h2>Your Details</h2>
      </div>
      <h3 style=" color:#585858;">
      ORDER NUMBER</h3>
      <h4 style=" color:#909090">#5931325555</h4>
      <h3 style=" color:#585858;">
      DELIVERY ADDRESS</h3>
      </div>
      <address>
                
                ${address}<br>
                ${city}<br>
                ${state}<br>
                ${country}<br>
                <abbr title="Phone">P:</abbr> (+92) ${num}
              </address>
              <hr/>
      `,
    });
  }

  if (req.body.orderStatus == "Completed") {
    console.log("Order Completed");
    await sendMail({
      email: email,
      subject: `Your Order has been Delivered`,
      message,
      html: `<div style="width:650px;margin: auto">
      <div style="background-color:#7451f8;text-align: center;justify-content: center;padding:10px;">
      <h1 style=" color:white;">Bare Beauty<h1>
      </div>
      <div style="background-color: white;">
      <h1 style=" text-align: center;font-size:40px">YOUR ORDER HAS BEEN DELIVERED</h1>
      <p style=" text-align: center;font-size:14px">Thank you for shopping with us,<strong>${name}</strong>. For any concerns related to a damaged order,
      please call us on 021-38383838 within 12 hours of receiving your parcel to claim a replacement.
      Please ensure to keep the packaging in-tact and the product unused.</p>

      <p style=" text-align: center;font-size:14px">For any other questions or concerns or feedback, you may contact us at 021-38383838 or write to us at care@bagallery.com.

      Interested in shopping our newest arrivals?</p>
      <br>
      <div style="background-color:#F5F5F5;padding:10px;">
      <h2>Your Details</h2>
      </div>
      <h3 style=" color:#585858;">
      ORDER NUMBER</h3>
      <h4 style=" color:#909090">#5931325555</h4>
      <h3 style=" color:#585858;">
      DELIVERY ADDRESS</h3>
      </div>
      <address>

                ${address}<br>
                ${city}<br>
                ${state}<br>
                ${country}<br>
                <abbr title="Phone">P:</abbr> (+92) ${num}
              </address>
              <hr/>
      `,
    });
  }

  res.json({
    success: true,
    order,
    // console.log("complete")
  });
});

//Order Report
exports.ordersReport = catchAsyncErrors(async (req, res, next) => {
  console.log("hello");
  const seller = req.params.id;
  const ordersOfShopkeeper = await OrderItem.find()
    .populate({
      path: "product",
    })
    .populate("userOrderedPlaced");

  const order = [];
  var processing = 0;
  var complete = 0;
  var Cancelled = 0;

  const orders = ordersOfShopkeeper.filter((e) => {
    // console.log(e.product.user);
    // console.log(seller);

    if (e.product.user.toString() === seller.toString()) {
      order.push(e);
    }
  });
  // console.log(order);
  count = 0;
  order.filter((e) => {
    // console.log("orders",e);
    if (e.orderStatus === "Completed") {
      complete = complete + 1;
    }
    if (e.orderStatus === "Processing") {
      processing = processing + 1;
    }
    if (e.orderStatus === "Cancelled") {
      Cancelled = Cancelled + 1;
    }
    count = count + 1;
  });

  if (!orders) {
    return next(new ErrorHandler("Order not found with this id", 404));
  }
  res.status(201).json({
    success: true,
    count,
    complete,
    Cancelled,
    processing,
  });
});

//Orders between dates
exports.ordersReportCustomize = catchAsyncErrors(async (req, res, next) => {
  console.log("hello");

  seller = req.params.id;
  startdate = req.query.Start;
  enddate = req.query.End;
  console.log("start", startdate);
  console.log("end", enddate);

  // let dateString = "2014-01-22T14:56:59.301Z";
  // console.log(Date(dateString))

  // start=moment(Date.parse(startdate)).format('YYYY-MM-DD ');
  // end=moment(Date.parse(enddate)).format('YYYY-MM-DD ');

  const ordersOfShopkeeper = await OrderItem.find({
    createdAt: { $gt: startdate, $lt: enddate },
  })
    .populate({
      path: "product",
    })
    .populate("userOrderedPlaced");

  const order = [];
  var processing = 0;
  var complete = 0;
  var Cancelled = 0;

  ordersOfShopkeeper.filter((e) => {
    if (e.product.user.toString() === seller.toString()) {
      order.push(e);
    }
  });

  count = 0;
  order.filter((e) => {
    // console.log("orders",e);
    if (e.orderStatus === "Completed") {
      complete = complete + 1;
    }
    if (e.orderStatus === "Processing") {
      processing = processing + 1;
    }
    if (e.orderStatus === "Cancelled") {
      Cancelled = Cancelled + 1;
    }
    count = count + 1;
  });

  console.log(order);
  console.log(count);
  res.status(201).json({
    success: true,
    count,
    complete,
    Cancelled,
    processing,
  });
});

//Sales
exports.Sales = catchAsyncErrors(async (req, res, next) => {
  const a = req.params.id;
  console.log(req.params.id);

  year = req.query.Year;
  start = req.query.start;
  end = req.query.end;
  console.log(year);
  const pipeline = [
    { $match: { year: year } },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "shopOwner",
      },
    },
    {
      $addFields: {
        convertedId: {
          $map: {
            input: "$shopOwner",
            as: "r",
            in: { $toString: "$$r.user" },
          },
        },
      },
    },

    {
      $match: {
        convertedId: req.params.id,
      },
    },
    {
      $match: {
        AdminStatus: "Completed",
      },
    },

    {
      $group: {
        _id: { $dateToString: { date: "$createdAt", format: "%Y-%m" } },
        // _i: { $dateToString: { date: "$createdAt", format: "%Y-%m" } },
        total: { $sum: "$totalPrice" },
      },
    },
    {
      $sort: { "_id.year_month": 1 },
    },
  ];
  const sale = [];
  const aggCursor = OrderItem.aggregate(pipeline);
  for await (const doc of aggCursor) {
    console.log(doc);
    sale.push(doc);
  }
  // console.log(sale)

  res.status(201).json({
    success: true,
    sale,
  });
});

exports.LastSixMonths = catchAsyncErrors(async (req, res, next) => {
  const a = req.params.id;
  console.log(req.params.id);

  var start = new Date();
  console.log("start", start.getMonth());
  // start.setMonth(start.getMonth() + 2 );
  var end = new Date();
  end.setMonth(end.getMonth() - 6);

  const LAST_MONTH = 12;
  // console.log("f", LAST_MONTH);
  const FIRST_MONTH = 1;
  // console.log("l", FIRST_MONTH);
  const MONTHS_ARRAY = [
    "Jan",
    "Feb",
    "Mar",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  start = moment(start).format("YYYY-MM-DD");
  console.log("Start", start);
  end = moment(end).format("YYYY-MM-DD");
  console.log("End", end);

  const pipeline = [
    {
      $match: {
        createdAt: {
          $gte: new Date(end),
          $lt: new Date(start),
        },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "shopOwner",
      },
    },
    {
      $addFields: {
        convertedId: {
          $map: {
            input: "$shopOwner",
            as: "r",
            in: { $toString: "$$r.user" },
          },
        },
      },
    },

    {
      $match: {
        convertedId: req.params.id,
      },
    },
    {
      $match: {
        AdminStatus: "Completed",
      },
    },

    {
      $group: {
        _id: { year_month: { $substrCP: ["$createdAt", 0, 7] } },
        count: { $sum: "$totalPrice" },
      },
    },
    {
      $sort: { "_id.year_month": 1 },
    },
    {
      $project: {
        _id: 0,
        count: 1,
        month_year: {
          $concat: [
            {
              $arrayElemAt: [
                MONTHS_ARRAY,
                {
                  $subtract: [
                    { $toInt: { $substrCP: ["$_id.year_month", 5, 2] } },
                    1,
                  ],
                },
              ],
            },
            "-",
            { $substrCP: ["$_id.year_month", 0, 4] },
          ],
        },
      },
    },
    {
      $group: {
        _id: null,
        data: { $push: { k: "$month_year", v: "$count" } },
      },
    },
    {
      $addFields: {
        start_year: { $substrCP: [end, 0, 4] },
        end_year: { $substrCP: [start, 0, 4] },
        months1: {
          $range: [
            { $toInt: { $substrCP: [end, 5, 2] } },
            { $add: [LAST_MONTH, 1] },
          ],
        },
        months2: {
          $range: [
            FIRST_MONTH,
            { $add: [{ $toInt: { $substrCP: [start, 5, 2] } }, 1] },
          ],
        },
      },
    },
    {
      $addFields: {
        template_data: {
          $concatArrays: [
            {
              $map: {
                input: "$months1",
                as: "m1",
                in: {
                  count: 0,
                  month_year: {
                    $concat: [
                      {
                        $arrayElemAt: [
                          MONTHS_ARRAY,
                          { $subtract: ["$$m1", 1] },
                        ],
                      },
                      "-",
                      "$start_year",
                    ],
                  },
                },
              },
            },
            {
              $map: {
                input: "$months2",
                as: "m2",
                in: {
                  count: 0,
                  month_year: {
                    $concat: [
                      {
                        $arrayElemAt: [
                          MONTHS_ARRAY,
                          { $subtract: ["$$m2", 1] },
                        ],
                      },
                      "-",
                      "$end_year",
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    },
    {
      $addFields: {
        data: {
          $map: {
            input: "$template_data",
            as: "t",
            in: {
              k: "$$t.month_year",
              v: {
                $reduce: {
                  input: "$data",
                  initialValue: 0,
                  in: {
                    $cond: [
                      { $eq: ["$$t.month_year", "$$this.k"] },
                      { $add: ["$$this.v", "$$value"] },
                      { $add: [0, "$$value"] },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
  ];

  const sale = [];
  // console.log('May-2022'===e)
  const aggCursor = OrderItem.aggregate(pipeline);
  for await (const doc of aggCursor) {
    sale.push(doc.data);
  }
  // console.log(sale[0])
  console.log("sale", sale);
  sixMonthsSale = [];
  if (sale.length == 0) {
    sale.push("");
    console.log("hello");
  } else {
    for (let i = 0; i < 6; i++) {
      sixMonthsSale.push(sale[0][i]);
    }
  }

  // console.log(sixMonthsSale)

  res.status(201).json({
    success: true,
    sixMonthsSale,
  });
});

//Orders between dates
exports.getOrdersDashboard = catchAsyncErrors(async (req, res, next) => {
  const seller = req.params.id;
  console.log(req.params.id);
  const ordersOfShopkeeper = await OrderItem.find()
    .populate({
      path: "product",
    })
    .populate("userOrderedPlaced")
    .sort({ $natural: -1 });

  const o = await OrderItem.find();
  const orders = ordersOfShopkeeper.filter((e) => {
    return e.product.user.toString() === seller.toString();
  });
  // console.log(orders);

  user = 0;
  sales = 0;
  count = 0;
  var processing = 0;
  var complete = 0;
  var Cancelled = 0;
  orders.map((e) => {
    // if (e.AdminStatus === "Complete") {
    //   sales = sales + e.totalPrice;
    // }
    if (e.orderStatus === "Completed") {
      complete = complete + 1;
      sales = sales + e.totalPrice;
    }
    if (e.orderStatus === "Processing") {
      processing = processing + 1;
    }
    if (e.orderStatus === "Cancelled") {
      Cancelled = Cancelled + 1;
    }
    count = count + 1;
  });

  if (!orders) {
    return next(new ErrorHandler("Order not found with this id", 404));
  }

  const pipeline = [
    {
      $lookup: {
        from: "users",
        localField: "userOrderedPlaced",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "shopOwner",
      },
    },
    {
      $addFields: {
        convertedId: {
          $map: {
            input: "$shopOwner",
            as: "r",
            in: { $toString: "$$r.user" },
          },
        },
      },
    },

    {
      $match: {
        convertedId: req.params.id,
      },
    },
    { $limit: 5 },
    { $sort: { createdAt: -1 } },
  ];
  const sale = [];
  c = 0;
  const aggCursor = OrderItem.aggregate(pipeline);
  for await (const doc of aggCursor) {
    // console.log(doc);
    c = c + 1;
    sale.push(doc);
  }

  res.status(201).json({
    success: true,
    sales,
    count,
    complete,
    sale,
    processing
  });
});
