import axios from "axios";
import { useEffect, useState } from "react";

function HeaderBar() {
  const [status, setStatus] = useState("Checking...");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/system-health")
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