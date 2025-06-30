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


  // Đếm số lịch sử dịch vụ trong tháng hiện tại (tính đến ngày hiện tại)
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-based
  const currentDate = today.getDate();
  const countInMonth = histories.filter(h => {
    if (!h.date) return false;
    const d = new Date(h.date);
    return (
      d.getFullYear() === currentYear &&
      d.getMonth() === currentMonth &&
      d.getDate() <= currentDate
    );
  }).length;

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
          <div className="text-base font-semibold text-pink-600">
            Tổng số lịch sử dịch vụ trong tháng này (tính đến hôm nay): <span className="text-2xl text-blue-700">{countInMonth}</span>
          </div>
        </div>
        {loading ? <div className="text-blue-500">Đang tải...</div> : error ? <div className="text-red-500">{error}</div> : (
          sortedDates.map(date => (
            <div key={date} className="mb-8">
              <div className="text-lg font-bold text-blue-600 mb-2">Ngày {date}</div>
              {/* Card responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {groupByDate[date].map((his, idx) => (
                  <div key={idx} className="bg-blue-50 rounded-xl shadow p-4 flex flex-col gap-2">
                    <div className="font-bold text-blue-700 text-base mb-1">
                      {customers.find(c => String(c._id || c.id) === String(his.customerId))?.name || ''}
                    </div>
                    <div className="text-sm text-gray-700"><b>Nhân viên:</b> {staff.find(s => String(s._id || s.id) === String(his.staffId))?.name || ''}</div>
                    <div className="text-sm text-gray-700"><b>Dịch vụ:</b> {services.find(s => String(s._id || s.id) === String(his.serviceId))?.name || ''}</div>
                    {his.note && <div className="text-sm text-gray-700"><b>Ghi chú:</b> {his.note}</div>}
                    <div className="text-sm text-gray-700"><b>Giá tiền:</b> {formatMoney(his.price)}</div>
                    {his.payment && <div className="text-sm text-gray-700"><b>Thanh toán:</b> {his.payment}</div>}
                    <div className="text-sm text-gray-700"><b>Hình ảnh:</b> {Array.isArray(his.images) && his.images.length > 0 ? (
                      <div className="flex gap-1 mt-1">
                        {his.images.slice(0, 4).map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt="thumb"
                            className="w-14 h-14 object-cover rounded cursor-pointer border"
                            // onClick={() => ...} // Có thể thêm modal xem ảnh lớn nếu muốn
                          />
                        ))}
                      </div>
                    ) : <span className="text-gray-400">Không có</span>}</div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
