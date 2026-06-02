import './AcneTracker.css';





function AcneTracker() {
  return (
    <section className="tracker-panel">
      <div className="tracker-content">
        <p className="eyebrow">Skin Journal</p>
        <h2>Acne Tracker</h2>

        <p className="tracker-description">
          Track daily habits and skin changes to help identify possible breakout
          patterns over time.
        </p>

        <div className="tracker-calendar">
          <div className="calendar-top">
            <h3>Weekly Calendar</h3>
            <span>June 2026</span>
          </div>

          <div className="calendar-grid">
            <div className="calendar-day">
              <span>Mon</span>
              <strong>1</strong>
            </div>

            <div className="calendar-day active-day">
              <span>Tue</span>
              <strong>2</strong>
            </div>

            <div className="calendar-day">
              <span>Wed</span>
              <strong>3</strong>
            </div>

            <div className="calendar-day">
              <span>Thu</span>
              <strong>4</strong>
            </div>

            <div className="calendar-day">
              <span>Fri</span>
              <strong>5</strong>
            </div>

            <div className="calendar-day">
              <span>Sat</span>
              <strong>6</strong>
            </div>

            <div className="calendar-day">
              <span>Sun</span>
              <strong>7</strong>
            </div>
          </div>
        </div>

        <div className="daily-log">
          <h3>Today&apos;s Log</h3>

          <div className="log-item">
            <span>Food Intake</span>
            <input type="text" placeholder="Example: dairy, fast food, protein shake..." />
          </div>

          <div className="log-item">
            <span>Workout / Shower</span>
            <input type="text" placeholder="Example: workout 6 PM, shower 6:30 PM" />
          </div>

          <div className="log-item">
            <span>Sleep</span>
            <input type="text" placeholder="Example: 7 hours, good quality" />
          </div>

          <div className="log-item">
            <span>Skincare</span>
            <input type="text" placeholder="Example: cleanser, moisturizer, treatment..." />
          </div>

          <div className="log-item">
            <span>Skin Image</span>
            <input type="file" accept="image/*" />
          </div>

          <div className="log-item">
            <span>Notes</span>
            <textarea placeholder="Any stress, water intake, breakout triggers, or skin changes..." />
          </div>

          <button className="save-log-btn">Save Log</button>
        </div>
      </div>
    </section>
  );
}

export default AcneTracker;