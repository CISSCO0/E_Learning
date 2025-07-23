import { useState, useEffect } from "react";
import axios from "axios";

type User = {
  _id: string;
  name: string;
  role: string; // Role mapped as "admin", "instructor", "student"
};

export default function AdminDashboard({ activeTab, userId }: { activeTab: string; userId: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [announcement, setAnnouncement] = useState({
    receivers: "",
    content: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users", { withCredentials: true });
        const mappedUsers = response.data.map((user: any) => ({
          _id: user._id,
          name: user.name,
          role: mapRole(user.role),
        }));
        setUsers(mappedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const mapRole = (role: string): string => {
    switch (role) {
      case "1":
        return "admin";
      case "2":
        return "instructor";
      case "3":
        return "student";
      default:
        return "unknown";
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    try {
      await axios.delete(`http://localhost:5000/users/${userId}`, { withCredentials: true });
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      alert(`User ${userName} has been deleted.`);
    } catch (error) {
      console.error(`Error deleting user ${userName}:`, error);
    }
  };

  const handleCreateBackup = async () => {
    try {
      await axios.post("http://localhost:5000/backup/manual", {}, { withCredentials: true });
      alert("Backup created successfully!");
    } catch (error) {
      console.error("Error creating backup:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setAnnouncement((prev) => ({ ...prev, [id]: value }));
  };

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let receiverIds: string[] = [];
      if (announcement.receivers === "all") {
        receiverIds = users.map((user) => user._id);
      } else if (announcement.receivers === "students") {
        receiverIds = users.filter((user) => user.role === "student").map((user) => user._id);
      } else if (announcement.receivers === "instructors") {
        receiverIds = users.filter((user) => user.role === "instructor").map((user) => user._id);
      }

      await axios.post(
        "http://localhost:5000/notifications",
        {
          senderId: userId,
          receiverId: receiverIds,
          content: announcement.content,
          isRead: false,
        },
        { withCredentials: true }
      );

      alert(`Announcement sent successfully!`);
      setAnnouncement({ receivers: "", content: "" });
    } catch (error) {
      console.error("Error creating announcement:", error);
    }
  };

  return (
    <>
      {/* Manage Accounts Tab */}
      <div className={`tab-content ${activeTab === "manage-accounts" ? "active" : ""}`}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "semibold", marginBottom: "1rem" }}>Manage Accounts</h2>
        <div className="course-grid">
          {users.map((user) => (
            <div key={user._id} className="dashboard-card">
              <h3 className="card-title">{user.name}</h3>
              <p>Role: {user.role}</p>
              <div className="card-content" style={{ display: "flex", justifyContent: "space-between" }}>
                <a href={`/profile/${user._id}`} className="button button-outline">
                  View Profile
                </a>
                <button
                  className="button button-destructive"
                  onClick={() => handleDeleteUser(user._id, user.name)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Backup Tab */}
      <div className={`tab-content ${activeTab === "create-backup" ? "active" : ""}`}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "semibold", marginBottom: "1rem" }}>Create Backup</h2>
        <div className="dashboard-card">
          <h3 className="card-title">System Backup</h3>
          <p>Create a backup of the entire system</p>
          <div className="card-content">
            <button className="button" onClick={handleCreateBackup}>
              Create Backup
            </button>
          </div>
        </div>
      </div>

      {/* Create Announcement Tab */}
      <div className={`tab-content ${activeTab === "announce" ? "active" : ""}`}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "semibold", marginBottom: "1rem" }}>Create Announcement</h2>
        <div className="dashboard-card">
          <h3 className="card-title">New Announcement</h3>
          <p>Create a new announcement for users</p>
          <div className="card-content">
            <form className="form-group" onSubmit={handleAnnouncementSubmit}>
              <div className="form-group">
                <label htmlFor="receivers">Receivers</label>
                <select id="receivers" value={announcement.receivers} onChange={handleInputChange}>
                  <option value="">Select receivers</option>
                  <option value="all">All Users</option>
                  <option value="students">Students</option>
                  <option value="instructors">Instructors</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="content">Announcement Content</label>
                <textarea
                  id="content"
                  value={announcement.content}
                  onChange={handleInputChange}
                  placeholder="Enter your announcement here"
                ></textarea>
              </div>
              <button type="submit" className="button">
                Send Announcement
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
