const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    // Find all products
    const productInfo = await Product.findAll({
      include: [{ model: Category}, { model: Tag, through: ProductTag}]
    });

    res.status(200).json(productInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

  // be sure to include its associated Category and Tag data


// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productInfo = await Product.findByPk(req.params.id, {
        include: [{ model: Category }, { model: Tag, through: ProductTag  }],
    });
    if (!productInfo) {
        res.status(404).json({ message: 'No product found with that id!' });
        return;
    };
    res.status(200).json(productInfo);
} catch (e) {
    res.status(500).json(e);
};
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
     
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((error) => {
      console.log(err);
      res.status(400).json(error);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

            
          const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
                 
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product id
  try {
    const prodInfo = await Product.destroy({
      where: {
        id: req.params.id
      },
    });
    if (!prodData[0]) {
      res.status(200).json({ message: 'Product has been removed' });
      return;
    }
    res.status(200).json(prodInfo);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
