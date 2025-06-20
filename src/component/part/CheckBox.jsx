export default function CheckBox({
  disabled = false,
  checked = false,
  onChange,
}) {
  return (
    <>
      <input
        type="checkbox"
        className="form-check-input"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
    </>
  );
}
