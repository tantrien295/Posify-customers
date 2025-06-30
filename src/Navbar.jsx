import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const navs = [
  { to: "/", label: "Dashboard" },
  { to: "/khachhang", label: "Khách hàng" },
  { to: "/dichvu", label: "Dịch vụ" },
  { to: "/nhanvien", label: "Nhân viên" },
  { to: "/lichsu", label: "Lịch sử dịch vụ" },
];

export default function Navbar() {
  const location = useLocation();
  const [settings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("appSettings")) || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (settings.primaryColor) {
      document.documentElement.style.setProperty('--primary', settings.primaryColor);
    }
    if (settings.accentColor) {
      document.documentElement.style.setProperty('--accent', settings.accentColor);
    }
    // Bỏ xử lý theme tối/sáng
  }, [settings]);

  // Đã bỏ handleSave vì không dùng nữa

  return (
    <nav className="bg-white/80 backdrop-blur shadow flex items-center px-6 py-3 mb-6 rounded-b-xl sticky top-0 z-40">
      <Link to="/" className="flex items-center mr-8 gap-2" aria-label="Trang chủ">
        {settings.logo ? (
          <img src={settings.logo} alt="logo" className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <span className="inline-block h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">{(settings.appName||'F').charAt(0)}</span>
        )}
        <span className="font-extrabold text-xl text-blue-700 tracking-wide">{settings.appName || "FONEND"}</span>
      </Link>
      <div className="flex gap-2 flex-1">
        {navs.map(n => (
          <Link
            key={n.to}
            to={n.to}
            className={`px-4 py-2 rounded-lg font-semibold transition hover:bg-[var(--primary,#2563eb)] hover:text-white ${location.pathname === n.to ? "bg-[var(--primary,#2563eb)] text-white" : "text-gray-700"}`}
          >
            {n.label}
          </Link>
        ))}
      </div>
      <Link
        to="/settings"
        className="ml-4 px-4 py-2 rounded-lg font-semibold bg-[var(--accent,#9333ea)] text-white hover:bg-[var(--primary,#2563eb)] transition flex items-center gap-1"
        aria-label="Cài đặt"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V4m0 16v-4m8-4h-4m-8 0H4" /></svg>
        Cài đặt
      </Link>
    </nav>
  );
}
