import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
    treasurer: {
      firstName: '',
      surname: '',
      email: ''
    }
  });

  const [members, setMembers] = useState([
    { id: Date.now(), firstName: '', surname: '', email: '' }
  ]);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('treasurer.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        treasurer: { ...formData.treasurer, [field]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleMemberChange = (id, e) => {
    const { name, value } = e.target;
    const newMembers = members.map(m => {
      if (m.id === id) return { ...m, [name]: value };
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

  const validateForm = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.groupName.trim()) tempErrors.groupName = "Group name is required";
    if (!formData.contributionAmount || formData.contributionAmount <= 0) tempErrors.contributionAmount = "Required";
    if (!formData.treasurer.firstName.trim()) tempErrors['treasurer.firstName'] = "Required";
    if (!formData.treasurer.email.trim() || !emailRegex.test(formData.treasurer.email)) {
        tempErrors['treasurer.email'] = "Valid email required";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // 1. Get logged-in user from localStorage
      const loggedInUser = JSON.parse(localStorage.getItem('user'));

      if (!loggedInUser || !loggedInUser._id) {
        alert("Session expired. Please log in again to create a group.");
        return;
      }

      // 2. Construct payload for MongoDB
      const payload = {
        groupName: formData.groupName,
        adminId: loggedInUser._id, // Automatic Admin Assignment
        treasurerDetails: {
          firstName: formData.treasurer.firstName,
          surname: formData.treasurer.surname,
          email: formData.treasurer.email
        },
        financials: {
            amount: formData.contributionAmount,
            frequency: formData.frequency,
            duration: formData.duration
        }
      };

      try {
        // 3. Post to Backend
        await axios.post('http://localhost:5000/api/stokvels', payload);
        
        alert("Success! Group created and saved to MongoDB.");
        navigate('/'); 
      } catch (err) {
        console.error("Submission Error:", err);
        alert(err.response?.data?.error || "Error connecting to the database.");
      }
    }
  };

  return (
    <section className="form-bg">
      <header className="create-header-nav">
        <button onClick={() => navigate(-1)} className="back-btn" aria-label="Go back">
          <ArrowLeft size={24} />
        </button>
        <h1>Create Group</h1>
        <span className="header-spacer" aria-hidden="true"></span> 
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
                value={formData.groupName}
                onChange={handleChange} 
                className={errors.groupName ? 'input-error' : ''}
                required
              />
            </p>

            <section className="form-row">
              <p className="input-group">
                <label htmlFor="contributionAmount">Contribution (R)</label>
                <input id="contributionAmount" name="contributionAmount" type="number" value={formData.contributionAmount} onChange={handleChange} required />
              </p>
              <p className="input-group">
                <label htmlFor="frequency">Frequency</label>
                <select id="frequency" name="frequency" value={formData.frequency} onChange={handleChange}>
                  <option value="Monthly">Monthly</option>
                  <option value="Weekly">Weekly</option>
                </select>
              </p>
            </section>
          </fieldset>

          <fieldset className="form-section">
            <legend>Logistics & Payout</legend>
            <section className="form-row">
              <p className="input-group">
                <label htmlFor="totalMembers">Total Members</label>
                <input id="totalMembers" name="totalMembers" type="number" value={formData.totalMembers} onChange={handleChange} />
              </p>
              <p className="input-group">
                <label htmlFor="duration">Duration (Months)</label>
                <input id="duration" name="duration" type="number" value={formData.duration} onChange={handleChange} />
              </p>
            </section>
          </fieldset>

          <fieldset className="form-section treasurer-section">
            <legend>Add Treasurer</legend>
            <p className="section-note">The treasurer manages the group funds and payouts.</p>
            <section className="form-row triple-col">
              <p className="input-group">
                <label htmlFor="treasurerFirstName">First Name</label>
                <input id="treasurerFirstName" name="treasurer.firstName" type="text" placeholder="First Name" value={formData.treasurer.firstName} onChange={handleChange} required />
              </p>
              <p className="input-group">
                <label htmlFor="treasurerSurname">Surname</label>
                <input id="treasurerSurname" name="treasurer.surname" type="text" placeholder="Surname" value={formData.treasurer.surname} onChange={handleChange} />
              </p>
              <p className="input-group">
                <label htmlFor="treasurerEmail">Email Address</label>
                <input id="treasurerEmail" name="treasurer.email" type="email" placeholder="Email" value={formData.treasurer.email} onChange={handleChange} required />
              </p>
            </section>
          </fieldset>

          <fieldset className="form-section">
            <legend>Add Members</legend>
            {members.map((member) => (
              <article key={member.id} className="form-row triple-col member-entry">
                <p className="input-group">
                  <label>Member Name</label>
                  <input name="firstName" placeholder="Name" value={member.firstName} onChange={(e) => handleMemberChange(member.id, e)} />
                </p>
                <p className="input-group">
                  <label>Surname</label>
                  <input name="surname" placeholder="Surname" value={member.surname} onChange={(e) => handleMemberChange(member.id, e)} />
                </p>
                <p className="input-group">
                  <label>Email</label>
                  <span className="input-with-action">
                    <input name="email" type="email" placeholder="Email" value={member.email} onChange={(e) => handleMemberChange(member.id, e)} />
                    {members.length > 1 && (
                      <button type="button" onClick={() => removeMemberRow(member.id)} className="remove-row-btn"><Trash2 size={18} /></button>
                    )}
                  </span>
                </p>
              </article>
            ))}
            <button type="button" onClick={addMemberRow} className="add-row-btn"><Plus size={18} /> Add Another Member</button>
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