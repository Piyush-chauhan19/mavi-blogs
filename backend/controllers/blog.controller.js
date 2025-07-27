const { validationResult } = require('express-validator')
const userModel = require('../models/user.model')
const blogModel = require('../models/blog.model')

module.exports.createBlog = async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(400).json({ error: err.array() });
  }

  const blog = await blogModel.create({
    title: req.body.title,
    content: req.body.content,
    author: req.user._id,
    coverPic: req.file?.filename
  })

  res.status(200).json("blog created")
}

module.exports.getBlogsByAuthor = async (req, res) => {
  try {
    const user = await userModel.findOne({ userName: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const blogs = await blogModel.find({ author: user._id })
      .sort({ createdAt: -1 }) // latest first
      .limit(4)
      .populate('author', 'userName'); // optional: limit to latest 4 blogs

    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports.getMostLikedBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const blogs = await blogModel.find()
    .sort({ likes: -1 })
    .skip(skip)
    .limit(limit)
    .populate('author', 'userName');

  res.json(blogs);
};

module.exports.getLatestBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const blogs = await blogModel.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('author', 'userName');

  res.json(blogs);
};

module.exports.getRecommendedBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const blogs = await blogModel.find()
    .skip(skip)
    .limit(limit)
    .populate('author', 'userName');

  res.json(blogs);
};


module.exports.getBlogById = async (req, res) => {
  try {
    const blog = await blogModel.findById(req.params.id).populate('author', 'userName');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blog', error: err.message });
  }
};

module.exports.toggleLike = async (req, res) => {
  try {
    console.log('found blog')
    const blog = await blogModel.findById(req.params.id);
    const userId = req.user._id;

    const alreadyLiked = blog.likes.includes(userId);
    if (alreadyLiked) {
      blog.likes.pull(userId); // unlike
    } else {
      blog.likes.push(userId); // like
    }

    await blog.save();
    res.json({ liked: !alreadyLiked, likes: blog.likes });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blog', error: err.message });
  }

};

module.exports.updateBlog = async (req, res) => {
  try {
    const blog = await blogModel.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (req.user._id.toString() !== blog.author.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { title, content } = req.body;

    blog.title = title || blog.title;
    blog.content = content || blog.content;

    if (req.file) {
      blog.coverPic = req.file.filename;
    }

    await blog.save();

    res.status(200).json({ message: 'Blog updated', blog });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

module.exports.deleteBlog = async (req, res) => {
  try {
    const blog = await blogModel.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (req.user._id.toString() !== blog.author.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await blogModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

