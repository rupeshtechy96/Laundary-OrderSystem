import { useEffect, useState } from "react";
import API from "../services/api";

function Schedule() {
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await API.get("/schedule");
        setSchedule(res.data || []);
      } catch (err) {
        setError("Unable to load schedule right now.");
      }
    };

    fetchSchedule();
  }, []);

  const fallbackSchedule = [
    { day: "Monday", isOpen: true, openTime: "09:00 AM", closeTime: "08:00 PM" },
    { day: "Tuesday", isOpen: true, openTime: "09:00 AM", closeTime: "08:00 PM" },
    { day: "Wednesday", isOpen: true, openTime: "09:00 AM", closeTime: "08:00 PM" },
    { day: "Thursday", isOpen: true, openTime: "09:00 AM", closeTime: "08:00 PM" },
    { day: "Friday", isOpen: true, openTime: "09:00 AM", closeTime: "08:00 PM" },
    { day: "Saturday", isOpen: true, openTime: "10:00 AM", closeTime: "06:00 PM" },
    { day: "Sunday", isOpen: false, openTime: "", closeTime: "" },
  ];

  const displaySchedule = schedule.length > 0 ? schedule : fallbackSchedule;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <p className="section-tag">Operating Hours</p>
        <h1>Laundry Schedule</h1>
        <p>
          Check our open and close timings before placing your order. Holidays
          and closed days are clearly mentioned for convenience.
        </p>
      </div>

      {error && <p className="error-message page-error">{error}</p>}

      <div className="schedule-grid">
        {displaySchedule.map((item, index) => (
          <div className="schedule-card" key={item._id || index}>
            <h3>{item.day}</h3>
            <p className={item.isOpen ? "open-status" : "closed-status"}>
              {item.isOpen ? "Open" : "Closed"}
            </p>
            <p>
              {item.isOpen
                ? `${item.openTime} - ${item.closeTime}`
                : "Holiday / Not available"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Schedule;