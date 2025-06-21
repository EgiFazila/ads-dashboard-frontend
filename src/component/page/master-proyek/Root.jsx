import { useState } from "react";
import MasterProyekIndex from "./Index";
import MasterProyekAdd from "./Add";

export default function MasterProyek() {
  const [pageMode, setPageMode] = useState("index");
  const [pageParams, setPageParams] = useState({});

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MasterProyekIndex onChangePage={handleSetPageMode} />;
      case "add":
        return <MasterProyekAdd onChangePage={handleSetPageMode} aktivitas={pageParams.aktivitas}/>;
    }
  }

  function handleSetPageMode(mode, params = {}) {
    setPageMode(mode);
    setPageParams(params);
  }

  return <div>{getPageMode()}</div>;
  
}