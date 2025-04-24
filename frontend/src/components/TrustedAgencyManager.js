import React, { useState } from "react";
import { getContract } from "../utils/getcontract";

const TrustedAgencyManager = () => {
  const [address, setAddress] = useState("");

  const addAgency = async () => {
    const contract = await getContract();
    const tx = await contract.addTrustedAgency(address);
    await tx.wait();
    alert("✅ Agency Added");
  };

  const removeAgency = async () => {
    const contract = await getContract();
    const tx = await contract.removeTrustedAgency(address);
    await tx.wait();
    alert("✅ Agency Removed");
  };

  return (
    <div style={{ margin: "1rem 0" }}>
      <h3>🏛 Manage Trusted Agencies</h3>
      <input
        style={{ marginRight: "0.5rem" }}
        placeholder="0xAgencyAddress"
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={addAgency}>Add</button>
      <button style={{ marginLeft: "0.5rem" }} onClick={removeAgency}>
        Remove
      </button>
    </div>
  );
};

export default TrustedAgencyManager;
