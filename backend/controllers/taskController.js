const Task = require("../models/Task");

// ==============================
// Create Task
// ==============================

exports.createTask = async (req, res) => {
  try {
    const { title, page } = req.body;

    if (!title || !page) {
      return res.status(400).json({
        message: "Title and Page are required",
      });
    }

    const task = await Task.create({
      title,
      page,
      user: req.user,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==============================
// Get Tasks
// ==============================

exports.getTasks = async (req, res) => {
  try {
    const pageNumber = Number(req.query.page) || 1;
    const limit = 5;
    const skip = (pageNumber - 1) * limit;

    const filter = {
      user: req.user,
    };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    // NEW
    if (req.query.pageId) {
      filter.page = req.query.pageId;
    }

    let sort = {
      createdAt: -1,
    };

    if (req.query.sort === "oldest") {
      sort = {
        createdAt: 1,
      };
    }

    const tasks = await Task.find(filter)
      .populate("page", "name")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(filter);

    res.json({
      tasks,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==============================
// Update Task
// ==============================

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user,
      },
      req.body,
      {
        new: true,
      }
    );

    res.json(task);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==============================
// Delete Task
// ==============================

exports.deleteTask = async (req, res) => {
  try {
    await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};