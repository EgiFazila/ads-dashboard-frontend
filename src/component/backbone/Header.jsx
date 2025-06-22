import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { decryptId } from "../util/Encryptor";
import { API_LINK, APPLICATION_ID, ROOT_LINK } from "../util/Constants";
import { formatDate } from "../util/Formatting";
import logo from "../../assets/IMG_Logo_white.png";
import UseFetch from "../util/UseFetch";
import Icon from "../part/Icon";

export default function Header({ displayName, roleName, handleShowMenu }) {
  //const [countNotifikasi, setCountNotifikasi] = useState("");

  function handleGetLastLogin() {
    return formatDate(
      JSON.parse(decryptId(Cookies.get("activeUser"))).lastLogin
    );
  }

  /*
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await UseFetch(
          API_LINK + "Utilities/GetDataCountingNotifikasi",
          { application: APPLICATION_ID }
        );

        if (data === "ERROR") {
          throw new Error();
        } else {
          setCountNotifikasi(data[0].counting);
        }
      } catch {
        setCountNotifikasi("");
      }
    };

    fetchData();
  }, []);
  */

  return (
    <div className="d-flex justify-content-between fixed-top border-bottom"
      style={{ backgroundColor: "#005eb8" }}>
      <div>
        <img
          src={logo}
          alt="Logo AstraTech"
          className="p-3 ms-2"
          style={{ height: "70px" }}
        />
      </div>
      <div className="d-flex align-items-center ms-4">
        <div className="me-4">
          <a href={ROOT_LINK}
            className="text-white"
            style={{ textDecoration: "none", fontSize: "1.1rem", lineHeight: "1.5rem" }}
          >
            Beranda
          </a>
        </div>
        <div className="dropdown me-4">
          <button
            className="btn btn-link dropdown-toggle text-white p-0 m-0 h2"
            style={{ textDecoration: "none", fontSize: "1.1rem", lineHeight: "1.5rem" }}
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            > 
              Master Data
            </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li>
              <a className="dropdown-item" href={ROOT_LINK + "/master_dosen"}>Dosen</a>
            </li>
            <li>
              <a className="dropdown-item" href={ROOT_LINK + "/master_mahasiswa"}>Mahasiswa</a>
            </li>
            <li>
              <a className="dropdown-item" href={ROOT_LINK + "/master_matakuliah"}>Mata Kuliah</a>
            </li>
            <li>
              <a className="dropdown-item" href={ROOT_LINK + "/master_alat"}>Alat</a>
            </li>
          </ul>
        </div>

        <div className="me-4">
          <a href={ROOT_LINK + "/master_proyek"}
          className="text-white"
          style={{ textDecoration: "none", fontSize: "1.1rem", lineHeight: "1.5rem" }}
          >
            Proyek
          </a>
        </div>

        <div>
          <a href={ROOT_LINK + "/dashboard"}
            className="text-white"
            style={{ textDecoration: "none", fontSize: "1.1rem", lineHeight: "1.5rem" }}
          >
            Dashboard
          </a>
        </div>
      </div>

      <div className="pe-4 my-auto">
        <div className="d-flex justify-content-end">
          <div className="text-end responsiveHeader">
            <p className="fw-bold mx-0 my-0 text-white">
              {displayName} ({roleName})
            </p>
            <small className="text-white" style={{ fontSize: ".7em" }}>
              Login terakhir: {handleGetLastLogin()} WIB
            </small>
          </div>
          <div className="my-auto ms-4 mt-2">
            <p
              className="h2 p-0 m-0 me-2"
              style={{ cursor: "pointer" }}
              data-bs-toggle="tooltip"
              data-bs-placement="bottom"
              title="Logout"
              onClick={() => (window.location.href = ROOT_LINK + "/logout")}
            >
              <Icon name="exit" style={{ color: "#fff" }}/>
            </p>
          </div>
          <div className="my-auto ms-4 mt-2 responsiveMenu">
            <p
              className="h2 p-0 m-0 me-1"
              style={{ cursor: "pointer" }}
              onClick={() => handleShowMenu()}
            >
              <Icon name="menu-burger" style={{ color: "#fff" }} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}