import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import './Creategroup.css'; 

const CreateGroup = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    groupName: '',
    contributionAmount: '',
    frequency: 'Monthly',
    dueDate: '1',
    totalMembers: '',
    payoutMethod: 'EFT',
    duration: '',
    // Treasurer fields removed from here
  });

  const [members, setMembers] = useState([
    { id: Date.now(), firstName: '', surname: '', email: '' }
  ]);

  const daysArray = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMemberChange = (id, e) => {
    const newMembers = members.map(m => {
      if (m.id === id) return { ...m, [e.target.name]: e.target.value };
      return m;
    });
    setMembers(newMembers);
  };

  const addMemberRow = () => {
    setMembers([...members, { id: Date.now(), firstName: '', surname: '', email: '' }]);
  };

  const removeMemberRow = (id) => {
    if (members.length > 1) setMembers(members.filter(m => m.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const existingGroups = JSON.parse(localStorage.getItem('stockvelGroups')) || [];
    const newGroup = { ...formData, groupMembers: members, id: Date.now() };
    localStorage.setItem('stockvelGroups', JSON.stringify([...existingGroups, newGroup]));
    navigate('/');
  };

  return (
    <section className="form-bg">
      <header className="create-header-nav">
        <button onClick={() => navigate(-1)} className="back-btn" aria-label="Go back">
          <ArrowLeft size={24} />
        </button>
        <h1>Create Group</h1>
        <span className="header-spacer"></span> 
      </header>

      <main className="form-container">
        <form onSubmit={handleSubmit} className="semantic-form">
          
          {/* Section 1: Basic Information */}
          <fieldset className="form-section">
            <legend>Basic Information</legend>
            <p className="input-group">
              <label htmlFor="groupName">Group Name</label>
              <input id="groupName" name="groupName" type="text" placeholder="e.g., Monthly Savings Circle" required onChange={handleChange} />
            </p>
            <section className="form-row">
              <p className="input-group">
                <label htmlFor="contributionAmount">Contribution Amount</label>
                <input id="contributionAmount" name="contributionAmount" type="number" placeholder="0.00" required onChange={handleChange} />
              </p>
              <p className="input-group">
                <label htmlFor="frequency">Payment Frequency</label>
                <select id="frequency" name="frequency" onChange={handleChange}>
                  <option value="Weekly">Weekly</option>
                  <option value="Fortnightly">Fortnightly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </p>
            </section>
          </fieldset>

          {/* Section 2: Logistics & Payout */}
          <fieldset className="form-section">
            <legend>Logistics & Payout</legend>
            <section className="form-row">
              <p className="input-group">
                <label htmlFor="totalMembers">Number of Members</label>
                <input id="totalMembers" name="totalMembers" type="number" placeholder="Min 2" onChange={handleChange} />
              </p>
              <p className="input-group">
                <label htmlFor="duration">Duration (Months)</label>
                <input id="duration" name="duration" type="number" placeholder="e.g., 12" onChange={handleChange} />
              </p>
            </section>
            <section className="form-row">
              <p className="input-group">
                <label htmlFor="payoutMethod">Payout Method</label>
                <select id="payoutMethod" name="payoutMethod" onChange={handleChange}>
                  <option value="EFT">Electronic Funds Transfer (EFT)</option>
                  <option value="Cash">Cash Distribution</option>
                </select>
              </p>
              <p className="input-group">
                <label htmlFor="dueDate">Monthly Due Date</label>
                <select id="dueDate" name="dueDate" onChange={handleChange}>
                  {daysArray.map(day => <option key={day} value={day}>{day}</option>)}
                </select>
              </p>
            </section>
          </fieldset>

          {/* Add Treasurer Section has been removed */}

          {/* Section 3: Add Members */}
          <fieldset className="form-section">
            <legend>Add Members</legend>
            {members.map((member, index) => (
              <section key={member.id} className="form-row triple-col member-entry">
                <p className="input-group">
                  <label>Member {index + 1}</label>
                  <input name="firstName" placeholder="Name" onChange={(e) => handleMemberChange(member.id, e)} />
                </p>
                <p className="input-group">
                  <label>Surname</label>
                  <input name="surname" placeholder="Surname" onChange={(e) => handleMemberChange(member.id, e)} />
                </p>
                <section className="input-group">
                  <label>Email</label>
                  <span className="input-with-action">
                    <input name="email" type="email" placeholder="Email" onChange={(e) => handleMemberChange(member.id, e)} />
                    {members.length > 1 && (
                      <button type="button" onClick={() => removeMemberRow(member.id)} className="remove-row-btn" aria-label="Remove member">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </span>
                </section>
              </section>
            ))}
            <button type="button" onClick={addMemberRow} className="add-row-btn">
              <Plus size={18} /> Add Another Member
            </button>
          </fieldset>

          <footer className="form-actions">
            <button type="submit" className="submit-full">Create Group</button>
          </footer>
        </form>
      </main>
    </section>
  );
};

export default CreateGroup;