import React, { useState } from "react";
import { getContract } from "../utils/getcontract";

const BatchCreator = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [expiry, setExpiry] = useState(""); // timestamp in seconds
  

  const createBatch = async () => {
    const contract = await getContract();
    const expiryTimestamp = Math.floor(new Date(expiry).getTime() / 1000);
    const tx = await contract.createBatch(name, location, expiryTimestamp);
    await tx.wait();
    alert("✅ Batch Created");
  };

  return (
    <div style={{ margin: "1rem 0" }}>
      <h3>📦 Create Batch</h3>
      <input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      /><br/>
      <input
        placeholder="Location"
        onChange={(e) => setLocation(e.target.value)}
      /><br/>
      <input
        type="date"
        onChange={(e) => setExpiry(e.target.value)}
      /><br/>
      
      <button onClick={createBatch}>Create</button>
    </div>
  );
};

export default BatchCreator;
