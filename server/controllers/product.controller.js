const Product = require("../models/Product");
const User = require("../models/User");


exports.allProducts = (req, res) => {
  let page = req.query.page || 1;
  let perPage = parseInt(req.query.perPage) || 8;

  Product.paginate(
    { numberInStock: { $ne: 0 } },
    { sort: { creationDate: -1 }, page: page, limit: perPage },
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({ message: "Couldn't find products" });
      } else {
        res.status(200).json({ products: result.docs, pagesCount: result.pages });
      }
    }
  );
};

exports.userProducts = (req, res) => {
  let page = req.query.page || 1;
  let perPage = parseInt(req.query.perPage);


  if (req.user.isAdmin) {
    Product.paginate(
      {},
      { sort: { creationDate: -1 }, populate: "seller", page: page, limit: perPage },
      (err, result) => {
        if (err) {
          res.status(400).json({ message: "Couldn't find products" });
        } else {
          res.status(200).json({ products: result.docs, pagesCount: result.pages });
        }
      }
    );
  } else {

    Product.paginate(
      { seller: req.user.id },
      { sort: { creationDate: -1 }, populate: "seller", page: page, limit: perPage },
      (err, result) => {
        if (err) {
          res.status(400).json({ message: "Couldn't find products" });
        } else {
          res
            .status(200)
            .json({ products: result.docs, current: result.page, pages: result.pages });
        }
      }
    );
  }
};


exports.createProduct = (req, res) => {
  if (!req.files) {
    return res.status(400).json({ message: "Please upload an image" });
  }

  const images_url = req.files.map(image => image.path);

  let newProduct = new Product({
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    seller: req.user.id,
    price: req.body.price,
    numberInStock: req.body.numberInStock,
    productImage: images_url
  });

  newProduct.save(function (err, product) {
    if (err) {
      res.status(400).json({
        message: "Couldn't create please try again"
      });
    } else {
      res.status(200).json({
        message: "Added Succefulyl",
        product
      });
    }
  });
};

exports.productDetails = (req, res) => {
  Product.findById(req.params.id)
    .populate("category")
    .populate("seller")
    .exec(function (err, result) {
      if (err) {
        res.status(404).json({ message: "Not Found" });
      } else {
        res.json(result);
      }
    });
};

exports.deleteProduct = (req, res) => {
  User.findById(req.user.id, (err, user) => {
    if (user.username != "admin") {
      res.status(400).json({ message: "You can't delete, please contact your admin" });
    } else {
      Product.findByIdAndDelete(req.params.id, err => {
        if (err) {
          res.status(400).json({ message: "Couldn't delete, try again" });
        } else {
          res.status(200).json({ message: "Deleted Successfully" });
        }
      });
    }
  });
};


exports.updateProduct = (req, res) => {
  const images_url = req.files.map(image => image.path);

  Product.findById(req.params.id, "productImage")
    .then(product => {
      let updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        numberInStock: req.body.numberInStock,
        productImage: req.files[0] ? images_url : product.productImage
      };


      Product.findByIdAndUpdate(req.params.id, updatedProduct, {
        new: true,
        useFindAndModify: false
      })
        .then(product => {
          res.status(200).json({
            message: "Successfuly Updated",
            product
          });
        })
        .catch(() => res.json(400).json({ message: "Error updating" }));
    })
    .catch(err => res.json(err));
};
