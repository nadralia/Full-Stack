let async = require("async");
const Category = require("../models/Category");
const Product = require("../models/Product");


exports.categoryIndex = (req, res) => {
  Category.find()
    .sort({ name: 1 })
    .then(category => res.json(category));
};

exports.createCategory = (req, res) => {
  let newCategory = new Category({
    name: req.body.name,
    description: req.body.description
  });


  Category.findOne({
    name: req.body.name
  }).exec(function (err, found_category) {
    if (found_category) {

      res.status(400).json({
        message: "Category already exists"
      });
    } else if (err) {
      res.json({
        message: "Couldn't create please try again"
      });
    } else {
      newCategory.save(function (err) {
        if (err) {
          res.json({
            message: "Couldn't create please try again"
          });
        } else {
          res.json({
            message: "Created Successfully"
          });
        }
      });
    }
  });
};


exports.categoryDetails = function (req, res) {
  async.parallel(
    {
      category: function (callback) {
        Category.findById(req.params.id).exec(callback);
      },
      products: function (callback) {
        Product.find({
          category: req.params.id
        }).exec(callback);
      }
    },
    function (err, results) {
      if (err) {
        return res.status(404).json({ message: "Couldn't load category", err });
      } else {
        let categoryProducts = results.products;
        let category = results.category;


        let products = categoryProducts.filter(item => item.numberInStock !== 0);

        return res.status(200).json({ products, category });
      }
    }
  );
};


exports.deleteCategory = (req, res) => {
  Category.findByIdAndDelete(req.params.id)
    .then(() => {
      return res.status(200).json({
        message: `Category was deleted Succefully`
      });
    })
    .catch(error => {
      return res
        .status(400)
        .json({ error, message: "Couldn't delete, please try again" });
    });
};


exports.updateCategory = (req, res) => {
  let updatedCategory = new Category({
    name: req.body.name,
    description: req.body.description,
    _id: req.params.id
  });

  Category.findByIdAndUpdate(req.params.id, updatedCategory, {
    new: true,
    useFindAndModify: false
  })
    .then(category => res.json({ message: "Successfully updated", category }))
    .catch(err => res.json(err));
};
