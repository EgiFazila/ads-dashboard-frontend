import { useState } from "react";
import Input from "../../part/Input";
import Button from "../../part/Button";

export default function MasterPeriodeAdd({ onSubmit, onChangePage }) {
  const [form, setForm] = useState({
    namaBulan: "",
    totalMinggu: "",
    tahun: "",
  });
  const [errors, setErrors] = useState({});

  const bulanOptions = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const mingguOptions = [3, 4];

  const tahunOptions = [];
    for (let i = 2025; i <= 2030; i++) {
    tahunOptions.push(i);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let err = {};
    if (!form.namaBulan) err.namaBulan = "Nama Bulan wajib diisi";
    if (!form.totalMinggu) err.totalMinggu = "Total Minggu wajib diisi";
    if (!form.tahun) err.tahun = "Tahun wajib diisi";
    setErrors(err);
    if (Object.keys(err).length === 0 && onSubmit) {
      onSubmit(form);
    }
  };

  const handleReset = () => {
    setForm({
      namaBulan: "",
      totalMinggu: "",
      tahun: "",
    });
    setErrors({});
  };

  return (
    <div className="container-fluid py-4">
      <h4 className="text-primary fw-bold text-center mb-4">Tambah Periode</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-bold">Nama Bulan <span className="text-danger">*</span></label>
          <select
            className="form-select"
            name="namaBulan"
            value={form.namaBulan}
            onChange={handleChange}
          >
            <option value="">-- Pilih Bulan --</option>
            {bulanOptions.map(bulan => (
              <option key={bulan} value={bulan}>{bulan}</option>
            ))}
          </select>
          {errors.namaBulan && <div className="text-danger">{errors.namaBulan}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold">Total Minggu <span className="text-danger">*</span></label>
          <select
            className="form-select"
            name="totalMinggu"
            value={form.totalMinggu}
            onChange={handleChange}
          >
            <option value="">-- Pilih Total Minggu --</option>
            {mingguOptions.map(minggu => (
              <option key={minggu} value={minggu}>{minggu}</option>
            ))}
          </select>
          {errors.totalMinggu && <div className="text-danger">{errors.totalMinggu}</div>}
        </div>
        <div className="mb-5">
          <label className="form-label fw-bold">Tahun <span className="text-danger">*</span></label>
          <select
            className="form-select"
            name="tahun"
            value={form.tahun}
            onChange={handleChange}
          >
            <option value="">-- Pilih Tahun --</option>
            {tahunOptions.map(tahun => (
              <option key={tahun} value={tahun}>{tahun}</option>
            ))}
          </select>
          {errors.tahun && <div className="text-danger">{errors.tahun}</div>}
        </div>
        
        <div className="d-flex justify-content-between align-items-center mt-4">
          <Button label="Reset" classType="secondary" onClick={handleReset} type="button" />
          <div>
            <Button label="Batal" classType="danger me-2" onClick={() => onChangePage("index")} />
            <Button label="Simpan" classType="primary" type="submit" />
          </div>
        </div>
      </form>
    </div>
  );
}