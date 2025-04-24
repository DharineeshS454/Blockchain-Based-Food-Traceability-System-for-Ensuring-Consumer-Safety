import React, { useState } from "react";
import { getContract } from "../utils/getcontract";

const RoleManager = () => {
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("1"); // default Farmer

  const assignRole = async () => {
    const contract = await getContract();
    const tx = await contract.assignRole(address, role);
    await tx.wait();
    alert("✅ Role assigned");
  };

  return (
    <div style={{ margin: "1rem 0" }}>
      <h3>👥 Assign Role</h3>
      <input
        style={{ marginRight: "0.5rem" }}
        placeholder="0xUserAddress"
        onChange={(e) => setAddress(e.target.value)}
      />
      <select onChange={(e) => setRole(e.target.value)} value={role}>
        <option value="0">Admin</option>
        <option value="1">Farmer</option>
        <option value="2">Manufaturer</option>
        <option value="3">Transporter</option>
        <option value="4">Warehouse</option>
        <option value="5">Retailer</option>
        <option value="6">Consumer</option>
      </select>
      <button style={{ marginLeft: "0.5rem" }} onClick={assignRole}>
        Assign
      </button>
    </div>
  );
};

export default RoleManager;
