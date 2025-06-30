import axios from "axios";


export const getKhachHangCount = async () => {
  try {
    const res = await axios.get("https://customer-management-app-t05h.onrender.com/api/customers", { timeout: 10000 });
    return Array.isArray(res.data) ? res.data.length : 0;
  } catch {
    return 0;
  }
};


export const getDichVuCount = async () => {
  try {
    const res = await axios.get("https://customer-management-app-t05h.onrender.com/api/services", { timeout: 10000 });
    return Array.isArray(res.data) ? res.data.length : 0;
  } catch {
    return 0;
  }
};


export const getNhanVienCount = async () => {
  try {
    const res = await axios.get("https://customer-management-app-t05h.onrender.com/api/staff", { timeout: 10000 });
    return Array.isArray(res.data) ? res.data.length : 0;
  } catch {
    return 0;
  }
};

// Lịch sử dịch vụ chưa có endpoint, luôn trả về 0
export const getLichSuCount = async () => 0;
