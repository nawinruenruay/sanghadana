import { LoadingOverlay } from "@mantine/core";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Logout() {
  const nav = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      localStorage.clear();
      nav("/login");
    }, 2000);
  }, []);
  return (
    <>
      <div>
        <LoadingOverlay loaderProps={{ type: "dots" }} visible={true} />
      </div>
    </>
  );
}
