import React, { useState } from "react";
import { getContract } from "../utils/getcontract";

const EventLogger = () => {
  const [batchId, setBatchId] = useState("");
  const [eventType, setEventType] = useState("0"); // Harvested
  const [location, setLocation] = useState("");
  const [data, setData] = useState("");

  const addEvent = async () => {
    const contract = await getContract();
    const tx = await contract.addBatchEvent(batchId, eventType, location, data);
    await tx.wait();
    alert("✅ Event Added");
  };

  return (
    <div style={{ margin: "1rem 0" }}>
      <h3>📝 Add Batch Event</h3>
      <input
        placeholder="Batch ID"
        onChange={(e) => setBatchId(e.target.value)}
      /><br/>
      <select onChange={(e) => setEventType(e.target.value)} value={eventType}>
        <option value="0">Harvested</option>
        <option value="1">Processed</option>
        <option value="2">Packed</option>
        <option value="3">Transported</option>
        <option value="4">Stored</option>
        <option value="5">Sold</option>
      </select><br/>
      <input
        placeholder="Location"
        onChange={(e) => setLocation(e.target.value)}
      /><br/>
      <input
        placeholder="Additional Data"
        onChange={(e) => setData(e.target.value)}
      /><br/>
      <button onClick={addEvent}>Log Event</button>
    </div>
  );
};

export default EventLogger;
