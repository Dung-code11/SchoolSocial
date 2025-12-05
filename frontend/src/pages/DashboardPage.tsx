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
  Key
} from "lucide-react";

// Services và Types
import { userService } from "../services/userService";
import type { User, UserStatus } from "../types/user.type";

// Modal component
import UserModal from "../components/Dashboard/UserModal";

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
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
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

  // Search với debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(0);
      fetchUsers();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const menuItems = [
    { 
      id: 1, 
      name: "Quản lý tài khoản", 
      icon: <Users size={20} />,
      path: "/dashboard"
    },
    { 
      id: 2, 
      name: "Thông tin cá nhân", 
      icon: <UserIcon size={20} />,
      path: "/dashboard/profile"
    },
    { 
      id: 3, 
      name: "Quản lý lớp học", 
      icon: <BookOpen size={20} />,
      path: "/dashboard/classes"
    },
    { 
      id: 4, 
      name: "Quản lý Role", 
      icon: <Shield size={20} />,
      subItems: [
        { 
          id: 41, 
          name: "Phân quyền", 
          icon: <Key size={18} />,
          path: "/dashboard/permissions"
        }
      ]
    },
  ];

  const toggleExpand = (id: number) => {
    setExpandedMenuItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
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
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = async (userData: any) => {
    try {
      if (modalMode === "create") {
        await userService.createUser(userData);
        alert("Tạo người dùng thành công");
      } else if (modalMode === "edit" && selectedUser) {
        await userService.updateUser(selectedUser.id, userData);
        alert("Cập nhật người dùng thành công");
      }
      handleCloseModal();
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
    const user = users.find(u => u.id === id);
    if (!user) return;
    
    const newStatus: UserStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
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
        userService.importExcel(file)
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
    switch(role) {
      case "Admin": return styles.roleAdmin;
      case "Teacher": return styles.roleTeacher;
      case "Student": return styles.roleStudent;
      default: return "";
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
          {menuItems.map(item => (
            <li key={item.id} className={styles.menuItem}>
              <div 
                className={`${styles.menuLink} ${activeMenuItem === item.name ? styles.active : ""}`}
                onClick={() => handleMenuItemClick(item.name, item.id)}
              >
                <div className={styles.menuIcon}>
                  {item.icon}
                </div>
                <span className={styles.menuText}>{item.name}</span>
                {item.subItems && (
                  <span className={styles.menuArrow}>
                    {expandedMenuItems.includes(item.id) ? 
                      <ChevronDown size={16} /> : 
                      <ChevronRight size={16} />
                    }
                  </span>
                )}
              </div>
              
              {item.subItems && expandedMenuItems.includes(item.id) && (
                <ul className={styles.subMenu}>
                  {item.subItems.map(subItem => (
                    <li key={subItem.id}>
                      <div 
                        className={`${styles.subMenuLink} ${activeMenuItem === subItem.name ? styles.active : ""}`}
                        onClick={() => handleMenuItemClick(subItem.name)}
                      >
                        <div className={styles.subMenuIcon}>
                          {subItem.icon}
                        </div>
                        <span className={styles.subMenuText}>{subItem.name}</span>
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
        <button 
          className={styles.logoutButton}
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );

  const renderHeader = () => {
    const getInitials = (name: string) => {
      return name.split(" ").map(n => n[0]).join("").toUpperCase();
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
        {user.status === "ACTIVE" ? <UserX size={16} /> : <UserCheck size={16} />}
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
          <p className={styles.tableDescription}>Tổng số: {totalElements} người dùng</p>
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
              <option value="INACTIVE">Không hoạt động</option>
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
            
            <button 
              className={styles.exportButton}
              onClick={handleExportExcel}
            >
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
                          {user.fullName.split(" ").map(n => n[0]).join("")}
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
                      <span className={`${styles.roleBadge} ${getRoleClass(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${getStatusClass(user.status)}`}>
                        {user.status === "ACTIVE" ? 
                          <UserCheck size={14} /> : 
                          <UserX size={14} />
                        }
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
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
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
                className={`${styles.paginationButton} ${currentPage === pageNum ? styles.active : ""}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum + 1}
              </button>
            );
          })}
          
          <button 
            className={styles.paginationButton}
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
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
          
          {activeMenuItem === "Quản lý tài khoản" ? renderUserTable() : renderPlaceholderContent()}
        </main>
      </div>
      
      {isModalOpen && (
        <UserModal
          mode={modalMode}
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};

export default DashboardPage;