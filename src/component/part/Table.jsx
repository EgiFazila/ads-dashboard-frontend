import DOMPurify from "dompurify";
import Icon from "./Icon";

export default function Table({
  data,
  size = "Normal",
  onToggle = () => {},
  onCancel = () => {},
  onDelete = () => {},
  onDetail = () => {},
  onEdit = () => {},
  onApprove = () => {},
  onReject = () => {},
  onSent = () => {},
  onUpload = () => {},
  onFinal = () => {},
  onPrint = () => {},
}) {
  let colPosition;
  let colCount = 0;

  function generateActionButton(columnName, value, key, id, status) {
    if (columnName !== "Aksi") return value;

    const listButton = value.map((action) => {
      switch (action) {
        case "Toggle": {
          if (status === "Aktif") {
            return (
              <Icon
                key={key + action}
                name="toggle-on"
                type="Bold"
                cssClass="btn px-1 py-0 text-primary"
                title="Nonaktifkan"
                onClick={() => onToggle(id)}
              />
            );
          } else if (status === "Tidak Aktif") {
            return (
              <Icon
                key={key + action}
                name="toggle-off"
                type="Bold"
                cssClass="btn px-1 py-0 text-secondary"
                title="Aktifkan"
                onClick={() => onToggle(id)}
              />
            );
          }
        }
        case "Cancel":
          return (
            <Icon
              key={key + action}
              name="delete-document"
              type="Bold"
              cssClass="btn px-1 py-0 text-danger"
              title="Batalkan"
              onClick={() => onCancel(id)}
            />
          );
        case "Delete":
          return (
            <Icon
              key={key + action}
              name="trash"
              type="Bold"
              cssClass="btn px-1 py-0 text-danger"
              title="Hapus"
              onClick={() => onDelete(id)}
            />
          );
        case "Detail":
          return (
            <Icon
              key={key + action}
              name="overview"
              type="Bold"
              cssClass="btn px-1 py-0 text-primary"
              title="Lihat Detail"
              onClick={() => onDetail("detail", id)}
            />
          );
        case "Edit":
          return (
            <Icon
              key={key + action}
              name="edit"
              type="Bold"
              cssClass="btn px-1 py-0 text-primary"
              title="Ubah"
              onClick={() => onEdit("edit", id)}
            />
          );
        case "Approve":
          return (
            <Icon
              key={key + action}
              name="check"
              type="Bold"
              cssClass="btn px-1 py-0 text-success"
              title="Setujui Pengajuan"
              onClick={() => onApprove(id)}
            />
          );
        case "Reject":
          return (
            <Icon
              key={key + action}
              name="cross"
              type="Bold"
              cssClass="btn px-1 py-0 text-danger"
              title="Tolak Pengajuan"
              onClick={() => onReject(id)}
            />
          );
        case "Sent":
          return (
            <Icon
              key={key + action}
              name="paper-plane"
              type="Bold"
              cssClass="btn px-1 py-0 text-primary"
              title="Kirim"
              onClick={() => onSent(id)}
            />
          );
        case "Upload":
          return (
            <Icon
              key={key + action}
              name="file-upload"
              type="Bold"
              cssClass="btn px-1 py-0 text-primary"
              title="Unggah Berkas"
              onClick={() => onUpload(id)}
            />
          );
        case "Final":
          return (
            <Icon
              key={key + action}
              name="gavel"
              type="Bold"
              cssClass="btn px-1 py-0 text-primary"
              title="Finalkan"
              onClick={() => onFinal(id)}
            />
          );
        case "Print":
          return (
            <Icon
              key={key + action}
              name="print"
              type="Bold"
              cssClass="btn px-1 py-0 text-primary"
              title="Cetak"
              onClick={() => onPrint(id)}
            />
          );
        default: {
          try {
            if (typeof action === "object") {
              return (
                <Icon
                  key={key + "Custom" + action.IconName}
                  name={action.IconName}
                  type="Bold"
                  cssClass="btn px-1 py-0 text-primary"
                  title={action.Title}
                  onClick={action.Function}
                />
              );
            } else return null;
          } catch (err) {
            return null;
          }
        }
      }
    });

    return listButton;
  }

  return (
    <div className="overflow-x-auto rounded-3 border border-1 mb-3 shadow-sm">
      <div className="flex-fill">
        <table
          className={
            "table table-hover table-striped table table-light m-0" +
            (size === "Small" ? " table-sm small" : "")
          }
        >
          <thead>
            <tr>
              {Object.keys(data[0]).map((value, index) => {
                if (
                  value !== "Key" &&
                  value !== "Count" &&
                  value !== "Alignment"
                ) {
                  colCount++;
                  return (
                    <th key={"Header" + index} className="text-center">
                      {value}
                    </th>
                  );
                }
              })}
            </tr>
          </thead>
          <tbody>
            {data[0].Count !== 0 &&
              data.map((value, rowIndex) => {
                colPosition = -1;
                return (
                  <tr
                    key={value["Key"]}
                    className={
                      value["Status"] &&
                      (value["Status"] === "Draft" ||
                        value["Status"] === "Revisi" ||
                        value["Status"] === "Belum Dikonversi" ||
                        value["Status"] === "Belum Dibuat Penjadwalan")
                        ? "fw-bold"
                        : undefined
                    }
                  >
                    {Object.keys(value).map((column, colIndex) => {
                      if (
                        column !== "Key" &&
                        column !== "Count" &&
                        column !== "Alignment"
                      ) {
                        colPosition++;
                        const cellValue = generateActionButton(
                          column,
                          value[column],
                          "Action" + rowIndex + colIndex,
                          value["Key"],
                          value["Status"]
                        );
                        return (
                          <td
                            key={rowIndex + "" + colIndex}
                            style={{
                              textAlign: value["Alignment"][colPosition],
                            }}
                          >
                            {typeof cellValue === "object" ? (
                              cellValue
                            ) : (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(cellValue),
                                }}
                              ></div>
                            )}
                          </td>
                        );
                      }
                    })}
                  </tr>
                );
              })}
            {data[0].Count === 0 && (
              <tr>
                <td colSpan={colCount} className="text-center">Tidak ada data.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/*import DOMPurify from "dompurify";
import Icon from "./Icon";

export default function Table({
  data,
  size = "Normal",
  onToggle = () => {},
  onCancel = () => {},
  onDelete = () => {},
  onDetail = () => {},
  onEdit = () => {},
  onApprove = () => {},
  onReject = () => {},
  onSent = () => {},
  onUpload = () => {},
  onFinal = () => {},
  onPrint = () => {},
}) {
  const hasData = Array.isArray(data) && data.length > 0 && data[0] != null;
  const headers = hasData
    ? Object.keys(data[0]).filter(
        (key) => key !== "Key" && key !== "Count" && key !== "Alignment"
      )
    : [];
  const colCount = headers.length;

  function generateActionButton(columnName, value, key, id, status) {
    if (columnName !== "Aksi") return value;

    if (!Array.isArray(value)) return null;

    return value.map((action) => {
      switch (action) {
        case "Toggle":
          return (
            <Icon
              key={key + action}
              name={status === "Aktif" ? "toggle-on" : "toggle-off"}
              type="Bold"
              cssClass={`btn px-1 py-0 ${
                status === "Aktif" ? "text-primary" : "text-secondary"
              }`}
              title={status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
              onClick={() => onToggle(id)}
            />
          );
        case "Cancel":
          return (
            <Icon
              key={key + action}
              name="delete-document"
              type="Bold"
              cssClass="btn px-1 py-0 text-danger"
              title="Batalkan"
              onClick={() => onCancel(id)}
            />
          );
        case "Delete":
          return (
            <Icon
              key={key + action}
              name="trash"
              type="Bold"
              cssClass="btn px-1 py-0 text-danger"
              title="Hapus"
              onClick={() => onDelete(id)}
            />
          );
        case "Detail":
          return (
            <Icon
              key={key + action}
              name="overview"
              type="Bold"
              cssClass="btn px-1 py-0 text-primary"
              title="Lihat Detail"
              onClick={() => onDetail("detail", id)}
            />
          );
        case "Edit":
          return (
            <Icon
              key={key + action}
              name="edit"
              type="Bold"
              cssClass="btn px-1 py-0 text-primary"
              title="Ubah"
              onClick={() => onEdit("edit", id)}
            />
          );
        case "Approve":
          return (
            <Icon
              key={key + action}
              name="check"
              type="Bold"
              cssClass="btn px-1 py-0 text-success"
              title="Setujui Pengajuan"
              onClick={() => onApprove(id)}
            />
          );
        case "Reject":
          return (
            <Icon
              key={key + action}
              name="cross"
              type="Bold"
              cssClass="btn px-1 py-0 text-danger"
              title="Tolak Pengajuan"
              onClick={() => onReject(id)}
            />
          );
        case "Sent":
          return (
            <Icon
              key={key + action}
              name="paper-plane"
              type="Bold"
              cssClass="btn px-1 py-0 text-primary"
              title="Kirim"
              onClick={() => onSent(id)}
            />
          );
        case "Upload":
          return (
            <Icon
              key={key + action}
              name="file-upload"
              type="Bold"
              cssClass="btn px-1 py-0 text-primary"
              title="Unggah Berkas"
              onClick={() => onUpload(id)}
            />
          );
        case "Final":
          return (
            <Icon
              key={key + action}
              name="gavel"
              type="Bold"
              cssClass="btn px-1 py-0 text-primary"
              title="Finalkan"
              onClick={() => onFinal(id)}
            />
          );
        case "Print":
          return (
            <Icon
              key={key + action}
              name="print"
              type="Bold"
              cssClass="btn px-1 py-0 text-primary"
              title="Cetak"
              onClick={() => onPrint(id)}
            />
          );
        default:
          try {
            if (typeof action === "object") {
              return (
                <Icon
                  key={key + "Custom" + action.IconName}
                  name={action.IconName}
                  type="Bold"
                  cssClass="btn px-1 py-0 text-primary"
                  title={action.Title}
                  onClick={action.Function}
                />
              );
            }
            return null;
          } catch {
            return null;
          }
      }
    });
  }

  return (
    <div className="overflow-x-auto rounded-3 border border-1 mb-3 shadow-sm">
      <div className="flex-fill">
        <table
          className={
            "table table-hover table-striped table table-light m-0" +
            (size === "Small" ? " table-sm small" : "")
          }
        >
          <thead>
            <tr>
              {headers.map((value, index) => (
                <th key={"Header" + index} className="text-center">
                  {value}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hasData && data[0].Count !== 0 ? (
              data.map((row, rowIndex) => {
                let colPosition = -1;
                return (
                  <tr
                    key={row.Key ?? rowIndex}
                    className={
                      ["Draft", "Revisi", "Belum Dikonversi", "Belum Dibuat Penjadwalan"].includes(
                        row.Status
                      )
                        ? "fw-bold"
                        : undefined
                    }
                  >
                    {headers.map((column, colIndex) => {
                      colPosition++;
                      const cellValue = generateActionButton(
                        column,
                        row[column],
                        "Action" + rowIndex + colIndex,
                        row.Key,
                        row.Status
                      );

                      return (
                        <td
                          key={`cell-${rowIndex}-${colIndex}`}
                          style={{
                            textAlign: row.Alignment?.[colPosition] || "center",
                          }}
                        >
                          {typeof cellValue === "object" ? (
                            cellValue
                          ) : (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                  typeof cellValue === "string" ? cellValue : ""
                                ),
                              }}
                            ></div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={colCount || 1} className="text-center">
                  Tidak ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} */

