// src/components/Dashboard/UserModal.tsx
import React, { useState, useEffect } from "react";
import { X, Save, User, Mail, Phone, MapPin, Shield, Lock, UserCircle } from "lucide-react";
import styles from "../../css/UserModal.module.css";
import type {
  User as UserType,
  UserRole,
  UserStatus,
  CreateUserDTO,
  UpdateUserDTO,
} from "../../types/user.type";

// =========================
// TYPE CHUẨN CHO FORM
// =========================
interface FormState {
  username: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  role: UserRole;
  status: UserStatus;
  password?: string;
  confirmPassword?: string;
}

interface UserModalProps {
  mode: "create" | "edit" | "view";
  user: UserType | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateUserDTO | UpdateUserDTO) => void;
}

const UserModal: React.FC<UserModalProps> = ({
  mode,
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<FormState>({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    role: "STUDENT",
    status: "ACTIVE",
    password: "",
    confirmPassword: "",
  });

  // =========================
  // LOAD DATA KHI CLICK EDIT/VIEW
  // =========================
  useEffect(() => {
    if (!isOpen) return;

    if (user) {
      setFormData({
        username: user.username || "",
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
        role: user.role,
        status: user.status,
      });
    } else {
      setFormData({
        username: "",
        fullName: "",
        email: "",
        phone: "",
        address: "",
        role: "STUDENT",
        status: "ACTIVE",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user, isOpen]);

  const isViewMode = mode === "view";

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "create") {
      // Validate username
      if (!formData.username || formData.username.length < 3) {
        alert("Username phải có ít nhất 3 ký tự!");
        return;
      }

      // Validate password
      if (formData.password !== formData.confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
      }

      if (!formData.password || formData.password.length < 6) {
        alert("Mật khẩu phải có ít nhất 6 ký tự!");
        return;
      }
    }

    // Chuẩn bị dữ liệu gửi
    let payload: any = { ...formData };

    // REMOVE confirmPassword
    delete payload.confirmPassword;

    // Nếu edit → không gửi password
    if (mode === "edit") {
      delete payload.password;
    }

    // Nếu view → không gửi gì
    if (mode === "view") return;

    onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>
            {mode === "create" && "Thêm người dùng mới"}
            {mode === "edit" && "Chỉnh sửa thông tin"}
            {mode === "view" && "Chi tiết người dùng"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalBody}>
          {/* USERNAME - Chỉ khi tạo mới */}
          {mode === "create" && (
            <div className={styles.formGroup}>
              <label>
                <UserCircle size={16} />
                Username *
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
                minLength={3}
                placeholder="Tên đăng nhập"
              />
            </div>
          )}

          {/* USERNAME - Khi xem hoặc sửa (chỉ hiển thị, không chỉnh sửa) */}
          {(mode === "edit" || mode === "view") && (
            <div className={styles.formGroup}>
              <label>
                <UserCircle size={16} />
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                disabled
                className={styles.disabledField}
              />
            </div>
          )}

          {/* FULLNAME */}
          <div className={styles.formGroup}>
            <label>
              <User size={16} />
              Họ và tên *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
              disabled={isViewMode}
              placeholder="Nguyễn Văn A"
            />
          </div>

          {/* EMAIL */}
          <div className={styles.formGroup}>
            <label>
              <Mail size={16} />
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              disabled={isViewMode || mode === "edit"}
              placeholder="example@domain.com"
            />
          </div>

          {/* PASSWORD - chỉ khi CREATE */}
          {mode === "create" && (
            <>
              <div className={styles.formGroup}>
                <label>
                  <Lock size={16} />
                  Mật khẩu *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  minLength={6}
                  required
                  placeholder="Ít nhất 6 ký tự"
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <Lock size={16} />
                  Xác nhận mật khẩu *
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  minLength={6}
                  required
                  placeholder="Nhập lại mật khẩu"
                />
              </div>
            </>
          )}

          {/* PHONE + ROLE */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>
                <Phone size={16} />
                Số điện thoại
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={isViewMode}
                placeholder="0123456789"
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                <Shield size={16} />
                Vai trò *
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as UserRole })
                }
                disabled={isViewMode}
              >
                <option value="ADMIN">Admin</option>
                <option value="TEACHER">Teacher</option>
                <option value="STUDENT">Student</option>
              </select>
            </div>
          </div>

          {/* ADDRESS */}
          <div className={styles.formGroup}>
            <label>
              <MapPin size={16} />
              Địa chỉ
            </label>
            <textarea
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              rows={3}
              disabled={isViewMode}
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
            />
          </div>

          {/* STATUS */}
          <div className={styles.formGroup}>
            <label>Trạng thái *</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as UserStatus,
                })
              }
              disabled={isViewMode}
            >
              <option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Không hoạt động</option>
            </select>
          </div>

          {/* FOOTER BUTTONS */}
          {!isViewMode && (
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={onClose}
              >
                Hủy
              </button>

              <button type="submit" className={styles.saveButton}>
                <Save size={16} />
                {mode === "create" ? "Tạo mới" : "Lưu thay đổi"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserModal;