import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://customer-management-app-t05h.onrender.com/api/staff";

export default function NhanVien() {
  const [nhanViens, setNhanViens] = useState([]);
  const [newNV, setNewNV] = useState({ ten: "", ngaySinh: "", soDienThoai: "", diaChi: "" });
  const [editId, setEditId] = useState(null);
  const [editNV, setEditNV] = useState({ ten: "", ngaySinh: "", soDienThoai: "", diaChi: "" });

  useEffect(() => {
    axios.get(API_URL)
      .then(res => setNhanViens(res.data))
      .catch(() => setNhanViens([]));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newNV.ten.trim()) return;
    try {
      const res = await axios.post(
        API_URL,
        { name: newNV.ten, birthday: newNV.ngaySinh, phone: newNV.soDienThoai, address: newNV.diaChi },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setNhanViens([...nhanViens, res.data]);
      setNewNV({ ten: "", ngaySinh: "", soDienThoai: "", diaChi: "" });
    } catch {
      alert("Thêm nhân viên thất bại!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa nhân viên này?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setNhanViens(nhanViens.filter((nv) => nv._id !== id && nv.id !== id));
    } catch {
      alert("Xóa nhân viên thất bại!");
    }
  };

  const handleEdit = (nv) => {
    setEditId(nv._id || nv.id);
    setEditNV({ ten: nv.ten, ngaySinh: nv.ngaySinh, soDienThoai: nv.soDienThoai, diaChi: nv.diaChi });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${editId}`, editNV);
      setNhanViens(
        nhanViens.map((nv) =>
          (nv._id === editId || nv.id === editId)
            ? { ...nv, ...editNV }
            : nv
        )
      );
      setEditId(null);
      setEditNV({ ten: "", ngaySinh: "", soDienThoai: "", diaChi: "" });
    } catch {
      alert("Cập nhật nhân viên thất bại!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[var(--primary,#2563eb)] via-[var(--accent,#9333ea)] to-pink-100 p-4 transition-colors">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-8">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-[var(--primary,#2563eb)] tracking-wide drop-shadow">Quản lý Nhân viên</h2>
        {/* Form thêm mới */}
        <form onSubmit={handleAdd} className="bg-white/80 rounded-2xl shadow-lg p-6 mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              className="border-2 border-[var(--accent,#9333ea)] focus:border-[var(--primary,#2563eb)] rounded-lg px-4 py-2 flex-1 text-base outline-none transition"
              placeholder="Tên nhân viên *"
              value={newNV.ten}
              onChange={(e) => setNewNV({ ...newNV, ten: e.target.value })}
              required
            />
            <input
              className="border-2 border-[var(--accent,#9333ea)] focus:border-[var(--primary,#2563eb)] rounded-lg px-4 py-2 flex-1 text-base outline-none transition"
              placeholder="Ngày sinh"
              type="date"
              value={newNV.ngaySinh}
              onChange={(e) => setNewNV({ ...newNV, ngaySinh: e.target.value })}
            />
            <input
              className="border-2 border-[var(--accent,#9333ea)] focus:border-[var(--primary,#2563eb)] rounded-lg px-4 py-2 flex-1 text-base outline-none transition"
              placeholder="Số điện thoại"
              value={newNV.soDienThoai}
              onChange={(e) => setNewNV({ ...newNV, soDienThoai: e.target.value })}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center mt-4">
            <input
            className="border-2 border-[var(--accent,#9333ea)] focus:border-[var(--primary,#2563eb)] rounded-lg px-4 py-2 flex-1 text-base outline-none transition"
              placeholder="Địa chỉ"
              value={newNV.diaChi}
              onChange={(e) => setNewNV({ ...newNV, diaChi: e.target.value })}
            />
            <button
              type="submit"
            className="bg-[var(--primary,#2563eb)] hover:bg-[var(--accent,#9333ea)] text-white px-6 py-2 rounded-lg font-semibold shadow transition md:w-auto w-full"
            >
              Thêm mới
            </button>
          </div>
        </form>
        {/* Danh sách nhân viên */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {nhanViens.length === 0 && (
            <div className="col-span-2 text-center text-gray-400 italic text-lg">Chưa có nhân viên nào.</div>
          )}
          {nhanViens.map((nv) => {
            // Lấy tên nhân viên từ các trường có thể có: ten, name, hoặc nv.ten || nv.name
            const tenHienThi = nv.ten || nv.name || "";
            return (
              <div
                key={nv.id || nv._id}
                className="bg-white/90 rounded-2xl shadow-md p-6 flex flex-col gap-2 relative border border-[var(--accent,#9333ea)] hover:shadow-xl transition"
              >
                {editId === nv.id ? (
                  <form onSubmit={handleUpdate} className="flex flex-col gap-3">
                    <input
                      className="border-2 border-blue-200 rounded px-3 py-2 text-base"
                      value={editNV.ten}
                      onChange={(e) => setEditNV({ ...editNV, ten: e.target.value })}
                      required
                    />
                    <input
                      className="border-2 border-blue-200 rounded px-3 py-2 text-base"
                      type="date"
                      value={editNV.ngaySinh}
                      onChange={(e) => setEditNV({ ...editNV, ngaySinh: e.target.value })}
                    />
                    <input
                      className="border-2 border-blue-200 rounded px-3 py-2 text-base"
                      value={editNV.soDienThoai}
                      onChange={(e) => setEditNV({ ...editNV, soDienThoai: e.target.value })}
                    />
                    <input
                      className="border-2 border-blue-200 rounded px-3 py-2 text-base"
                      value={editNV.diaChi}
                      onChange={(e) => setEditNV({ ...editNV, diaChi: e.target.value })}
                    />
                    <div className="flex gap-2 mt-2">
                      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition">Lưu</button>
                      <button type="button" onClick={() => setEditId(null)} className="bg-gray-300 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition">Hủy</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="mb-3 flex items-center gap-2">
                    <span className="inline-block bg-gradient-to-r from-[var(--primary,#2563eb)] to-[var(--accent,#9333ea)] text-white px-4 py-2 rounded-lg shadow text-xl font-bold tracking-wide max-w-full truncate" title={tenHienThi}>
                        {tenHienThi}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 text-gray-700 text-base">
                      <span>{nv.ngaySinh ? `🎂 ${nv.ngaySinh}` : <span className="italic text-gray-400">(Chưa có ngày sinh)</span>}</span>
                      <span>{nv.soDienThoai ? `📞 ${nv.soDienThoai}` : <span className="italic text-gray-400">(Chưa có SĐT)</span>}</span>
                      <span>{nv.diaChi ? `🏠 ${nv.diaChi}` : <span className="italic text-gray-400">(Chưa có địa chỉ)</span>}</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleEdit(nv)}
                        className="bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition flex items-center justify-center"
                        title="Sửa"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6h6" /></svg>
                      </button>
                      <button
                        onClick={() => handleDelete(nv.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center"
                        title="Xóa"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
