const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const authMiddleware = require('../middlewares/authUser')
const blogController = require('../controllers/blog.controller')
const upload = require('../middlewares/upload')

router.patch('/like/:id', authMiddleware.authUser, blogController.toggleLike);

router.post('/create',
  authMiddleware.authUser,
  upload.single('coverPic'),
  [body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('content')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters')],
  blogController.createBlog
);
router.patch('/update/:id',
  authMiddleware.authUser,
  upload.single('coverPic'),
  blogController.updateBlog
);

router.delete('/delete/:id',
  authMiddleware.authUser,
  blogController.deleteBlog
);

router.get('/by-author/:username', blogController.getBlogsByAuthor);

router.get('/most-liked', blogController.getMostLikedBlogs);

router.get('/latest', blogController.getLatestBlogs);

router.get('/home', blogController.getRecommendedBlogs);

router.get('/:id', blogController.getBlogById);

module.exports = router;