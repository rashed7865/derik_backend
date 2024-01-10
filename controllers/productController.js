const Product = require('../models/productModel');
const cloudinary = require('../middlewares/cloudinary');
const cloudinaryCon = require('../middlewares/cloudinary');
const fs = require("fs");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().limit(20)
      .populate('category seller').exec();
    if (products) {
      res.status(200).send(products);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    res.status(404).json({ errorMessage: 'Error in finding products!', error });
  }
}

exports.getAllSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id })
      .populate('category seller').exec();
    res.status(200).send(products);
  } catch (error) {
    res.status(404).json({ errorMessage: 'Error in finding products!', error });
  }
}

exports.getLimitedProducts = async (req, res) => {
  const PAGE_SIZE = 20;
  const page = parseInt(req.params.page || "0")
  const products = await Product.find().limit(PAGE_SIZE).skip(PAGE_SIZE * page)
    .populate('category seller').exec();
  const count = await Product.countDocuments({});
  if (products) {
    res.status(200).send({ products, count });
  } else {
    res.status(404).json({ errorMessage: 'No Products found!' });
  }
}

exports.getLimitedProductsByCat = async (req, res) => {
  const PAGE_SIZE = 20;
  const page = parseInt(req.body.pageNo || "0");
  const products = await Product.find({ category: req.params.id })
    .limit(PAGE_SIZE).skip(PAGE_SIZE * page)
    .populate('category seller').exec();
  const count = await Product.find({ category: req.params.id }).countDocuments({});
  if (products) {
    res.status(200).send({ products, count });
  } else {
    res.status(404).json({ errorMessage: 'No Products found!' });
  }
}

exports.getProductById = async (req, res) => {
  const findProduct = await Product.findOne({ _id: req.params.id }).populate('category seller').exec();
  if (findProduct) {
    res.status(200).send(findProduct);
  } else {
    res.send(200).json({});
  }
}

exports.getProductByCategory = async (req, res) => {
  const findProduct = await Product.find({ category: req.params.id })
    .populate('category seller').exec();
  if (findProduct) {
    res.status(200).json(findProduct);
  } else {
    res.json({ errorMessage: 'No products found' })
  }
}



exports.uploadProduct = async (req, res) => {
  console.log(req.body);
  try {
    if (req.files) {
      let productPictures;
      const uploader = async (path) => await cloudinary.uploads(path, 'Dêrik-online-shopRA/Product')
      const urls = [];
      const files = req.files;
      for (const file of files) {
        const { path } = file;
        const newPath = await uploader(path)
        urls.push(newPath);
        fs.unlinkSync(path);
      }

      if (urls && urls.length > 0) {
        productPictures = urls.map(pic => {
          return {
            url: pic.url,
            cloudinary_id: pic.id
          }
        })
      }

      const product = new Product({
        title: req.body.title,
        description: req.body.description,
        seller: req.user._id,
        price: req.body.price,
        qty: req.body.qty,
        category: req.body.category,
        productPicture: productPictures,
        sizes: req.body.sizes, // Add sizes field
      });

      await product.save(((error, result) => {
        if (error) {
          res.status(400).json({ errorMessage: 'Failed to create product. Please try again', error })
        }
        if (result) {
          res.status(200).send({ successMessage: 'Product created successfully', result });
        }

      }))
    } else {
      res.status(400).json({ errorMessage: 'Failed to upload file. Please try again' })
    }
  } catch (error) {
    res.status(400).json({ errorMessage: 'Failed to create product. Please try again', error });
    console.log(error);
  }
}



exports.updateProductController = async (req, res) => {
  console.log("first")
  try {
    const findProduct = await Product.findById({ _id: req.params.id });
    if (findProduct) {
      if (req.files?.length > 0) {
        console.log(req.files)
        let productPictures;
        const uploader = async (path) => await cloudinary.uploads(path, 'Dêrik-online-shopRA/Product')
        const urls = [];
        const files = req.files;
        for (const file of files) {
          const { path } = file;
          const newPath = await uploader(path)
          urls.push(newPath);
          fs.unlinkSync(path);
        }

        if (urls && urls.length > 0) {
          productPictures = urls.map(pic => {
            return {
              url: pic.url,
              cloudinary_id: pic.id
            }
          })
        }

        findProduct.title = req.body.title;
        findProduct.description = req.body.description;
        findProduct.price = req.body.price;
        findProduct.seller = req.user._id;
        findProduct.qty = req.body.qty;
        findProduct.category = req.body.category;
        findProduct.productPicture = productPictures;
        findProduct.sizes= req.body.sizes, // Add sizes field

        await findProduct.save(((error, result) => {
          if (error) {
            res.status(400).json({ errorMessage: 'Failed to update product. Please try again', error })
          }
          if (result) {
            res.status(200).send({ successMessage: 'Product updated successfully', result });
          }

        }))
      } else {
        console.log(findProduct.productPicture)
        findProduct.title = req.body.title;
        findProduct.description = req.body.description;
        findProduct.price = req.body.price;
        findProduct.seller = req.user._id;
        findProduct.qty = req.body.qty;
        findProduct.category = req.body.category;
        findProduct.productPicture = findProduct.productPicture;
        findProduct.sizes= req.body.sizes, // Add sizes field
        await findProduct.save(((error, result) => {
          if (error) {
            res.status(400).json({ errorMessage: 'Failed to update product. Please try again', error })
          }
          else {
            res.status(200).send({ successMessage: 'Product updated successfully', result });
          }
        }))
      }

    }
    else {
      res.status(404).json({ errorMessage: 'Product not found' });
    }

  } catch (error) {
    console.log(error);
  }

}

// exports.updateProductController = async (req, res) => {
//   console.log(req.body);
//   try {
//     const findProduct = await Product.findById({ _id: req.params.id });
//     console.log(req.body)
//     if (findProduct) {
//       if (req.file) {
//         findProduct.title = req.body.title;
//         findProduct.description = req.body.description;
//         findProduct.price = req.body.price;
//         findProduct.seller = req.user._id;
//         findProduct.qty = req.body.qty;
//         findProduct.category = req.body.category;
//         findProduct.productPicture = req.body.productPicture;
//       } else {
//         findProduct.title = req.body.title;
//         findProduct.description = req.body.description;
//         findProduct.price = req.body.price;
//         findProduct.seller = req.user._id;
//         findProduct.qty = req.body.qty;
//         findProduct.category = req.body.category;
//       }

//       const updatedProduct = await findProduct.save();

//       if (updatedProduct) {
//         res.json({ successMessage: 'Product updated successfully', result: updatedProduct });
//       } else {
//         res.status(400).json({ errorMessage: 'Failed to update product. Please try again' });
//       }
//     } else {
//       res.status(404).json({ errorMessage: 'Product not found' });
//     }
//   } catch (error) {
//     console.log(error);
//     res.send({ errorMessage: 'Internal server error' });
//   }
// };



exports.deleteProduct = async (req, res) => {
  const product = await Product.findById({ _id: req.params.id });
  if (product) {
    await cloudinaryCon.uploader?.destroy(product?.productPicture?.cloudinary_id);
    product.remove();
    res.status(200).json({ successMessage: 'Product Deleted Successfully' });
  }
}

exports.getRelatedProducts = async (req, res) => {
  const products = await Product.find({ category: req.params.id }).exec();
  if (products) {
    res.status(200).send(products);
  } else {
    res.status(201).json({ errorMessage: 'No Related Products' });
  }
}


