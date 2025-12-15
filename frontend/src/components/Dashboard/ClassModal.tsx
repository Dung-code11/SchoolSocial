import React, { useState, useEffect } from "react";
import styles from "../../css/ClassModal.module.css";

// Định nghĩa interfaces
interface ClassData {
  id?: number;
  classid: string;
  name: string;
  description: string;
}

interface ClassModalProps {
  mode: "create" | "edit";
  clazz: ClassData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ClassData) => Promise<void>;
}

const ClassModal: React.FC<ClassModalProps> = ({ 
  mode, 
  clazz, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [form, setForm] = useState<ClassData>({
    classid: "",
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset form khi modal mở/đóng hoặc clazz thay đổi
  useEffect(() => {
    if (isOpen) {
      if (clazz) {
        setForm(clazz);
      } else {
        setForm({
          classid: "",
          name: "",
          description: "",
        });
      }
      setError("");
    }
  }, [isOpen, clazz]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    if (!form.classid.trim()) {
      setError("Mã lớp không được để trống");
      return false;
    }
    if (!form.name.trim()) {
      setError("Tên lớp không được để trống");
      return false;
    }
    if (form.classid.length < 2) {
      setError("Mã lớp phải có ít nhất 2 ký tự");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      await onSave(form);
      // Không gọi onClose() ở đây, để parent component xử lý
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi lưu lớp học");
      console.error("Lỗi khi lưu lớp:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>{mode === "create" ? "Thêm lớp học" : "Chỉnh sửa lớp"}</h2>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.formGroup}>
          <label htmlFor="classid">Mã lớp *</label>
          <input
            id="classid"
            name="classid"
            value={form.classid}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Nhập mã lớp"
            disabled={loading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="name">Tên lớp *</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tên lớp"
            disabled={loading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Mô tả</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleInputChange}
            placeholder="Nhập mô tả lớp học"
            disabled={loading}
            rows={4}
          />
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.cancelBtn} 
            onClick={onClose}
            disabled={loading}
            type="button"
          >
            Hủy
          </button>
          <button 
            className={styles.saveBtn} 
            onClick={handleSubmit}
            disabled={loading}
            type="button"
          >
            {loading ? "Đang xử lý..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassModal;