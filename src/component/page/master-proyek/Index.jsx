import { useEffect, useRef, useState } from "react";
import { PAGE_SIZE, API_LINK } from "../../util/Constants";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Table from "../../part/Table";
import Paging from "../../part/Paging";
import Filter from "../../part/Filter";
import DropDown from "../../part/Dropdown";
import Alert from "../../part/Alert";
import Modal from "../../part/Modal";
import Loading from "../../part/Loading";

const inisialisasiData = [
  {
    Key: null,
    No: null,
    "Kode Proyek": null,
    "Judul": null,
    "Nama Pelanggan": null,
    "Asal Instansi/Unit": null,
    "Aktivitas": null,
    "Layanan": null,
    "Status": null,
    Aksi: "",
    Count: 0,
  },
];

const dataFilterSort = [
  { Value: "[Judul Proyek] asc", Text: "Judul Proyek [↑]" },
  { Value: "[Judul Proyek] desc", Text: "Judul Proyek [↓]" },
  { Value: "[Nama Pelanggan] asc", Text: "Nama Pelanggan [↑]" },
  { Value: "[Nama Pelanggan] desc", Text: "Nama Pelanggan [↓]" },
];

export default function MasterProyekIndex({ onChangePage }) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [showExportModal, setShowExportModal] = useState(false);
  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    sort: "[Kode Proyek] asc",
  });

  const searchQuery = useRef();
  const searchFilterSort = useRef();
  const modalExportRef = useRef();
  const [exportFields, setExportFields] = useState([
    { key: "proyekid", label: "ID Proyek", checked: true },
    { key: "namaPelanggan", label: "Nama Pelanggan", checked: true },
    { key: "asalProyek", label: "Asal Instansi/Unit", checked: true },
    { key: "kategoriProyek", label: "Kategori", checked: true },
    { key: "noSpk", label: "No SPK", checked: true },
    { key: "aktivitas", label: "Aktivitas", checked: true },
    { key: "layanan", label: "Layanan", checked: true },
    { key: "tanggalMulai", label: "Tanggal Mulai", checked: true },
    { key: "tanggalSelesai", label: "Tanggal Selesai", checked: true },
    { key: "judulProyek", label: "Judul Proyek", checked: true },
    { key: "dosen", label: "Dosen", checked: true },
    { key: "mahasiswa", label: "Mahasiswa", checked: true },
    { key: "semester", label: "Semester", checked: true },
    { key: "mataKuliah", label: "Mata Kuliah", checked: true },
    { key: "namaAlat", label: "Alat/Mesin", checked: true },
    { key: "durasiAlat", label: "Durasi Alat", checked: true },
    { key: "namaMaterial", label: "Bahan/Material", checked: true },
  ]);

  const handleExportExcel = () => {
    const selectedFields = exportFields.filter(f => f.checked).map(f => f.key);

    // Ambil data dari formData dan memberData
    let data = {
      ...formData,
      dosen: memberData.filter(m => listDosen.some(d => d.Value === m.Key)).map(m => m.Name).join(", "),
      mahasiswa: memberData.filter(m => listMahasiswa.some(d => d.Value === m.Key)).map(m => m.Name).join(", "),
    };

    // Filter hanya field yang dipilih
    let exportData = {};
    selectedFields.forEach(key => {
      exportData[key] = data[key];
    });

    // Ekspor ke Excel (pakai SheetJS/xlsx)
    // Contoh:
    // import * as XLSX from "xlsx";
    // const ws = XLSX.utils.json_to_sheet([exportData]);
    // const wb = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, "DataProyek");
    // XLSX.writeFile(wb, "DataProyek.xlsx");

    setShowExportModal(false);
};

  function handleSetCurrentPage(newCurrentPage) {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      page: newCurrentPage,
    }));
  }

  function handleSearch() {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      page: 1,
      query: searchQuery.current?.value,
      sort: searchFilterSort.current?.value,
    }));
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      try {
        const data = await UseFetch(
          API_LINK + "MasterProyek/GetDataProyek",
          currentFilter
        );

        if (!data || data === "ERROR") {
          setIsError(true);
        } else if (data.length === 0) {
          setCurrentData(inisialisasiData);
        } else {
          const formattedData = data.map((value) => ({
            ...value,
            Aksi: ["Toggle", "Detail", "Delete"],
            Alignment: [
              "center",   // No
              "center",   // Id Proyek
              "center",   // Title
              "center",   // Customer Name
              "center",   // Company/Dept
              "center",   // Activity
              "center",   // Services
              "center",   // Status
              "center",   // Aksi
            ],
          }));
          setCurrentData(formattedData);
        }
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentFilter]);

  return (
    <>
      <div className="d-flex flex-column">
        {isError && (
          <div className="flex-fill">
            <Alert
              type="warning"
              message="Terjadi kesalahan: Gagal mengambil data proyek."
            />
          </div>
        )}
        <div className="flex-fill ">
          <Button
              iconName="add"
              classType="primary me-3 mb-3"
              label="Layanan Industri"
              onClick={() => onChangePage("add", { aktivitas: "Layanan Industri"})}
          />
          <Button
              iconName="add"
              classType="primary mb-3"
              label="Tri Dharma"
              onClick={() => onChangePage("add", { aktivitas: "Tri Dharma"})}
          />
          <Button
              iconName="file-export"
              classType="success mb-3 ms-3"
              label="Ekspor Excel"
              onClick={() => 
                modalExportRef.current.open()}
          />
          <div className="input-group">
            <Input
              ref={searchQuery}
              forInput="pencarianProyek"
              placeholder="Cari proyek..."
            />
            <Button
              iconName="search"
              classType="primary px-4"
              title="Cari"
              onClick={handleSearch}
            />
            <Filter>
              <DropDown
                ref={searchFilterSort}
                forInput="ddUrut"
                label="Urut berdasarkan"
                type="none"
                data={dataFilterSort}
                defaultValue="[Judul Proyek] asc"
              />
            </Filter>
          </div>
        </div>
        <div className="mt-3">
          {isLoading ? (
            <Loading />
          ) : (
            <div className="d-flex flex-column">
              <Table
                data={currentData}
                onDetail={onChangePage}
                onEdit={onChangePage}
              />
              <Paging
                pageSize={PAGE_SIZE}
                pageCurrent={currentFilter.page}
                totalData={currentData?.[0]?.Count || 0}
                navigation={handleSetCurrentPage}
              />
            </div>
          )}
        </div>
      </div>

    {/* Modal Ekspor Excel */}
    <Modal
      ref={modalExportRef}
      title="Pilih Data yang Akan Diekspor"
      size="medium"
      Button1={
        <Button label="Batal" classType="danger me-2" onClick={() => modalExportRef.current.close()} />
      }
      Button2={
        <Button label="Ekspor" onClick={handleExportExcel} classType="primary" />
      } 
    >
      {/* Isi modal */}
        <div style={{ display: "flex", gap: "32px" }}>
          <div style={{ flex: 1 }}>
            {exportFields.slice(0, 9).map((field, idx) => (
              <div key={field.key} className="mb-2">
                <input
                  type="checkbox"
                  checked={field.checked}
                  onChange={() => {
                    setExportFields(fields =>
                      fields.map((f, i) =>
                        i === idx ? { ...f, checked: !f.checked } : f
                      )
                    );
                  }}
                  id={`export-col-${field.key}`}
                />
                <label htmlFor={`export-col-${field.key}`} className="ms-2">
                  {field.label}
                </label>
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }}>
            {exportFields.slice(9).map((field, idx) => (
              <div key={field.key} className="mb-2">
                <input
                  type="checkbox"
                  checked={field.checked}
                  onChange={() => {
                    setExportFields(fields =>
                      fields.map((f, i) =>
                        i === idx + 9 ? { ...f, checked: !f.checked } : f
                      )
                    );
                  }}
                  id={`export-col-${field.key}`}
                />
                <label htmlFor={`export-col-${field.key}`} className="ms-2">
                  {field.label}
                </label>
              </div>
            ))}
          </div>
        </div>
    </Modal>
  </>
  );
}
