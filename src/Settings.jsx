import React, { useState, useEffect } from "react";
import Modal from "./Modal";

const defaultSettings = {
  appName: "FONEND",
  logo: "",
  primaryColor: "#2563eb", // blue-600
  accentColor: "#9333ea", // purple-600
};

const API = "https://customer-management-app-t05h.onrender.com/api/settings";

export default function Settings() {
  const [form, setForm] = useState(defaultSettings);
  const [logoPreview, setLogoPreview] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Lấy settings từ backend khi load
  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(API);
        if (!res.ok) throw new Error();
        const data = await res.json();
        // Ưu tiên backend, nếu không có thì lấy localStorage, cuối cùng là default
        let local = {};
        try { 
          local = JSON.parse(localStorage.getItem("appSettings")) || {}; 
        } catch { /* ignore */ }
        const merged = { ...defaultSettings, ...data, ...local };
        setForm(merged);
        setLogoPreview(merged.logo);
      } catch {
        // Nếu lỗi backend, vẫn lấy local hoặc default
        let local = {};
        try { 
          local = JSON.parse(localStorage.getItem("appSettings")) || {}; 
        } catch { /* ignore */ }
        const merged = { ...defaultSettings, ...local };
        setForm(merged);
        setLogoPreview(merged.logo);
        setError("Không thể tải cài đặt từ server!");
      }
      setLoading(false);
    }
    fetchSettings();
  }, []);

  const handleChange = e => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files[0]) {
      const reader = new FileReader();
      reader.onload = e => {
        setForm(f => ({ ...f, logo: e.target.result }));
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaved(false);
    setError("");
    // Lưu localStorage
    localStorage.setItem("appSettings", JSON.stringify(form));
    // Gửi lên backend
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
    } catch {
      setError("Không thể lưu cài đặt lên server!");
    }
    // Cập nhật màu sắc/theme ngay
    if (form.primaryColor) {
      document.documentElement.style.setProperty('--primary', form.primaryColor);
    }
    if (form.accentColor) {
      document.documentElement.style.setProperty('--accent', form.accentColor);
    }
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-[var(--primary,#2563eb)]">Cài đặt ứng dụng</h2>
      {loading ? <div className="text-blue-500">Đang tải...</div> : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-1">Tên ứng dụng</label>
            <input name="appName" value={form.appName} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Logo</label>
            <input type="file" accept="image/*" onChange={handleChange} className="mb-2" />
            {logoPreview && <img src={logoPreview} alt="Logo preview" className="h-12 mb-2" />}
          </div>
          <div>
            <label className="block font-semibold mb-1">Màu chủ đạo</label>
            <input type="color" name="primaryColor" value={form.primaryColor} onChange={handleChange} className="w-10 h-10 p-0 border-none" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Màu nhấn</label>
            <input type="color" name="accentColor" value={form.accentColor} onChange={handleChange} className="w-10 h-10 p-0 border-none" />
          </div>
          <button type="submit" className="w-full bg-[var(--primary,#2563eb)] text-white rounded py-2 font-bold hover:bg-[var(--accent,#9333ea)] transition">Lưu cài đặt</button>
          {saved && <div className="text-green-600 text-center mt-2">Đã lưu cài đặt!</div>}
          {error && <div className="text-red-600 text-center mt-2">{error}</div>}
        </form>
      )}
    </div>
  );
}
