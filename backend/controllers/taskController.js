const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  const task = await Task.create({
    title: req.body.title,
    user: req.user
  });
  res.status(201).json(task);
};

exports.getTasks = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  const filter = { user: req.user };
  if (req.query.status) filter.status = req.query.status;

  let sort = { createdAt: -1 };
  if (req.query.sort === "oldest") sort = { createdAt: 1 };

  const tasks = await Task.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Task.countDocuments(filter);

  res.json({
    tasks,
    totalPages: Math.ceil(total / limit)
  });
};

exports.updateTask = async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user },
    req.body,
    { new: true }
  );
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user
  });
  res.json({ message: "Task deleted" });
};
