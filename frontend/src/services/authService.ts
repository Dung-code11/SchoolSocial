import api from "./api";

export const login = async (username: string, password: string) => {
  const res = await api.post("/auth/login", {
    username,
    password,
  });

  // BE trả { token, role, accountId }
  return res.data;
};
