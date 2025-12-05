// Token functions
export const saveToken = (token: string): void => {
  localStorage.setItem("token", token);
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const removeToken = (): void => {
  localStorage.removeItem("token");
};

// User role functions
export const saveUserRole = (role: string): void => {
  localStorage.setItem("role", role);
};

export const getUserRole = (): string | null => {
  return localStorage.getItem("role");
};

export const removeUserRole = (): void => {
  localStorage.removeItem("role");
};

// Username functions
export const saveUsername = (username: string): void => {
  localStorage.setItem("username", username);
};

export const getUsername = (): string | null => {
  return localStorage.getItem("username");
};

export const removeUsername = (): void => {
  localStorage.removeItem("username");
};

// Saved username for remember me
export const saveRememberedUsername = (username: string): void => {
  localStorage.setItem("savedUsername", username);
};

export const getRememberedUsername = (): string | null => {
  return localStorage.getItem("savedUsername");
};

export const removeRememberedUsername = (): void => {
  localStorage.removeItem("savedUsername");
};

// Clear all auth data
export const clearAuthData = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
  localStorage.removeItem("savedUsername");
};