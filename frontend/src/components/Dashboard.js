import React, { useState, useEffect } from "react";
import { getContract } from "../utils/getcontract";
import BatchCreator from "./BatchCreator";
import BatchTracker from "./BatchTracker";
import RoleManager from "./RoleManager";
import TrustedAgencyManager from "./TrustedAgencyManager";
import EventLogger from "./EventLogger";

const UserDashboard = () => {
  const [userAddress, setUserAddress] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [isTrusted, setIsTrusted] = useState(false);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const contract = await getContract();
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const userAccount = accounts[0];
        setUserAddress(userAccount);

        // Get user role
        const role = await contract.getRole(userAccount);
        setUserRole(role.toString());

        // Check if user is trusted
        const trustedStatus = await contract.isTrusted(userAccount);
        setIsTrusted(trustedStatus);

        // Get user batches
        const userBatches = await contract.getUserBatches(userAccount);
        setBatches(userBatches);

        setLoading(false);
      } catch (error) {
        console.error("Error loading data", error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ margin: "1rem 0" }}>
      <h3>👤 User Dashboard</h3>
      <p><strong>Address:</strong> {userAddress}</p>
      <p><strong>Role:</strong> {userRole}</p>
      <p><strong>Is Trusted:</strong> {isTrusted ? "Yes" : "No"}</p>
      {/* Admin (Role 0) */}
      {userRole === "0" && (
        <div>
          <h4>🛡️ Admin Dashboard</h4>
          <p>Manage users, verify accounts, assign roles, and oversee the system.</p>
            <RoleManager />
            <TrustedAgencyManager />
        </div>
      )}

      {/* Farmer (Role 1) */}
      {userRole === "1" && (
        <div>
          <h4>🧑‍🌾 Your Batches</h4>
          {batches.length > 0 ? (
            <ul>
              {batches.map((batchId, index) => (
                <li key={index}>Batch ID: {batchId}</li>
              ))}
            </ul>
          ) : (
            <p>No batches found for you.</p>
          )}
            <BatchCreator />
            <BatchTracker />
            <EventLogger />
        </div>
      )}

      {/* Trusted Users Section */}
      {isTrusted && (
        <div>
          <h4>🌟 Trusted User Benefits</h4>
          <p>You have access to additional features as a trusted user!</p>
        </div>
      )}

      {/* Manufacturer (Role 2) */}
      {userRole === "2" && (
        <div>
          <h4>🚚 Manufacturer Dashboard</h4>
          <p>Manage your batches and events here.</p>
          <EventLogger />
          <BatchTracker />
          
        </div>
      )}

      {/* Transporter (Role 3) */}
      {userRole === "3" && (
        <div>
          <h4>🚚 Transporter Dashboard</h4>
          <p>Manage your batches and events here.</p>
          <EventLogger />
          <BatchTracker />
          
        </div>
      )}

      {/* Warehouse (Role 4) */}
      {userRole === "4" && (
        <div>
          <h4>🏠 Warehouse Dashboard</h4>
          <p>Manage stored batches and events here.</p>
          <EventLogger />
          <BatchTracker />
        </div>
      )}

      {/* Retailer (Role 5) */}
      {userRole === "5" && (
        <div>
          <h4>🛒 Retailer Dashboard</h4>
          <p>Manage your batches for sale here.</p>
          <EventLogger />
          <BatchTracker />
        </div>
      )}

      {/* Consumer (Role 6) */}
      {userRole === "6" && (
        <div>
          <h4>🛍️ Consumer Dashboard</h4>
          <p>Track and manage the batches you purchase.</p>
          <BatchTracker />
        </div>
      )}

    </div>
  );
};

export default UserDashboard;
