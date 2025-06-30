import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "./Modal";

const API = "https://customer-management-app-t05h.onrender.com/api";

export default function LichSuKhachHang() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [histories, setHistories] = useState([]);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imgModal, setImgModal] = useState({ open: false, images: [], idx: 0 });
  // State cho form lịch sử khách hàng
  const [formOpen, setFormOpen] = useState(false);
  const [editHistory, setEditHistory] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    staffId: '',
    serviceId: '',
    note: '',
    price: '',
    payment: '',
    images: [],
  });

  // Reset form khi mở form mới
  const openForm = (his = null) => {
    setEditHistory(his);
    if (his) {
      // Ưu tiên lấy used_date, nếu không có thì lấy date
      let dateValue = his.used_date || his.date || '';
      // Nếu là kiểu Date ISO thì cắt lấy yyyy-mm-dd
      if (dateValue && typeof dateValue === 'string' && dateValue.length > 9) {
        const d = new Date(dateValue);
        if (!isNaN(d)) {
          dateValue = d.toISOString().slice(0, 10);
        }
      }
      setFormData({
        date: dateValue,
        staffId: his.staffId || his.staff_id || '',
        serviceId: his.serviceId || his.service_id || '',
        note: his.note || '',
        price: his.price || '',
        payment: his.payment || his.payment_method || '',
        images: his.images || [],
      });
    } else {
      setFormData({ date: '', staffId: '', serviceId: '', note: '', price: '', payment: '', images: [] });
    }
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    setEditHistory(null);
  };

  // Xử lý thay đổi input
  const handleInput = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  // Upload ảnh lên Cloudinary và lưu URL vào formData.images
  const CLOUD_NAME = 'dqxhgxipv';
  const UPLOAD_PRESET = 'default';
  const handleImage = async e => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      const form = new FormData();
      form.append('file', file);
      form.append('upload_preset', UPLOAD_PRESET);
      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: form,
        });
        const data = await res.json();
        if (data.secure_url) {
          setFormData(f => ({ ...f, images: [...f.images, data.secure_url] }));
        } else {
          alert('Upload ảnh thất bại!');
        }
      } catch {
        alert('Upload ảnh thất bại!');
      }
    }
  };

  // Xử lý submit form: gọi API thêm/sửa lịch sử
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Chuẩn hóa dữ liệu gửi lên backend
      const payload = {
        customer_id: Number(id),
        service_id: Number(formData.serviceId),
        staff_id: Number(formData.staffId),
        used_date: formData.date,
        price: formData.price ? Number(formData.price) : 0,
        payment_method: formData.payment || '',
        note: formData.note || '',
        images: formData.images && formData.images.length > 0 ? formData.images : [],
      };
      console.log('Payload gửi lên:', payload);
      let res;
      if (editHistory) {
        // Sửa lịch sử
        const id = editHistory._id || editHistory.id;
        if (!id) {
          alert('Không tìm thấy ID lịch sử để cập nhật!');
          return;
        }
        res = await fetch(`${API}/service-histories/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Thêm mới lịch sử
        res = await fetch(`${API}/service-histories`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) {
        const text = await res.text();
        console.error('Lỗi backend:', text);
        throw new Error('Lỗi backend: ' + text);
      }
      const data = await res.json();
      if (editHistory) {
        setHistories(his => his.map(h => (h._id === editHistory._id ? data : h)));
      } else {
        setHistories(his => [data, ...his]);
      }
      closeForm();
    } catch (err) {
      alert(err.message || 'Có lỗi xảy ra!');
    }
  };

  // Xử lý xóa lịch sử
  const handleDelete = async (his) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa lịch sử này?')) return;
    try {
      const id = his._id || his.id;
      if (!id) {
        alert('Không tìm thấy ID lịch sử để xóa!');
        return;
      }
      const res = await fetch(`${API}/service-histories/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Xóa thất bại');
      setHistories(h => h.filter(x => (x._id || x.id) !== id));
    } catch (err) {
      alert(err.message || 'Có lỗi xảy ra!');
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API}/customers/${id}`).then(r => r.json()),
      fetch(`${API}/service-histories?customerId=${id}`).then(r => r.json()),
      fetch(`${API}/services`).then(r => r.json()),
      fetch(`${API}/staff`).then(r => r.json()),
    ])
      .then(([cus, his, ser, stf]) => {
        setCustomer(cus);
        // Chuẩn hóa dữ liệu lịch sử cho frontend
        const histories = Array.isArray(his) ? his : his.histories || [];
        setHistories(histories.map(h => ({
          ...h,
          // Map lại các trường cho đúng frontend
          date: h.used_date || h.date || '',
          staffId: h.staff_id !== undefined ? String(h.staff_id) : (h.staffId !== undefined ? String(h.staffId) : ''),
          serviceId: h.service_id !== undefined ? String(h.service_id) : (h.serviceId !== undefined ? String(h.serviceId) : ''),
          payment: h.payment_method || h.payment || '',
          images: h.images || [],
        })));
        setServices(Array.isArray(ser) ? ser : ser.services || []);
        setStaff(Array.isArray(stf) ? stf : stf.staff || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Không thể tải dữ liệu!");
        setLoading(false);
      });
  }, [id]);

  const formatMoney = v => v ? v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[var(--primary,#2563eb)] via-[var(--accent,#9333ea)] to-pink-100 p-4 transition-colors">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-8">
        {/* Card thông tin khách hàng */}
        {customer && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 flex flex-col sm:flex-row gap-6 items-center">
            <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-3xl font-bold text-blue-700">
              {customer.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 space-y-1">
              <div className="text-2xl font-bold text-blue-700">{customer.name}</div>
              <div><span className="font-semibold">SĐT:</span> {customer.phone}</div>
              <div><span className="font-semibold">Địa chỉ:</span> {customer.address || <span className="text-gray-400">(trống)</span>}</div>
              <div><span className="font-semibold">Ngày sinh:</span> {(() => {
                const dob = customer.birthday || customer.dob;
                if (!dob) return "";
                const [d, m, y] = dob.split("-");
                if (y === "1900" || !y) return `${d}/${m}`;
                return `${d}/${m}/${y}`;
              })()}</div>
              <div><span className="font-semibold">Ghi chú:</span> {customer.note || <span className="text-gray-400">(trống)</span>}</div>
            </div>
          </div>
        )}
        {/* Card lịch sử sử dụng dịch vụ */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-700">Lịch sử sử dụng dịch vụ</h2>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
              onClick={() => openForm()}
            >+ Thêm lịch sử</button>
          </div>
          {/* Form thêm/sửa lịch sử khách hàng dạng modal popup */}
          <Modal open={formOpen} onClose={closeForm}>
            <form className="bg-white rounded-xl p-6 shadow-xl w-full max-w-lg" onSubmit={handleSubmit} onClick={e => e.stopPropagation()}>
              <div className="text-lg font-bold text-blue-700 mb-4">{editHistory ? 'Cập nhật lịch sử' : 'Thêm lịch sử mới'}</div>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[180px]">
                  <label className="block font-semibold mb-1">Ngày làm</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInput} className="w-full border rounded px-2 py-1" required />
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="block font-semibold mb-1">Nhân viên</label>
                  <select name="staffId" value={formData.staffId} onChange={handleInput} className="w-full border rounded px-2 py-1" required>
                    <option value="">-- Chọn --</option>
                    {staff.map((s, idx) => <option key={s._id || s.id || idx} value={s._id || s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="block font-semibold mb-1">Dịch vụ</label>
                  <select name="serviceId" value={formData.serviceId} onChange={handleInput} className="w-full border rounded px-2 py-1" required>
                    <option value="">-- Chọn --</option>
                    {services.map((s, idx) => <option key={s._id || s.id || idx} value={s._id || s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="block font-semibold mb-1">Giá tiền</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInput} className="w-full border rounded px-2 py-1" min="0" />
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="block font-semibold mb-1">Thanh toán</label>
                  <input type="text" name="payment" value={formData.payment} onChange={handleInput} className="w-full border rounded px-2 py-1" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block font-semibold mb-1">Ghi chú</label>
                <textarea name="note" value={formData.note} onChange={handleInput} className="w-full border rounded px-2 py-1" rows={2} />
              </div>
              <div className="mt-4">
                <label className="block font-semibold mb-1">Hình ảnh</label>
                <input type="file" multiple accept="image/*" onChange={handleImage} className="block" />
                <div className="flex gap-2 mt-2">
                  {formData.images.map((img, idx) => (
                    <img key={idx} src={img} alt="preview" className="w-12 h-12 object-cover rounded border" />
                  ))}
                </div>
              </div>
              <div className="mt-4 flex gap-2 justify-end">
                <button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg" onClick={closeForm}>Huỷ</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow">{editHistory ? 'Cập nhật' : 'Thêm mới'}</button>
              </div>
            </form>
          </Modal>
          {loading ? <div className="text-blue-500">Đang tải...</div> : error ? <div className="text-red-500">{error}</div> : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-blue-50 text-blue-700">
                    <th className="py-2 px-3">Ngày làm</th>
                    <th className="py-2 px-3">Nhân viên</th>
                    <th className="py-2 px-3">Dịch vụ</th>
                    <th className="py-2 px-3">Ghi chú</th>
                    <th className="py-2 px-3">Giá tiền</th>
                    <th className="py-2 px-3">Thanh toán</th>
                    <th className="py-2 px-3">Hình ảnh</th>
                    <th className="py-2 px-3">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {histories.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-6 text-gray-400">Chưa có lịch sử sử dụng dịch vụ</td></tr>
                  ) : (
                    histories.map((his, idx) => (
                      <tr key={(his._id || his.id || idx) + '-' + idx} className="border-b hover:bg-blue-50 transition">
                        <td className="py-2 px-3">{(() => {
                          const d = his.date ? new Date(his.date) : null;
                          if (!d || isNaN(d)) return '';
                          const day = String(d.getDate()).padStart(2, '0');
                          const month = String(d.getMonth() + 1).padStart(2, '0');
                          const year = d.getFullYear();
                          return `${day}-${month}-${year}`;
                        })()}</td>
                        <td className="py-2 px-3">{
                          staff.find(s => String(s._id || s.id) === String(his.staffId || his.staff_id))?.name || ''
                        }</td>
                        <td className="py-2 px-3">{
                          services.find(s => String(s._id || s.id) === String(his.serviceId || his.service_id))?.name || ''
                        }</td>
                        <td className="py-2 px-3 max-w-xs whitespace-pre-line">{his.note}</td>
                        <td className="py-2 px-3">{formatMoney(his.price)}</td>
                        <td className="py-2 px-3">{his.payment || his.payment_method || ''}</td>
                        <td className="py-2 px-3">
                          {Array.isArray(his.images) && his.images.length > 0 ? (
                            <img src={his.images[0]} alt="thumb" className="w-10 h-10 object-cover rounded cursor-pointer border" onClick={() => setImgModal({ open: true, images: his.images, idx: 0 })} />
                          ) : <span className="text-gray-400">Không có</span>}
                        </td>
                        <td className="py-2 px-3 flex gap-2 justify-center">
                          <button className="text-yellow-600 hover:bg-yellow-100 rounded p-1" title="Sửa" onClick={() => openForm(his)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6h6" /></svg>
                          </button>
                          <button className="text-red-600 hover:bg-red-100 rounded p-1" title="Xóa" onClick={() => handleDelete(his)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* Modal xem ảnh lớn */}
        <Modal open={imgModal.open} onClose={() => setImgModal({ open: false, images: [], idx: 0 })}>
          {imgModal.images.length > 0 && (
            <div className="flex flex-col items-center">
              <img src={imgModal.images[imgModal.idx]} alt="big" className="max-w-[80vw] max-h-[60vh] rounded shadow mb-2" />
              <div className="flex gap-2 mt-2">
                <button disabled={imgModal.idx === 0} onClick={() => setImgModal(m => ({ ...m, idx: m.idx - 1 }))} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">◀</button>
                <button disabled={imgModal.idx === imgModal.images.length - 1} onClick={() => setImgModal(m => ({ ...m, idx: m.idx + 1 }))} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">▶</button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
