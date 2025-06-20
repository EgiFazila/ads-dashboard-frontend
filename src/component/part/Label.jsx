import DOMPurify from "dompurify";

export default function Label({ title, data, forLabel }) {
  const decodedData = new DOMParser().parseFromString(data, "text/html").body
    .textContent;

  return (
    <>
      <div className="mb-3">
        <label htmlFor={forLabel} className="form-label fw-bold">
          {title}
        </label>
        <br />
        {decodedData !== "undefined" && (
          <>
            {typeof data === "object" && (
              <div style={{ whiteSpace: "pre-wrap" }}>{data}</div>
            )}
            {typeof data !== "object" && (
              <div
                style={{ whiteSpace: "pre-wrap" }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(decodedData),
                }}
              ></div>
            )}
          </>
        )}
      </div>
    </>
  );
}
