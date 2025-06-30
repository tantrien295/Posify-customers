import React, { useEffect, useState } from "react";

const API = "https://customer-management-app-t05h.onrender.com/api";

export default function LichSuDichVuNgay() {
  const [histories, setHistories] = useState([]);
  const [filteredHistories, setFilteredHistories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // State for date range filter
  const today = new Date();
  const lastMonth = new Date(today);
  lastMonth.setMonth(today.getMonth() - 1);
  
  const [dateRange, setDateRange] = useState({
    startDate: lastMonth.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0]
  });

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



  // Filter histories by date range
  useEffect(() => {
    if (histories.length > 0) {
      const filtered = histories.filter(h => {
        if (!h.date) return false;
        const historyDate = new Date(h.date).toISOString().split('T')[0];
        return historyDate >= dateRange.startDate && historyDate <= dateRange.endDate;
      });
      setFilteredHistories(filtered);
    }
  }, [histories, dateRange]);

  // Handle date range change
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Nhóm lịch sử theo ngày (yyyy-mm-dd)
  const groupByDate = filteredHistories.reduce((acc, h) => {
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
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-700 mb-4">Thống kê lịch sử dịch vụ theo ngày</h2>
          
          {/* Date Range Picker */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            {/* Desktop View - Full Date Inputs */}
            <div className="hidden sm:flex flex-1 gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                <input
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  max={dateRange.endDate}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                <input
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  min={dateRange.startDate}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            
            {/* Mobile View - Icon Buttons */}
            <div className="sm:hidden flex justify-between gap-2">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Từ ngày</label>
                <div className="relative">
                  <input
                    type="date"
                    name="startDate"
                    value={dateRange.startDate}
                    onChange={handleDateChange}
                    className="absolute inset-0 w-full h-full opacity-0"
                    max={dateRange.endDate}
                    id="startDateInput"
                  />
                  <label 
                    htmlFor="startDateInput"
                    className="flex items-center justify-between p-2 border border-gray-300 rounded-md bg-white cursor-pointer"
                  >
                    <span className="text-sm">{formatDisplayDate(dateRange.startDate)}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </label>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Đến ngày</label>
                <div className="relative">
                  <input
                    type="date"
                    name="endDate"
                    value={dateRange.endDate}
                    onChange={handleDateChange}
                    className="absolute inset-0 w-full h-full opacity-0"
                    min={dateRange.startDate}
                    max={new Date().toISOString().split('T')[0]}
                    id="endDateInput"
                  />
                  <label 
                    htmlFor="endDateInput"
                    className="flex items-center justify-between p-2 border border-gray-300 rounded-md bg-white cursor-pointer"
                  >
                    <span className="text-sm">{formatDisplayDate(dateRange.endDate)}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 mb-2">
            Hiển thị <span className="font-semibold">{filteredHistories.length}</span> bản ghi
            {dateRange.startDate && dateRange.endDate && (
              <span> từ ngày {new Date(dateRange.startDate).toLocaleDateString('vi-VN')} đến {new Date(dateRange.endDate).toLocaleDateString('vi-VN')}</span>
            )}
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
