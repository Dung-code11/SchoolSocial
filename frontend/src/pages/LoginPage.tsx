import React, { useState, useEffect } from "react";
import styles from "../css/LoginPage.module.css";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  Users,
  TrendingUp,
  Shield,
  School,
  AlertCircle,
  LogIn,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { saveToken } from "../utils/storage";

// Response trả về từ BE
interface LoginResponse {
  token: string;
  role: string;
}

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  // username (không dùng email)
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  // Load username đã lưu
  useEffect(() => {
    const saved = localStorage.getItem("savedUsername");
    if (saved) setUsername(saved);
  }, []);

  // -----------------------------------
  // HANDLE LOGIN
  // -----------------------------------
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res: LoginResponse = await login(username, password);

      saveToken(res.token);
      localStorage.setItem("role", res.role);

      if (rememberMe) localStorage.setItem("savedUsername", username);
      else localStorage.removeItem("savedUsername");

      navigate("/dashboard");
    } catch (err) {
      setError("Sai tên đăng nhập hoặc mật khẩu!");
    }

    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      {" "}
      <div className={styles.mainContent}>
        {/* LEFT SECTION */}
        <div className={styles.leftSection}>
          <div className={styles.systemHeader}>
            <div className={styles.logoArea}>
              <div className={styles.logoIcon}>
                <School size={36} />
              </div>
              <h1 className={styles.systemTitle}>SchoolConnect</h1>
            </div>
            <p className={styles.systemSubtitle}>
              Hệ thống quản lý và kết nối trường học
            </p>
          </div>

          <div className={styles.featuresArea}>
            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                <BookOpen size={28} />
              </div>
              <div className={styles.featureText}>
                <h3 className={styles.featureTitle}>Chia sẻ kiến thức</h3>
                <p className={styles.featureDescription}>
                  Trao đổi tài liệu, bài giảng và kinh nghiệm học tập
                </p>
              </div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                <Users size={28} />
              </div>
              <div className={styles.featureText}>
                <h3 className={styles.featureTitle}>Kết nối cộng đồng</h3>
                <p className={styles.featureDescription}>
                  Tạo nhóm học tập, câu lạc bộ và hoạt động ngoại khóa
                </p>
              </div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                <TrendingUp size={28} />
              </div>
              <div className={styles.featureText}>
                <h3 className={styles.featureTitle}>Theo dõi tiến độ</h3>
                <p className={styles.featureDescription}>
                  Cập nhật điểm số, lịch học và thông báo từ nhà trường
                </p>
              </div>
            </div>
          </div>

          <div className={styles.adminNotice}>
            <div className={styles.noticeHeader}>
              <Shield size={22} />
              <span>Tài khoản được cấp bởi Quản trị viên</span>
            </div>
            <p className={styles.noticeText}>
              Hệ thống chỉ dành cho thành viên được cấp tài khoản chính thức
            </p>
          </div>
        </div>
        {/* RIGHT SECTION */}
        <div className={styles.rightSection}>
          <div className={styles.loginWrapper}>
            <div className={styles.loginHeader}>
              <h2 className={styles.loginTitle}>
                <LogIn size={32} className={styles.loginTitleIcon} />
                Đăng nhập hệ thống
              </h2>
              <p className={styles.loginSubtitle}>
                Tài khoản được cấp bởi Quản trị viên trường học
              </p>
            </div>

            <form onSubmit={handleLogin} className={styles.loginForm}>
              {error && (
                <div className={styles.errorBox}>
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              {/* USERNAME */}
              <div className={styles.formField}>
                <label className={styles.fieldLabel}>
                  <Mail size={20} className={styles.fieldIcon} />
                  Tên đăng nhập
                </label>

                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    placeholder="Nhập tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.textInput}
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className={styles.formField}>
                <div className={styles.fieldLabelRow}>
                  <label className={styles.fieldLabel}>
                    <Lock size={20} className={styles.fieldIcon} />
                    Mật khẩu
                  </label>
                  <a href="#" className={styles.forgotLink}>
                    Quên mật khẩu?
                  </a>
                </div>

                <div className={styles.inputContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.textInput}
                    required
                  />

                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>

              {/* REMEMBER ME */}
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className={styles.checkboxText}>Ghi nhớ đăng nhập</span>
              </label>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                className={`${styles.loginButton} ${
                  isLoading ? styles.loading : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Đang xác thực..." : "Đăng nhập vào hệ thống"}
              </button>

              {/* WARNING */}
              <div className={styles.warningBox}>
                <AlertCircle size={24} className={styles.warningIcon} />
                <div className={styles.warningContent}>
                  <strong>Lưu ý quan trọng:</strong>
                  <p>Tài khoản được cấp bởi Quản trị viên trường.</p>
                </div>
              </div>
            </form>

            {/* CONTACT */}
            <div className={styles.contactSection}>
              <h4 className={styles.contactTitle}>📞 Liên hệ hỗ trợ</h4>

              <div className={styles.contactGrid}>
                <div className={styles.contactItem}>
                  <span className={styles.contactType}>Email hỗ trợ:</span>
                  <a
                    href="mailto:admin@schoolconnect.edu.vn"
                    className={styles.contactValue}
                  >
                    admin@schoolconnect.edu.vn
                  </a>
                </div>

                <div className={styles.contactItem}>
                  <span className={styles.contactType}>Hotline:</span>
                  <a href="tel:19001234" className={styles.contactValue}>
                    1900 1234
                  </a>
                </div>

                <div className={styles.contactItem}>
                  <span className={styles.contactType}>Giờ làm việc:</span>
                  <span className={styles.contactValue}>
                    7:30 - 17:00 (T2 - T6)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
