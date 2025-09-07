import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, Briefcase, GraduationCap, Github, Linkedin, Mail, ArrowRight, Menu, X } from 'lucide-react';
import AdminApp from './AdminApp';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

function App() {
  // Initialize all hooks first (before any conditional returns)
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [stats, setStats] = useState({});
  const [events, setEvents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, eventsRes, jobsRes, mentorsRes, teamRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/stats`).catch(() => ({ json: () => ({}) })),
        fetch(`${BACKEND_URL}/api/events`).catch(() => ({ json: () => [] })),
        fetch(`${BACKEND_URL}/api/jobs`).catch(() => ({ json: () => [] })),
        fetch(`${BACKEND_URL}/api/mentors`).catch(() => ({ json: () => [] })),
        fetch(`${BACKEND_URL}/api/team-members`).catch(() => ({ json: () => [] }))
      ]);

      const [statsData, eventsData, jobsData, mentorsData, teamData] = await Promise.all([
        statsRes.json(),
        eventsRes.json(),
        jobsRes.json(),
        mentorsRes.json(),
        teamRes.json()
      ]);

      setStats(statsData);
      setEvents(eventsData);
      setJobs(jobsData);
      setMentors(mentorsData);
      setTeamMembers(teamData);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set default data if backend is not available
      setStats({ total_events: 25, active_jobs: 12, mentors_available: 8, total_members: 50 });
      setEvents([]);
      setJobs([]);
      setMentors([]);
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Check if we're on admin path AFTER hooks are initialized
  const isAdminPath = window.location.pathname.startsWith('/admin');
  
  if (isAdminPath) {
    return <AdminApp />;
  }

  // Navigation component
  const Navigation = () => (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => setCurrentPage('home')}>
          <div className="logo">
            <div className="logo-icon">OS</div>
            <div className="logo-text">
              <div className="brand-name">OSCode</div>
              <div className="brand-subtitle">Tech Community</div>
            </div>
          </div>
        </div>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <a href="#home" onClick={() => { setCurrentPage('home'); setIsMenuOpen(false); }}>Home</a>
          <a href="#events" onClick={() => { setCurrentPage('events'); setIsMenuOpen(false); }}>Events</a>
          <a href="#jobs" onClick={() => { setCurrentPage('jobs'); setIsMenuOpen(false); }}>Jobs</a>
          <a href="#mentors" onClick={() => { setCurrentPage('mentors'); setIsMenuOpen(false); }}>Mentors</a>
          <a href="#team" onClick={() => { setCurrentPage('team'); setIsMenuOpen(false); }}>Team</a>
          <a href="#contact" onClick={() => { setCurrentPage('contact'); setIsMenuOpen(false); }}>Contact</a>
        </div>

        <div className="nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </div>
      </div>
    </nav>
  );

  // Home page component
  const HomePage = () => (
    <div className="page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="text-accent">OSCode</span>
            <br />Tech Community
          </h1>
          <p className="hero-subtitle">
            Building the next generation of developers through collaboration, learning, and innovation.
            Join our vibrant community of tech enthusiasts, students, and professionals.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => setCurrentPage('events')}>
              Explore Events <ArrowRight className="w-4 h-4" />
            </button>
            <button className="btn btn-secondary" onClick={() => setCurrentPage('contact')}>
              Join Community
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-grid">
          <div className="stat-card">
            <Calendar className="stat-icon" />
            <div className="stat-number">{stats.total_events || 25}</div>
            <div className="stat-label">Events Organized</div>
          </div>
          <div className="stat-card">
            <Briefcase className="stat-icon" />
            <div className="stat-number">{stats.active_jobs || 12}</div>
            <div className="stat-label">Active Job Postings</div>
          </div>
          <div className="stat-card">
            <GraduationCap className="stat-icon" />
            <div className="stat-number">{stats.mentors_available || 8}</div>
            <div className="stat-label">Expert Mentors</div>
          </div>
          <div className="stat-card">
            <Users className="stat-icon" />
            <div className="stat-number">{stats.total_members || 50}</div>
            <div className="stat-label">Active Members</div>
          </div>
        </div>
      </section>

      {/* Recent Events */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Upcoming Events</h2>
          <div className="events-grid">
            {events.slice(0, 3).map((event, index) => (
              <div key={event.id || index} className="event-card">
                <div className="event-type">{event.event_type}</div>
                <h3 className="event-title">{event.title}</h3>
                <p className="event-description">{event.description}</p>
                <div className="event-details">
                  <div className="event-detail">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="event-detail">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="event-detail">
                    <MapPin className="w-4 h-4" />
                    <span>{event.venue}</span>
                  </div>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="no-events">
                <p>No events scheduled yet. Check back soon!</p>
              </div>
            )}
          </div>
          <div className="text-center mt-8">
            <button className="btn btn-outline" onClick={() => setCurrentPage('events')}>
              View All Events <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );

  // Team page component
  const TeamPage = () => {
    if (loading) {
      return (
        <div className="page">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading team members...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="page">
        <section className="section">
          <div className="container">
            <h2 className="section-title">Meet Our Team</h2>
            <p className="section-subtitle">
              Passionate individuals driving innovation and building community
            </p>
            
            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <div key={member.id || index} className="team-member-card">
                  <div className="member-image-container">
                    {member.image_url ? (
                      <img 
                        src={`${BACKEND_URL}${member.image_url}`} 
                        alt={member.name}
                        className="member-image"
                      />
                    ) : (
                      <div className="member-placeholder">
                        <Users className="w-12 h-12 text-accent" />
                      </div>
                    )}
                  </div>
                  
                  <div className="member-content">
                    <h3 className="member-name">{member.name}</h3>
                    <p className="member-role">{member.role}</p>
                    <p className="member-department">{member.department} • {member.year}</p>
                    <p className="member-bio">{member.bio}</p>
                    
                    <div className="member-social">
                      {member.linkedin_url && (
                        <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="social-link">
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {member.github_url && (
                        <a href={member.github_url} target="_blank" rel="noopener noreferrer" className="social-link">
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {member.email && (
                        <a href={`mailto:${member.email}`} className="social-link">
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {teamMembers.length === 0 && (
                <div className="no-data">
                  <p>Team members will appear here once added through the admin panel!</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  };

  // Events page component
  const EventsPage = () => (
    <div className="page">
      <section className="section">
        <div className="container">
          <h2 className="section-title">Events & Workshops</h2>
          <div className="events-grid">
            {events.map((event, index) => (
              <div key={event.id || index} className="event-card">
                <div className="event-type">{event.event_type}</div>
                <h3 className="event-title">{event.title}</h3>
                <p className="event-description">{event.description}</p>
                <div className="event-details">
                  <div className="event-detail">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="event-detail">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="event-detail">
                    <MapPin className="w-4 h-4" />
                    <span>{event.venue}</span>
                  </div>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="no-events">
                <p>No events scheduled yet. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );

  // Contact page component
  const ContactPage = () => {
    const [formData, setFormData] = useState({
      name: '', email: '', subject: '', message: '', form_type: 'general'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      try {
        const response = await fetch(`${BACKEND_URL}/api/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          setSubmitMessage('Message sent successfully! We\'ll get back to you soon.');
          setFormData({ name: '', email: '', subject: '', message: '', form_type: 'general' });
        } else {
          setSubmitMessage('Error sending message. Please try again.');
        }
      } catch (error) {
        setSubmitMessage('Backend not available. Please try again later.');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="page">
        <section className="section">
          <div className="container">
            <h2 className="section-title">Get In Touch</h2>
            <p className="section-subtitle">
              Have questions or want to join our community? We'd love to hear from you!
            </p>
            
            <div className="contact-container">
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="form_type">Category</label>
                  <select
                    id="form_type"
                    value={formData.form_type}
                    onChange={(e) => setFormData({...formData, form_type: e.target.value})}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="membership">Join Community</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    rows="5"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                
                {submitMessage && (
                  <div className={`submit-message ${submitMessage.includes('Error') || submitMessage.includes('not available') ? 'error' : 'success'}`}>
                    {submitMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>
      </div>
    );
  };

  // Jobs page component
  const JobsPage = () => (
    <div className="page">
      <section className="section">
        <div className="container">
          <h2 className="section-title">Job Opportunities</h2>
          <div className="jobs-grid">
            {jobs.map((job, index) => (
              <div key={job.id || index} className="job-card">
                <h3 className="job-title">{job.title}</h3>
                <div className="job-company">{job.company}</div>
                <div className="job-location">{job.location} • {job.job_type}</div>
                <p className="job-description">{job.description}</p>
                <div className="job-requirements">
                  <h4>Requirements:</h4>
                  <ul>
                    {job.requirements && job.requirements.map((req, reqIndex) => (
                      <li key={reqIndex}>{req}</li>
                    ))}
                  </ul>
                </div>
                <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Apply Now <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ))}
            {jobs.length === 0 && (
              <div className="no-data">
                <p>No job postings available at the moment. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );

  // Mentors page component
  const MentorsPage = () => (
    <div className="page">
      <section className="section">
        <div className="container">
          <h2 className="section-title">Our Mentors</h2>
          <div className="mentors-grid">
            {mentors.map((mentor, index) => (
              <div key={mentor.id || index} className="mentor-card">
                <h3 className="mentor-name">{mentor.name}</h3>
                <div className="mentor-expertise">{mentor.expertise}</div>
                <div className="mentor-company">{mentor.company}</div>
                <p className="mentor-bio">{mentor.bio}</p>
                {mentor.linkedin_url && (
                  <a href={mentor.linkedin_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                    <Linkedin className="w-4 h-4" /> Connect
                  </a>
                )}
              </div>
            ))}
            {mentors.length === 0 && (
              <div className="no-data">
                <p>Mentor profiles will be available soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'events': return <EventsPage />;
      case 'jobs': return <JobsPage />;
      case 'mentors': return <MentorsPage />;
      case 'team': return <TeamPage />;
      case 'contact': return <ContactPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="App">
      <Navigation />
      {renderPage()}
    </div>
  );
}

export default App;
