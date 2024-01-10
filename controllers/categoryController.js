const Category = require('../models/categoryModel');


exports.getAllCategories = async (req, res) => {
    Category.find({})
        .exec((error, categories) => {
            if (error) {
                res.status(404).json({ errorMessage: 'Error in finding categories' });
            }
            if (categories) {
                res.status(200).send(categories);
            }
        });
}

exports.createMainCategory = async (req, res) => {
    const category = new Category({
        name: req.body.name
    });

    const newCategory = category.save();
    if (newCategory) {
        res.status(200).json({ successMessage: `Category ${req.body.name} created successfully` });
    } else {
        res.status(400).json('Category is not created. Please Try Again')
    }
}

exports.getCategoryById = async (req, res) => {
    const editCategory = await Category.findById({ _id: req.params.id });
    if (editCategory) {
        res.status(200).json({ editCategory });
    }
    else {
        res.status(400).json({ errorMessage: 'Category not found. Please try again' });
    }
}

exports.updateCategory = async (req, res) => {
    const getCat = await Category.findById({ _id: req.params.id });
    if (getCat) {
        getCat.name = req.body.name;
        const newCategory = getCat.save();
        if (newCategory) {
            res.status(200).json({ successMessage: `Category updated successfully` });
        } else {
            res.status(400).json({ errorMessage: 'Category not updated. Please try again' })
        }
    }
    else {
        res.status(400).json({ errorMessage: 'Category not found. Please try again' });
    }
}

exports.deleteCategory = async (req, res) => {
    const deleteCategory = await Category.findById({ _id: req.params.id })
    if (deleteCategory) {
        deleteCategory.remove();
        res.status(200).json({ successMessage: `Category ${deleteCategory.name} has been deleted successfully` });
    } else {
        res.status(400).json({ errorMessage: 'Category could not be deleted. Please try again' });
    }
}
