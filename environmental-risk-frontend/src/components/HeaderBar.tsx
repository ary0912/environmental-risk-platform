import { useEffect, useState } from "react";
import { getSystemHealth } from "../services/api";

function HeaderBar() {
  const [status, setStatus] = useState("Checking...");

  useEffect(() => {
    getSystemHealth()
      .then(() => setStatus("Operational"))
      .catch(() => setStatus("Offline"));
  }, []);

  return (
    <div className="header">
      <h1>Environmental Risk Intelligence Platform</h1>
      <div className="status">
        System Status: {status}
      </div>
    </div>
  );
}

export default HeaderBar;