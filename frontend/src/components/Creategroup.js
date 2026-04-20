import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import './Creategroup.css'; 

const CreateGroup = () => {
  const navigate = useNavigate();
  
  // ==========================================
  // 1. THE STATE (The Form's Memory)
  // ==========================================
  
  // Holds all the standard text inputs for the group and the treasurer
  const [formData, setFormData] = useState({
    groupName: '',
    contributionAmount: '',
    frequency: 'Monthly',
    dueDate: '1',
    totalMembers: '',
    payoutMethod: 'EFT',
    duration: '',
    // Treasurer is nested because it relates to a specific person's details
    treasurer: {
      firstName: '',
      surname: '',
      email: ''
    }
  });

  // Holds the dynamic list of members. We start with 1 empty row.
  // We use Date.now() as a unique ID so React knows exactly which row is which!
  const [members, setMembers] = useState([
    { id: Date.now(), firstName: '', surname: '', email: '' }
  ]);

  // Holds any red error messages if the user forgets to fill something out
  const [errors, setErrors] = useState({});

  // ==========================================
  // 2. INPUT HANDLERS (Tracking what the user types)
  // ==========================================
  
  // Handles typing in the normal form fields AND the nested treasurer fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Smart trick: If the input's name starts with 'treasurer.', we know we need to update the nested object
    if (name.startsWith('treasurer.')) {
      const field = name.split('.')[1]; // Extracts 'firstName', 'email', etc.
      setFormData({
        ...formData, // Keep all other group data the same
        treasurer: { ...formData.treasurer, [field]: value } // Only update the specific treasurer field
      });
    } else {
      // Standard input update (e.g., groupName, contributionAmount)
      setFormData({ ...formData, [name]: value });
    }

    // If they start typing, clear the red error message for that specific field
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // Handles typing specifically inside the dynamic "Add Members" rows
  const handleMemberChange = (id, e) => {
    const { name, value } = e.target;
    // Map through all members. If the ID matches the row they are typing in, update it. Otherwise, leave it alone.
    const newMembers = members.map(m => {
      if (m.id === id) return { ...m, [name]: value };
      return m;
    });
    setMembers(newMembers);
  };

  // Adds a brand new, empty member row to the bottom of the list
  const addMemberRow = () => {
    setMembers([...members, { id: Date.now(), firstName: '', surname: '', email: '' }]);
  };

  // Deletes a specific member row based on its unique ID
  const removeMemberRow = (id) => {
    // Only allow deletion if there is more than 1 row left (prevents deleting the last empty row)
    if (members.length > 1) setMembers(members.filter(m => m.id !== id));
  };

  // ==========================================
  // 3. VALIDATION (Checking the rules)
  // ==========================================
  const validateForm = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Standard email format checker

    // Check if crucial fields are empty
    if (!formData.groupName.trim()) tempErrors.groupName = "Group name is required";
    if (!formData.contributionAmount || formData.contributionAmount <= 0) tempErrors.contributionAmount = "Required";
    if (!formData.treasurer.firstName.trim()) tempErrors['treasurer.firstName'] = "Required";
    
    // Check if the treasurer email is empty OR formatted incorrectly
    if (!formData.treasurer.email.trim() || !emailRegex.test(formData.treasurer.email)) {
        tempErrors['treasurer.email'] = "Valid email required";
    }

    setErrors(tempErrors);
    
    // If the tempErrors object is completely empty, the form is valid! Returns true.
    return Object.keys(tempErrors).length === 0;
  };

  // ==========================================
  // 4. SUBMISSION (Sending data to the Database)
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stops the page from doing a hard reload
    
    // Only proceed if our validation rules pass
    if (validateForm()) {
      
      // Grab the person currently logged into the app (The Admin creating the group)
      const loggedInUser = JSON.parse(sessionStorage.getItem('user'));

      if (!loggedInUser || !loggedInUser.email) {
        alert("Session error: Please log out and back in.");
        return;
      }

      // 📦 THE BUNDLE: We pack all the state data into the exact format the Backend expects!
      const payload = {
        groupName: formData.groupName,
        adminId: loggedInUser.email, 
        treasurerId: formData.treasurer.email, 
        treasurerDetails: {
          firstName: formData.treasurer.firstName,
          surname: formData.treasurer.surname,
          email: formData.treasurer.email
        },
        financials: {
            amount: Number(formData.contributionAmount), // Convert string to a real number
            frequency: formData.frequency,
            duration: Number(formData.duration)
        },
        // Clean up the members array: drop the temporary Date.now() IDs before sending to DB
        members: members.map(({ firstName, surname, email }) => ({ firstName, surname, email }))
      };

      try {
        // SMART URL LOGIC: Points to Render when live, or localhost when testing
        const apiUrl = process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

        // Send the bundled 'payload' to the backend
        const response = await axios.post(`${apiUrl}/stokvel`, payload);
        
        alert("Success! Group created and saved.");
        navigate('/home'); // Send them back to the dashboard!
      } catch (err) {
        console.error("Submission Error:", err);
        // Show the specific error message from the backend if it exists
        alert(err.response?.data?.details || "Error adding to database. Check terminal.");
      }
    }
  };

  // ==========================================
  // 5. THE UI (The Screen)
  // ==========================================
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
        {/* 'noValidate' stops the browser's default ugly error popups so we can use our custom React errors */}
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
              {errors.groupName && <span className="error-text">{errors.groupName}</span>}
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
            {/* 🔄 THE LOOP: Draws an input row for every object inside our 'members' state array */}
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
                    {/* Only show the Trash button if there is more than 1 row */}
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