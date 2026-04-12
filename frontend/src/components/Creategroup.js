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
  });

  const [members, setMembers] = useState([
    { id: Date.now(), firstName: '', surname: '', email: '' }
  ]);

  const [errors, setErrors] = useState({});

  const daysArray = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleMemberChange = (id, e, index) => {
    const { name, value } = e.target;
    const newMembers = members.map(m => {
      if (m.id === id) return { ...m, [name]: value };
      return m;
    });
    setMembers(newMembers);

    if (errors.members && errors.members[index] && errors.members[index][name]) {
      const newMemberErrors = [...errors.members];
      newMemberErrors[index][name] = null;
      setErrors({ ...errors, members: newMemberErrors });
    }
  };

  const addMemberRow = () => {
    setMembers([...members, { id: Date.now(), firstName: '', surname: '', email: '' }]);
  };

  const removeMemberRow = (id) => {
    if (members.length > 1) setMembers(members.filter(m => m.id !== id));
  };

  const validateForm = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.groupName.trim()) tempErrors.groupName = "Group name is required";
    if (!formData.contributionAmount || formData.contributionAmount <= 0) {
      tempErrors.contributionAmount = "Amount must be greater than 0";
    }
    if (!formData.totalMembers || formData.totalMembers < 2) {
      tempErrors.totalMembers = "At least 2 members required";
    }
    if (!formData.duration || formData.duration <= 0) {
      tempErrors.duration = "Duration must be 1 month or more";
    }
    
    const memberErrors = members.map((member) => {
      let mError = {};
      if (!member.firstName.trim()) mError.firstName = "Required";
      if (!member.surname.trim()) mError.surname = "Required";
      if (!member.email.trim()) {
        mError.email = "Required";
      } else if (!emailRegex.test(member.email)) {
        mError.email = "Invalid email";
      }
      return mError;
    });

    const hasMemberErrors = memberErrors.some(obj => Object.keys(obj).length > 0);
    if (hasMemberErrors) tempErrors.members = memberErrors;

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const existingGroups = JSON.parse(localStorage.getItem('stockvelGroups')) || [];
      const newGroup = { ...formData, groupMembers: members, id: Date.now() };
      localStorage.setItem('stockvelGroups', JSON.stringify([...existingGroups, newGroup]));
      alert("Group created! Invitations sent.");
      navigate('/');
    }
  };

  return (
    <section className="form-bg">
      <header className="create-header-nav">
        <button onClick={() => navigate(-1)} className="back-btn" aria-label="Go back">
          <ArrowLeft size={24} />
        </button>
        <h1>Create Group</h1>
        <i className="header-spacer" aria-hidden="true"></i> 
      </header>

      <main className="form-container">
        <form onSubmit={handleSubmit} className="semantic-form" noValidate>
          
          <fieldset className="form-section">
            <legend>Basic Information</legend>
            <p className="input-group">
              <label htmlFor="groupName">Group Name</label>
              <input 
                id="groupName" 
                name="groupName" 
                type="text" 
                placeholder="e.g., Monthly Savings Circle" 
                className={errors.groupName ? 'input-error' : ''}
                onChange={handleChange} 
              />
              {errors.groupName && <small className="error-text">{errors.groupName}</small>}
            </p>
            <section className="form-row">
              <p className="input-group">
                <label htmlFor="contributionAmount">Contribution Amount (R)</label>
                <input 
                  id="contributionAmount" 
                  name="contributionAmount" 
                  type="number" 
                  placeholder="0.00" 
                  className={errors.contributionAmount ? 'input-error' : ''}
                  onChange={handleChange} 
                />
                {errors.contributionAmount && <small className="error-text">{errors.contributionAmount}</small>}
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

          <fieldset className="form-section">
            <legend>Logistics & Payout</legend>
            <section className="form-row">
              <p className="input-group">
                <label htmlFor="totalMembers">Number of Members</label>
                <input 
                  id="totalMembers" 
                  name="totalMembers" 
                  type="number" 
                  placeholder="Min 2" 
                  className={errors.totalMembers ? 'input-error' : ''}
                  onChange={handleChange} 
                />
                {errors.totalMembers && <small className="error-text">{errors.totalMembers}</small>}
              </p>
              <p className="input-group">
                <label htmlFor="duration">Duration (Months)</label>
                <input 
                  id="duration" 
                  name="duration" 
                  type="number" 
                  min="1"
                  placeholder="e.g., 12" 
                  className={errors.duration ? 'input-error' : ''}
                  onChange={handleChange} 
                />
                {errors.duration && <small className="error-text">{errors.duration}</small>}
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

          <fieldset className="form-section">
            <legend>Add Members</legend>
            <small className="section-note">An invitation link will be sent to each email address.</small>
            
            {members.map((member, index) => (
              <section key={member.id} className="form-row triple-col member-entry">
                <p className="input-group">
                  <label>Member {index + 1} Name</label>
                  <input 
                    name="firstName" 
                    placeholder="Name" 
                    className={errors.members?.[index]?.firstName ? 'input-error' : ''}
                    onChange={(e) => handleMemberChange(member.id, e, index)} 
                  />
                  {errors.members?.[index]?.firstName && <small className="error-text">{errors.members[index].firstName}</small>}
                </p>
                <p className="input-group">
                  <label>Surname</label>
                  <input 
                    name="surname" 
                    placeholder="Surname" 
                    className={errors.members?.[index]?.surname ? 'input-error' : ''}
                    onChange={(e) => handleMemberChange(member.id, e, index)} 
                  />
                  {errors.members?.[index]?.surname && <small className="error-text">{errors.members[index].surname}</small>}
                </p>
                <p className="input-group">
                  <label>Email Address</label>
                  <section className="input-with-action">
                    <input 
                      name="email" 
                      type="email" 
                      placeholder="Email" 
                      className={errors.members?.[index]?.email ? 'input-error' : ''}
                      onChange={(e) => handleMemberChange(member.id, e, index)} 
                    />
                    {members.length > 1 && (
                      <button type="button" onClick={() => removeMemberRow(member.id)} className="remove-row-btn" aria-label="Remove member">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </section>
                  {errors.members?.[index]?.email && <small className="error-text small">{errors.members[index].email}</small>}
                </p>
              </section>
            ))}
            
            <button type="button" onClick={addMemberRow} className="add-row-btn">
              <Plus size={18} /> Add Another Member
            </button>
          </fieldset>

          <footer className="form-actions">
            <button type="submit" className="submit-full">Create Group & Send Invites</button>
          </footer>
        </form>
      </main>
    </section>
  );
};

export default CreateGroup;