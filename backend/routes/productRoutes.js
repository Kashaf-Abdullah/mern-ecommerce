const express = require('express');
const router = express.Router();
const {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct,
  uploadImages, deleteImage, getSearchSuggestions
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/suggestions', getSearchSuggestions);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);
router.post('/:id/images', protect, authorize('admin'), upload.array('images', 10), uploadImages);
router.delete('/:id/images/:imageId', protect, authorize('admin'), deleteImage);

module.exports = router;
