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
import Loading from "../../part/Loading";
import Modal from "../../part/Modal";
import Cookies from "js-cookie";
import { decryptId } from "../../util/Encryptor";

const inisialisasiData = [
  {
    Key: null,
    No: null,
    Kode: null,
    "Nama Alat": null,
    "Area": null,
    Count: 0,
    Aksi: "",
  },
];

const dataFilterSort = [
  { Value: "[Nama Alat] asc", Text: "[Nama Alat] [↑]" },
  { Value: "[Nama Alat] desc", Text: "[Nama Alat] [↓]" },
  { Value: "[Area] asc", Text: "[Area] [↑]" },
  { Value: "[Area] desc", Text: "[Area] [↓]" },
];

export default function MasterAlatIndex({ onChangePage }) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [currentFilter, setCurrentFilter] = useState({
    sort: "[Kode] asc",
    page: 1,
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const searchQuery = useRef();
  const searchFilterSort = useRef();
  const importModalRef = useRef();
  const fileInputRef = useRef();

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
      query: searchQuery.current.value,
      sort: searchFilterSort.current.value,
    }));
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      try {
        const data = await UseFetch(
          API_LINK + "MasterAlat/GetDataAlat",
          currentFilter
        );

        if (data === "ERROR") {
          setIsError(true);
        } else if (data.length === 0) {
          setCurrentData(inisialisasiData);
        } else {
          const formattedData = data.map((value, idx) => ({
            ...value,
            Aksi: ["Delete"],
            Key: value.Kode || idx,
            Alignment: ["center", "center", "center", "center", "center"],
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

  const handleDelete = async (id) => {
    const confirm = await SweetAlert(
      "Konfirmasi",
      "Yakin ingin menghapus data ini?",
      "info",
      "Ya saya yakin"
    );
    if (!confirm) return;

    try {
      const jwtToken = Cookies.get("jwtToken");
      const response = await fetch(API_LINK + "MasterAlat/DeleteDataAlat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
        body: JSON.stringify({ Kode: id }),
      });
      if (!response.ok) {
        const resText = await response.text();
        throw new Error(resText);
      }
      SweetAlert("Sukses", "Data berhasil dihapus", "success");
      setIsLoading(true);
      setCurrentFilter({ ...currentFilter });
    } catch (error) {
      SweetAlert("Gagal", error.message, "error");
    }
  };

  return (
    <>
      <div className="d-flex flex-column">
        {isError && (
          <div className="flex-fill">
            <Alert
              type="warning"
              message="Terjadi kesalahan: Gagal mengambil data alat."
            />
          </div>
        )}
        <div className="flex-fill">
          <Button
            iconName="download"
            classType="primary me-3 mb-3"
            label="Unduh Template"
              onClick={() => {
                const link = document.createElement("a");
                link.href = "/template/ADS_MasterMataKuliah.xlsx";
                link.download = "ADS_MasterMataKuliah.xlsx";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
          
                SweetAlert("Sukses", "Template berhasil diunduh!", "success");
              }}
          />
          <Button
            iconName="file-import"
            classType="success mb-3"
            label="Import Excel"
            onClick={() => importModalRef.current.open()}
          />
          <div className="input-group">
            <Input
              ref={searchQuery}
              forInput="pencarianAlat"
              placeholder="Cari"
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
                arrData={dataFilterSort}
                defaultValue="[Nama Alat] asc"
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
                onDelete={handleDelete}
              />
              <Paging
                pageSize={PAGE_SIZE}
                pageCurrent={currentFilter.page}
                totalData={currentData[0]["Count"]}
                navigation={handleSetCurrentPage}
              />
            </div>
          )}
        </div>
      </div>

      { /* Modal Import File Excel */ }
      <Modal
        ref={importModalRef}
        title="Import Data Alat"
        size="small"
        Button1={
          <>
          <Button
            classType="danger me-2"
            label="Batal"
            onClick={() => {
              importModalRef.current.close();
              setSelectedFile(null);
            }}
          />
          <Button
            classType="primary me-2"
            label="Konfirmasi"
            onClick={ async () => {
              if (!selectedFile) {
                SweetAlert("Silahkan pilih berkas terlebih dahulu");
                return;
              }
                            
              try {
                const jwtToken = Cookies.get("jwtToken");
                const userCookie = Cookies.get("activeUser");
                if (!userCookie) throw new Error("User belum login");
              
                const username = JSON.parse(decryptId(userCookie)).username;
              
                const formData = new FormData();
                formData.append("File", selectedFile);
                formData.append("UserName", username);
              
                const response = await fetch(API_LINK + "MasterDosen/ImportExcelMataKuliah", {
                  method: "POST",
                  headers: {
                    Authorization: "Bearer " + jwtToken,
                  },
                  body: formData,
                });
              
                if (!response.ok) {
                  const resText = await response.text();
                  throw new Error(`Upload gagal: ${resText}`);
                }
              
                SweetAlert("Sukses", `Berkas berhasil diunggah dan disimpan.`, "success");
                importModalRef.current.close();
                setSelectedFile(null);
                setIsLoading(true);
                setCurrentFilter({ ...currentFilter });
              
              } catch (error) {
                SweetAlert("Gagal", error.message, "error");
              }
            }}
          />
          </>
        }
        >
          <p className="mb-2" style={{ fontSize: "0.8rem" }}>
            Berkas harus berformat .xlsx atau .xls dan mengikuti template yang telah disediakan.
          </p>
          <input 
            type="file" 
            className="form-control" 
            accept=".xlsx, .xls" 
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setSelectedFile(file);
              }
            }}
          />

          {selectedFile && (
            <p className="small text-success mt-2">Dipilih : {selectedFile.name}</p>
          )} 

          <p style={{ fontSize: "0.75rem", color: "red" }} className="mt-2">
            Berkas yang akan di terima adalah berkas yang diunggah terakhir. Jika mengimport ulang, berkas sebelumnya akan digantikan dan tidak diproses.        
          </p>
      </Modal>
    </>
  );
}