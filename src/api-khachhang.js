import axios from "axios";

// Lấy số lượng khách hàng trong 5 tháng gần nhất (theo tháng hiện tại)
export const getKhachHang5ThangGanNhat = async () => {
  try {
    const res = await axios.get("https://customer-management-app-t05h.onrender.com/api/customers", { timeout: 10000 });
    const customers = Array.isArray(res.data) ? res.data : [];
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
    // Đếm số khách theo tháng tạo
    customers.forEach(c => {
      if (!c.created_at && !c.createdAt) return;
      const d = new Date(c.created_at || c.createdAt);
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
