import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const navs = [
  {
    to: "/",
    label: "Dashboard",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" /></svg>
    ),
  },
  {
    to: "/khachhang",
    label: "Khách hàng",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    ),
  },
  {
    to: "/dichvu",
    label: "Dịch vụ",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h3a4 4 0 014 4v2M9 17H7a2 2 0 01-2-2v-2a2 2 0 012-2h2m0 0V7a4 4 0 118 0v4" /></svg>
    ),
  },
  {
    to: "/nhanvien",
    label: "Nhân viên",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0 0H6m6 0h6" /></svg>
    ),
  },
  {
    to: "/lichsu",
    label: "Lịch sử dịch vụ",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 17l4 4 4-4m-4-5v9" /></svg>
    ),
  },
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
      <Link to="/" className="flex items-center mr-4 gap-2 sm:mr-8" aria-label="Trang chủ">
        {settings.logo ? (
          <img src={settings.logo} alt="logo" className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover" />
        ) : (
          <span className="inline-block h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-base sm:text-lg">{(settings.appName||'F').charAt(0)}</span>
        )}
        <span className="font-extrabold text-lg sm:text-xl text-blue-700 tracking-wide hidden xs:block">{settings.appName || "FONEND"}</span>
      </Link>
      <div className="flex gap-1 sm:gap-2 flex-1 justify-center">
        {navs.map(n => (
          <Link
            key={n.to}
            to={n.to}
            className={`flex flex-col items-center justify-center px-2 sm:px-4 py-2 rounded-lg font-semibold transition hover:bg-[var(--primary,#2563eb)] hover:text-white ${location.pathname === n.to ? "bg-[var(--primary,#2563eb)] text-white" : "text-gray-700"}`}
            title={n.label}
          >
            {n.icon}
            <span className="hidden sm:inline text-xs mt-1">{n.label}</span>
          </Link>
        ))}
      </div>
      <Link
        to="/settings"
        className="ml-2 sm:ml-4 px-2 sm:px-4 py-2 rounded-lg font-semibold bg-[var(--accent,#9333ea)] text-white hover:bg-[var(--primary,#2563eb)] transition flex items-center gap-1"
        aria-label="Cài đặt"
        title="Cài đặt"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V4m0 16v-4m8-4h-4m-8 0H4" /></svg>
        <span className="hidden sm:inline">Cài đặt</span>
      </Link>
    </nav>
  );
}
