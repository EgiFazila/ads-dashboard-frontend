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
import * as XLSX from "xlsx";

const inisialisasiData = [
  {
    Key: null,
    //No: null,
    "NPK": null,
    "Nama Dosen": null,
    Count: 0,
    Aksi: "",
  },
];

const dataFilterSort = [
  { Value: "[NPK] asc", Text: "NPK [↑]" },
  { Value: "[NPK] desc", Text: "NPK [↓]" },
  { Value: "[Nama Dosen] asc", Text: "Nama Dosen [↑]" },
  { Value: "[Nama Dosen] desc", Text: "Nama Dosen [↓]" },
];

export default function MasterDosenIndex({ onChangePage }) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    sort: "[NPK] asc",
  });

  const searchQuery = useRef();
  const searchFilterSort = useRef();
  const importModalRef = useRef();

  function handleSetCurrentPage(newCurrentPage){
    setIsLoading(true);
    setCurrentFilter((prevFilter) => {
        return {
            ...prevFilter,
            page: newCurrentPage,
        };
    });
  }

  function handleSearch(){
    setIsLoading(true);
    setCurrentFilter((prevFilter) => {
        return {
            ...prevFilter,
            page: 1,
            query: searchQuery.current.value,
            sort: searchFilterSort.current.value,
        };
    });
  }

  useEffect(() => {
    const fetchData = async () => {
        setIsError(false);

        try {
          const data = await UseFetch(
          API_LINK + "MasterDosen/GetDataDosen",
          currentFilter
          );

          if (data === "ERROR"){
            setIsError(true);
          } else if (data.length === 0){
            setCurrentData(inisialisasiData);
          } else {
            const formattedData = data.map((value) => ({ 
                ...value,
                //Aksi: ["Detail", "Hapus"],
                Alignment: ["center", "center", "center"],
            }));
            setCurrentData(formattedData);
          }   
        } catch {
            setIsError(true);
        }  finally {
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
              message="Terjadi kesalahan: Gagal mengambil data dosen."
            />
          </div>
        )}
        <div className="flex-fill">
          <Button
            iconName="download"
            classType="primary me-3 mb-3"
            label="Unduh Template"
            onClick={() => {
              // Download file secara manual
              const link = document.createElement("a");
              link.href = "/template/ADS_MasterDosen.xlsx";
              link.download = "ADS_MasterDosen.xlsx";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

              // Tampilkan SweetAlert
              SweetAlert("Template berhasil diunduh!");
            }}
          />
          <Button
              iconName="file-import"
              classType="success mb-3"
              label="Import Excel"
              onClick={() => 
                importModalRef.current.open()}
          />
          <div className="input-group">
            <Input
              ref={searchQuery}
              forInput="pencarianDosen"
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
                defaultValue="[NPK] asc"
              />
            </Filter>
          </div>
        </div>

        { /* Tabel dan Paging */ }
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
        title="Import Data Dosen"
        size="small"
        Button1={
          <>
          <Button
            classType="danger me-2"
            label="Batal"
            onClick={() => importModalRef.current.close()}
          />
          <Button
            classType="primary me-2"
            label="Konfirmasi"
            onClick={() => {
              const fileInput = document.getElementById("fileExcelDosen");
              const file = fileInput.files[0];
              if (!file) {
                SweetAlert("Silahkan pilih berkas terlebih dahulu");
                return;
              }
              
              /*const reader = new FileReader();
              reader.onload = async (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet); */
              
              const reader = new FileReader();
              reader.onload = async (e) => {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet);

                try {
                  const response = await fetch(API_LINK + "MasterDosen/ImportDataDosen", {
                    method: "POST",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify(jsonData),
                  });

                  if (!response.ok) throw new Error("Gagal mengunggah file");
                  SweetAlert(`Berkas '${file.name}' berhasil diunggah dan disimpan.`);
                  importModalRef.current.close();
                  setIsLoading(true);
                  setCurrentFilter({ ...currentFilter });
                } catch (error){
                  SweetAlert("Gagal mengunggah ke server.");
                }
              };

              reader.readAsArrayBuffer(file);
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
            id="fileExcelDosen" 
            accept=".xlsx, .xls" 
          />
          <p style={{ fontSize: "0.75rem", color: "red" }} className="mt-2">
            Berkas yang akan di terima adalah berkas yang diunggah terakhir. Jika mengimport ulang, berkas sebelumnya akan digantikan dan tidak diproses.
          </p>
        </Modal>
    </>
  );
}