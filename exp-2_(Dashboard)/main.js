// Theme Toggle Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    let isDark = false;

    themeToggle.addEventListener('click', () => {
      isDark = !isDark;
      body.classList.toggle('dark', isDark);
      themeToggle.textContent = isDark ? '☀️' : '🌙';
      
      // Add smooth transition effect
      body.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        body.style.transition = '';
      }, 300);
    });

    // Navigation Functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const pageTitle = document.getElementById('page-title');

    const pageData = {
      home: 'Dashboard Overview',
      analytics: 'Analytics Dashboard',
      users: 'User Management',
      settings: 'System Settings'
    };

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Update page title
        const page = link.getAttribute('data-page');
        pageTitle.textContent = pageData[page];
        
        // Add page transition effect
        pageTitle.style.opacity = '0';
        setTimeout(() => {
          pageTitle.style.opacity = '1';
        }, 150);
      });
    });

    // Card Click Effects
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
      card.addEventListener('click', () => {
        // Add click animation
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          card.style.transform = '';
        }, 150);
        
        const cardType = card.getAttribute('data-card');
        console.log(`Clicked on ${cardType} card`);
      });
    });

    // Dynamic Number Animation
    function animateNumber(element, target) {
      const start = 0;
      const duration = 2000;
      const startTime = performance.now();
      
      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (target - start) * progress);
        
        if (element.id === 'sales-number') {
          element.textContent = '$' + current.toLocaleString();
        } else {
          element.textContent = current.toLocaleString();
        }
        
        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        }
      }
      
      requestAnimationFrame(updateNumber);
    }

    // Initialize number animations on page load
    window.addEventListener('load', () => {
      animateNumber(document.getElementById('sales-number'), 47825);
      animateNumber(document.getElementById('views-number'), 2847);
      animateNumber(document.getElementById('users-number'), 1234);
    });

    // Quick Actions Functionality
    function performAction(action) {
      const messages = {
        export: 'Data exported successfully! 📊',
        backup: 'System backup completed! 💾',
        refresh: 'Dashboard refreshed! 🔄'
      };
      
      // Create notification
      const notification = document.createElement('div');
      notification.textContent = messages[action];
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(74, 222, 128, 0.9);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
      `;
      
      // Add slide-in animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
      
      document.body.appendChild(notification);
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
      
      // Simulate data refresh for refresh action
      if (action === 'refresh') {
        setTimeout(() => {
          animateNumber(document.getElementById('sales-number'), 47825 + Math.floor(Math.random() * 1000));
          animateNumber(document.getElementById('views-number'), 2847 + Math.floor(Math.random() * 500));
          animateNumber(document.getElementById('users-number'), 1234 + Math.floor(Math.random() * 200));
        }, 500);
      }
    }

    // Add hover effects for better interactivity
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.zIndex = '10';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.zIndex = '1';
      });
    });

    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
      if (e.key === 't' || e.key === 'T') {
        themeToggle.click();
      }
    });

    // Initialize theme based on system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      themeToggle.click();
    }

    console.log('🚀 Admin Dashboard loaded successfully!');