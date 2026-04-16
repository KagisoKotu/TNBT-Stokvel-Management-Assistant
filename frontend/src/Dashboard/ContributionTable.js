import { FaCheck, FaFlag } from 'react-icons/fa';
import './ContributionTable.css';

function ContributionTable() {
  const members = [
    { name: "Belle Bryan", date: "03/26" },
    { name: "Alex Wilson", date: "02/26" },
    { name: "Alex Brown", date: "05/26" },
    { name: "Kevin Hart", date: "06/26" },
    { name: "Sarah Jenkins", date: "07/26" },
    { name: "Mike Ross", date: "08/26" }
  ];

  return (
    <article className="contribution-card">
      <header className="card-header">
        <h1>Contribution Management</h1>
      </header>
      
      <section className="table-wrapper">
        <h2 className="table-subtitle">Monthly Contributions</h2>
        <table className="contribution-table">
          <thead>
            <tr>
              <th>Member Name</th>
              <th>Amount Due</th>
              <th>Date Paid</th>
              <th>Payment Proof</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={index}>
                <td>{member.name}</td>
                <td>R1,500</td>
                <td>{member.date}</td>
                <td>
                  <a href="#" className="receipt-link">view receipt</a>
                </td>
                <td className="actions">
                  <button className="btn-confirm">
                    <FaCheck aria-hidden="true" /> Confirm
                  </button>
                  <button className="btn-flag">
                    <FaFlag aria-hidden="true" /> Flag
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </article>
  );
}

export default ContributionTable;