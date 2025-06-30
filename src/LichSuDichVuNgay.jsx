import React, { useEffect, useState } from "react";

const API = "https://customer-management-app-t05h.onrender.com/api";

export default function LichSuDichVuNgay() {
  const [histories, setHistories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API}/service-histories`).then(r => r.json()),
      fetch(`${API}/customers`).then(r => r.json()),
      fetch(`${API}/services`).then(r => r.json()),
      fetch(`${API}/staff`).then(r => r.json()),
    ])
      .then(([his, cus, ser, stf]) => {
        // Chuẩn hóa dữ liệu lịch sử
        const histories = Array.isArray(his) ? his : his.histories || [];
        setHistories(histories.map(h => ({
          ...h,
          date: h.used_date || h.date || '',
          customerId: h.customer_id || h.customerId || '',
          staffId: h.staff_id || h.staffId || '',
          serviceId: h.service_id || h.serviceId || '',
          payment: h.payment_method || h.payment || '',
          images: h.images || [],
        })));
        setCustomers(Array.isArray(cus) ? cus : cus.customers || []);
        setServices(Array.isArray(ser) ? ser : ser.services || []);
        setStaff(Array.isArray(stf) ? stf : stf.staff || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Không thể tải dữ liệu!");
        setLoading(false);
      });
  }, []);

  // Nhóm lịch sử theo ngày (yyyy-mm-dd)
  const groupByDate = histories.reduce((acc, h) => {
    let d = h.date;
    if (d && typeof d === 'string' && d.length > 9) {
      const dt = new Date(d);
      if (!isNaN(dt)) d = dt.toISOString().slice(0, 10);
    }
    if (!d) d = 'Không xác định';
    if (!acc[d]) acc[d] = [];
    acc[d].push(h);
    return acc;
  }, {});

  // Sắp xếp ngày giảm dần
  const sortedDates = Object.keys(groupByDate).sort((a, b) => b.localeCompare(a));

  const formatMoney = v => v ? v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[var(--primary,#2563eb)] via-[var(--accent,#9333ea)] to-pink-100 p-4 transition-colors">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-700">Thống kê lịch sử dịch vụ theo ngày</h2>
        </div>
        {loading ? <div className="text-blue-500">Đang tải...</div> : error ? <div className="text-red-500">{error}</div> : (
          sortedDates.map(date => (
            <div key={date} className="mb-8">
              <div className="text-lg font-bold text-blue-600 mb-2">Ngày {date}</div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-blue-50 text-blue-700">
                      <th className="py-2 px-3">Khách hàng</th>
                      <th className="py-2 px-3">Nhân viên</th>
                      <th className="py-2 px-3">Dịch vụ</th>
                      <th className="py-2 px-3">Ghi chú</th>
                      <th className="py-2 px-3">Giá tiền</th>
                      <th className="py-2 px-3">Thanh toán</th>
                      <th className="py-2 px-3">Hình ảnh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupByDate[date].map((his, idx) => (
                      <tr key={idx} className="border-b hover:bg-blue-50 transition">
                        <td className="py-2 px-3">{customers.find(c => String(c._id || c.id) === String(his.customerId))?.name || ''}</td>
                        <td className="py-2 px-3">{staff.find(s => String(s._id || s.id) === String(his.staffId))?.name || ''}</td>
                        <td className="py-2 px-3">{services.find(s => String(s._id || s.id) === String(his.serviceId))?.name || ''}</td>
                        <td className="py-2 px-3 max-w-xs whitespace-pre-line">{his.note}</td>
                        <td className="py-2 px-3">{formatMoney(his.price)}</td>
                        <td className="py-2 px-3">{his.payment}</td>
                        <td className="py-2 px-3">
                          {Array.isArray(his.images) && his.images.length > 0 ? (
                            <img src={his.images[0]} alt="thumb" className="w-10 h-10 object-cover rounded border" />
                          ) : <span className="text-gray-400">Không có</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
