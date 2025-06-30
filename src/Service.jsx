
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://customer-management-app-t05h.onrender.com/api/services";

export default function Service() {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [editService, setEditService] = useState({ name: "", description: "" });

  // Fetch services from API
  useEffect(() => {
    axios.get(API_URL)
      .then(res => setServices(res.data))
      .catch(() => setServices([]));
  }, []);


  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newService.name.trim()) return;
    try {
      const res = await axios.post(API_URL, newService);
      setServices([...services, res.data]);
      setNewService({ name: "", description: "" });
    } catch {
      alert("Thêm dịch vụ thất bại!");
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa dịch vụ này?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setServices(services.filter((s) => s._id !== id && s.id !== id));
    } catch {
      alert("Xóa dịch vụ thất bại!");
    }
  };


  const handleEdit = (service) => {
    setEditId(service._id || service.id);
    setEditService({ name: service.name, description: service.description });
  };


  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${editId}`, editService);
      setServices(
        services.map((s) =>
          (s._id === editId || s.id === editId)
            ? { ...s, name: editService.name, description: editService.description }
            : s
        )
      );
      setEditId(null);
      setEditService({ name: "", description: "" });
    } catch {
      alert("Cập nhật dịch vụ thất bại!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[var(--primary,#2563eb)] via-[var(--accent,#9333ea)] to-pink-100 p-4 transition-colors">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-8">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-[var(--primary,#2563eb)] tracking-wide drop-shadow">Quản lý Dịch vụ</h2>
        {/* Form thêm mới */}
        <form onSubmit={handleAdd} className="bg-white/80 rounded-2xl shadow-lg p-6 mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              className="border-2 border-[var(--accent,#9333ea)] focus:border-[var(--primary,#2563eb)] rounded-lg px-4 py-2 flex-1 text-base outline-none transition"
              placeholder="Tên dịch vụ *"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              required
            />
            <input
              className="border-2 border-[var(--accent,#9333ea)] focus:border-[var(--primary,#2563eb)] rounded-lg px-4 py-2 flex-1 text-base outline-none transition"
              placeholder="Mô tả (không bắt buộc)"
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
            />
            <button
              type="submit"
            className="bg-[var(--primary,#2563eb)] hover:bg-[var(--accent,#9333ea)] text-white px-6 py-2 rounded-lg font-semibold shadow transition md:w-auto w-full"
            >
              Thêm mới
            </button>
          </div>
        </form>
        {/* Danh sách dịch vụ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white/90 rounded-2xl shadow-md p-6 flex flex-col gap-2 relative border border-[var(--accent,#9333ea)] hover:shadow-xl transition"
            >
              {editId === service.id ? (
                <form onSubmit={handleUpdate} className="flex flex-col gap-2">
                  <input
                    className="border rounded px-2 py-1"
                    value={editService.name}
                    onChange={(e) => setEditService({ ...editService, name: e.target.value })}
                    required
                  />
                  <input
                    className="border rounded px-2 py-1"
                    value={editService.description}
                    onChange={(e) => setEditService({ ...editService, description: e.target.value })}
                  />
                  <div className="flex gap-2 mt-2">
                    <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Lưu</button>
                    <button type="button" onClick={() => setEditId(null)} className="bg-gray-300 px-3 py-1 rounded">Hủy</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    {/* Không dùng icon */}
                    <span className="inline-block bg-gradient-to-r from-[var(--primary,#2563eb)] to-[var(--accent,#9333ea)] text-white px-4 py-2 rounded-lg shadow text-xl font-bold tracking-wide max-w-full truncate" title={service.name}>{service.name}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{service.description || <span className="italic text-gray-400">(Không có mô tả)</span>}</p>
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => handleEdit(service)}
                      className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 flex items-center justify-center"
                      title="Sửa"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6h6" /></svg>
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center justify-center"
                      title="Xóa"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
