import React from "react";
import Navbar from "./components/Navbar";
// import RoleManager from "./components/RoleManager";
// import TrustedAgencyManager from "./components/TrustedAgencyManager";
// import BatchCreator from "./components/BatchCreator";
// import BatchTracker from "./components/BatchTracker";
// import EventLogger from "./components/EventLogger";
import UserDashboard from "./components/Dashboard";

function App() {
  return (
    <div style={{ padding: "1rem" }}>
      <Navbar />
      {/* <RoleManager />
      <TrustedAgencyManager />
      <BatchCreator />
      <BatchTracker />
      <EventLogger /> */}
      <UserDashboard />
    </div>
  );
}

export default App;
