import { useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import "trumbowyg/dist/ui/trumbowyg.min.css";
import "trumbowyg";
import IconPack from "trumbowyg/dist/ui/icons.svg";

const Editor = ({
  label = "",
  forInput,
  isRequired = false,
  isDisabled = false,
  errorMessage,
  onChange,
  value,
  ...props
}) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      $.trumbowyg.svgPath = IconPack;
      $(editorRef.current)
        .trumbowyg({
          btns: [
            ["viewHTML"],
            ["strong", "em", "del"],
            ["superscript", "subscript"],
            ["link"],
            ["unorderedList", "orderedList"],
          ],
        })
        .on("tbwchange", function () {
          onChange({
            target: {
              name: forInput,
              value: $(editorRef.current).trumbowyg("html"),
            },
          });
        })
        .trumbowyg("html", DOMPurify.sanitize(value));
    }

    return () => {
      if (editorRef.current) {
        $(editorRef.current).trumbowyg("destroy");
      }
    };
  }, []);

  return (
    <>
      {label !== "" && (
        <div className="mb-3">
          <label htmlFor={forInput} className="form-label fw-bold">
            {label}
            {isRequired ? <span className="text-danger"> *</span> : ""}
            {errorMessage ? (
              <span className="fw-normal text-danger"> {errorMessage}</span>
            ) : (
              ""
            )}
          </label>
          <textarea
            id={forInput}
            name={forInput}
            ref={editorRef}
            disabled={isDisabled}
            {...props}
          ></textarea>
        </div>
      )}
      {label === "" && (
        <>
          <textarea
            id={forInput}
            name={forInput}
            ref={editorRef}
            disabled={isDisabled}
            {...props}
          ></textarea>
          {errorMessage ? (
            <span className="small ms-1 text-danger">{errorMessage}</span>
          ) : (
            ""
          )}
        </>
      )}
    </>
  );
};

export default Editor;
