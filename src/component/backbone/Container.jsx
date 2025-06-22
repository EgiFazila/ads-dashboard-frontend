import ContentBody from "./ContentBody";
import ContentTitle from "./ContentTitle";

export default function Container({ children }) {
  return (
    <div className="w-100 p-3"
      style={{
        minHeight: "calc(100vh - 80px)",
        overflowX: "hidden",
        overflowY: "hidden",
        boxSizing: "border-box",
      }}>
      <ContentTitle />
      <ContentBody>{children}</ContentBody>
    </div>
  );
}
