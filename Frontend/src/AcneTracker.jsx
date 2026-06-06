import { useState } from "react";
import "./AcneTracker.css";

/* creates a blank daily log whenever there is no saved data for a date */
function createEmptyLog() {
  return {
    food: [],
    workoutShower: [],
    sleep: [],
    skincare: [],
    severity: "",
    notes: [],
    skinImage: "",
  };
}

/* loads saved tracker logs from localStorage when the component first opens */
function readSavedTrackerLogs() {
  const savedLogs = localStorage.getItem("acneTrackerLogs");

  if (!savedLogs) {
    return {};
  }

  return JSON.parse(savedLogs);
}

/* reusable section for each tracker category */
function TrackerBubbleSection({
  title,
  category,
  placeholder,
  formData,
  activeAddForm,
  newEntryText,
  setNewEntryText,
  openAddForm,
  closeAddForm,
  addBubbleEntry,
  removeBubbleEntry,
}) {
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

            <button type="button" onClick={closeAddForm}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* formats dates as YYYY-MM-DD without changing the timezone */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* formats saved YYYY-MM-DD dates into readable labels like June 1st */
function formatDisplayDate(dateValue) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const daySuffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";

  const monthName = date.toLocaleDateString("en-US", {
    month: "long",
  });

  return `${monthName} ${day}${daySuffix}`;
}

function AcneTracker() {
  /* creates today's date using the user's local timezone instead of UTC */
  const today = formatDate(new Date());
  const savedLogs = readSavedTrackerLogs();

  /* keeps track of which calendar day is selected */
  const [selectedDate, setSelectedDate] = useState(today);

  /* stores which month the calendar is currently showing */
  const [currentMonth, setCurrentMonth] = useState(new Date());

  /* stores all tracker logs from localStorage */
  const [trackerLogs, setTrackerLogs] = useState(savedLogs);

  /* controls which small add form is currently open */
  const [activeAddForm, setActiveAddForm] = useState(null);

  /* stores the text being typed into the small add form */
  const [newEntryText, setNewEntryText] = useState("");

  /* stores the current form values for the selected day */
  const [formData, setFormData] = useState(savedLogs[today] || createEmptyLog());

  /* stores the save message for successfully saving the log */
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  /* opens the small card/form for adding a new bubble */
  function openAddForm(category) {
    setActiveAddForm(category);
    setNewEntryText("");
  }

  /* closes the small add form without saving the typed text */
  function closeAddForm() {
    setActiveAddForm(null);
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
    setFormData(createEmptyLog());
  }

  /* gets the month title shown at the top of the calendar */
  function getMonthTitle() {
    return currentMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }

  /* moves the calendar to the previous month */
  function goToPreviousMonth() {
    setCurrentMonth((previousMonth) => {
      const newMonth = new Date(previousMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  }

  /* moves the calendar to the next month */
  function goToNextMonth() {
    setCurrentMonth((previousMonth) => {
      const newMonth = new Date(previousMonth);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  }

  /* selects a calendar date and loads the log for that day */
  function selectCalendarDate(dateValue) {
    setSelectedDate(dateValue);
    setFormData(trackerLogs[dateValue] || createEmptyLog());
    setActiveAddForm(null);
    setNewEntryText("");
  }

  /* creates all the calendar boxes for the selected month */
  function getMonthDates() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    /* first day of the current month */
    const firstDayOfMonth = new Date(year, month, 1);

    /* last day of the current month */
    const lastDayOfMonth = new Date(year, month + 1, 0);

    /* gets which weekday the month starts on, where Sunday is 0 */
    const startingWeekday = firstDayOfMonth.getDay();

    /* gets how many days are in the current month */
    const daysInMonth = lastDayOfMonth.getDate();

    const calendarDays = [];

    /* adds empty boxes before the first day so the calendar lines up correctly */
    for (let i = 0; i < startingWeekday; i++) {
      calendarDays.push(null);
    }

    /* adds the actual days of the month */
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);

      calendarDays.push({
        dayNumber: day,
        dateValue: formatDate(date),
      });
    }

    return calendarDays;
  }

  const bubbleSectionProps = {
    formData,
    activeAddForm,
    newEntryText,
    setNewEntryText,
    openAddForm,
    closeAddForm,
    addBubbleEntry,
    removeBubbleEntry,
  };

  return (
    <section className="tracker-panel">
      <div className="tracker-content">
        {/* left tracker column: title, description, and monthly calendar */}
        <div className="tracker-overview">
          <p className="eyebrow">Skin Journal</p>
          <h2>Acne Tracker</h2>

          <p className="tracker-description">
            Track daily habits, skin images, and lifestyle changes to help identify
            possible breakout patterns over time.
          </p>

          <div className="tracker-calendar">
            <div className="calendar-top">
              <button
                type="button"
                className="month-arrow"
                onClick={goToPreviousMonth}
                aria-label="Go to previous month"
              >
                &lt;
              </button>

              <div className="calendar-title">
                <h3>{getMonthTitle()}</h3>
                <span>Selected: {formatDisplayDate(selectedDate)}</span>
              </div>

              <button
                type="button"
                className="month-arrow"
                onClick={goToNextMonth}
                aria-label="Go to next month"
              >
                &gt;
              </button>
            </div>

            <div className="calendar-weekdays">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            <div className="calendar-grid month-grid">
              {getMonthDates().map((day, index) => {
                if (!day) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="empty-calendar-day"
                    />
                  );
                }

                return (
                  <button
                    key={day.dateValue}
                    type="button"
                    className={`calendar-day ${
                      selectedDate === day.dateValue ? "active-day" : ""
                    } ${trackerLogs[day.dateValue] ? "logged-day" : ""}`}
                    onClick={() => selectCalendarDate(day.dateValue)}
                  >
                    <strong>{day.dayNumber}</strong>

                    {trackerLogs[day.dateValue] && (
                      <small className="log-dot" aria-label="Saved log" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {showSaveMessage && (
          <div className="save-toast">
            Log saved!
          </div>
        )}

        {/* middle tracker column: bubble-based daily log */}
        <div className="daily-log">
          <h3>Log for {formatDisplayDate(selectedDate)}</h3>

          <TrackerBubbleSection
            title="Food Intake"
            category="food"
            placeholder="Example: eggs, pasta, protein shake..."
            {...bubbleSectionProps}
          />

          <TrackerBubbleSection
            title="Workout / Shower"
            category="workoutShower"
            placeholder="Example: workout 6 PM, shower 6:30 PM..."
            {...bubbleSectionProps}
          />

          <TrackerBubbleSection
            title="Sleep"
            category="sleep"
            placeholder="Example: 7 hours, slept late..."
            {...bubbleSectionProps}
          />

          <TrackerBubbleSection
            title="Skincare"
            category="skincare"
            placeholder="Example: cleanser, moisturizer, benzoyl peroxide..."
            {...bubbleSectionProps}
          />

          <TrackerBubbleSection
            title="Notes"
            category="notes"
            placeholder="Example: stressed, drank lots of water, menstrual cycle..."
            {...bubbleSectionProps}
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
        </div>

        {/* right tracker column: skin image and save controls */}
        <div className={`skin-log-card ${formData.skinImage ? "has-skin-image" : ""}`}>
          <div className="log-item skin-image-control">
            <span>Skin Image</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>

          {formData.skinImage ? (
            <img
              src={formData.skinImage}
              alt="Skin log preview"
              className="tracker-image-preview"
            />
          ) : (
            <div className="skin-image-placeholder">
              <p>No skin image added</p>
            </div>
          )}

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
