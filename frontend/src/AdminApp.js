import React, { useState, useEffect } from 'react';
import { 
  Home, Users, Calendar, Briefcase, MessageSquare, Upload, 
  Plus, Edit2, Trash2, LogOut, Menu, X, Save, Eye, EyeOff 
} from 'lucide-react';
import './AdminApp.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

const AdminApp = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sessionId, setSessionId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedSession = localStorage.getItem('admin_session');
    if (savedSession) {
      verifySession(savedSession);
    } else {
      setLoading(false);
    }
  }, []);

  const verifySession = async (session) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/verify?session_id=${session}`);
      if (response.ok) {
        setSessionId(session);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('admin_session');
      }
    } catch (error) {
      console.error('Session verification failed:', error);
      localStorage.removeItem('admin_session');
    } finally {
      setLoading(false);
    }
  };

  // Login Component
  const AdminLogin = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch(`${BACKEND_URL}/api/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('admin_session', data.session_id);
          onLogin(data.session_id);
        } else {
          setError(data.detail || 'Login failed');
        }
      } catch (error) {
        setError('Connection error. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <div className="logo-icon">OS</div>
              <h2>OSCode Admin</h2>
            </div>
            <p>Sign in to manage your community</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                required
                placeholder="Enter your username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  required
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  // Dashboard Component
  const Dashboard = ({ sessionId }) => {
    const [stats, setStats] = useState({});
    const [recentActivity, setRecentActivity] = useState({ contacts: [], events: [] });

    useEffect(() => {
      fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/admin/dashboard-stats?session_id=${sessionId}`);
        const data = await response.json();
        setStats(data.stats);
        setRecentActivity({
          contacts: data.recent_contacts || [],
          events: data.recent_events || []
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    return (
      <div className="dashboard">
        <div className="page-header">
          <h2>Dashboard</h2>
          <p>Welcome to OSCode Admin Panel</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <Calendar className="stat-icon" />
            <div className="stat-content">
              <div className="stat-number">{stats.total_events || 0}</div>
              <div className="stat-label">Total Events</div>
            </div>
          </div>
          <div className="stat-card">
            <Users className="stat-icon" />
            <div className="stat-content">
              <div className="stat-number">{stats.total_team_members || 0}</div>
              <div className="stat-label">Team Members</div>
            </div>
          </div>
          <div className="stat-card">
            <Briefcase className="stat-icon" />
            <div className="stat-content">
              <div className="stat-number">{stats.total_jobs || 0}</div>
              <div className="stat-label">Job Postings</div>
            </div>
          </div>
          <div className="stat-card">
            <MessageSquare className="stat-icon" />
            <div className="stat-content">
              <div className="stat-number">{stats.total_contacts || 0}</div>
              <div className="stat-label">Contact Forms</div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="recent-activity">
            <h3>Recent Contact Forms</h3>
            {recentActivity.contacts.length > 0 ? (
              <div className="activity-list">
                {recentActivity.contacts.map((contact, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-content">
                      <div className="activity-title">{contact.name}</div>
                      <div className="activity-subtitle">{contact.subject}</div>
                    </div>
                    <div className="activity-time">
                      {new Date(contact.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No recent contact forms</p>
            )}
          </div>

          <div className="recent-activity">
            <h3>Recent Events</h3>
            {recentActivity.events.length > 0 ? (
              <div className="activity-list">
                {recentActivity.events.map((event, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-content">
                      <div className="activity-title">{event.title}</div>
                      <div className="activity-subtitle">{event.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No recent events</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Team Management Component
  const TeamManagement = ({ sessionId }) => {
    const [members, setMembers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [memberForm, setMemberForm] = useState({
      name: '', role: '', year: '', department: '', bio: '', 
      linkedin_url: '', github_url: '', email: '', is_active: true
    });

    useEffect(() => {
      fetchTeamMembers();
    }, []);

    const fetchTeamMembers = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/admin/team-members?session_id=${sessionId}`);
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error('Failed to fetch team members:', error);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        const url = editingMember 
          ? `${BACKEND_URL}/api/admin/team-members/${editingMember.id}?session_id=${sessionId}`
          : `${BACKEND_URL}/api/admin/team-members?session_id=${sessionId}`;
        
        const method = editingMember ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(memberForm)
        });

        if (response.ok) {
          fetchTeamMembers();
          resetForm();
        }
      } catch (error) {
        console.error('Error saving member:', error);
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleEdit = (member) => {
      setEditingMember(member);
      setMemberForm(member);
      setShowModal(true);
    };

    const handleDelete = async (memberId) => {
      if (!window.confirm('Are you sure you want to delete this team member?')) return;

      try {
        const response = await fetch(`${BACKEND_URL}/api/admin/team-members/${memberId}?session_id=${sessionId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchTeamMembers();
        }
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    };

    const handleImageUpload = async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('session_id', sessionId);

      try {
        const response = await fetch(`${BACKEND_URL}/api/admin/upload-image`, {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        if (response.ok) {
          setMemberForm({ ...memberForm, image_url: data.image_url });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    };

    const resetForm = () => {
      setMemberForm({
        name: '', role: '', year: '', department: '', bio: '', 
        linkedin_url: '', github_url: '', email: '', is_active: true
      });
      setEditingMember(null);
      setShowModal(false);
    };

    return (
      <div className="team-management">
        <div className="page-header">
          <h2>Team Management</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} /> Add Member
          </button>
        </div>

        <div className="team-grid">
          {members.map((member) => (
            <div key={member.id} className="member-card">
              <div className="member-image">
                {member.image_url ? (
                  <img src={`${BACKEND_URL}${member.image_url}`} alt={member.name} />
                ) : (
                  <div className="member-placeholder">
                    <Users size={40} />
                  </div>
                )}
              </div>
              <div className="member-info">
                <h3>{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <p className="member-details">{member.department} • {member.year}</p>
              </div>
              <div className="member-actions">
                <button className="btn-icon" onClick={() => handleEdit(member)}>
                  <Edit2 size={16} />
                </button>
                <button className="btn-icon btn-danger" onClick={() => handleDelete(member.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Member Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => resetForm()}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingMember ? 'Edit Member' : 'Add New Member'}</h3>
                <button className="btn-close" onClick={resetForm}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="member-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      value={memberForm.name}
                      onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Role *</label>
                    <input
                      type="text"
                      value={memberForm.role}
                      onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Year *</label>
                    <select
                      value={memberForm.year}
                      onChange={(e) => setMemberForm({ ...memberForm, year: e.target.value })}
                      required
                    >
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Alumni">Alumni</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Department *</label>
                    <input
                      type="text"
                      value={memberForm.department}
                      onChange={(e) => setMemberForm({ ...memberForm, department: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Bio *</label>
                  <textarea
                    value={memberForm.bio}
                    onChange={(e) => setMemberForm({ ...memberForm, bio: e.target.value })}
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Profile Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                  {memberForm.image_url && (
                    <div className="image-preview">
                      <img src={`${BACKEND_URL}${memberForm.image_url}`} alt="Preview" />
                    </div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>LinkedIn URL</label>
                    <input
                      type="url"
                      value={memberForm.linkedin_url}
                      onChange={(e) => setMemberForm({ ...memberForm, linkedin_url: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>GitHub URL</label>
                    <input
                      type="url"
                      value={memberForm.github_url}
                      onChange={(e) => setMemberForm({ ...memberForm, github_url: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={memberForm.email}
                    onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Member'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Events Management Component
  const EventsManagement = ({ sessionId }) => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [eventForm, setEventForm] = useState({
      title: '', description: '', date: '', time: '', venue: '', event_type: 'workshop', is_active: true
    });

    useEffect(() => {
      fetchEvents();
    }, []);

    const fetchEvents = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/admin/events?session_id=${sessionId}`);
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        const url = editingEvent 
          ? `${BACKEND_URL}/api/admin/events/${editingEvent.id}?session_id=${sessionId}`
          : `${BACKEND_URL}/api/admin/events?session_id=${sessionId}`;
        
        const method = editingEvent ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventForm)
        });

        if (response.ok) {
          fetchEvents();
          resetForm();
        }
      } catch (error) {
        console.error('Error saving event:', error);
      }
    };

    const handleDelete = async (eventId) => {
      if (!window.confirm('Are you sure you want to delete this event?')) return;

      try {
        const response = await fetch(`${BACKEND_URL}/api/admin/events/${eventId}?session_id=${sessionId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchEvents();
        }
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    };

    const resetForm = () => {
      setEventForm({
        title: '', description: '', date: '', time: '', venue: '', event_type: 'workshop', is_active: true
      });
      setEditingEvent(null);
      setShowModal(false);
    };

    return (
      <div className="events-management">
        <div className="page-header">
          <h2>Events Management</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} /> Add Event
          </button>
        </div>

        <div className="events-list">
          {events.map((event) => (
            <div key={event.id} className="event-item">
              <div className="event-content">
                <div className="event-header">
                  <h3>{event.title}</h3>
                  <div className="event-type">{event.event_type}</div>
                </div>
                <p className="event-description">{event.description}</p>
                <div className="event-meta">
                  <span><Calendar size={16} /> {event.date}</span>
                  <span>{event.time}</span>
                  <span>{event.venue}</span>
                </div>
              </div>
              <div className="event-actions">
                <button 
                  className="btn-icon" 
                  onClick={() => {
                    setEditingEvent(event);
                    setEventForm(event);
                    setShowModal(true);
                  }}
                >
                  <Edit2 size={16} />
                </button>
                <button className="btn-icon btn-danger" onClick={() => handleDelete(event.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Event Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => resetForm()}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingEvent ? 'Edit Event' : 'Add New Event'}</h3>
                <button className="btn-close" onClick={resetForm}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="event-form">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    rows="4"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Time *</label>
                    <input
                      type="time"
                      value={eventForm.time}
                      onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Venue *</label>
                    <input
                      type="text"
                      value={eventForm.venue}
                      onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Event Type *</label>
                    <select
                      value={eventForm.event_type}
                      onChange={(e) => setEventForm({ ...eventForm, event_type: e.target.value })}
                    >
                      <option value="workshop">Workshop</option>
                      <option value="hackathon">Hackathon</option>
                      <option value="seminar">Seminar</option>
                      <option value="meeting">Meeting</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Save size={16} /> Save Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Contact Forms Management
  const ContactFormsManagement = ({ sessionId }) => {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
      fetchContacts();
    }, []);

    const fetchContacts = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/admin/contact-forms?session_id=${sessionId}`);
        const data = await response.json();
        setContacts(data);
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
      }
    };

    const handleDelete = async (contactId) => {
      if (!window.confirm('Are you sure you want to delete this contact form?')) return;

      try {
        const response = await fetch(`${BACKEND_URL}/api/admin/contact-forms/${contactId}?session_id=${sessionId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchContacts();
        }
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    };

    return (
      <div className="contacts-management">
        <div className="page-header">
          <h2>Contact Forms</h2>
          <p>Manage community inquiries and messages</p>
        </div>

        <div className="contacts-list">
          {contacts.map((contact) => (
            <div key={contact._id} className="contact-item">
              <div className="contact-content">
                <div className="contact-header">
                  <h3>{contact.name}</h3>
                  <div className="contact-type">{contact.form_type}</div>
                </div>
                <p className="contact-email">{contact.email}</p>
                <p className="contact-subject">{contact.subject}</p>
                <p className="contact-message">{contact.message}</p>
                <div className="contact-date">
                  {new Date(contact.created_at).toLocaleString()}
                </div>
              </div>
              <div className="contact-actions">
                <button className="btn-icon btn-danger" onClick={() => handleDelete(contact._id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleLogout = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/admin/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId })
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('admin_session');
      setIsAuthenticated(false);
      setSessionId(null);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={(session) => {
      setSessionId(session);
      setIsAuthenticated(true);
    }} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard sessionId={sessionId} />;
      case 'team': return <TeamManagement sessionId={sessionId} />;
      case 'events': return <EventsManagement sessionId={sessionId} />;
      case 'contacts': return <ContactFormsManagement sessionId={sessionId} />;
      default: return <Dashboard sessionId={sessionId} />;
    }
  };

  return (
    <div className="admin-app">
      <div className={`admin-sidebar ${sidebarOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <div className="admin-logo">
            <div className="logo-icon">OS</div>
            <div>
              <div className="brand-name">OSCode</div>
              <div className="brand-subtitle">Admin Panel</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentPage('dashboard')}
          >
            <Home size={20} /> Dashboard
          </button>
          <button 
            className={`nav-item ${currentPage === 'team' ? 'active' : ''}`}
            onClick={() => setCurrentPage('team')}
          >
            <Users size={20} /> Team Members
          </button>
          <button 
            className={`nav-item ${currentPage === 'events' ? 'active' : ''}`}
            onClick={() => setCurrentPage('events')}
          >
            <Calendar size={20} /> Events
          </button>
          <button 
            className={`nav-item ${currentPage === 'contacts' ? 'active' : ''}`}
            onClick={() => setCurrentPage('contacts')}
          >
            <MessageSquare size={20} /> Contact Forms
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      <div className="admin-main">
        <div className="admin-header">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={24} />
          </button>
        </div>

        <div className="admin-content">
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default AdminApp;