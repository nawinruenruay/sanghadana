import { LoadingOverlay } from "@mantine/core";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
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
        <LoadingOverlay
          loaderProps={{ color: "#7ea236", type: "bars" }}
          visible={true}
        />
      </div>
    </>
  );
}

export default Logout;
