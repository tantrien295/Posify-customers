
import axios from "axios";

// Đếm số lịch sử dịch vụ trong tháng hiện tại (tính đến hôm nay)
export const getLichSuThangNayCount = async () => {
  try {
    const res = await axios.get("https://customer-management-app-t05h.onrender.com/api/service-histories", { timeout: 10000 });
    const histories = Array.isArray(res.data) ? res.data : (res.data.histories || []);
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-based
    const currentDate = today.getDate();
    return histories.filter(h => {
      if (!h.used_date && !h.date) return false;
      const d = new Date(h.used_date || h.date);
      return (
        d.getFullYear() === currentYear &&
        d.getMonth() === currentMonth &&
        d.getDate() <= currentDate
      );
    }).length;
  } catch {
    return 0;
  }
};
