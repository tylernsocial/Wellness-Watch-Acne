import { useEffect, useState } from "react";
import "./AcneTracker.css";

function AcneTracker() {
  /* creates today's date using the user's local timezone instead of UTC */
  const today = formatDate(new Date());

  /* keeps track of which calendar day is selected */
  const [selectedDate, setSelectedDate] = useState(today);

  /* stores all tracker logs from localStorage */
  const [trackerLogs, setTrackerLogs] = useState({});

  /* controls which small add form is currently open */
  const [activeAddForm, setActiveAddForm] = useState(null);

  /* stores the text being typed into the small add form */
  const [newEntryText, setNewEntryText] = useState("");

  /* stores the current form values for the selected day */
  const [formData, setFormData] = useState({
    food: [],
    workoutShower: [],
    sleep: [],
    skincare: [],
    severity: "",
    notes: [],
    skinImage: "",
  });

  /* stores the save message for successfully saving the log */
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  /* formats dates as YYYY-MM-DD without changing the timezone */
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  /* loads saved tracker logs from localStorage when the component first opens */
  useEffect(() => {
    const savedLogs = localStorage.getItem("acneTrackerLogs");

    if (savedLogs) {
      setTrackerLogs(JSON.parse(savedLogs));
    }
  }, []);

  /* whenever the selected date changes, load that day's saved log if it exists */
  useEffect(() => {
    if (trackerLogs[selectedDate]) {
      setFormData(trackerLogs[selectedDate]);
    } else {
      setFormData({
        food: [],
        workoutShower: [],
        sleep: [],
        skincare: [],
        severity: "",
        notes: [],
        skinImage: "",
      });
    }

    setActiveAddForm(null);
    setNewEntryText("");
  }, [selectedDate, trackerLogs]);

  /* opens the small card/form for adding a new bubble */
  function openAddForm(category) {
    setActiveAddForm(category);
    setNewEntryText("");
  }

  /* adds a new bubble entry to the selected category */
  function addBubbleEntry() {
    if (!newEntryText.trim() || !activeAddForm) {
      return;
    }

    setFormData((previousData) => ({
      ...previousData,
      [activeAddForm]: [...previousData[activeAddForm], newEntryText.trim()],
    }));

    setNewEntryText("");
    setActiveAddForm(null);
  }

  /* removes one bubble from a category */
  function removeBubbleEntry(category, indexToRemove) {
    setFormData((previousData) => ({
      ...previousData,
      [category]: previousData[category].filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  }

  /* updates acne severity dropdown */
  function handleSeverityChange(event) {
    setFormData((previousData) => ({
      ...previousData,
      severity: event.target.value,
    }));
  }

  /* handles the skin image upload and stores a preview version */
  function handleImageUpload(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((previousData) => ({
        ...previousData,
        skinImage: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  }

  /* saves the selected day's tracker log into localStorage */
  function handleSaveLog() {
    const updatedLogs = {
      ...trackerLogs,
      [selectedDate]: formData,
    };

    setTrackerLogs(updatedLogs);
    localStorage.setItem("acneTrackerLogs", JSON.stringify(updatedLogs));

    setShowSaveMessage(true);

    setTimeout(() => {
      setShowSaveMessage(false);
    }, 2000);
  }

  /* clears only the selected day's form */
  function handleClearLog() {
    const updatedLogs = { ...trackerLogs };

    delete updatedLogs[selectedDate];

    setTrackerLogs(updatedLogs);
    localStorage.setItem("acneTrackerLogs", JSON.stringify(updatedLogs));

    setFormData({
      food: [],
      workoutShower: [],
      sleep: [],
      skincare: [],
      severity: "",
      notes: [],
      skinImage: "",
    });
  }

  /* creates a simple 7-day calendar starting from today */
  function getWeekDates() {
    const dates = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      dates.push({
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        dayNumber: date.getDate(),
        dateValue: formatDate(date),
      });
    }

    return dates;
  }

  /* reusable section for each tracker category */
  function TrackerBubbleSection({ title, category, placeholder }) {
    return (
      <div className="bubble-section">
        <div className="bubble-section-header">
          <span>{title}</span>

          <button
            type="button"
            className="add-bubble-btn"
            onClick={() => openAddForm(category)}
            aria-label={`Add ${title}`}
            >
            Add
            </button>
        </div>

        <div className="bubble-list">
          {/* shows example text when there are no bubbles in this category yet */}
          {formData[category].length === 0 && (
            <p className="empty-bubble-text">{placeholder}</p>
          )}

          {formData[category].map((entry, index) => (
            <button
              key={index}
              type="button"
              className="tracker-bubble"
              onClick={() => removeBubbleEntry(category, index)}
              title="Click to remove"
            >
              {entry}
            </button>
          ))}
        </div>

        {activeAddForm === category && (
          <div className="add-entry-card">
            <input
              type="text"
              value={newEntryText}
              onChange={(event) => setNewEntryText(event.target.value)}
              placeholder={placeholder}
              autoFocus
            />

            <div className="add-entry-buttons">
              <button type="button" onClick={addBubbleEntry}>
                Add
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveAddForm(null);
                  setNewEntryText("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="tracker-panel">
      <div className="tracker-content">
        <p className="eyebrow">Skin Journal</p>
        <h2>Acne Tracker</h2>

        <p className="tracker-description">
          Track daily habits, skin images, and lifestyle changes to help identify
          possible breakout patterns over time.
        </p>

        <div className="tracker-calendar">
          <div className="calendar-top">
            <h3>Weekly Calendar</h3>
            <span>{selectedDate}</span>
          </div>

          <div className="calendar-grid">
            {getWeekDates().map((day) => (
              <button
                key={day.dateValue}
                type="button"
                className={`calendar-day ${
                  selectedDate === day.dateValue ? "active-day" : ""
                } ${trackerLogs[day.dateValue] ? "logged-day" : ""}`}
                onClick={() => setSelectedDate(day.dateValue)}
              >
                <span>{day.label}</span>
                <strong>{day.dayNumber}</strong>

                {trackerLogs[day.dateValue] && (
                  <small className="log-dot">●</small>
                )}
              </button>
            ))}
          </div>
        </div>

        {showSaveMessage && (
          <div className="save-toast">
            Log saved!
          </div>
        )}

        <div className="daily-log">
          <h3>Log for {selectedDate}</h3>

          <TrackerBubbleSection
            title="Food Intake"
            category="food"
            placeholder="Example: eggs, pasta, protein shake..."
          />

          <TrackerBubbleSection
            title="Workout / Shower"
            category="workoutShower"
            placeholder="Example: workout 6 PM, shower 6:30 PM..."
          />

          <TrackerBubbleSection
            title="Sleep"
            category="sleep"
            placeholder="Example: 7 hours, slept late..."
          />

          <TrackerBubbleSection
            title="Skincare"
            category="skincare"
            placeholder="Example: cleanser, moisturizer, benzoyl peroxide..."
          />

          <TrackerBubbleSection
            title="Notes"
            category="notes"
            placeholder="Example: stressed, drank lots of water, menstrual cycle..."
          />

          <div className="log-item">
            <span>Acne Severity</span>

            <select
              name="severity"
              value={formData.severity}
              onChange={handleSeverityChange}
            >
              <option value="">Select severity</option>
              <option value="Clear / No breakout">Clear / No breakout</option>
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
            </select>
          </div>

          <div className="log-item">
            <span>Skin Image</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} />

            {formData.skinImage && (
              <img
                src={formData.skinImage}
                alt="Skin log preview"
                className="tracker-image-preview"
              />
            )}
          </div>

          <div className="tracker-buttons">
            <button className="save-log-btn" onClick={handleSaveLog}>
              Save Log
            </button>

            <button className="clear-log-btn" onClick={handleClearLog}>
              Clear Day
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AcneTracker;