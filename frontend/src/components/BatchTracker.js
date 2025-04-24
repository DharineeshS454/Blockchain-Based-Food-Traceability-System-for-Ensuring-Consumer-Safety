import React, { useState } from "react";
import { getContract } from "../utils/getcontract";

const BatchTracker = () => {
  const [batchId, setBatchId] = useState("");
  const [details, setDetails] = useState(null);
  const [events, setEvents] = useState([]);

  const fetchData = async () => {
    const contract = await getContract();

    try {
      // Fetch batch details
      const [name, owner, loc, expiry] =
        await contract.getBatchDetails(batchId);

      // Convert the values like expiry to string to avoid BigInt issues
      const expiryDate = expiry.toString();

      // Fetch batch events
      const evs = await contract.getEvents(batchId);

      // Handle setting details
      setDetails({
        name,
        owner,
        location: loc,
        expiry: new Date(expiryDate * 1000).toLocaleString(), // Convert expiry to Date forma
      });

      // Handle setting events and ensure each field is properly converted to strings
      const formattedEvents = evs.map((e) => ({
        eventType: e.eventType.toString(), // Convert eventType to string
        location: e.location,
        timestamp: new Date(e.timestamp.toString() * 1000).toLocaleString(), // Convert timestamp to Date
        additionalData: e.additionalData,
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching batch data:", error);
    }
  };

  return (
    <div style={{ margin: "1rem 0" }}>
      <h3>🔍 Track Batch</h3>
      <input
        placeholder="Batch ID"
        onChange={(e) => setBatchId(e.target.value)}
      />
      <button onClick={fetchData} style={{ marginLeft: "0.5rem" }}>
        Get Info
      </button>

      {details && (
        <div style={{ marginTop: "1rem" }}>
          <p><strong>Name:</strong> {details.name}</p>
          <p><strong>Owner:</strong> {details.owner}</p>
          <p><strong>Location:</strong> {details.location}</p>
          <p><strong>Expiry:</strong> {details.expiry}</p>
        </div>
      )}

      {events.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <h4>📑 Events</h4>
          <ul>
            {events.map((e, i) => (
              <li key={i}>
                <strong>Type:</strong> {e.eventType} |{" "}
                <strong>Loc:</strong> {e.location} |{" "}
                <strong>Time:</strong> {e.timestamp} |{" "}
                <strong>Data:</strong> {e.additionalData}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BatchTracker;
