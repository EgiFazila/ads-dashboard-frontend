import { useState } from "react";
import MasterProyekIndex from "./Index";
import MasterProyekAdd from "./Add";

export default function MasterProyek() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MasterProyekIndex onChangePage={handleSetPageMode} />;
      case "add":
        return <MasterProyekAdd onChangePage={handleSetPageMode} />;
    }
  }

  function handleSetPageMode(mode) {
    setPageMode(mode);
  }

  return <div>{getPageMode()}</div>;
  
}