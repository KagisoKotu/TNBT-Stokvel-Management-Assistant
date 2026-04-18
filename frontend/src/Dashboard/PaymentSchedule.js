import './PaymentSchedule.css';

function PaymentSchedule() {
  return (
    <article className="schedule-card">
      <header className="schedule-header">
        <h2>Payment Schedule</h2>
      </header>
      
      <section className="schedule-content">
        <ul className="schedule-details">
          <li>
            <strong>Contribution Due Date:</strong> 29th of each month
          </li>
          <li>
            <strong>Contribution Amount:</strong> R1,500
          </li>
          <li>
            <strong>Grace Period:</strong> 3 days after due date
          </li>
        </ul>
        
        <button className="btn-update">Update Schedule</button>
      </section>
    </article>
  );
}

export default PaymentSchedule;