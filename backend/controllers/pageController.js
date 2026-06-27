const Page = require("../models/Page");

// ==============================
// Create Page
// ==============================

exports.createPage = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Page name is required",
      });
    }

    const page = await Page.create({
      name,
      user: req.user.id,
    });

    res.status(201).json(page);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==============================
// Get All Pages
// ==============================

exports.getPages = async (req, res) => {
  try {
    const pages = await Page.find({
      user: req.user.id,
    }).sort({
      createdAt: 1,
    });

    res.json(pages);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==============================
// Update Page
// ==============================

exports.updatePage = async (req, res) => {
  try {
    const page = await Page.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!page) {
      return res.status(404).json({
        message: "Page not found",
      });
    }

    page.name = req.body.name || page.name;

    await page.save();

    res.json(page);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==============================
// Delete Page
// ==============================

exports.deletePage = async (req, res) => {
  try {
    const page = await Page.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!page) {
      return res.status(404).json({
        message: "Page not found",
      });
    }

    await page.deleteOne();

    res.json({
      message: "Page deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};