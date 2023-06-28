const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const catData = await Category.findAll();
    res.status(200).json(catData);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const catData = await Category.findByPk(req.params.id);
    res.status(200).json(catData)
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/', (req, res) => {
  // create a new category
  Category.create(req.body)
  .then((createdCategory) => {
    res.json(createdCategory)
  })
  .catch ((error) => {
    res.json(error)
  })
});

   // update a category by its `id` value
  router.put('/:id', async (req, res) => {
    try {
      const catData = await Category.update(req.body, {
        where: {
          id: req.params.id,
        },
      });
      if (!categoryData[0]) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }
      res.status(200).json(catData);
    } catch (err) {
      res.status(500).json(err);
    }
  });


router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const catData = await Category.destroy({
     where: {
      id: req.params.id
     }, 
    });
    if (!catData[0]) {
      res.status(200).json({ message: 'Category has been removed' });
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
   }
});

module.exports = router;
