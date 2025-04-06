// 1. Import necessary modules and components
import React, { useState, useEffect } from "react";
import { Table, Input, Button, Modal, Form, Select, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const TaskList = () => {
  // 2. Define and initialize component state
  const [tasks, setTasks] = useState([]); // Stores task list
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [totalPages, setTotalPages] = useState(0); // Total pages from backend
  const [searchText, setSearchText] = useState(""); // Search input text
  const [loading, setLoading] = useState(false); // Loading state for fetch
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility
  const [editingTask, setEditingTask] = useState(null); // Task being edited
  const [form] = Form.useForm(); // Ant Design form instance
  const navigate = useNavigate(); // For navigation (e.g. logout redirect)

  // 3. Utility function to retrieve JWT token from storage
  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  // 4. Fetch tasks from backend using current pagination and search text
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(
        `http://localhost:5000/api/tasks?page=${currentPage}&limit=5&search=${searchText}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        const formatted = data.tasks.map((task, index) => ({
          ...task,
          sno: (currentPage - 1) * 5 + index + 1, // Calculate serial number
          createdDate: new Date(task.createdAt).toLocaleDateString(), // Format date
        }));
        setTasks(formatted);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error("Error fetching tasks", err);
      message.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  // 5. Trigger task fetch on page load and when pagination or search text changes
  useEffect(() => {
    fetchTasks();
  }, [currentPage, searchText]);

  // 6. Handle search input change and reset to first page
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  // 7. Logout function clears local/session storage and redirects to login
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("savedEmail");
    localStorage.removeItem("savedPassword");
    localStorage.removeItem("rememberMe");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  // 8. Open modal for task creation
  const handleCreate = () => {
    form.resetFields();
    setEditingTask(null);
    setIsModalVisible(true);
  };

  // 9. Open modal with task data for editing
  const handleEdit = (task) => {
    setEditingTask(task);
    form.setFieldsValue(task);
    setIsModalVisible(true);
  };

  // 10. Delete task by ID and refresh list
  const handleDelete = async (id) => {
    try {
      const token = getToken();
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Task deleted");
      fetchTasks();
    } catch (err) {
      console.error("Delete error", err);
      message.error("Failed to delete task");
    }
  };

  // 11. Redirect to login if token is not found
  const token = getToken();
  if (!token) {
    message.error("Authentication token not found. Please login again.");
    navigate("/");
    return;
  }

  // 12. Validate form and send request to create or update task
  const handleSave = () => {
    form.validateFields().then(async (values) => {
      const token = getToken();
      try {
        const url = editingTask
          ? `http://localhost:5000/api/tasks/${editingTask.id}`
          : "http://localhost:5000/api/tasks";

        const method = editingTask ? "PUT" : "POST";

        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });

        const result = await response.json();

        if (result.success) {
          message.success(editingTask ? "Task updated" : "Task created");
          setIsModalVisible(false);
          fetchTasks();
        } else {
          message.error(result.message || "Save failed");
        }
      } catch (error) {
        console.error("Save error", error);
        message.error("Something went wrong");
      }
    });
  };

  // 13. Define table column layout and actions
  const columns = [
    { title: "S.NO", dataIndex: "sno", key: "sno", align: "center" },
    { title: "ID", dataIndex: "id", key: "id", align: "center" },
    { title: "NAME", dataIndex: "name", key: "name", align: "center" },
    { title: "DESCRIPTION", dataIndex: "description", key: "description", align: "center" },
    { title: "CREATED DATE", dataIndex: "createdDate", key: "createdDate", align: "center" },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (text) => <span className="status">{text}</span>,
    },
    {
      title: "ACTIONS",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <div className="action-icons">
          <EditOutlined className="edit-icon" onClick={() => handleEdit(record)} />
          <DeleteOutlined className="delete-icon" onClick={() => handleDelete(record.id)} />
        </div>
      ),
    },
  ];

  // 14. Render UI: Header, Search, Table, Modal Form
  return (
    <div className="task-list-container">
      <div
        className="header"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <h2>Task List</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <Input
            placeholder="Search by name..."
            value={searchText}
            onChange={handleSearch}
            className="search-box"
            style={{ width: 200 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Create
          </Button>
          <Button danger onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <Table
  columns={columns}
  dataSource={tasks}
  loading={loading}
  rowKey="id"
  pagination={{
    current: currentPage,
    pageSize: 5,
    total: totalPages * 5,
    onChange: (page) => setCurrentPage(page),
    showSizeChanger: false,
  }}
  bordered
  // scroll={{ y: 300 }} 
/>



      <Modal
        title={editingTask ? "Edit Task" : "Create Task"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
        okText={editingTask ? "Update" : "Create"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter the task name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status!" }]}
          >
            <Select>
              <Option value="pending">Pending</Option>
              <Option value="in-progress">In Progress</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// 15. Export component as default
export default TaskList;
