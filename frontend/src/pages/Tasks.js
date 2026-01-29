import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Tasks() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState("latest");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 🔐 Auth protection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  // 📥 Fetch tasks
  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, [page, statusFilter, sort]);

  const fetchTasks = async () => {
    try {
      const res = await api.get(
        `/tasks?page=${page}&status=${statusFilter}&sort=${sort}`
      );
      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  // ➕ Add task
  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await api.post("/tasks", { title });
      setTitle("");
      setPage(1);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔄 Update task status
  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/tasks/${id}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="container">
      <h2>My Tasks</h2>

      <button className="logout" onClick={logout}>
        Logout
      </button>

      {/* Filters */}
      <select
        value={statusFilter}
        onChange={(e) => {
          setPage(1);
          setStatusFilter(e.target.value);
        }}
      >
        <option value="">All Status</option>
        <option value="Pending">Pending</option>
        <option value="In-Progress">In-Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <select
        value={sort}
        onChange={(e) => {
          setPage(1);
          setSort(e.target.value);
        }}
      >
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
      </select>

      {/* Add Task */}
      <form onSubmit={addTask}>
        <input
          type="text"
          placeholder="New task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit" disabled={!title.trim()}>
          Add Task
        </button>
      </form>

      {/* Task List */}
      {tasks.length === 0 && <p>No tasks found</p>}

      {tasks.map((task) => (
        <div className="task" key={task._id}>
          <span>{task.title}</span>
          <select
            value={task.status}
            onChange={(e) => updateStatus(task._id, e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="In-Progress">In-Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      ))}

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Tasks;
