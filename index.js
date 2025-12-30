document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const neuNav = document.getElementById('neuNav');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuPanel = document.getElementById('mobileMenuPanel');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    const notificationsBtn = document.getElementById('notificationsBtn');
    const mobileSearchBtn = document.getElementById('mobileSearchBtn');
    const searchInput = document.querySelector('.search-input');
    const mobileSearchInput = document.querySelector('.mobile-search-input');
    const navLinks = document.querySelectorAll('.nav-link, .tablet-nav-link, .mobile-nav-item');
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');

    // Current Theme
    let currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    mobileThemeToggle.checked = currentTheme === 'dark';

    // Mobile Menu Toggle
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    mobileMenuOverlay.addEventListener('click', toggleMobileMenu);
    closeMobileMenu.addEventListener('click', toggleMobileMenu);

    function toggleMobileMenu() {
        mobileMenuBtn.classList.toggle('active');
        mobileMenuPanel.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        document.body.style.overflow = mobileMenuPanel.classList.contains('active') ? 'hidden' : '';
    }

    // Theme Toggle
    themeToggleBtn.addEventListener('click', toggleTheme);
    mobileThemeToggle.addEventListener('change', toggleTheme);

    function toggleTheme() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
        updateThemeIcon(currentTheme);
        mobileThemeToggle.checked = currentTheme === 'dark';
    }

    function updateThemeIcon(theme) {
        const icon = themeToggleBtn.querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Notifications
    notificationsBtn.addEventListener('click', function () {
        this.classList.toggle('active');
        showNotificationPopup();
    });

    function showNotificationPopup() {
        const notifications = [
            { text: 'New project inquiry received', time: '5 min ago' },
            { text: 'Someone viewed your portfolio', time: '1 hour ago' },
            { text: 'Your article got 15 likes', time: '3 hours ago' }
        ];

        let popup = document.querySelector('.notification-popup');

        if (!popup) {
            popup = document.createElement('div');
            popup.className = 'notification-popup';
            popup.innerHTML = `
                        <div class="notification-header">
                            <h4>Notifications</h4>
                            <button class="clear-notifications">Clear All</button>
                        </div>
                        <div class="notification-list">
                            ${notifications.map(notif => `
                                <div class="notification-item">
                                    <div class="notification-content">
                                        <p>${notif.text}</p>
                                        <small>${notif.time}</small>
                                    </div>
                                    <button class="notification-dismiss">&times;</button>
                                </div>
                            `).join('')}
                        </div>
                    `;

            document.body.appendChild(popup);

            // Position popup
            const btnRect = notificationsBtn.getBoundingClientRect();
            popup.style.cssText = `
                        position: fixed;
                        top: ${btnRect.bottom + 10}px;
                        right: 20px;
                        background: var(--neu-bg);
                        border-radius: 15px;
                        box-shadow: var(--card-shadow);
                        width: 300px;
                        z-index: 10000;
                        animation: slideInUp 0.3s ease;
                    `;

            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                        .notification-header {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 1rem;
                            border-bottom: 1px solid var(--neu-border);
                        }
                        
                        .notification-header h4 {
                            margin: 0;
                            color: var(--neu-text);
                        }
                        
                        .clear-notifications {
                            background: none;
                            border: none;
                            color: var(--neu-accent);
                            cursor: pointer;
                            font-size: 0.9rem;
                        }
                        
                        .notification-list {
                            max-height: 300px;
                            overflow-y: auto;
                        }
                        
                        .notification-item {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            padding: 1rem;
                            border-bottom: 1px solid var(--neu-border);
                            transition: background 0.3s;
                        }
                        
                        .notification-item:hover {
                            background: var(--neu-shadow-dark);
                        }
                        
                        .notification-content p {
                            margin: 0 0 0.25rem 0;
                            color: var(--neu-text);
                        }
                        
                        .notification-content small {
                            color: var(--neu-text);
                            opacity: 0.6;
                            font-size: 0.8rem;
                        }
                        
                        .notification-dismiss {
                            background: none;
                            border: none;
                            color: var(--neu-text);
                            opacity: 0.5;
                            cursor: pointer;
                            font-size: 1.2rem;
                            width: 24px;
                            height: 24px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-radius: 50%;
                            transition: all 0.3s;
                        }
                        
                        .notification-dismiss:hover {
                            background: var(--neu-warning);
                            color: white;
                            opacity: 1;
                        }
                    `;

            document.head.appendChild(style);

            // Close popup when clicking outside
            setTimeout(() => {
                document.addEventListener('click', function closePopup(e) {
                    if (!popup.contains(e.target) && e.target !== notificationsBtn) {
                        popup.remove();
                        style.remove();
                        notificationsBtn.classList.remove('active');
                        document.removeEventListener('click', closePopup);
                    }
                });
            }, 100);

            // Clear notifications
            popup.querySelector('.clear-notifications').addEventListener('click', function () {
                notificationsBtn.querySelector('.notification-badge').style.display = 'none';
                popup.remove();
                style.remove();
                notificationsBtn.classList.remove('active');
            });

            // Dismiss individual notifications
            popup.querySelectorAll('.notification-dismiss').forEach((btn, index) => {
                btn.addEventListener('click', function () {
                    this.closest('.notification-item').remove();
                    const badge = notificationsBtn.querySelector('.notification-badge');
                    const count = parseInt(badge.textContent);
                    if (count > 1) {
                        badge.textContent = count - 1;
                    } else {
                        badge.style.display = 'none';
                    }
                });
            });
        } else {
            popup.remove();
        }
    }

    // Search Functionality
    mobileSearchBtn.addEventListener('click', function () {
        if (window.innerWidth < 768) {
            // Show search in mobile menu
            toggleMobileMenu();
            setTimeout(() => {
                mobileSearchInput.focus();
            }, 400);
        } else {
            // Toggle search bar on desktop/tablet
            searchInput.focus();
        }
    });

    // Search Input Events
    searchInput.addEventListener('input', performSearch);
    mobileSearchInput.addEventListener('input', performSearch);

    function performSearch(e) {
        const query = e.target.value.toLowerCase();
        console.log('Searching for:', query);
        // In a real implementation, this would filter content
    }

    // Active Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            if (this.classList.contains('mobile-nav-item')) {
                toggleMobileMenu();
            }

            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // For dropdown parents
            if (this.parentElement.classList.contains('nav-item')) {
                this.parentElement.querySelector('.nav-link').classList.add('active');
            }
        });
    });

    // Quick Actions
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const action = this.getAttribute('data-action');
            switch (action) {
                case 'github':
                    window.open('https://github.com', '_blank');
                    break;
                case 'linkedin':
                    window.open('https://linkedin.com', '_blank');
                    break;
                case 'download':
                    // Download resume
                    window.open('/resume.pdf', '_blank');
                    break;
                case 'email':
                    window.location.href = 'mailto:hello@example.com';
                    break;
                case 'share':
                    if (navigator.share) {
                        navigator.share({
                            title: 'DevPortfolio',
                            text: 'Check out my portfolio!',
                            url: window.location.href
                        });
                    }
                    break;
                case 'settings':
                    alert('Settings would open here');
                    break;
            }
        });
    });

    // Scroll Behavior
    let lastScrollTop = 0;
    const navHeight = neuNav.offsetHeight;
    const scrollThreshold = 100;

    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > navHeight) {
            // Scrolling down
            neuNav.style.transform = `translateY(-${navHeight}px)`;
        } else {
            // Scrolling up
            neuNav.style.transform = 'translateY(0)';
        }

        // Add shadow when scrolled
        if (scrollTop > scrollThreshold) {
            neuNav.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.15)';
        } else {
            neuNav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        }

        lastScrollTop = scrollTop;
    });

    // Touch gestures for mobile menu
    let touchStartX = 0;
    let touchEndX = 0;

    mobileMenuPanel.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    mobileMenuPanel.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (swipeDistance > swipeThreshold) {
            // Swipe right - close menu
            toggleMobileMenu();
        }
    }

    // Keyboard Navigation
    document.addEventListener('keydown', function (e) {
        // Escape closes mobile menu
        if (e.key === 'Escape' && mobileMenuPanel.classList.contains('active')) {
            toggleMobileMenu();
        }

        // Ctrl+K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });

    // Initialize
    console.log('Enhanced Neumorphic Navbar initialized');
});

// ⚡ Hero Section JavaScript
// Hero Section JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const heroCard = document.getElementById('heroCard');
    const flipCardBtn = document.getElementById('flipCard');
    const viewLiveBtn = document.getElementById('viewLive');
    const playIntroBtn = document.getElementById('playIntro');
    const introModal = document.getElementById('introModal');
    const closeModalBtn = document.getElementById('closeModal');
    const typedText = document.getElementById('typedText');
    const statNumbers = document.querySelectorAll('.stat-number');
    const techOrbs = document.querySelectorAll('.tech-orb');
    const uptimeStat = document.getElementById('uptimeStat');
    const performanceStat = document.getElementById('performanceStat');
    const progressPercent = document.querySelector('.progress-percent');
    const particlesContainer = document.getElementById('particles');

    // Typing Effect
    const words = ['Ideas', 'Vision', 'Business', 'Potential', 'Dreams'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isEnd = false;

    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typedText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentWord.length) {
            isEnd = true;
            isDeleting = true;
            setTimeout(typeEffect, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(typeEffect, 500);
        } else {
            const typeSpeed = isDeleting ? 100 : 150;
            setTimeout(typeEffect, typeSpeed);
        }
    }

    // Start typing effect
    setTimeout(typeEffect, 1000);

    // Animated Counters
    function animateCounters() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target + '+';
                    clearInterval(timer);
                    
                    // Animate fill bars
                    const fillBar = stat.closest('.stat-item').querySelector('.stat-fill');
                    const width = stat.getAttribute('data-count') === '50' ? '90%' : 
                                 stat.getAttribute('data-count') === '5' ? '85%' : '95%';
                    fillBar.style.width = width;
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 16);
        });
    }

    // Animate counters when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelector('.hero-stats').querySelectorAll('.stat-item').forEach(item => {
        observer.observe(item);
    });

    // Card Flip Functionality
    flipCardBtn.addEventListener('click', function() {
        heroCard.classList.toggle('flipped');
        flipCardBtn.innerHTML = heroCard.classList.contains('flipped') 
            ? '<i class="fas fa-code"></i><span>Show Code</span>'
            : '<i class="fas fa-sync-alt"></i><span>Flip View</span>';
    });

    // View Live Preview
    viewLiveBtn.addEventListener('click', function() {
        // In a real implementation, this would open a live preview
        const projectUrl = 'https://example-project.com';
        const newWindow = window.open(projectUrl, '_blank');
        
        if (newWindow) {
            // Animate button
            this.innerHTML = '<i class="fas fa-external-link-alt"></i><span>Opening...</span>';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-external-link-alt"></i><span>Live Preview</span>';
            }, 1000);
        }
    });

    // Play Intro Video
    playIntroBtn.addEventListener('click', function() {
        introModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // In a real implementation, start video playback here
        console.log('Playing intro video...');
    });

    // Close Modal
    closeModalBtn.addEventListener('click', closeModal);
    introModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    function closeModal() {
        introModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Tech Orb Interactions
    techOrbs.forEach(orb => {
        orb.addEventListener('click', function() {
            const tech = this.getAttribute('data-tech');
            
            // Create tech info popup
            const popup = document.createElement('div');
            popup.className = 'tech-popup';
            popup.innerHTML = `
                <div class="popup-content">
                    <h4>${tech}</h4>
                    <p>Click to view ${tech} projects</p>
                </div>
            `;
            
            this.appendChild(popup);
            
            // Remove popup after delay
            setTimeout(() => {
                popup.remove();
                
                // Navigate to filtered projects
                window.location.hash = `#projects?filter=${tech.toLowerCase()}`;
            }, 1500);
        });
    });

    // Live Stats Animation
    function animateLiveStats() {
        let uptime = 99.9;
        let performance = 98;
        let direction = 1;
        
        setInterval(() => {
            // Animate uptime
            uptime += (Math.random() - 0.5) * 0.01;
            uptime = Math.max(99.8, Math.min(100, uptime));
            uptimeStat.textContent = uptime.toFixed(1) + '%';
            
            // Animate performance
            performance += (Math.random() - 0.5) * 0.1;
            performance = Math.max(97, Math.min(99.5, performance));
            performanceStat.textContent = Math.round(performance) + '%';
            
            // Animate progress
            const progressFill = document.querySelector('.progress-fill');
            const progressDot = document.querySelector('.progress-dot');
            let currentPercent = parseFloat(progressPercent.textContent);
            
            if (currentPercent >= 85) direction = -1;
            if (currentPercent <= 65) direction = 1;
            
            currentPercent += direction * 0.1;
            progressPercent.textContent = currentPercent.toFixed(0) + '%';
            progressFill.style.width = currentPercent + '%';
            progressDot.style.left = `calc(${currentPercent}% - 8px)`;
        }, 2000);
    }

    // Start live stats animation
    animateLiveStats();

    // Create Particles
    function createParticles() {
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            // Random size
            const size = Math.random() * 4 + 1;
            
            // Random animation
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;
            
            particle.style.cssText = `
                left: ${x}%;
                top: ${y}%;
                width: ${size}px;
                height: ${size}px;
                animation: floatParticle ${duration}s ease-in-out ${delay}s infinite;
            `;
            
            particlesContainer.appendChild(particle);
        }
        
        // Add particle animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatParticle {
                0%, 100% {
                    transform: translate(0, 0) rotate(0deg);
                    opacity: 0.3;
                }
                25% {
                    transform: translate(20px, -20px) rotate(90deg);
                    opacity: 0.5;
                }
                50% {
                    transform: translate(-20px, 20px) rotate(180deg);
                    opacity: 0.3;
                }
                75% {
                    transform: translate(20px, 20px) rotate(270deg);
                    opacity: 0.5;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Create particles
    createParticles();

    // Scroll Indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    scrollIndicator.addEventListener('click', function() {
        const nextSection = document.querySelector('#projects') || document.querySelector('section:nth-of-type(2)');
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Parallax Effect
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 30;
        const y = (e.clientY / window.innerHeight - 0.5) * 30;
        
        // Move background elements
        document.querySelector('.bg-grid').style.transform = `rotate(15deg) translate(-25%, -25%) translate(${x * 0.2}px, ${y * 0.2}px)`;
        
        // Move floating tech orbs
        techOrbs.forEach((orb, index) => {
            const factor = 0.5 + (index * 0.1);
            orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
        });
        
        // Move hero card slightly
        heroCard.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });

    // Keyboard Navigation
    document.addEventListener('keydown', function(e) {
        // Space to play intro
        if (e.key === ' ' && !introModal.classList.contains('active')) {
            playIntroBtn.click();
            e.preventDefault();
        }
        
        // Escape to close modal
        if (e.key === 'Escape' && introModal.classList.contains('active')) {
            closeModal();
        }
        
        // F to flip card
        if (e.key === 'f' || e.key === 'F') {
            flipCardBtn.click();
        }
    });

    // Initialize
    console.log('Hero section initialized');
});


// ⚡ Projects Section JavaScript
// Projects Section JavaScript
// Simplified Projects JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const projectsGrid = document.getElementById('projectsGrid');
    const categoryButtons = document.querySelectorAll('.cat-btn');
    const viewDetailsButtons = document.querySelectorAll('.view-details');
    const loadMoreBtn = document.getElementById('loadMore');
    const projectModal = document.getElementById('projectModal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalClose = document.querySelector('.modal-close');
    const modalBody = document.querySelector('.modal-body');

    // Project Data
    const projects = [
        {
            title: "E-commerce Platform",
            category: "web",
            status: "live",
            description: "Full-featured online store with payment integration, inventory management, and admin dashboard. Built with modern technologies for optimal performance and scalability.",
            tech: ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
            features: ["User authentication", "Payment processing", "Inventory management", "Admin dashboard", "Responsive design"],
            links: {
                demo: "https://ecommerce.example.com",
                github: "https://github.com/username/ecommerce"
            }
        },
        {
            title: "Analytics Dashboard",
            category: "web",
            status: "live",
            description: "Real-time data visualization dashboard with interactive charts and reporting tools. Provides insights and analytics for business intelligence.",
            tech: ["Vue.js", "TypeScript", "D3.js", "Chart.js", "WebSocket"],
            features: ["Real-time updates", "Interactive charts", "Data export", "Custom reports", "Mobile responsive"],
            links: {
                demo: "https://analytics.example.com",
                github: "https://github.com/username/analytics"
            }
        },
        {
            title: "Fitness Tracker",
            category: "mobile",
            status: "live",
            description: "Mobile fitness app with workout plans, progress tracking, and social features. Helps users achieve their fitness goals with personalized plans.",
            tech: ["React Native", "Firebase", "Redux", "HealthKit"],
            features: ["Workout plans", "Progress tracking", "Social features", "Nutrition tracking", "Push notifications"],
            links: {
                demo: "https://fitness.example.com",
                github: "https://github.com/username/fitness"
            }
        },
        {
            title: "UI Design System",
            category: "design",
            status: "complete",
            description: "Comprehensive design system with components, patterns, and documentation for web applications. Ensures consistency across products.",
            tech: ["Figma", "Storybook", "Design Tokens", "CSS"],
            features: ["Component library", "Design tokens", "Documentation", "Accessibility guidelines", "Responsive patterns"],
            links: {
                demo: "https://design.example.com",
                github: "https://github.com/username/design-system"
            }
        },
        {
            title: "API Gateway",
            category: "web",
            status: "live",
            description: "Scalable API gateway with rate limiting, authentication, and monitoring for microservices. Built for high performance and reliability.",
            tech: ["Node.js", "Express", "Redis", "Docker", "Kubernetes"],
            features: ["Rate limiting", "Authentication", "Monitoring", "Load balancing", "Circuit breaking"],
            links: {
                demo: "https://api.example.com",
                github: "https://github.com/username/api-gateway"
            }
        },
        {
            title: "Portfolio Website",
            category: "design",
            status: "complete",
            description: "Modern portfolio website with animations, responsive design, and interactive elements. Showcases work in an engaging way.",
            tech: ["HTML/CSS", "JavaScript", "GSAP", "Netlify"],
            features: ["Smooth animations", "Responsive design", "Dark mode", "Performance optimized", "SEO friendly"],
            links: {
                demo: "https://portfolio.example.com",
                github: "https://github.com/username/portfolio"
            }
        }
    ];

    // Initialize
    init();

    function init() {
        setupEventListeners();
    }

    function setupEventListeners() {
        // Category filter buttons
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                filterProjects(filter);
                
                // Update active state
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });

        // View details buttons
        viewDetailsButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                showProjectDetails(index);
            });
        });

        // Load more button
        loadMoreBtn.addEventListener('click', loadMoreProjects);

        // Modal close
        modalClose.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', closeModal);

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }

    function filterProjects(category) {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    function showProjectDetails(index) {
        const project = projects[index];
        
        modalBody.innerHTML = `
            <div class="modal-project">
                <div class="modal-header">
                    <h3 class="modal-title">${project.title}</h3>
                    <span class="modal-status ${project.status}">${project.status}</span>
                </div>
                
                <div class="modal-section">
                    <h4>Description</h4>
                    <p>${project.description}</p>
                </div>
                
                <div class="modal-section">
                    <h4>Technologies</h4>
                    <div class="modal-tech">
                        ${project.tech.map(tech => `
                            <span class="tech-tag">${tech}</span>
                        `).join('')}
                    </div>
                </div>
                
                <div class="modal-section">
                    <h4>Key Features</h4>
                    <ul class="modal-features">
                        ${project.features.map(feature => `
                            <li>${feature}</li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="modal-section">
                    <h4>Project Links</h4>
                    <div class="modal-links">
                        <a href="${project.links.demo}" class="modal-link" target="_blank">
                            <i class="fas fa-external-link-alt"></i>
                            <span>Live Demo</span>
                        </a>
                        <a href="${project.links.github}" class="modal-link" target="_blank">
                            <i class="fab fa-github"></i>
                            <span>View Code</span>
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal styles
        addModalStyles();
        
        // Show modal
        projectModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        projectModal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function loadMoreProjects() {
        // Create placeholder for new projects
        const placeholderProjects = [
            {
                title: "Task Management App",
                category: "web",
                status: "in-progress",
                description: "Collaborative task management application with real-time updates and team features."
            },
            {
                title: "Weather Dashboard",
                category: "web",
                status: "live",
                description: "Weather application with forecasts, maps, and historical data visualization."
            },
            {
                title: "Recipe Finder",
                category: "mobile",
                status: "live",
                description: "Mobile app for discovering recipes based on available ingredients."
            }
        ];
        
        // Add new project cards
        placeholderProjects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.dataset.category = project.category;
            card.innerHTML = `
                <div class="card-image">
                    <div class="image-overlay">
                        <div class="project-links">
                            <a href="#" class="project-link" target="_blank">
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                            <a href="#" class="project-link" target="_blank">
                                <i class="fab fa-github"></i>
                            </a>
                        </div>
                    </div>
                </div>
                
                <div class="card-content">
                    <div class="project-header">
                        <h3 class="project-title">${project.title}</h3>
                        <span class="project-status ${project.status}">${project.status}</span>
                    </div>
                    
                    <p class="project-desc">
                        ${project.description}
                    </p>
                    
                    <div class="project-tech">
                        <span class="tech-tag">React</span>
                        <span class="tech-tag">Node.js</span>
                        <span class="tech-tag">MongoDB</span>
                    </div>
                </div>
                
                <div class="card-footer">
                    <button class="view-details">View Details</button>
                </div>
            `;
            
            projectsGrid.appendChild(card);
            
            // Add animation
            card.style.animation = 'fadeIn 0.5s ease';
            
            // Add event listener to new button
            const viewDetailsBtn = card.querySelector('.view-details');
            viewDetailsBtn.addEventListener('click', () => {
                showProjectDetails(Math.floor(Math.random() * projects.length));
            });
        });
        
        // Disable button after loading all projects
        loadMoreBtn.disabled = true;
        loadMoreBtn.innerHTML = '<i class="fas fa-check"></i><span>All Projects Loaded</span>';
        loadMoreBtn.style.opacity = '0.7';
        
        // Show notification
        showNotification('More projects loaded successfully!', 'success');
    }

    function addModalStyles() {
        const styleId = 'modal-internal-styles';
        if (document.getElementById(styleId)) return;
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .modal-project {
                color: var(--neu-text);
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 2rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid rgba(66, 153, 225, 0.1);
            }
            
            .modal-title {
                font-size: 2rem;
                font-weight: 700;
                margin: 0;
            }
            
            .modal-status {
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: 600;
            }
            
            .modal-status.live {
                background: rgba(72, 187, 120, 0.1);
                color: var(--neu-success);
            }
            
            .modal-status.complete {
                background: rgba(66, 153, 225, 0.1);
                color: var(--neu-accent);
            }
            
            .modal-status.in-progress {
                background: rgba(245, 158, 11, 0.1);
                color: #d69e2e;
            }
            
            .modal-section {
                margin-bottom: 2rem;
            }
            
            .modal-section h4 {
                font-size: 1.2rem;
                margin-bottom: 1rem;
                color: var(--neu-accent);
            }
            
            .modal-section p {
                line-height: 1.6;
                opacity: 0.9;
            }
            
            .modal-tech {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
            }
            
            .modal-features {
                list-style: none;
                padding: 0;
            }
            
            .modal-features li {
                padding: 0.5rem 0;
                padding-left: 1.5rem;
                position: relative;
            }
            
            .modal-features li:before {
                content: '✓';
                position: absolute;
                left: 0;
                color: var(--neu-accent);
                font-weight: bold;
            }
            
            .modal-links {
                display: flex;
                gap: 1rem;
            }
            
            .modal-link {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.75rem 1.5rem;
                background: var(--neu-accent);
                color: white;
                border-radius: 12px;
                text-decoration: none;
                font-weight: 600;
                transition: all 0.3s;
            }
            
            .modal-link:hover {
                background: var(--neu-accent-light);
                transform: translateY(-2px);
            }
        `;
        
        document.head.appendChild(style);
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--neu-bg);
                border-radius: 12px;
                padding: 1rem 1.5rem;
                box-shadow: 
                    8px 8px 16px var(--neu-shadow-dark),
                    -8px -8px 16px var(--neu-shadow-light);
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                animation: slideInUp 0.3s ease;
            }
            
            @keyframes slideInUp {
                from {
                    transform: translateY(100%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                color: var(--neu-text);
                font-weight: 500;
            }
            
            .notification-content i {
                color: var(--neu-${type === 'success' ? 'success' : 'accent'});
            }
        `;
        
        document.head.appendChild(style);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutDown 0.3s ease forwards';
            setTimeout(() => {
                notification.remove();
                style.remove();
            }, 300);
        }, 3000);
        
        // Add slideOutDown animation
        const animationStyle = document.createElement('style');
        animationStyle.textContent = `
            @keyframes slideOutDown {
                from {
                    transform: translateY(0);
                    opacity: 1;
                }
                to {
                    transform: translateY(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(animationStyle);
        
        setTimeout(() => {
            animationStyle.remove();
        }, 300);
    }
});




// ------------------------------------

// Clean Skills JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Animate progress bars on scroll
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                
                // Reset width to 0
                progressBar.style.width = '0%';
                
                // Animate to target width
                setTimeout(() => {
                    progressBar.style.transition = 'width 1.5s ease';
                    progressBar.style.width = width;
                }, 300);
                
                // Unobserve after animation
                observer.unobserve(progressBar);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    });
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
    
    // Add hover effect to skill tags
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = 
                '8px 8px 16px var(--neu-shadow-dark), -8px -8px 16px var(--neu-shadow-light)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 
                '4px 4px 8px var(--neu-shadow-dark), -4px -4px 8px var(--neu-shadow-light)';
        });
    });
    
    // Add click effect to experience cards
    const experienceCards = document.querySelectorAll('.experience-card');
    
    experienceCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add pulse animation
            this.style.animation = 'pulse 0.5s ease';
            
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });
    });
    
    // Add CSS for pulse animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: translateY(-5px) scale(1); }
            50% { transform: translateY(-5px) scale(1.02); }
            100% { transform: translateY(-5px) scale(1); }
        }
    `;
    document.head.appendChild(style);
    
    // Simple skill level tooltips
    const skillLevels = document.querySelectorAll('.skill-level');
    
    skillLevels.forEach(level => {
        level.addEventListener('mouseenter', function() {
            const text = this.textContent;
            const descriptions = {
                'Expert': 'Extensive experience, can teach others',
                'Advanced': 'Comfortable with complex tasks',
                'Intermediate': 'Can work independently',
                'Beginner': 'Learning, can complete basic tasks'
            };
            
            const description = descriptions[text] || 'Skill level indicator';
            
            // Create tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'skill-tooltip';
            tooltip.textContent = description;
            tooltip.style.cssText = `
                position: absolute;
                background: var(--neu-text);
                color: var(--neu-bg);
                padding: 0.5rem 1rem;
                border-radius: 8px;
                font-size: 0.8rem;
                font-weight: 500;
                white-space: nowrap;
                z-index: 1000;
                transform: translateY(-100%) translateX(-50%);
                margin-top: -10px;
                left: 50%;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            `;
            
            this.appendChild(tooltip);
        });
        
        level.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.skill-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
    
    // Initialize animations on page load
    setTimeout(() => {
        // Animate skill categories sequentially
        const skillCategories = document.querySelectorAll('.skill-category');
        
        skillCategories.forEach((category, index) => {
            setTimeout(() => {
                category.style.opacity = '0';
                category.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    category.style.transition = 'all 0.5s ease';
                    category.style.opacity = '1';
                    category.style.transform = 'translateY(0)';
                }, 100);
            }, index * 200);
        });
    }, 500);
});