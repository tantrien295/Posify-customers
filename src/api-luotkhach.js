import axios from "axios";

// Lấy số lượt khách sử dụng dịch vụ trong 5 tháng gần nhất (theo tháng hiện tại)
export const getLuotKhach5ThangGanNhat = async () => {
  try {
    const res = await axios.get("https://customer-management-app-t05h.onrender.com/api/service-histories", { timeout: 10000 });
    const histories = Array.isArray(res.data) ? res.data : (res.data.histories || []);
    // Tạo mảng 5 tháng gần nhất
    const now = new Date();
    const months = [];
    for (let i = 4; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        year: d.getFullYear(),
        month: d.getMonth(),
        count: 0
      });
    }
    // Đếm số lượt khách theo tháng sử dụng dịch vụ
    histories.forEach(h => {
      const dateStr = h.used_date || h.date;
      if (!dateStr) return;
      const d = new Date(dateStr);
      months.forEach(m => {
        if (d.getFullYear() === m.year && d.getMonth() === m.month) m.count++;
      });
    });
    return months;
  } catch {
    // Trả về mảng 0 nếu lỗi
    const now = new Date();
    return Array.from({ length: 5 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (4 - i), 1);
      return {
        label: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        count: 0
      };
    });
  }
};
