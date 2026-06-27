// ==========================
// Tasks.js (PART 1 of 4)
// Replace everything in your current Tasks.js with this first.
// DO NOT close the component until Part 4.
// ==========================

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Tasks() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);

  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [newPage, setNewPage] = useState("");
  const [title, setTitle] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState("latest");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);

  // Greeting
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning ☀️"
      : hour < 17
      ? "Good Afternoon 🌤️"
      : "Good Evening 🌙";

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // -----------------------
  // Authentication
  // -----------------------

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  // -----------------------
  // Fetch Tasks
  // -----------------------

useEffect(() => {
  fetchPages();
}, []);

useEffect(() => {
  if (selectedPage) {
    fetchTasks();
  }
}, [
  page,
  statusFilter,
  sort,
  selectedPage,
]);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const res = await api.get(
  `/tasks?page=${page}&pageId=${selectedPage}&status=${statusFilter}&sort=${sort}`
);

      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
// ======================
// Fetch Pages
// ======================

const fetchPages = async () => {
  try {
    const res = await api.get("/pages");

    setPages(res.data);

    if (res.data.length > 0 && !selectedPage) {
      setSelectedPage(res.data[0]._id);
    }
  } catch (err) {
    console.log(err);
  }
};

// ======================
// Create Page
// ======================

const createPage = async () => {
  if (!newPage.trim()) return;

  try {
const res = await api.post("/pages", {
  name: newPage,
});

setNewPage("");

await fetchPages();

setSelectedPage(res.data._id);
  } catch (err) {
    console.log(err);
  }
};
  // -----------------------
  // Add Task
  // -----------------------

  const addTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      await api.post("/tasks", {
  title,
  page: selectedPage,
});

      setTitle("");
      setPage(1);

      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // -----------------------
  // Update Status
  // -----------------------

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/tasks/${id}`, {
        status,
      });

      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // -----------------------
  // Delete Task
  // -----------------------

  const deleteTask = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this task?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/tasks/${id}`);

      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // -----------------------
  // Logout
  // -----------------------

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // -----------------------
  // Search
  // -----------------------

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      task.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [tasks, search]);

  // -----------------------
  // Statistics
  // -----------------------

  const total = tasks.length;

  const pending = tasks.filter(
    (t) => t.status === "Pending"
  ).length;

  const progress = tasks.filter(
    (t) => t.status === "In-Progress"
  ).length;

  const completed = tasks.filter(
    (t) => t.status === "Completed"
  ).length;

  const percentage =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  // ===========================
  // UI STARTS HERE
  // ===========================

return (

<div
  style={{
    display: "flex",
    minHeight: "100vh",
  }}
>

{/* ================= Sidebar ================= */}

<div
  style={{
    width: "280px",
    background: "rgba(255,255,255,.12)",
    backdropFilter: "blur(15px)",
    padding: "25px",
    color: "white",
    borderRight: "1px solid rgba(255,255,255,.15)",
  }}
>

<h2
  style={{
    marginBottom: "30px",
    textAlign: "center",
  }}
>
📝 TO-DO Pro
</h2>

<input
  type="text"
  placeholder="New Page"
  value={newPage}
  onChange={(e)=>setNewPage(e.target.value)}
/>

<button
  onClick={createPage}
  style={{
    marginBottom: "25px",
  }}
>
➕ Create Page
</button>

<div>

{pages.map((page)=>{

return(

<div
key={page._id}

onClick={()=>{

setSelectedPage(page._id);
setPage(1);

}}

style={{

padding:"14px",

marginBottom:"10px",

borderRadius:"12px",

cursor:"pointer",

background:
  selectedPage === page._id
    ? "linear-gradient(135deg,#667eea,#764ba2)"
    : "transparent",

boxShadow:
  selectedPage === page._id
    ? "0 10px 25px rgba(0,0,0,.25)"
    : "none",

fontWeight:
  selectedPage === page._id
    ? "600"
    : "400",

transition:".3s"

}}

>

</div>

);

})}

</div>

<div
style={{
marginTop:"40px"
}}
>

<button

onClick={logout}

style={{
background:"#ef4444"
}}

>

Logout

</button>

</div>

</div>

{/* ================= Main Content ================= */}

<div
style={{
flex:1,
padding:"30px"
}}
>

<div className="dashboard">

      <div className="header">

        <div>
          <h1 style={{ color: "white" }}>
  📁{" "}
  {pages.find((p) => p._id === selectedPage)?.name ||
    "Dashboard"}
</h1>

          <p style={{ color: "white" }}>
            {greeting}
          </p>

          <p style={{ color: "#eee" }}>
            {today}
          </p>

        </div>


      </div>
      {/* Add Task */}

      <div
        className="card"
        style={{
          marginBottom: 30,
        }}
      >
        <form
          onSubmit={addTask}
          style={{
            width: "100%",
            background: "transparent",
            boxShadow: "none",
            border: "none",
            padding: 0,
          }}
        >
          <input
            type="text"
            placeholder="📝 What do you want to accomplish today?"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
          />

          <button
            type="submit"
            disabled={!title.trim()}
          >
            ➕ Add Task
          </button>
        </form>
      </div>

      
        {/* Search + Filters */}

      <div
        className="card"
        style={{
          marginBottom: 25,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "2fr 1fr 1fr",
            gap: "15px",
          }}
        >
          <input
            type="text"
            placeholder="🔍 Search Tasks..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(
                e.target.value
              );
            }}
          >
            <option value="">
              All Status
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="In-Progress">
              In Progress
            </option>

            <option value="Completed">
              Completed
            </option>
          </select>

          <select
            value={sort}
            onChange={(e) => {
              setPage(1);
              setSort(e.target.value);
            }}
          >
            <option value="latest">
              Latest
            </option>

            <option value="oldest">
              Oldest
            </option>
          </select>
        </div>
      </div>


      {/* Task Cards */}

      {filteredTasks.map((task) => {

        let badgeClass =
          "pending";

        if (
          task.status ===
          "Completed"
        ) {
          badgeClass =
            "completed";
        }

        if (
          task.status ===
          "In-Progress"
        ) {
          badgeClass =
            "progress";
        }

        return (

          <div
            className="task-card"
            key={task._id}
          >

            <h3>
              {task.title}
            </h3>

            <span
              className={`badge ${badgeClass}`}
            >
              {task.status}
            </span>

            <p>
              Status
            </p>

            <select
              value={task.status}
              onChange={(e) =>
                updateStatus(
                  task._id,
                  e.target.value
                )
              }
            >
              <option value="Pending">
                Pending
              </option>

              <option value="In-Progress">
                In Progress
              </option>

              <option value="Completed">
                Completed
              </option>
            </select>

            <div className="task-actions">

              <button
                className="delete-btn"
                onClick={() =>
                  deleteTask(
                    task._id
                  )
                }
              >
                🗑 Delete
              </button>

            </div>

          </div>

        );

      })}
      {/* Loading */}

      {loading && (
        <div
          className="card"
          style={{
            textAlign: "center",
            color: "white",
          }}
        >
          Loading Tasks...
        </div>
      )}

      {/* Empty */}

      {!loading &&
        filteredTasks.length ===
          0 && (
          <div
  className="card"
  style={{
    textAlign: "center",
    marginBottom: "50px",   // Increase this value as needed
  }}
>
            <h2
              style={{
                marginBottom: 15,
              }}
            >
              📭
            </h2>

            <h3
              style={{
                color: "white",
              }}
            >
              No Tasks Found
            </h3>

            <p
              style={{
                color: "#eee",
              }}
            >
              Add your first task
              to get started.
            </p>
          </div>
        )}

      
      {/* Statistics Cards */}

      <div className="cards">

        <div className="card">
          <h3>Total Tasks</h3>
          <p>{total}</p>
        </div>

        <div className="card">
          <h3>Pending</h3>
          <p>{pending}</p>
        </div>

        <div className="card">
          <h3>In Progress</h3>
          <p>{progress}</p>
        </div>

        <div className="card">
          <h3>Completed</h3>
          <p>{completed}</p>
        </div>

      </div>

      {/* Progress */}

      <div
        className="card"
        style={{ marginBottom: 25 }}
      >
        <h3>Overall Progress</h3>

        <div
          style={{
            width: "100%",
            height: "12px",
            background: "#ddd",
            borderRadius: "10px",
            overflow: "hidden",
            marginTop: "15px"
          }}
        >

          <div
            style={{
              width: `${percentage}%`,
              height: "100%",
              background:
                "linear-gradient(90deg,#22c55e,#16a34a)"
            }}
          />

        </div>

        <p
          style={{
            marginTop: "15px",
            color: "white"
          }}
        >
          {percentage}% Completed
        </p>

      </div>
            

      
            {/* Pagination */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "15px",
          marginTop: "30px",
          marginBottom: "40px",
        }}
      >
        <button
          style={{ width: "120px" }}
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          ← Previous
        </button>

        <div
          style={{
            background: "rgba(255,255,255,.18)",
            color: "white",
            padding: "12px 20px",
            borderRadius: "12px",
            fontWeight: "600",
          }}
        >
          Page {page} of {totalPages}
        </div>

        <button
          style={{ width: "120px" }}
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next →
        </button>
      </div>

      {/* Footer */}

      <div
        style={{
          textAlign: "center",
          color: "rgba(255,255,255,.8)",
          paddingBottom: "20px",
        }}
      >
        <p>
          Made using React • Express • MongoDB • Node.js
        </p>
      </div>

   </div>

</div>

</div>

);
}

export default Tasks;
