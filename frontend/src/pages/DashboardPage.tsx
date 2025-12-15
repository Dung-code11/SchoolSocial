// src/pages/DashboardPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/DashboardPage.module.css";
import {
  Search,
  Bell,
  User as UserIcon,
  LogOut,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Plus,
  Upload,
  RefreshCw,
  Shield,
  UserCheck,
  UserX,
  Calendar,
  Mail,
  Settings,
  Users,
  BookOpen,
  GraduationCap,
  Key,
  History,
  FileText,
  Heart,
  MessageCircle,
  EyeOff,
  AlertCircle // Thêm icon này
} from "lucide-react";

// Services và Types
import { userService } from "../services/userService";
import type { User, UserStatus } from "../types/user.type";
import { classService } from "../services/classService";
import postService from "../services/postService";
import type { Post, Interaction } from "../types/post.type";
// Modal component
import UserModal from "../components/Dashboard/UserModal";
import ClassModal from "../components/Dashboard/ClassModal";
import PostModal from "../components/Dashboard/PostModal";
const DashboardPage: React.FC = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("Quản lý tài khoản");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedMenuItems, setExpandedMenuItems] = useState<number[]>([1]);
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Class state
  const [classList, setClassList] = useState<SchoolClass[]>([]);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);
  const [classModalMode, setClassModalMode] = useState<"create" | "edit">(
    "create"
  );
   // Post management state - ĐÃ THÊM CÁC BIẾN CÒN THIẾU
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postModalMode, setPostModalMode] = useState<'view' | 'create' | 'edit'>('view');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [postCurrentPage, setPostCurrentPage] = useState(0); // THÊM BIẾN NÀY
  const [postTotalPages, setPostTotalPages] = useState(1); // THÊM BIẾN NÀY

  // Interaction history state - ĐÃ THÊM CÁC BIẾN CÒN THIẾU
  const [interactions, setInteractions] = useState<any[]>([]); // Tạm dùng any
  const [interactionTypeFilter, setInteractionTypeFilter] = useState('all');
  const [interactionUserId, setInteractionUserId] = useState<number | undefined>();
  const [interactionCurrentPage, setInteractionCurrentPage] = useState(0); // THÊM BIẾN NÀY
  const [interactionTotalPages, setInteractionTotalPages] = useState(1); // THÊM BIẾN NÀY

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);

  // Modal state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userModalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Lấy thông tin user từ localStorage
  // Trong DashboardPage.tsx, sửa phần useEffect:
  useEffect(() => {
    const role = localStorage.getItem("role") || "User";
    const savedUsername = localStorage.getItem("username") || "Admin";
    setUserRole(role);
    setUserName(savedUsername);
  }, []);
  // Lấy danh sách users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getUsers(
        searchTerm || undefined,
        selectedRole !== "all" ? selectedRole : undefined,
        selectedStatus !== "all" ? selectedStatus : undefined,
        currentPage,
        pageSize
      );

      setUsers(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  // Load users khi component mount và khi filter thay đổi
  useEffect(() => {
    fetchUsers();
  }, [currentPage, selectedRole, selectedStatus]);
  // Load Classes
  useEffect(() => {
    if (activeMenuItem === "Quản lý lớp học") {
      loadClasses();
    }
  }, [activeMenuItem]);

  async function loadClasses() {
    try {
      const data = await classService.getAllClasses();
      setClassList(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách lớp:", error);
    }
  }

  // Xử lý Class
  const handleCreateClass = async (data: CreateClassDTO) => {
    try {
      await classService.createClass(data);
      await loadClasses();
      setIsClassModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi tạo lớp:", error);
      throw error;
    }
  };

  const handleUpdateClass = async (id: number, data: UpdateClassDTO) => {
    try {
      await classService.updateClass(id, data);
      await loadClasses();
      setIsClassModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật lớp:", error);
      throw error;
    }
  };

  const handleDeleteClass = async (id: number) => {
    try {
      await classService.deleteClass(id);
      await loadClasses();
    } catch (error) {
      console.error("Lỗi khi xóa lớp:", error);
      throw error;
    }
  };
  //Tương tác và bài viết
  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await postService.getAllPosts(
        postCurrentPage, 
        10, 
        searchTerm || undefined,
        interactionUserId
      );
      setPosts(response.content);
      setPostTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load interactions function - ĐÃ SỬA (tạm thời)
  const loadInteractions = async () => {
    setLoading(true);
    try {
      // Tạm thời: gọi API lấy like history
      const response = await postService.getLikeHistory?.(
        interactionCurrentPage,
        10,
        interactionUserId,
        undefined // postId
      );
      setInteractions(response?.content || []);
      setInteractionTotalPages(response?.totalPages || 1);
    } catch (error) {
      console.error('Error loading interactions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle post actions
  const handleCreatePost = async () => {
    try {
      await postService.createPost({ content: newPostContent });
      setNewPostContent('');
      await loadPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        await postService.deletePost(postId);
        await loadPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

// Trong DashboardPage.tsx
const handleToggleHidePost = async (postId: number) => {
  try {
    console.log('Toggling visibility for post:', postId);
    
    // Sử dụng API mới
    await postService.togglePostVisibility(postId);
    
    // Load lại danh sách
    await loadPosts();
    
    console.log('Post visibility toggled successfully');
  } catch (error: any) {
    console.error('Error toggling post visibility:', error);
    
    // Hiển thị thông báo lỗi chi tiết
    if (error.response?.status === 403) {
      alert('Bạn không có quyền thay đổi trạng thái bài viết này');
    } else if (error.response?.status === 404) {
      alert('Bài viết không tồn tại');
    } else {
      alert('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
    }
  }
};

  // Effect hooks - ĐÃ SỬA
  useEffect(() => {
    if (activeMenuItem === 'Quản lý bài viết') {
      loadPosts();
    } else if (activeMenuItem === 'Lịch sử tương tác') {
      loadInteractions();
    }
  }, [activeMenuItem, postCurrentPage, interactionCurrentPage]);
  // Search với debounce
    useEffect(() => {
    const timer = setTimeout(() => {
      if (activeMenuItem === 'Quản lý tài khoản') {
        setCurrentPage(0);
        fetchUsers();
      } else if (activeMenuItem === 'Quản lý bài viết') {
        setPostCurrentPage(0);
        loadPosts();
      } else if (activeMenuItem === 'Lịch sử tương tác') {
        setInteractionCurrentPage(0);
        loadInteractions();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, interactionTypeFilter, interactionUserId]);

  const menuItems = [
    {
      id: 1,
      name: "Quản lý tài khoản",
      icon: <Users size={20} />,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Thông tin cá nhân",
      icon: <UserIcon size={20} />,
      path: "/dashboard/profile",
    },
    {
      id: 3,
      name: "Quản lý lớp học",
      icon: <BookOpen size={20} />,
      path: "/dashboard/classes",
    },
      {
    id: 4,
    name: "Quản lý bài viết",
    icon: <FileText size={20} />,  // Icon cho bài viết
    path: "/dashboard/posts",  // Bạn nên đổi path này cho phù hợp
  },
  {
    id: 5,
    name: "Lịch sử tương tác",
    icon: <History size={20} />,  // Icon cho lịch sử
    path: "/dashboard/interaction-history",  // Bạn nên đổi path này cho phù hợp
  },
    {
      id: 6,
      name: "Quản lý Role",
      icon: <Shield size={20} />,
      subItems: [
        {
          id: 41,
          name: "Phân quyền",
          icon: <Key size={18} />,
          path: "/dashboard/permissions",
        },
      ],
    },
  ];

  const toggleExpand = (id: number) => {
    setExpandedMenuItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleMenuItemClick = (itemName: string, itemId?: number) => {
    setActiveMenuItem(itemName);
    if (itemId) {
      toggleExpand(itemId);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const handleOpenModal = (mode: "create" | "edit" | "view", user?: User) => {
    setModalMode(mode);
    setSelectedUser(user || null);
    setIsUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = async (userData: any) => {
    try {
      if (userModalMode === "create") {
        await userService.createUser(userData);
        alert("Tạo người dùng thành công");
      } else if (userModalMode === "edit" && selectedUser) {
        await userService.updateUser(selectedUser.id, userData);
        alert("Cập nhật người dùng thành công");
      }
      handleCloseUserModal();
      fetchUsers();
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi khi lưu người dùng");
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await userService.deleteUser(id);
        alert("Xóa người dùng thành công");
        fetchUsers();
      } catch (error) {
        alert("Lỗi khi xóa người dùng");
      }
    }
  };

  const handleChangeStatus = async (id: number) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    const newStatus: UserStatus =
      user.status === "ACTIVE" ? "LOCKED" : "ACTIVE";
    try {
      await userService.changeStatus(id, newStatus);
      alert("Thay đổi trạng thái thành công");
      fetchUsers();
    } catch (error) {
      alert("Lỗi khi thay đổi trạng thái");
    }
  };

  const handleExportExcel = async () => {
    try {
      await userService.exportExcel();
    } catch (error) {
      alert("Lỗi khi xuất Excel");
    }
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (window.confirm(`Bạn có chắc muốn import file ${file.name}?`)) {
        userService
          .importExcel(file)
          .then(() => {
            alert("Import Excel thành công");
            fetchUsers();
          })
          .catch(() => {
            alert("Lỗi khi import Excel");
          });
      }
    }
  };

  const getStatusText = (status: UserStatus) => {
    return status === "ACTIVE" ? "Hoạt động" : "Không hoạt động";
  };

  const getStatusClass = (status: UserStatus) => {
    return status === "ACTIVE" ? styles.activeStatus : styles.inactiveStatus;
  };

  const getRoleClass = (role: string) => {
    switch (role) {
      case "ADMIN":
        return styles.roleAdmin;
      case "TEACHER":
        return styles.roleTeacher;
      case "STUDENT":
        return styles.roleStudent;
      default:
        return "";
    }
  };

  const renderSidebar = () => (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}>
            <GraduationCap size={32} />
          </div>
          <div>
            <h1 className={styles.systemTitle}>SchoolConnect</h1>
            <p className={styles.systemSubtitle}>Admin Dashboard</p>
          </div>
        </div>
        <div className={styles.greeting}>Hi thông quản lý</div>
      </div>

      <nav className={styles.sidebarMenu}>
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className={styles.menuItem}>
              <div
                className={`${styles.menuLink} ${
                  activeMenuItem === item.name ? styles.active : ""
                }`}
                onClick={() => handleMenuItemClick(item.name, item.id)}
              >
                <div className={styles.menuIcon}>{item.icon}</div>
                <span className={styles.menuText}>{item.name}</span>
                {item.subItems && (
                  <span className={styles.menuArrow}>
                    {expandedMenuItems.includes(item.id) ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </span>
                )}
              </div>

              {item.subItems && expandedMenuItems.includes(item.id) && (
                <ul className={styles.subMenu}>
                  {item.subItems.map((subItem) => (
                    <li key={subItem.id}>
                      <div
                        className={`${styles.subMenuLink} ${
                          activeMenuItem === subItem.name ? styles.active : ""
                        }`}
                        onClick={() => handleMenuItemClick(subItem.name)}
                      >
                        <div className={styles.subMenuIcon}>{subItem.icon}</div>
                        <span className={styles.subMenuText}>
                          {subItem.name}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.sidebarFooter}>
        <button className={styles.logoutButton} onClick={handleLogout}>
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );

  const renderHeader = () => {
    const getInitials = (name: string) => {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    };

    return (
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.searchBar}>
            <div className={styles.searchContainer}>
              <Search size={20} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              {searchTerm && (
                <button
                  className={styles.clearSearch}
                  onClick={() => setSearchTerm("")}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div className={styles.headerActions}>
            <button className={styles.notificationButton}>
              <Bell size={22} />
              <span className={styles.notificationBadge}>3</span>
            </button>

            <div className={styles.userProfile}>
              <div className={styles.userAvatar}>
                <span>{getInitials(userName)}</span>
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{userName}</span>
                <span className={styles.userRole}>{userRole}</span>
              </div>
              <ChevronDown size={18} className={styles.userDropdown} />
            </div>
          </div>
        </div>
      </header>
    );
  };

  const renderActionButtons = (user: User) => (
    <div className={styles.actionButtons}>
      <button
        className={styles.viewButton}
        onClick={() => handleOpenModal("view", user)}
        title="Xem chi tiết"
      >
        <Eye size={16} />
      </button>
      <button
        className={styles.editButton}
        onClick={() => handleOpenModal("edit", user)}
        title="Chỉnh sửa"
      >
        <Edit size={16} />
      </button>
      <button
        className={styles.statusButton}
        onClick={() => handleChangeStatus(user.id)}
        title="Thay đổi trạng thái"
      >
        {user.status === "ACTIVE" ? (
          <UserX size={16} />
        ) : (
          <UserCheck size={16} />
        )}
      </button>
      <button
        className={styles.deleteButton}
        onClick={() => handleDeleteUser(user.id)}
        title="Xóa"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  const renderUserTable = () => (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <div className={styles.tableTitle}>
          <h2>Quản lý tài khoản</h2>
          <p className={styles.tableDescription}>
            Tổng số: {totalElements} người dùng
          </p>
        </div>

        <div className={styles.tableActions}>
          <div className={styles.filterGroup}>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Tất cả Role</option>
              <option value="Admin">Admin</option>
              <option value="Teacher">Teacher</option>
              <option value="Student">Student</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="LOCKED">Không hoạt động</option>
            </select>

            <button
              className={styles.refreshButton}
              onClick={fetchUsers}
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? styles.spinning : ""} />
              <span>Làm mới</span>
            </button>
          </div>

          <div className={styles.actionButtons}>
            <div className={styles.uploadWrapper}>
              <input
                type="file"
                id="excelUpload"
                accept=".xlsx,.xls"
                onChange={handleImportExcel}
                style={{ display: "none" }}
              />
              <label htmlFor="excelUpload" className={styles.uploadButton}>
                <Upload size={16} />
                <span>Nhập Excel</span>
              </label>
            </div>

            <button className={styles.exportButton} onClick={handleExportExcel}>
              <Download size={16} />
              <span>Xuất Excel</span>
            </button>

            <button
              className={styles.addButton}
              onClick={() => handleOpenModal("create")}
            >
              <Plus size={16} />
              <span>Thêm người dùng</span>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        {loading ? (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>Họ và tên</th>
                <th>Email</th>
                <th>Role</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className={styles.userInfo}>
                        <div className={styles.avatar}>
                          {user.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div className={styles.userName}>{user.fullName}</div>
                          <div className={styles.userId}>ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.emailCell}>
                        <Mail size={14} className={styles.emailIcon} />
                        {user.email}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`${styles.roleBadge} ${getRoleClass(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${getStatusClass(
                          user.status
                        )}`}
                      >
                        {user.status === "ACTIVE" ? (
                          <UserCheck size={14} />
                        ) : (
                          <UserX size={14} />
                        )}
                        {getStatusText(user.status)}
                      </span>
                    </td>
                    <td>
                      <div className={styles.dateCell}>
                        <Calendar size={14} className={styles.dateIcon} />
                        {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                      </div>
                    </td>
                    <td>{renderActionButtons(user)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className={styles.noResults}>
                    <div className={styles.noResultsContent}>
                      <Search size={48} />
                      <h3>Không tìm thấy kết quả</h3>
                      <p>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className={styles.tableFooter}>
        <div className={styles.paginationInfo}>
          Hiển thị {currentPage * pageSize + 1}-
          {Math.min((currentPage + 1) * pageSize, totalElements)}
          của {totalElements} người dùng
        </div>
        <div className={styles.paginationControls}>
          <button
            className={styles.paginationButton}
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            Trước
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i;
            } else if (currentPage <= 2) {
              pageNum = i;
            } else if (currentPage >= totalPages - 3) {
              pageNum = totalPages - 5 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                className={`${styles.paginationButton} ${
                  currentPage === pageNum ? styles.active : ""
                }`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum + 1}
              </button>
            );
          })}

          <button
            className={styles.paginationButton}
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
            }
            disabled={currentPage >= totalPages - 1}
          >
            Tiếp
          </button>
        </div>
      </div>
    </div>
  );

  const renderPlaceholderContent = () => (
    <div className={styles.placeholder}>
      <div className={styles.placeholderIcon}>
        <Settings size={48} />
      </div>
      <h2>{activeMenuItem}</h2>
      <p>Chức năng đang được phát triển...</p>
      <button
        className={styles.placeholderButton}
        onClick={() => setActiveMenuItem("Quản lý tài khoản")}
      >
        Quay lại Quản lý tài khoản
      </button>
    </div>
  );
  // Class Render
  function renderClassTable() {
    return (
      <div className={styles.tableWrapper}>
        <div className={styles.tableHeader}>
          <h2>Danh sách lớp</h2>
          <button
            className={styles.addButton}
            onClick={() => {
              setClassModalMode("create");
              setSelectedClass(null);
              setIsClassModalOpen(true);
            }}
          >
            <Plus size={16} /> Thêm lớp
          </button>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Mã lớp</th>
              <th>Tên lớp</th>
              <th>Mô tả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {classList.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.classid}</td>
                <td>{c.name}</td>
                <td>{c.description}</td>
                <td>
                  <button
                    className={styles.iconButton}
                    onClick={() => {
                      setClassModalMode("edit");
                      setSelectedClass(c);
                      setIsClassModalOpen(true);
                    }}
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    className={styles.iconButtonDanger}
                    onClick={async () => {
                      if (window.confirm("Xóa lớp này?")) {
                        await handleDeleteClass(c.id);
                        loadClasses();
                      }
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  //Lịch sử tương tác và quản lý bài viết render
const renderPostTable = () => {
    const isAdmin = userRole === 'ADMIN';

    return (
      <div className={styles.tableContainer}>
        {/* Filters và Search */}
        <div className={styles.tableHeader}>
          <div className={styles.searchAndFilters}>
            <div className={styles.searchBox}>
              <Search size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className={styles.filterGroup}>
              <select 
                className={styles.filterSelect}
                value={interactionUserId || ''}
                onChange={(e) => setInteractionUserId(
                  e.target.value ? parseInt(e.target.value) : undefined
                )}
              >
                <option value="">Tất cả người dùng</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Create Post Button */}
          {!isAdmin && (
            <button 
              className={styles.primaryButton}
              onClick={() => {
                setPostModalMode('create');
                setIsPostModalOpen(true);
              }}
            >
              <Plus size={18} />
              Tạo bài viết
            </button>
          )}
        </div>

        {/* Posts Table - ĐÃ SỬA (sử dụng đúng Post type) */}
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nội dung</th>
              <th>Tác giả</th>
              <th>Likes</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className={styles.loadingCell}>
                  Đang tải...
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.noDataCell}>
                  Không có bài viết nào
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id}>
                  <td>{post.id}</td>
                  <td className={styles.postContentCell}>
                    <div className={styles.postPreview}>
                      {post.content.length > 100 
                        ? `${post.content.substring(0, 100)}...`
                        : post.content}
                    </div>
                  </td>
                  <td>
                    <div className={styles.authorCell}>
                      <div className={styles.avatarSmall}>
                        <UserIcon size={16} />
                      </div>
                      <span>{post.authorUsername}</span> {/* Sửa từ post.author.username */}
                    </div>
                  </td>
                  <td>
                    <div className={styles.likeCell}>
                      <Heart size={16} className={post.likedByCurrentUser ? styles.liked : ''} />
                      {post.likeCount} {/* Sửa từ post.likes */}
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${
                      post.hidden ? styles.hidden : styles.published // Sửa từ post.isHidden
                    }`}>
                      {post.hidden ? 'Đã ẩn' : 'Hiển thị'}
                    </span>
                  </td>
                  <td>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.iconButton}
                        onClick={() => {
                          setSelectedPost(post);
                          setPostModalMode('view');
                          setIsPostModalOpen(true);
                        }}
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      
                      {/* Điều chỉnh logic quyền */}
                      {!isAdmin && (
                        <>
                          <button
                            className={styles.iconButton}
                            onClick={() => {
                              setSelectedPost(post);
                              setPostModalMode('edit');
                              setIsPostModalOpen(true);
                            }}
                            title="Chỉnh sửa"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className={`${styles.iconButton} ${styles.danger}`}
                            onClick={() => handleToggleHidePost(post.id)}
                            title={post.hidden ? 'Hiện bài viết' : 'Ẩn bài viết'}
                          >
                            {post.hidden ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                        </>
                      )}
                      
                      {isAdmin && (
                        <button
                          className={`${styles.iconButton} ${styles.danger}`}
                          onClick={() => handleDeletePost(post.id)}
                          title="Xóa bài viết"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {posts.length > 0 && (
          <div className={styles.pagination}>
            <button
              onClick={() => setPostCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={postCurrentPage === 0 || loading}
            >
              Trước
            </button>
            
            <span>
              Trang {postCurrentPage + 1} / {postTotalPages}
            </span>
            
            <button
              onClick={() => setPostCurrentPage(prev => 
                prev < postTotalPages - 1 ? prev + 1 : prev
              )}
              disabled={postCurrentPage >= postTotalPages - 1 || loading}
            >
              Sau
            </button>
          </div>
        )}
      </div>
    );
  };

  // Render Interaction History Table - ĐÃ SỬA (đơn giản hóa)
  const renderInteractionTable = () => {
    // Sửa interaction types cho phù hợp với database
    const interactionTypes = [
      { value: 'all', label: 'Tất cả' },
      { value: 'LIKE', label: 'Thích' },
      // Các loại khác sẽ thêm sau khi có bảng tương ứng
    ];

    const getInteractionIcon = (type: string) => {
      switch (type) {
        case 'LIKE': return <Heart size={16} />;
        case 'COMMENT': return <MessageCircle size={16} />;
        case 'REPORT': return <AlertCircle size={16} />;
        default: return <History size={16} />;
      }
    };

    const getInteractionColor = (type: string) => {
      switch (type) {
        case 'LIKE': return '#dc3545';
        case 'COMMENT': return '#28a745';
        case 'REPORT': return '#ffc107';
        default: return '#6c757d';
      }
    };


  return (
    <div className={styles.tableContainer}>
      {/* Filters */}
      <div className={styles.tableHeader}>
        <div className={styles.searchAndFilters}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm trong lịch sử..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <select 
              className={styles.filterSelect}
              value={interactionTypeFilter}
              onChange={(e) => setInteractionTypeFilter(e.target.value)}
            >
              {interactionTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            
            <select 
              className={styles.filterSelect}
              value={interactionUserId || ''}
              onChange={(e) => setInteractionUserId(
                e.target.value ? parseInt(e.target.value) : undefined
              )}
            >
              <option value="">Tất cả người dùng</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button 
          className={styles.secondaryButton}
          onClick={loadInteractions}
        >
          <RefreshCw size={18} />
          Làm mới
        </button>
      </div>

      {/* Interactions Table */}
      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Loại</th>
            <th>Người thực hiện</th>
            <th>Mục tiêu</th>
            <th>Chi tiết</th>
            <th>Thời gian</th>
            <th>Bài viết</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className={styles.loadingCell}>
                Đang tải...
              </td>
            </tr>
          ) : interactions.length === 0 ? (
            <tr>
              <td colSpan={7} className={styles.noDataCell}>
                Không có lịch sử tương tác nào
              </td>
            </tr>
          ) : (
            interactions.map((interaction) => (
              <tr key={interaction.id}>
                <td>{interaction.id}</td>
                <td>
                  <div className={styles.interactionType}>
                    <span 
                      className={styles.typeIcon}
                      style={{ color: getInteractionColor(interaction.type) }}
                    >
                      {getInteractionIcon(interaction.type)}
                    </span>
                    <span className={styles.typeLabel}>
                      {interaction.type === 'LIKE' ? 'Thích' :
                       interaction.type === 'COMMENT' ? 'Bình luận' :
                       interaction.type === 'CREATE_POST' ? 'Tạo bài viết' :
                       interaction.type === 'UPDATE_POST' ? 'Chỉnh sửa bài viết' :
                       interaction.type === 'DELETE_POST' ? 'Xóa bài viết' : interaction.type}
                    </span>
                  </div>
                </td>
                <td>
                  <div className={styles.userCell}>
                    <UserIcon size={14} />
                    <span>{interaction.username}</span>
                  </div>
                </td>
                <td>
                  {interaction.targetUsername ? (
                    <div className={styles.userCell}>
                      <UserIcon size={14} />
                      <span>{interaction.targetUsername}</span>
                    </div>
                  ) : '-'}
                </td>
                <td className={styles.detailsCell}>
                  {interaction.details || '-'}
                </td>
                <td>
                  {new Date(interaction.timestamp).toLocaleString('vi-VN')}
                </td>
                <td>
                  {interaction.postId ? (
                    <button
                      className={styles.linkButton}
                      onClick={() => {
                        // Tìm và hiển thị bài viết
                        const post = posts.find(p => p.id === interaction.postId);
                        if (post) {
                          setSelectedPost(post);
                          setPostModalMode('view');
                          setIsPostModalOpen(true);
                        }
                      }}
                    >
                      Xem bài viết
                    </button>
                  ) : '-'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {interactions.length > 0 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setInteractionCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={interactionCurrentPage === 0 || loading}
          >
            Trước
          </button>
          
          <span>
            Trang {interactionCurrentPage + 1} / {interactionTotalPages}
          </span>
          
          <button
            onClick={() => setInteractionCurrentPage(prev => 
              prev < interactionTotalPages - 1 ? prev + 1 : prev
            )}
            disabled={interactionCurrentPage >= interactionTotalPages - 1 || loading}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};
  return (
  <div className={styles.dashboard}>
    {renderSidebar()}
    <div className={styles.mainContent}>
      {renderHeader()}
      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <h1>{activeMenuItem}</h1>
          <div className={styles.breadcrumb}>
            <span>Dashboard</span>
            <ChevronRight size={16} />
            <span className={styles.activeBreadcrumb}>{activeMenuItem}</span>
          </div>
        </div>

        {activeMenuItem === "Quản lý lớp học"
          ? renderClassTable()
          : activeMenuItem === "Quản lý tài khoản"
          ? renderUserTable()
          : activeMenuItem === "Quản lý bài viết"
          ? renderPostTable()
          : activeMenuItem === "Lịch sử tương tác"
          ? renderInteractionTable()
          : renderPlaceholderContent()}
      </main>
    </div>

      {/* User Modal */}
      {isUserModalOpen && (
        <UserModal
          mode={userModalMode}
          user={selectedUser}
          isOpen={isUserModalOpen}
          onClose={handleCloseUserModal}
          onSave={handleSaveUser}
        />
      )}

      {/* Class Modal */}
      {isClassModalOpen && (
        <ClassModal
          mode={classModalMode}
          clazz={selectedClass} // Đảm bảo tên prop là "clazz"
          isOpen={isClassModalOpen}
          onClose={() => setIsClassModalOpen(false)}
          onSave={async (data) => {
            try {
              if (classModalMode === "create") {
                await classService.createClass(data);
              } else if (selectedClass?.id) {
                await classService.updateClass(selectedClass.id, data);
              }
              await loadClasses(); // Load lại danh sách
              setIsClassModalOpen(false); // Đóng modal
            } catch (error) {
              console.error("Lỗi khi lưu lớp:", error);
              throw error; // Ném lỗi để ClassModal xử lý
            }
          }}
        />
      )}
          {/* Post Modal */}
    {isPostModalOpen && (
      <PostModal
        mode={postModalMode}
        post={selectedPost}
        isOpen={isPostModalOpen}
        onClose={() => {
          setIsPostModalOpen(false);
          setSelectedPost(null);
        }}
        onSave={async (content) => {
          if (postModalMode === 'create') {
            await postService.createPost({ content });
          } else if (postModalMode === 'edit' && selectedPost) {
            // Gọi API update post
            await postService.updatePost(selectedPost.id, { content });
          }
          await loadPosts();
        }}
        onDelete={handleDeletePost}
        onToggleHide={handleToggleHidePost}
        onLike={async (postId) => {
          await postService.toggleLike(postId);
          await loadPosts();
        }}
      />
    )}
    </div>
  );
};

export default DashboardPage;
