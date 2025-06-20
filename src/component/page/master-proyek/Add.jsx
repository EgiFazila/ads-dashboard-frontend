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
import FileUpload from "../../part/FileUpload";
import Loading from "../../part/Loading";
import { object, string, date, number } from "yup";

export default function MasterProyekAdd({ onChangePage }) {
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ error: false, message: "" });

    const formDataRef = useRef({
        //proyekid: "",
        namaPelanggan: "",
        asalProyek: "",
        kategoriProyek: "",
        noSpk: "",
        aktivitas: "",
        layanan: "",
        tanggalMulai: "",
        tanggalSelesai: "",
        namaProyek: "",
        namaDosen: "",
        namaAlat: "",
        durasiAlat: "",
        namaMaterial: "",
        semester: "",
        mataKuliah: "",
        namaMahasiswa: "",
    });

    const proyekSchema = object({
        // proyekid: string().required("ID Proyek Otomatis"),
        namaPelanggan: string()
            .max(100, "maksimum 100 karakter")
            .required("Nama Pelanggan harus diisi"),
        asalProyek: string().required("Asal Proyek harus diisi"),
        kategoriProyek: string().required("Kategori Proyek harus diisi"),
        noSpk: string(),
        aktivitas: string(),
        layanan: string().required("Layanan harus diisi"),
        tanggalMulai: date().required("Tanggal Mulai harus diisi"),
        tanggalSelesai: date().required("Tanggal Selesai harus diisi"),
        namaProyek: string().required("Nama Proyek harus diisi"),
        namaDosen: string().required("Input Dosen harus diisi"),
        namaAlat: string(),
        durasiAlat: number(),
        namaMaterial: string(),
        semester: string().required("Semester harus diisi"),
        mataKuliah: string().required("Mata Kuliah harus diisi"),
        namaMahasiswa: string().required("Input Mahasiswa harus diisi")
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        formDataRef.current[name] = value;
    };

    const handleSubmit = async (e) => {
        try {
            await proyekSchema.validate(formDataRef.current, { abortEarly: false });
            setErrors({});
            setIsLoading(true);
        } catch (err) {
            if (err.inner){
                const newErrors = {};
                err.inner.forEach((validationError) => {
                    newErrors[validationError.path] = validationError.message;
                });
                setErrors(newErrors);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            
        </div>
    )




}