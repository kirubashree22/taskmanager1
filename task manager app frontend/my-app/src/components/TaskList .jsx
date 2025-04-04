import React, { useState, useEffect } from "react";
import { Table, Input, Button, Modal, Form, Select, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Get token from either localStorage or sessionStorage

  
  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  // Fetch tasks from backend
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
          sno: (currentPage - 1) * 5 + index + 1,
          createdDate: new Date(task.createdAt).toLocaleDateString(),
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
  

  useEffect(() => {
    fetchTasks();
  }, [currentPage, searchText]);

  // Search handler
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  const handleLogout = () => {
    localStorage.clear();        // Clears token and any stored values
    sessionStorage.clear();      // Clears token and any session values
    message.success("Logged out successfully");
    navigate("/");               // Go back to login screen
  };
  

  // Modal management
  const handleCreate = () => {
    form.resetFields();
    setEditingTask(null);
    setIsModalVisible(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    form.setFieldsValue(task);
    setIsModalVisible(true);
  };

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
  const token = getToken();
if (!token) {
  message.error("Authentication token not found. Please login again.");
  navigate("/");
  return;
}


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

export default TaskList;
