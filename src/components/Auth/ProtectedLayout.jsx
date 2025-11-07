import GeneratorHeader from "../GeneratorHeader";
import { Outlet } from "react-router-dom";

export default function ProtectedLayout() {
  return (
    <>
      <GeneratorHeader />
      <main className="protected-content">
        <Outlet />{" "}
      </main>
    </>
  );
}
