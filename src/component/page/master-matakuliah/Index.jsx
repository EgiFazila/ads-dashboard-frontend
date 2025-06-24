import { useEffect, useRef, useState } from "react";
import { PAGE_SIZE, API_LINK } from "../../util/Constants";
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
    "Semester": null,
    "Mata Kuliah": null,
    Count: 0,
  },
];

export default function MasterMataKuliahIndex({ onChangePage }) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [semesterList, setSemesterList] = useState([]);
  const [matkulList, setMatkulList] = useState([]);
  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    semester: "",
    matkul: "",
  });

  const searchQuery = useRef();
  const searchSemester = useRef();
  const searchMatkul = useRef();
  const importModalRef = useRef();

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
      semester: searchSemester.current.value,
      matkul: searchMatkul.current.value,
    }));
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      try {
        const data = await UseFetch(
          API_LINK + "MasterMataKuliah/GetDataMataKuliah",
          currentFilter
        );

        if (data === "ERROR") {
          setIsError(true);
        } else if (data.length === 0) {
          setCurrentData(inisialisasiData);
        } else {
          const formattedData = data.map((value) => ({
            ...value,
            Aksi: ["Toggle", "Detail", "Edit"],
            Alignment: ["center", "left", "left", "center"],
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
              message="Terjadi kesalahan: Gagal mengambil data semester/matkul."
            />
          </div>
        )}
        <div className="flex-fill">
          <a href="/template/ADS_MasterMataKuliah.xlsx" download>
            <Button
              iconName="download"
              classType="primary me-3 mb-3"
              label="Unduh Template"
            />
          </a>
            <Button
              iconName="add"
              classType="success mb-3"
              label="Import Excel"
              onClick={() => 
                importModalRef.current.open()}
            />
          <div className="input-group">
            <Input
              ref={searchQuery}
              forInput="pencarianMataKuliah"
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
                ref={searchSemester}
                forInput="ddSemester"
                label="Semester"
                type="semua"
                arrData={semesterList}
                defaultValue="[Semester] asc"
              />
              <DropDown
                ref={searchMatkul}
                forInput="ddMatkul"
                label="Mata Kuliah"
                type="semua"
                arrData={matkulList}
                defaultValue="[Mata Kuliah] asc"
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
        title="Import Data Mata Kuliah"
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
              const fileInput = document.getElementById("fileExcelMataKuliah");
              const file = fileInput.files[0];
              if (file) {
                SweetAlert(`Berkas '${file.name}' berhasil diunggah!.`);
              } else {
                SweetAlert("Silakan pilih berkas Excel terlebih dahulu.");
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
            id="fileExcelMataKuliah" 
            accept=".xlsx, .xls" 
          />
          <p style={{ fontSize: "0.75rem", color: "red" }} className="mt-2">
            Berkas yang akan di terima adalah berkas yang diunggah terakhir. Jika mengimport ulang, berkas sebelumnya akan digantikan dan tidak diproses.        
          </p>
      </Modal>
    </>
  );
}
