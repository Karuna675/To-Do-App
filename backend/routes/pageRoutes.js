const express = require("express");
const router = express.Router();

const {
  createPage,
  getPages,
  updatePage,
  deletePage,
} = require("../controllers/pageController");

const authMiddleware = require("../middleware/authMiddleware");

// All routes require authentication
router.use(authMiddleware);

// GET all pages
router.get("/", getPages);

// CREATE page
router.post("/", createPage);

// UPDATE page
router.put("/:id", updatePage);

// DELETE page
router.delete("/:id", deletePage);

module.exports = router;