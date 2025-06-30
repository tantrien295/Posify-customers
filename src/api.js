import axios from "axios";

export const getKhachHangCount = async () => {
  const res = await axios.get("https://customer-management-app-t05h.onrender.com/api/customers");
  return Array.isArray(res.data) ? res.data.length : 0;
};

export const getDichVuCount = async () => {
  const res = await axios.get("https://customer-management-app-t05h.onrender.com/api/services");
  return Array.isArray(res.data) ? res.data.length : 0;
};

export const getNhanVienCount = async () => {
  const res = await axios.get("https://customer-management-app-t05h.onrender.com/api/staff");
  return Array.isArray(res.data) ? res.data.length : 0;
};

// Lịch sử dịch vụ chưa có endpoint, luôn trả về 0
export const getLichSuCount = async () => 0;
