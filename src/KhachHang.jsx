
import { Link } from "react-router-dom";
import React from "react";

import { useState, useEffect } from "react";
import Modal from "./Modal";

const API = "https://customer-management-app-t05h.onrender.com/api/customers";

function KhachHang() {
  const [search, setSearch] = useState("");
  const [searchMonth, setSearchMonth] = useState("");
  const [searchDay, setSearchDay] = useState("");
  const [data, setData] = useState([]);
  const [modal, setModal] = useState({ open: false, type: null, kh: null });
  const [form, setForm] = useState({ name: "", phone: "", address: "", day: "", month: "", year: "", note: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch data from backend
  useEffect(() => {
    setLoading(true);
    fetch(API)
      .then(res => res.json())
      .then(json => {
        setData(Array.isArray(json) ? json : json.customers || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Không thể tải dữ liệu từ server!");
        setLoading(false);
      });
  }, []);

  const filtered = data.filter(kh => {
    const s = search.toLowerCase();
    let match = (
      kh.name?.toLowerCase().includes(s) ||
      kh.phone?.includes(s) ||
      kh.dob?.includes(s)
    );
    
    const dob = kh.birthday || kh.dob || "";
    let day = "";
    let month = "";
    
    if (dob) {
      const parts = dob.split(/[-/]/);
      if (parts.length >= 2) {
        month = parts[1];
        if (parts.length >= 3) {
          day = parts[0].length === 4 ? parts[2] : parts[0];
        }
      }
    }
    
    // Lọc theo tháng nếu có
    if (searchMonth) {
      match = match && (month === searchMonth.padStart(2, "0"));
    }
    
    // Lọc theo ngày nếu có
    if (searchDay) {
      match = match && (day === searchDay.padStart(2, "0"));
    }
    
    return match;
  });

  // Xử lý mở modal
  const openModal = (type, kh = null) => {
    setModal({ open: true, type, kh });
    if (type === "edit" && kh) {
      console.log('Dữ liệu khách hàng khi mở modal:', kh);
      // Lấy ngày sinh từ cả hai trường có thể có
      const dob = kh.birthday || kh.dob || "";
      console.log('Ngày sinh từ API:', dob);
      
      // Reset form trước
      const formData = {
        name: kh.name || "",
        phone: kh.phone || "",
        address: kh.address || "",
        day: "",
        month: "",
        year: "",
        note: kh.note || ""
      };
      
      if (dob) {
        // Xử lý định dạng ngày tháng (có thể là DD-MM-YYYY hoặc YYYY-MM-DD)
        const parts = dob.split(/[-/]/);
        
        if (parts.length >= 2) {
          if (parts[0].length === 4) {
            // Định dạng YYYY-MM-DD
            formData.year = parts[0] !== "1900" ? parts[0] : "";
            formData.month = parts[1] || "";
            formData.day = parts[2] || "";
          } else {
            // Định dạng DD-MM-YYYY
            formData.day = parts[0] || "";
            formData.month = parts[1] || "";
            formData.year = (parts[2] && parts[2] !== "1900") ? parts[2] : "";
          }
          
          // Loại bỏ số 0 đứng đầu
          if (formData.day) formData.day = formData.day.replace(/^0+/, '');
          if (formData.month) formData.month = formData.month.replace(/^0+/, '');
          if (formData.year) formData.year = formData.year.replace(/^0+/, '');
        }
      }
      
      console.log('Dữ liệu form sau khi xử lý:', formData);
      setForm(formData);
    } else if (type === "add") {
      setForm({ name: "", phone: "", address: "", day: "", month: "", year: "", note: "" });
    }
  };
  const closeModal = () => setModal({ open: false, type: null, kh: null });

  // Thêm mới
  const handleAdd = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Xử lý ngày sinh
    let birthday = null;
    if (form.day && form.month) {
      birthday = `${form.day.padStart(2, "0")}-${form.month.padStart(2, "0")}-${form.year ? form.year : "1900"}`;
    }
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          address: form.address,
          birthday,
          note: form.note
        })
      });
      if (!res.ok) throw new Error();
      const newKH = await res.json();
      setData(prev => [...prev, newKH]);
      closeModal();
    } catch {
      setError("Không thể thêm khách hàng!");
    }
    setLoading(false);
  };
  // Sửa
  const handleEdit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    let birthday = null;
    
    // Chỉ tạo chuỗi birthday nếu có ít nhất ngày hoặc tháng
    if (form.day || form.month) {
      const day = form.day ? form.day.padStart(2, "0") : "01";
      const month = form.month ? form.month.padStart(2, "0") : "01";
      const year = form.year || "1900";
      birthday = `${day}-${month}-${year}`;
    }
    try {
      const res = await fetch(`${API}/${modal.kh._id || modal.kh.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          address: form.address,
          birthday,
          note: form.note
        })
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setData(prev => prev.map(kh => (kh._id || kh.id) === (updated._id || updated.id) ? updated : kh));
      closeModal();
    } catch {
      setError("Không thể sửa khách hàng!");
    }
    setLoading(false);
  };
  // Xóa
  const handleDelete = async id => {
    if (!window.confirm("Bạn chắc chắn muốn xóa khách hàng này?")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setData(prev => prev.filter(kh => (kh._id || kh.id) !== id));
    } catch {
      setError("Không thể xóa khách hàng!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[var(--primary,#2563eb)] via-[var(--accent,#9333ea)] to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 transition-colors">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-extrabold text-[var(--primary,#2563eb)] dark:text-white text-center sm:text-left">Quản lý Khách hàng</h1>
          <button onClick={() => openModal("add")}
            className="bg-[var(--primary,#2563eb)] hover:bg-[var(--accent,#9333ea)] text-white font-semibold px-5 py-2 rounded-lg shadow transition">+ Thêm khách hàng mới</button>
        </div>
        <div className="mb-4 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc SĐT..."
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary,#2563eb)]"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <input
            type="number"
            min=""
            max="31"
            placeholder="Ngày sinh"
            className="w-full sm:w-28 px-4 py-2 border border-gray-300 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary,#2563eb)]"
            value={searchDay}
            onChange={e => {
              let v = e.target.value;
              if (v === '') {
                setSearchDay('');
                return;
              }
              v = v.replace(/[^0-9]/g, '');
              if (v > 31) v = "31";
              setSearchDay(v);
            }}
          />
          <input
            type="number"
            min=""
            max="12"
            placeholder="Tháng sinh"
            className="w-full sm:w-28 px-4 py-2 border border-gray-300 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary,#2563eb)]"
            value={searchMonth}
            onChange={e => {
              let v = e.target.value;
              if (v === '') {
                setSearchMonth('');
                return;
              }
              v = v.replace(/[^0-9]/g, '');
              if (v > 12) v = "12";
              setSearchMonth(v);
            }}
          />
        </div>
        {error && <div className="text-red-600 mb-2 text-center">{error}</div>}
        {/* Bảng cho desktop/tablet */}
        <div className="overflow-x-auto rounded-lg shadow mt-2 hidden sm:block">
          <table className="min-w-full bg-white dark:bg-gray-900">
            <thead>
              <tr className="bg-blue-50 dark:bg-gray-800 text-[var(--primary,#2563eb)] dark:text-white">
                <th className="py-3 px-4 text-left">Tên</th>
                <th className="py-3 px-4 text-left">Số điện thoại</th>
                <th className="py-3 px-4 text-left">Ngày sinh</th>
                <th className="py-3 px-4 text-left">Địa chỉ</th>
                <th className="py-3 px-4 text-left">Ghi chú</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-6 text-blue-400">Đang tải dữ liệu...</td></tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-400">Không có khách hàng phù hợp</td>
                </tr>
              ) : (
                filtered.map(kh => (
                  <tr key={kh._id || kh.id} className="border-b hover:bg-blue-50 dark:hover:bg-gray-800 transition">
                    <td className="py-3 px-4 font-medium">
                      <span className="text-[var(--primary,#2563eb)] dark:text-[var(--accent,#9333ea)] hover:underline cursor-pointer">
                        <Link to={`/khachhang/${kh._id || kh.id}`}>{kh.name}</Link>
                      </span>
                    </td>
                    <td className="py-3 px-4">{kh.phone}</td>
                    <td className="py-3 px-4">
                      {(() => {
                        const dob = kh.birthday || kh.dob;
                        if (!dob) return "";
                        const [d, m, y] = dob.split("-");
                        if (y === "1900" || !y) return `${d}/${m}`;
                        return `${d}/${m}/${y}`;
                      })()}
                    </td>
                    <td className="py-3 px-4">{kh.address || ""}</td>
                    <td className="py-3 px-4">{kh.note}</td>
                    <td className="py-3 px-4 text-center flex gap-2 justify-center">
                      <button
                        onClick={() => openModal("edit", kh)}
                        className="text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900 p-2 rounded-full transition"
                        title="Sửa"
                        aria-label="Sửa"
                      >
                        {/* Icon cây bút */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 3.487a2.06 2.06 0 112.915 2.914L7.5 18.678l-4 1 1-4 12.362-12.19z" /></svg>
                      </button>
                      <button
                        onClick={() => handleDelete(kh._id || kh.id)}
                        className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900 p-2 rounded-full transition"
                        title="Xóa"
                        aria-label="Xóa"
                      >
                        {/* Icon thùng rác */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Card cho mobile */}
        <div className="sm:hidden mt-2 space-y-3">
          {loading ? (
            <div className="text-center py-6 text-blue-400">Đang tải dữ liệu...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-6 text-gray-400">Không có khách hàng phù hợp</div>
          ) : (
            filtered.map(kh => (
              <div key={kh._id || kh.id} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 relative">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-700 text-base flex-1">
                    <Link to={`/khachhang/${kh._id || kh.id}`}>{kh.name}</Link>
                  </span>
                  <button
                    onClick={() => openModal("edit", kh)}
                    className="text-yellow-600 hover:bg-yellow-100 p-2 rounded-full transition"
                    title="Sửa"
                    aria-label="Sửa"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 3.487a2.06 2.06 0 112.915 2.914L7.5 18.678l-4 1 1-4 12.362-12.19z" /></svg>
                  </button>
                  <button
                    onClick={() => handleDelete(kh._id || kh.id)}
                    className="text-red-600 hover:bg-red-100 p-2 rounded-full transition"
                    title="Xóa"
                    aria-label="Xóa"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                  </button>
                </div>
                <div className="text-sm text-gray-700"><b>SĐT:</b> {kh.phone}</div>
                <div className="text-sm text-gray-700"><b>Ngày sinh:</b> {(() => {
                  const dob = kh.birthday || kh.dob;
                  if (!dob) return "";
                  const [d, m, y] = dob.split("-");
                  if (y === "1900" || !y) return `${d}/${m}`;
                  return `${d}/${m}/${y}`;
                })()}</div>
                {kh.address && <div className="text-sm text-gray-700"><b>Địa chỉ:</b> {kh.address}</div>}
                {kh.note && <div className="text-sm text-gray-700"><b>Ghi chú:</b> {kh.note}</div>}
              </div>
            ))
          )}
        </div>

        {/* Modal thêm/sửa/xem */}
        <Modal open={modal.open} onClose={closeModal}>
          {modal.type === "add" && (
            <form onSubmit={handleAdd} className="space-y-4 w-80">
              <h2 className="text-xl font-bold text-blue-700 mb-2">Thêm khách hàng mới</h2>
              <input required className="w-full px-3 py-2 border rounded" placeholder="Tên khách hàng" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <input required className="w-full px-3 py-2 border rounded" placeholder="Số điện thoại" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              <input className="w-full px-3 py-2 border rounded" placeholder="Địa chỉ" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
              <div className="flex gap-2">
                <input required type="number" min="1" max="31" className="w-1/3 px-3 py-2 border rounded" placeholder="Ngày" value={form.day} onChange={e => setForm(f => ({ ...f, day: e.target.value }))} />
                <input required type="number" min="1" max="12" className="w-1/3 px-3 py-2 border rounded" placeholder="Tháng" value={form.month} onChange={e => setForm(f => ({ ...f, month: e.target.value }))} />
                <input type="number" min="1900" max="2100" className="w-1/3 px-3 py-2 border rounded" placeholder="Năm (không bắt buộc)" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} />
              </div>
              <input className="w-full px-3 py-2 border rounded" placeholder="Ghi chú" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Hủy</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Lưu</button>
              </div>
            </form>
          )}
          {modal.type === "edit" && (
            <form onSubmit={handleEdit} className="space-y-4 w-80">
              <h2 className="text-xl font-bold text-yellow-700 mb-2">Sửa thông tin khách hàng</h2>
              <input required className="w-full px-3 py-2 border rounded" placeholder="Tên khách hàng" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <input required className="w-full px-3 py-2 border rounded" placeholder="Số điện thoại" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              <input className="w-full px-3 py-2 border rounded" placeholder="Địa chỉ" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
              <div className="flex gap-2">
                <input required type="number" min="1" max="31" className="w-1/3 px-3 py-2 border rounded" placeholder="Ngày" value={form.day} onChange={e => setForm(f => ({ ...f, day: e.target.value }))} />
                <input required type="number" min="1" max="12" className="w-1/3 px-3 py-2 border rounded" placeholder="Tháng" value={form.month} onChange={e => setForm(f => ({ ...f, month: e.target.value }))} />
                <input type="number" min="1900" max="2100" className="w-1/3 px-3 py-2 border rounded" placeholder="Năm (không bắt buộc)" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} />
              </div>
              <input className="w-full px-3 py-2 border rounded" placeholder="Ghi chú" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Hủy</button>
                <button type="submit" className="px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-700">Lưu</button>
              </div>
            </form>
          )}
          {modal.type === "view" && modal.kh && (
            <div className="space-y-3 w-80">
              <h2 className="text-xl font-bold text-blue-700 mb-2">Thông tin khách hàng</h2>
              <div><span className="font-semibold">Tên:</span> {modal.kh.name}</div>
              <div><span className="font-semibold">Số điện thoại:</span> {modal.kh.phone}</div>
              <div><span className="font-semibold">Địa chỉ:</span> {modal.kh.address || <span className="text-gray-400">(trống)</span>}</div>
              <div><span className="font-semibold">Ngày sinh:</span> {(() => {
                const dob = modal.kh.birthday || modal.kh.dob;
                if (!dob) return "";
                const [d, m, y] = dob.split("-");
                if (y === "1900" || !y) return `${d}/${m}`;
                return `${d}/${m}/${y}`;
              })()}</div>
              <div><span className="font-semibold">Ghi chú:</span> {modal.kh.note || <span className="text-gray-400">(trống)</span>}</div>
              <div className="flex gap-2 justify-end mt-4">
                <button onClick={closeModal} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Đóng</button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default KhachHang;
