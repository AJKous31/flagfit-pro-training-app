// app.js - FlagFit Pro main application logic

// Placeholder classes
class FlagFitApp {
  constructor() {
    this.currentUser = null;
    this.currentRole = null;
    this.isOnline = navigator.onLine;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.checkGDPR();
    this.setupOfflineDetection();
    this.loadUserPreferences();
    console.log('FlagFit Pro initialized successfully');
  }

  setupEventListeners() {
    // Role selection
    const roleSelect = document.getElementById('role');
    const loginBtn = document.querySelector('.role-btn');
    
    if (roleSelect && loginBtn) {
      loginBtn.addEventListener('click', () => this.login());
    }

    // YouTube search forms
    const ytForms = document.querySelectorAll('form[onsubmit*="searchYT"]');
    ytForms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const isCoach = form.id === 'ytFormCoach';
        this.searchYouTube(isCoach);
      });
    });

    // GDPR buttons
    const acceptBtn = document.querySelector('button[onclick="acceptGDPR()"]');
    const declineBtn = document.querySelector('button[onclick="declineGDPR()"]');
    
    if (acceptBtn) acceptBtn.addEventListener('click', () => this.acceptGDPR());
    if (declineBtn) declineBtn.addEventListener('click', () => this.declineGDPR());
  }

  login() {
    const roleSelect = document.getElementById('role');
    if (!roleSelect) return;

    this.currentRole = roleSelect.value;
    this.currentUser = {
      id: Date.now(),
      role: this.currentRole,
      loginTime: new Date().toISOString()
    };

    // Hide role selection
    const roleSelectSection = document.getElementById('roleSelect');
    if (roleSelectSection) {
      roleSelectSection.classList.add('hidden');
    }

    // Show appropriate dashboard
    this.showDashboard(this.currentRole);
    
    // Save user session
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    
    console.log(`User logged in as: ${this.currentRole}`);
  }

  showDashboard(role) {
    // Hide all dashboards
    const dashboards = ['athleteDash', 'coachDash', 'adminDash'];
    dashboards.forEach(id => {
      const element = document.getElementById(id);
      if (element) element.classList.add('hidden');
    });

    // Show selected dashboard
    const targetDashboard = document.getElementById(`${role}Dash`);
    if (targetDashboard) {
      targetDashboard.classList.remove('hidden');
      this.loadDashboardData(role);
    }
  }

  loadDashboardData(role) {
    switch (role) {
      case 'athlete':
        this.loadAthleteData();
        break;
      case 'coach':
        this.loadCoachData();
        break;
      case 'admin':
        this.loadAdminData();
        break;
    }
  }

  loadAthleteData() {
    // Load athlete-specific data
    const athleteCount = document.getElementById('athleteCount');
    if (athleteCount) {
      athleteCount.textContent = '12'; // This would come from a real API
    }
  }

  loadCoachData() {
    // Load coach-specific data
    const nextSession = document.getElementById('nextSession');
    if (nextSession) {
      nextSession.textContent = 'Tomorrow, 18:00';
    }
  }

  loadAdminData() {
    // Load admin-specific data
    console.log('Loading admin dashboard data');
  }

  async searchYouTube(isCoach = false) {
    const queryInput = isCoach ? document.getElementById('ytQueryCoach') : document.getElementById('ytQuery');
    const resultsDiv = isCoach ? document.getElementById('ytResultsCoach') : document.getElementById('ytResults');
    
    if (!queryInput || !resultsDiv) return;

    const query = queryInput.value.trim();
    if (!query) return;

    resultsDiv.innerHTML = '<p>Loading...</p>';

    try {
      // For demo purposes, show mock results
      // In production, you'd use the actual YouTube API
      const mockResults = [
        {
          id: { videoId: 'dQw4w9WgXcQ' },
          snippet: { title: 'Flag Football Training Drills - Basic Routes' }
        },
        {
          id: { videoId: 'dQw4w9WgXcQ' },
          snippet: { title: 'Advanced Flag Football Defense Techniques' }
        },
        {
          id: { videoId: 'dQw4w9WgXcQ' },
          snippet: { title: 'Flag Football Speed and Agility Workout' }
        }
      ];

      resultsDiv.innerHTML = '';
      mockResults.forEach(item => {
        const vid = item.id.videoId;
        const title = item.snippet.title;
        resultsDiv.innerHTML += `
          <div class="yt-embed">
            <iframe width="100%" height="240" src="https://www.youtube.com/embed/${vid}" 
              title="${title}" frameborder="0" allowfullscreen></iframe>
            <p>${title}</p>
          </div>
        `;
      });

    } catch (error) {
      console.error('YouTube search error:', error);
      resultsDiv.innerHTML = '<p>Failed to load videos. Please try again later.</p>';
    }
  }

  checkGDPR() {
    const gdprStatus = localStorage.getItem('gdpr');
    const gdprBanner = document.getElementById('gdprBanner');
    
    if (gdprStatus === 'accepted' && gdprBanner) {
      gdprBanner.style.display = 'none';
    }
  }

  acceptGDPR() {
    localStorage.setItem('gdpr', 'accepted');
    const gdprBanner = document.getElementById('gdprBanner');
    if (gdprBanner) {
      gdprBanner.style.display = 'none';
    }
    console.log('GDPR consent accepted');
  }

  declineGDPR() {
    localStorage.setItem('gdpr', 'declined');
    alert('You must accept cookies to use the app.');
    console.log('GDPR consent declined');
  }

  setupOfflineDetection() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('App is online');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('App is offline');
    });
  }

  loadUserPreferences() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
        this.currentRole = this.currentUser.role;
        this.showDashboard(this.currentRole);
      } catch (error) {
        console.error('Error loading user preferences:', error);
      }
    }
  }

  // Utility methods
  showNotification(message, type = 'info') {
    // Simple notification system
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed; top: 20px; right: 20px; 
      background: ${type === 'error' ? '#ff6b6b' : '#21808d'}; 
      color: white; padding: 1rem; border-radius: 0.5rem; 
      z-index: 10000; max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

class GDPRManager {}
class YouTubeManager {}
class PerformanceMonitor {}
class NotificationManager {}
class ThemeManager {}
class DataManager {}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.flagFitApp = new FlagFitApp();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FlagFitApp;
} 