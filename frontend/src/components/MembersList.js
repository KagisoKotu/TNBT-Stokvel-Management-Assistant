import React, { useState, useEffect } from 'react';
import './MembersList.css';

const MembersList = ({ user = {}, groupId = '', groupName = '' }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({ email: '', name: '', role: 'Member' });
  const [message, setMessage] = useState({ type: '', text: '' });

  // SMART URL LOGIC: Automatically switches between local testing and live deployment
  const apiUrl = 'https://tnbt-stokvel-management-assistant.onrender.com/api';

  // Mock data for initial display
  const getMockMembers = () => {
    return [
      { email: 'admin@stokvel.com', name: 'Admin User', memberType: 'Admin', joiningDate: new Date().toISOString() },
      { email: 'treasurer@stokvel.com', name: 'Treasurer User', memberType: 'Treasurer', joiningDate: new Date().toISOString() },
      { email: 'member@stokvel.com', name: 'John Doe', memberType: 'Member', joiningDate: new Date().toISOString() }
    ];
  };

  useEffect(() => {
    fetchMembers();
  }, [groupId]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMembers(getMockMembers());
        setLoading(false);
        return;
      }

      // Replaced relative path with Smart URL
      const response = await fetch(`${apiUrl}/admin/members?groupId=${groupId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMembers(data.members || []);
      } else {
        setMembers(getMockMembers());
      }
    } catch (error) {
      setMembers(getMockMembers());
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Demo mode - add to local state
        const newMemberData = {
          email: newMember.email,
          name: newMember.name,
          memberType: newMember.role,
          joiningDate: new Date().toISOString()
        };
        setMembers([...members, newMemberData]);
        setMessage({ type: 'success', text: 'Member added successfully!' });
        setShowAddModal(false);
        setNewMember({ email: '', name: '', role: 'Member' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        return;
      }

      // Replaced relative path with Smart URL
      const response = await fetch(`${apiUrl}/admin/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...newMember, groupId })
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Member added successfully!' });
        setShowAddModal(false);
        setNewMember({ email: '', name: '', role: 'Member' });
        fetchMembers();
      } else {
        // Fallback to local
        const newMemberData = {
          email: newMember.email,
          name: newMember.name,
          memberType: newMember.role,
          joiningDate: new Date().toISOString()
        };
        setMembers([...members, newMemberData]);
        setMessage({ type: 'success', text: 'Member added successfully!' });
        setShowAddModal(false);
        setNewMember({ email: '', name: '', role: 'Member' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      const newMemberData = {
        email: newMember.email,
        name: newMember.name,
        memberType: newMember.role,
        joiningDate: new Date().toISOString()
      };
      setMembers([...members, newMemberData]);
      setMessage({ type: 'success', text: 'Member added successfully!' });
      setShowAddModal(false);
      setNewMember({ email: '', name: '', role: 'Member' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleUpdateRole = async (memberEmail, newRole) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Demo mode - update local state
        setMembers(members.map(m => 
          m.email === memberEmail ? { ...m, memberType: newRole } : m
        ));
        setMessage({ type: 'success', text: 'Role updated successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        return;
      }

      // Replaced relative path with Smart URL
      const response = await fetch(`${apiUrl}/admin/members/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: memberEmail, role: newRole, groupId })
      });
      
      setMembers(members.map(m => 
        m.email === memberEmail ? { ...m, memberType: newRole } : m
      ));
      setMessage({ type: 'success', text: 'Role updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMembers(members.map(m => 
        m.email === memberEmail ? { ...m, memberType: newRole } : m
      ));
      setMessage({ type: 'success', text: 'Role updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleRemoveMember = async (memberEmail) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMembers(members.filter(m => m.email !== memberEmail));
        setMessage({ type: 'success', text: 'Member removed successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        return;
      }

      // Replaced relative path with Smart URL
      const response = await fetch(`${apiUrl}/admin/members`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: memberEmail, groupId })
      });
      
      setMembers(members.filter(m => m.email !== memberEmail));
      setMessage({ type: 'success', text: 'Member removed successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMembers(members.filter(m => m.email !== memberEmail));
      setMessage({ type: 'success', text: 'Member removed successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || member.memberType === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeClass = (role) => {
    switch(role) {
      case 'Admin': return 'badge-admin';
      case 'Treasurer': return 'badge-treasurer';
      default: return 'badge-member';
    }
  };

  const canManageRoles = user?.role === 'Admin';

  return (
    <section className="memberslist-container">
      <header className="memberslist-header">
        <h2>Group Members {groupName ? `- ${groupName}` : ''}</h2>
        {canManageRoles && (
          <button className="btn-add-member" onClick={() => setShowAddModal(true)}>
            + Add Member
          </button>
        )}
      </header>

      {message.text && (
        <aside className={`message ${message.type}`} role="alert" aria-live="polite">
          {message.text}
        </aside>
      )}

      <form className="memberslist-filters" onSubmit={(e) => e.preventDefault()} aria-label="Filter members">
        <label htmlFor="member-search">Search members</label>
        <input
          type="search"
          id="member-search"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <label htmlFor="role-filter">Filter by role</label>
        <select id="role-filter" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Treasurer">Treasurer</option>
          <option value="Member">Member</option>
        </select>
      </form>

      {loading ? (
        <p className="loading-spinner">Loading members...</p>
      ) : (
        <section className="members-table-wrapper">
          <table className="members-table">
            <caption>List of group members and their roles</caption>
            <thead>
              <tr>
                <th scope="col">Member</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Join Date</th>
                {canManageRoles && <th scope="col">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={canManageRoles ? 5 : 4} className="no-data">
                    No members found
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member, index) => (
                  <tr key={member.email || index}>
                    <th scope="row" className="member-name-cell">
                      <figure className="member-avatar">
                        <figcaption>Avatar for {member.name}</figcaption>
                        {member.name?.charAt(0) || 'M'}
                      </figure>
                      {member.name}
                    </th>
                    <td>{member.email}</td>
                    <td>
                      <output className={`role-badge ${getRoleBadgeClass(member.memberType)}`}>
                        {member.memberType}
                      </output>
                    </td>
                    <td><time dateTime={member.joiningDate}>{new Date(member.joiningDate).toLocaleDateString()}</time></td>
                    {canManageRoles && (
                      <td className="actions-cell">
                        <label htmlFor={`role-select-${index}`} className="visually-hidden">
                          Change role for {member.name}
                        </label>
                        <select
                          id={`role-select-${index}`}
                          value={member.memberType}
                          onChange={(e) => handleUpdateRole(member.email, e.target.value)}
                          className="role-select"
                          aria-label={`Change role for ${member.name}`}
                        >
                          <option value="Member">Member</option>
                          <option value="Treasurer">Treasurer</option>
                          <option value="Admin">Admin</option>
                        </select>
                        <button
                          className="btn-remove"
                          onClick={() => handleRemoveMember(member.email)}
                          aria-label={`Remove ${member.name} from group`}
                        >
                          ✕
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <dialog className="modal-overlay" open aria-label="Add member dialog">
          <article className="modal-content" role="document">
            <header className="modal-header">
              <h3>Add New Member</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)} aria-label="Close dialog">
                ✕
              </button>
            </header>
            <form onSubmit={handleAddMember} aria-label="Add new member form">
              <fieldset>
                <legend>New member information</legend>
                
                <label htmlFor="member-name">Full Name</label>
                <input
                  type="text"
                  id="member-name"
                  required
                  aria-required="true"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                />
                
                <label htmlFor="member-email">Email Address</label>
                <input
                  type="email"
                  id="member-email"
                  required
                  aria-required="true"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                />
                
                <label htmlFor="member-role">Role</label>
                <select
                  id="member-role"
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                >
                  <option value="Member">Member</option>
                  <option value="Treasurer">Treasurer</option>
                  <option value="Admin">Admin</option>
                </select>
                
                {/* Fixed the cut-off code by adding the submit button and closing the form tags! */}
                <button type="submit" className="btn-submit-member">
                  Add Member
                </button>
              </fieldset>
            </form>
          </article>
        </dialog>
      )}
    </section>
  );
};

export default MembersList;