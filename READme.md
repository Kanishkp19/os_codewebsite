# 🚀 OSCode - University Tech Community Website

<div align="center">

![OSCode Logo](https://img.shields.io/badge/OSCode-Tech%20Community-00d4ff?style=for-the-badge&logo=react)

**A modern, full-featured website for university tech communities with admin panel**

[![React](https://img.shields.io/badge/React-18.2.0-61dafb?style=flat&logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009639?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776ab?style=flat&logo=python)](https://python.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat)](LICENSE)

[🌐 Live Demo](#) | [📚 Documentation](#installation) | [🛠️ Admin Panel](#admin-panel)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🔧 Installation](#-installation)
- [🎯 Usage](#-usage)
- [🔐 Admin Panel](#-admin-panel)
- [🌐 Deployment](#-deployment)
- [📸 Screenshots](#-screenshots)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🌟 **Public Website**
- **Modern Responsive Design** - Works perfectly on all devices
- **Dynamic Team Profiles** - Team member showcase with photos and social links
- **Event Management** - Display workshops, hackathons, and seminars
- **Job Board** - Integration for posting opportunities
- **Contact System** - Professional contact forms with categorization
- **Real-time Statistics** - Community stats and engagement metrics
- **Dark Theme** - Modern dark UI with accent colors

### 🔐 **Admin Panel**
- **Secure Authentication** - Multi-user admin system
- **Team Management** - Add, edit, delete members with photo uploads
- **Event Creation** - Full CRUD operations for events
- **Contact Management** - View and manage form submissions
- **Dashboard Analytics** - Comprehensive statistics and recent activity
- **File Upload System** - Image handling for profiles and events
- **Mobile Responsive** - Admin panel works on all devices

### 🛡️ **Technical Features**
- **RESTful API** - Clean, documented API endpoints
- **File-based Storage** - JSON storage system (easily upgradeable to database)
- **Session Management** - Secure admin sessions
- **Image Optimization** - Automatic image handling and serving
- **CORS Enabled** - Ready for deployment across domains
- **Error Handling** - Graceful error management throughout

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18.2** - Modern React with hooks
- **Lucide React** - Beautiful icon system
- **CSS3** - Custom responsive styling with CSS variables
- **JavaScript ES6+** - Modern JavaScript features

### **Backend**
- **FastAPI** - High-performance Python web framework
- **Pydantic** - Data validation and serialization
- **Uvicorn** - Lightning-fast ASGI server
- **Python 3.11+** - Latest Python features

### **Storage**
- **JSON Files** - Simple, reliable file-based storage
- **File System** - Image storage and serving
- **Session Storage** - In-memory session management

---

## 🚀 Quick Start

Get OSCode running in 5 minutes:

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/oscode-website.git
cd oscode-website

# 2. Set up backend
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements_simple.txt
python server_with_admin.py &

# 3. Set up frontend
cd ../frontend
npm install
npm start

# 4. Open your browser
# Main site: http://localhost:3000
# Admin panel: http://localhost:3000/admin
```

**Default Admin Credentials:**
- Username: `admin`
- Password: `oscode2024`

---

## 📁 Project Structure

```
oscode-website/
├── 📂 frontend/                    # React Frontend
│   ├── 📂 public/
│   │   ├── index.html             # Main HTML template
│   │   └── manifest.json          # PWA manifest
│   ├── 📂 src/
│   │   ├── App.js                 # Main React application
│   │   ├── App.css                # Main stylesheet
│   │   ├── AdminApp.js            # Admin panel component
│   │   ├── AdminApp.css           # Admin panel styles
│   │   └── index.js               # React entry point
│   └── package.json               # Frontend dependencies
│
├── 📂 backend/                     # FastAPI Backend
│   ├── server_with_admin.py       # Main server with admin
│   ├── admin_routes_simple.py     # Admin API routes
│   ├── requirements_simple.txt    # Python dependencies
│   ├── 📂 data/                   # JSON data storage
│   │   ├── events.json            # Events data
│   │   ├── team_members.json      # Team members data
│   │   ├── contacts.json          # Contact form submissions
│   │   ├── jobs.json              # Job postings data
│   │   └── mentors.json           # Mentors data
│   └── 📂 uploads/                # Uploaded images
│
├── 📂 deployment/                  # Deployment files
│   ├── Dockerfile                 # Container configuration
│   ├── docker-compose.yml         # Multi-container setup
│   └── nginx.conf                 # Nginx configuration
│
├── README.md                      # This file
├── LICENSE                        # MIT License
└── .gitignore                     # Git ignore rules
```

---

## 🔧 Installation

### **Prerequisites**
- **Node.js 16+** - [Download](https://nodejs.org/)
- **Python 3.11+** - [Download](https://python.org/)
- **Git** - [Download](https://git-scm.com/)

### **Step 1: Clone Repository**
```bash
git clone https://github.com/yourusername/oscode-website.git
cd oscode-website
```

### **Step 2: Backend Setup**
```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements_simple.txt

# Start backend server
python server_with_admin.py
```

**Backend will run on:** `http://localhost:8000`

### **Step 3: Frontend Setup**
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

**Frontend will run on:** `http://localhost:3000`

### **Step 4: Verify Installation**

✅ Visit `http://localhost:3000` - Main website should load  
✅ Visit `http://localhost:3000/admin` - Admin login should appear  
✅ Login with `admin` / `oscode2024` - Dashboard should load  
✅ Test adding a team member - Should appear on main site  

---

## 🎯 Usage

### **Public Website Navigation**

1. **Homepage** - Community overview with statistics
2. **Events** - Workshops, hackathons, and seminars
3. **Jobs** - Career opportunities and internships
4. **Mentors** - Expert guidance and mentorship
5. **Team** - Meet the community leaders
6. **Contact** - Get in touch with the community

### **Contact Form Categories**
- **General Inquiry** - Questions and information
- **Join Community** - Membership applications
- **Collaboration** - Partnership opportunities
- **Feedback** - Suggestions and improvements

---

## 🔐 Admin Panel

Access the admin panel at `http://localhost:3000/admin`

### **Default Credentials**
| Username | Password | Role |
|----------|----------|------|
| `admin` | `oscode2024` | Full Access |
| `president` | `oscode2024` | Full Access |
| `vice_president` | `oscode2024` | Full Access |

### **Admin Features**

#### 📊 **Dashboard**
- Real-time community statistics
- Recent contact form submissions
- Latest events overview
- Quick action buttons

#### 👥 **Team Management**
- ✅ Add new team members
- ✅ Upload profile photos
- ✅ Edit member information
- ✅ Manage social media links
- ✅ Set member roles and status

#### 📅 **Event Management**
- ✅ Create workshops and hackathons
- ✅ Set dates, times, and venues
- ✅ Manage event descriptions
- ✅ Toggle event visibility

#### 📧 **Contact Management**
- ✅ View all form submissions
- ✅ Filter by submission type
- ✅ Delete processed inquiries
- ✅ Export contact data

### **Adding Your First Team Member**

1. Login to admin panel
2. Navigate to **Team Members**
3. Click **Add Member**
4. Fill in the form:
   ```
   Name: John Doe
   Role: Developer
   Year: 3rd Year
   Department: Computer Science
   Bio: Passionate about web development...
   LinkedIn: https://linkedin.com/in/johndoe
   GitHub: https://github.com/johndoe
   Email: john@example.com
   ```
5. Upload a profile photo
6. Click **Save Member**
7. View the new member on the main website!

---

## 🌐 Deployment

### **Option 1: Docker Deployment (Recommended)**

```bash
# Build and run with Docker Compose
docker-compose up -d

# Access your site
# Main site: http://localhost:8000
# Admin: http://localhost:8000/admin
```

### **Option 2: Manual VPS Deployment**

#### **1. Server Setup (Ubuntu/Debian)**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y python3 python3-pip nodejs npm nginx

# Clone your repository
git clone https://github.com/yourusername/oscode-website.git
cd oscode-website
```

#### **2. Backend Deployment**
```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements_simple.txt

# Create systemd service
sudo nano /etc/systemd/system/oscode-backend.service
```

**Service configuration:**
```ini
[Unit]
Description=OSCode Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/path/to/oscode-website/backend
Environment=PATH=/path/to/oscode-website/backend/venv/bin
ExecStart=/path/to/oscode-website/backend/venv/bin/python server_with_admin.py
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable oscode-backend
sudo systemctl start oscode-backend
```

#### **3. Frontend Deployment**
```bash
cd frontend

# Install dependencies and build
npm install
npm run build

# Copy build to web directory
sudo cp -r build/* /var/www/html/
```

#### **4. Nginx Configuration**
```bash
sudo nano /etc/nginx/sites-available/oscode
```

**Nginx config:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Uploaded files
    location /uploads/ {
        alias /path/to/oscode-website/backend/uploads/;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/oscode /etc/nginx/sites-enabled/
sudo systemctl reload nginx
```

### **Option 3: Cloud Platforms**

#### **Vercel (Frontend)**
```bash
# In frontend directory
npm run build
npx vercel --prod
```

#### **Railway (Backend)**
1. Connect your GitHub repository
2. Select the `backend` folder
3. Set environment variables
4. Deploy automatically

#### **Heroku (Full Stack)**
```bash
# Create Heroku app
heroku create oscode-community

# Set buildpacks
heroku buildpacks:add --index 1 heroku/nodejs
heroku buildpacks:add --index 2 heroku/python

# Deploy
git push heroku main
```

### **Environment Variables for Production**

Create `.env` file:
```env
# Backend
ADMIN_PASSWORD=your_secure_password
PRESIDENT_PASSWORD=your_secure_password
VP_PASSWORD=your_secure_password

# Frontend  
REACT_APP_BACKEND_URL=https://your-domain.com
```

### **SSL Certificate (Let's Encrypt)**
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 📸 Screenshots

### **Public Website**
<div align="center">

**Homepage**
![Homepage](https://via.placeholder.com/800x400/0a0a0a/00d4ff?text=OSCode+Homepage)

**Team Page**
![Team Page](https://via.placeholder.com/800x400/0a0a0a/00d4ff?text=Team+Members)

**Events Page**
![Events Page](https://via.placeholder.com/800x400/0a0a0a/00d4ff?text=Events+%26+Workshops)

</div>

### **Admin Panel**
<div align="center">

**Admin Dashboard**
![Admin Dashboard](https://via.placeholder.com/800x400/121212/00d4ff?text=Admin+Dashboard)

**Team Management**
![Team Management](https://via.placeholder.com/800x400/121212/00d4ff?text=Team+Management)

**Add Member Form**
![Add Member](https://via.placeholder.com/800x400/121212/00d4ff?text=Add+Team+Member)

</div>

---

## 🔧 Customization

### **Branding**
Edit `frontend/src/App.css`:
```css
:root {
  --accent: #your-color;        /* Primary accent color */
  --background: #your-bg;       /* Background color */
  --surface: #your-surface;     /* Card/surface color */
}
```

### **Add New Admin Users**
Edit `backend/admin_routes_simple.py`:
```python
ADMIN_CREDENTIALS = {
    "admin": "oscode2024",
    "president": "oscode2024", 
    "secretary": "new_password",    # Add new admin
    "treasurer": "new_password",    # Add another admin
}
```

### **Community Information**
Update in `frontend/src/App.js`:
```javascript
// Update hero section
<h1 className="hero-title">
  Welcome to <span className="text-accent">YourCommunity</span>
  <br />Tech Community
</h1>
```

---

## 🔨 Development

### **API Endpoints**

#### **Public Endpoints**
```
GET  /api/stats              # Community statistics
GET  /api/events             # Active events
GET  /api/team-members       # Active team members
GET  /api/jobs               # Active job postings
GET  /api/mentors            # Active mentors
POST /api/contact            # Submit contact form
```

#### **Admin Endpoints**
```
POST /api/admin/login                    # Admin login
GET  /api/admin/dashboard-stats          # Dashboard data
GET  /api/admin/team-members             # All team members
POST /api/admin/team-members             # Create member
PUT  /api/admin/team-members/{id}        # Update member
DELETE /api/admin/team-members/{id}      # Delete member
POST /api/admin/upload-image             # Upload image
GET  /api/admin/events                   # All events
POST /api/admin/events                   # Create event
GET  /api/admin/contact-forms            # All contacts
DELETE /api/admin/contact-forms/{id}     # Delete contact
```

### **Data Storage Format**

**Team Member JSON:**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "role": "President",
  "year": "4th Year",
  "department": "Computer Science",
  "bio": "Passionate developer...",
  "image_url": "/uploads/profile.jpg",
  "linkedin_url": "https://linkedin.com/in/john",
  "github_url": "https://github.com/john",
  "email": "john@example.com",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00Z"
}
```

### **Running Tests**
```bash
# Frontend tests
cd frontend
npm test

# Backend tests (add pytest later)
cd backend
python -m pytest
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### **1. Fork & Clone**
```bash
git clone https://github.com/yourusername/oscode-website.git
cd oscode-website
```

### **2. Create Branch**
```bash
git checkout -b feature/your-feature-name
```

### **3. Make Changes**
- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly

### **4. Submit Pull Request**
- Describe your changes clearly
- Include screenshots if applicable
- Reference any related issues

### **Contributing Guidelines**
- **Code Style**: Use consistent formatting
- **Commits**: Write clear, descriptive messages
- **Documentation**: Update README if needed
- **Testing**: Ensure all features work

### **Bug Reports**
Use GitHub Issues with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/logs if applicable

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 OSCode Community

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙋‍♂️ Support

### **Community**
- 💬 [Discord](https://discord.gg/your-invite) - Join our community
- 🐦 [Twitter](https://twitter.com/oscode) - Follow for updates
- 📧 [Email](mailto:contact@oscode.com) - Direct support

### **Documentation**
- 📚 [API Docs](http://localhost:8000/docs) - Auto-generated API documentation
- 🎥 [Video Tutorials](https://youtube.com/oscode) - Step-by-step guides
- 📖 [Wiki](https://github.com/yourusername/oscode-website/wiki) - Detailed guides

### **Getting Help**
1. Check the [FAQ](#faq) section
2. Search [existing issues](https://github.com/yourusername/oscode-website/issues)
3. Create a [new issue](https://github.com/yourusername/oscode-website/issues/new)
4. Join our [Discord community](https://discord.gg/your-invite)

---

## 📊 Project Status

![GitHub last commit](https://img.shields.io/github/last-commit/yourusername/oscode-website)
![GitHub issues](https://img.shields.io/github/issues/yourusername/oscode-website)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/oscode-website)
![GitHub stars](https://img.shields.io/github/stars/yourusername/oscode-website)

### **Roadmap**
- [x] ✅ Basic website functionality
- [x] ✅ Admin panel with authentication
- [x] ✅ Team member management
- [x] ✅ Event management system
- [x] ✅ Contact form handling
- [ ] 🔄 Database integration (MongoDB/PostgreSQL)
- [ ] 🔄 Email notifications
- [ ] 🔄 User registration system
- [ ] 🔄 Event booking system
- [ ] 🔄 Mobile app (React Native)

---

<div align="center">

**⭐ Star this repository if it helped you!**

**Made with ❤️ by the OSCode Community**

[🚀 Get Started](#-quick-start) | [📖 Documentation](#-installation) | [🤝 Contribute](#-contributing)

</div>