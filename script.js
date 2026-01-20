// Data paths (relative to portfolio folder)
const DATA_PATH = '../portfolio/data/';

// Global state
let aboutData = null;
let skillsData = null;
let projectsData = null;
let experienceData = null;
let educationData = null;
let certificatesData = null;

// Typewriter Effect for Hero Profession
function typewriterEffect() {
    const professions = [
        'Data Analyst',
        'AI Engineer',
        'SQL Developer',
        'Business Analyst'
    ];
    const element = document.getElementById('typewriter');
    if (!element) return;
    
    let professionIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentProfession = professions[professionIndex];
        
        if (!isDeleting && charIndex <= currentProfession.length) {
            element.textContent = currentProfession.substring(0, charIndex);
            charIndex++;
            setTimeout(type, 150); // Typing speed
        } else if (!isDeleting && charIndex > currentProfession.length) {
            // Pause before deleting
            setTimeout(() => {
                isDeleting = true;
                type();
            }, 2000);
        } else if (isDeleting && charIndex > 0) {
            element.textContent = currentProfession.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(type, 100); // Deleting speed
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            professionIndex = (professionIndex + 1) % professions.length; // Move to next profession
            setTimeout(type, 500); // Pause before typing next profession
        }
    }
    
    type();
}

// Show More Certificates Functionality
function initShowMoreCerts() {
    const showMoreBtn = document.getElementById('showMoreCerts');
    const certificatesSubsection = document.querySelector('.certificates-subsection');
    
    if (!showMoreBtn || !certificatesSubsection) return;
    
    const allCertCards = certificatesSubsection.querySelectorAll('.cert-card');
    
    // If there are more than 3 certificates, hide the extra ones
    if (allCertCards.length > 3) {
        allCertCards.forEach((cert, index) => {
            if (index >= 3) {
                cert.classList.add('hidden-cert');
            }
        });
        
        // Show the button
        showMoreBtn.style.display = 'inline-flex';
        
        // Add click event
        showMoreBtn.addEventListener('click', function() {
            const hiddenCerts = certificatesSubsection.querySelectorAll('.hidden-cert');
            const showText = this.querySelector('.show-text');
            const hideText = this.querySelector('.hide-text');
            
            hiddenCerts.forEach(cert => {
                cert.classList.toggle('show');
            });
            
            this.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                showText.style.display = 'none';
                hideText.style.display = 'inline';
            } else {
                showText.style.display = 'inline';
                hideText.style.display = 'none';
            }
        });
    } else {
        // Hide the button if 3 or fewer certificates
        showMoreBtn.style.display = 'none';
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    typewriterEffect();
    initTheme();
    initNavigation();
    initParticles();
    initAnimations();
    initProjectTabs();
    initShowMoreCerts();
    loadAllData();
    updateFooter();
});

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleMobile = document.getElementById('themeToggleMobile');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    html.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

// Navigation
function initNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBackdrop = document.getElementById('menuBackdrop');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    const nav = document.getElementById('navigation');
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            menuBackdrop.classList.toggle('active');
            menuToggle.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        });
    }
    
    // Close menu when clicking backdrop
    if (menuBackdrop) {
        menuBackdrop.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            menuBackdrop.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                mobileMenu.classList.remove('open');
                menuBackdrop.classList.remove('active');
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                }
                document.body.style.overflow = '';
            }
        });
    });
    
    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Update active nav link
        updateActiveNavLink();
        
        lastScroll = currentScroll;
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.pageYOffset + 150;
    
    let currentSection = '';
    
    // Special case: if at the very top of the page, highlight hero/home
    if (scrollPosition < 300) {
        currentSection = 'hero';
    } else {
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop - 200 && scrollPosition < sectionTop + sectionHeight - 200) {
                currentSection = sectionId;
            }
        });
    }
    
    // Only update if we found a section
    if (currentSection) {
        document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
}

// Project Tabs
function initProjectTabs() {
    const tabs = document.querySelectorAll('.project-tab');
    const projectCards = document.querySelectorAll('.project-bento-card');
    
    // Show DEA category by default
    projectCards.forEach(card => {
        if (card.dataset.category === 'DEA') {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Filter project cards
            projectCards.forEach(card => {
                if (card.dataset.category === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Particles Animation
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    particle.style.animationDelay = Math.random() * 5 + 's';
    container.appendChild(particle);
}

// Scroll Animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('[class*="fade"], [class*="slide"]').forEach(el => {
        observer.observe(el);
    });
}

// Data Loading
async function loadAllData() {
    try {
        await Promise.all([
            loadAboutData(),
            loadSkillsData(),
            loadProjectsData(),
            loadExperienceData(),
            loadEducationData(),
            loadCertificatesData()
        ]);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

async function loadAboutData() {
    try {
        const response = await fetch(DATA_PATH + 'about.json');
        aboutData = await response.json();
        populateAboutSection();
        populateHeroSection();
        populateContactSection();
    } catch (error) {
        console.error('Error loading about data:', error);
    }
}

async function loadSkillsData() {
    try {
        const response = await fetch(DATA_PATH + 'skills.json');
        const data = await response.json();
        skillsData = data.skills || data;
        populateSkillsSection();
    } catch (error) {
        console.error('Error loading skills data:', error);
    }
}

async function loadProjectsData() {
    try {
        const response = await fetch(DATA_PATH + 'projects.json');
        const data = await response.json();
        projectsData = data.projects || data;
        populateProjectsSection();
    } catch (error) {
        console.error('Error loading projects data:', error);
    }
}

async function loadExperienceData() {
    try {
        const response = await fetch(DATA_PATH + 'experience.json');
        const data = await response.json();
        experienceData = data.experience || data;
        populateExperienceSection();
    } catch (error) {
        console.error('Error loading experience data:', error);
    }
}

async function loadEducationData() {
    try {
        const response = await fetch(DATA_PATH + 'education.json');
        const data = await response.json();
        educationData = data.education || data;
        populateEducationSection();
    } catch (error) {
        console.error('Error loading education data:', error);
    }
}

async function loadCertificatesData() {
    try {
        const response = await fetch(DATA_PATH + 'certificates.json');
        const data = await response.json();
        certificatesData = data.certificates || data;
        populateCertificatesSection();
    } catch (error) {
        console.error('Error loading certificates data:', error);
    }
}

// Populate Sections
function populateHeroSection() {
    if (!aboutData) return;
    
    document.getElementById('heroName').textContent = aboutData.name || 'Meet Patel';
    document.getElementById('heroTagline').textContent = aboutData.tagline || '';
    
    // Rotating titles
    const titles = ["Full Stack Developer", "Frontend Expert", "Problem Solver", "UI/UX Enthusiast"];
    let titleIndex = 0;
    const heroTitle = document.getElementById('heroTitle');
    
    setInterval(() => {
        titleIndex = (titleIndex + 1) % titles.length;
        heroTitle.style.opacity = '0';
        setTimeout(() => {
            heroTitle.textContent = titles[titleIndex];
            heroTitle.style.opacity = '1';
        }, 250);
    }, 3000);
    
    // Social links
    const socialLinks = document.getElementById('socialLinks');
    socialLinks.innerHTML = '';
    
    if (aboutData.social) {
        if (aboutData.social.github) {
            socialLinks.innerHTML += `<a href="${aboutData.social.github}" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i></a>`;
        }
        if (aboutData.social.linkedin) {
            socialLinks.innerHTML += `<a href="${aboutData.social.linkedin}" target="_blank" rel="noopener noreferrer"><i class="fab fa-linkedin"></i></a>`;
        }
        if (aboutData.social.twitter) {
            socialLinks.innerHTML += `<a href="${aboutData.social.twitter}" target="_blank" rel="noopener noreferrer"><i class="fab fa-twitter"></i></a>`;
        }
        if (aboutData.email) {
            socialLinks.innerHTML += `<a href="mailto:${aboutData.email}"><i class="fas fa-envelope"></i></a>`;
        }
    }
}

function populateAboutSection() {
    if (!aboutData) return;
    
    document.getElementById('aboutLocation').textContent = aboutData.location || 'Houston, TX';
    document.getElementById('aboutRole').textContent = aboutData.role || 'Full Stack Developer';
    document.getElementById('aboutBio').textContent = aboutData.bio || '';
    
    // Stats
    const statsGrid = document.getElementById('statsGrid');
    if (aboutData.stats) {
        statsGrid.innerHTML = aboutData.stats.map(stat => `
            <div class="stat-card">
                <div class="stat-number" data-target="${stat.value}">${stat.value}+</div>
                <div class="stat-label">${stat.label}</div>
            </div>
        `).join('');
        
        // Animate counters
        animateCounters();
    }
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + '+';
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + '+';
            }
        }, 30);
    });
}

function populateSkillsSection() {
    if (!skillsData || !Array.isArray(skillsData)) return;
    
    const skillsGrid = document.getElementById('skillsGrid');
    skillsGrid.innerHTML = skillsData.map((skill, index) => `
        <div class="skill-card" style="animation-delay: ${index * 0.1}s">
            <div class="skill-header">
                <span class="skill-name">${skill.name}</span>
                <span class="skill-level">${skill.level}%</span>
            </div>
            <div class="skill-bar">
                <div class="skill-progress" style="width: ${skill.level}%"></div>
            </div>
        </div>
    `).join('');
}

function populateProjectsSection() {
    if (!projectsData || !Array.isArray(projectsData)) return;
    
    // Get unique tags
    const allTags = [...new Set(projectsData.flatMap(p => p.tags || []))];
    
    // Create filter buttons
    const filterButtons = document.getElementById('projectFilters');
    filterButtons.innerHTML = `
        <button class="filter-btn active" data-filter="all">All</button>
        ${allTags.map(tag => `<button class="filter-btn" data-filter="${tag}">${tag}</button>`).join('')}
    `;
    
    // Add filter event listeners
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProjects(btn.getAttribute('data-filter'));
        });
    });
    
    // Display projects
    displayProjects(projectsData);
}

function displayProjects(projects) {
    const projectsGrid = document.getElementById('projectsGrid');
    projectsGrid.innerHTML = projects.map((project, index) => `
        <div class="project-card" style="animation-delay: ${index * 0.1}s">
            <img src="${project.image || 'https://via.placeholder.com/400x200'}" alt="${project.title}" class="project-image">
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tags">
                    ${(project.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${project.github ? `<a href="${project.github}" target="_blank" class="project-link"><i class="fab fa-github"></i> Code</a>` : ''}
                    ${project.demo ? `<a href="${project.demo}" target="_blank" class="project-link"><i class="fas fa-external-link-alt"></i> Demo</a>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function filterProjects(filter) {
    if (filter === 'all') {
        displayProjects(projectsData);
    } else {
        const filtered = projectsData.filter(p => p.tags && p.tags.includes(filter));
        displayProjects(filtered);
    }
}

function populateExperienceSection() {
    if (!experienceData || !Array.isArray(experienceData)) return;
    
    const timeline = document.getElementById('experienceTimeline');
    timeline.innerHTML = experienceData.map((exp, index) => `
        <div class="timeline-item" style="animation-delay: ${index * 0.1}s">
            <div class="timeline-dot"></div>
            <div class="experience-card">
                <div class="experience-header">
                    <h3 class="experience-company">${exp.company}</h3>
                    <p class="experience-role">${exp.role}</p>
                    <div class="experience-meta">
                        <span><i class="fas fa-calendar"></i> ${exp.duration}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${exp.location}</span>
                    </div>
                </div>
                <p class="experience-description">${exp.description}</p>
                ${exp.responsibilities ? `
                    <ul class="experience-responsibilities">
                        ${exp.responsibilities.map(r => `<li>${r}</li>`).join('')}
                    </ul>
                ` : ''}
                ${exp.technologies ? `
                    <div class="experience-techs">
                        ${exp.technologies.map(t => `<span class="tag">${t}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function populateEducationSection() {
    if (!educationData || !Array.isArray(educationData)) return;
    
    const educationGrid = document.getElementById('educationGrid');
    educationGrid.innerHTML = educationData.map((edu, index) => `
        <div class="education-card" style="animation-delay: ${index * 0.1}s">
            <div class="education-header">
                <div class="education-icon"><i class="fas fa-graduation-cap"></i></div>
                <div class="education-info">
                    <h3>${edu.degree}</h3>
                    <p class="education-school">${edu.school}</p>
                </div>
            </div>
            <p class="education-meta">${edu.duration} • ${edu.location}</p>
            <p class="education-description">${edu.description || ''}</p>
            ${edu.achievements ? `
                <ul class="education-achievements">
                    ${edu.achievements.map(a => `<li>${a}</li>`).join('')}
                </ul>
            ` : ''}
        </div>
    `).join('');
}

function populateCertificatesSection() {
    if (!certificatesData || !Array.isArray(certificatesData)) return;
    
    const certificatesGrid = document.getElementById('certificatesGrid');
    certificatesGrid.innerHTML = certificatesData.map((cert, index) => `
        <div class="certificate-card" style="animation-delay: ${index * 0.1}s">
            <div class="certificate-icon"><i class="fas fa-award"></i></div>
            <h3 class="certificate-name">${cert.name}</h3>
            <p class="certificate-issuer">${cert.issuer}</p>
            <p class="certificate-date">${cert.date}</p>
            ${cert.skills ? `
                <div class="certificate-skills">
                    ${cert.skills.map(s => `<span class="tag">${s}</span>`).join('')}
                </div>
            ` : ''}
            ${cert.credentialUrl ? `<a href="${cert.credentialUrl}" target="_blank" class="certificate-link">View Credential →</a>` : ''}
        </div>
    `).join('');
}

function populateContactSection() {
    if (!aboutData) return;
    
    const contactEmail = document.getElementById('contactEmail');
    const contactLocation = document.getElementById('contactLocation');
    
    if (contactEmail && aboutData.email) {
        contactEmail.textContent = aboutData.email;
        contactEmail.href = `mailto:${aboutData.email}`;
    }
    
    if (contactLocation && aboutData.location) {
        contactLocation.textContent = aboutData.location;
    }
    
    // Contact social
    const contactSocial = document.getElementById('contactSocial');
    contactSocial.innerHTML = '';
    
    if (aboutData.social) {
        if (aboutData.social.github) {
            contactSocial.innerHTML += `
                <a href="${aboutData.social.github}" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-github"></i> GitHub
                </a>
            `;
        }
        if (aboutData.social.linkedin) {
            contactSocial.innerHTML += `
                <a href="${aboutData.social.linkedin}" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-linkedin"></i> LinkedIn
                </a>
            `;
        }
        if (aboutData.social.twitter) {
            contactSocial.innerHTML += `
                <a href="${aboutData.social.twitter}" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-twitter"></i> Twitter
                </a>
            `;
        }
    }
}

function updateFooter() {
    const currentYear = document.getElementById('currentYear');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    
    const footerName = document.getElementById('footerName');
    if (footerName && aboutData) {
        footerName.textContent = aboutData.name || 'Meet Patel';
    }
}

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('.form-submit-btn') || e.target.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    
    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    const formData = new FormData(e.target);
    
    try {
        // Replace with your FormSpree endpoint URL
        const response = await fetch('https://formspree.io/f/mjkzjjna', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            // Show success message
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            e.target.reset();
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        // Show error message
        showNotification('Oops! Something went wrong. Please try again or email me directly.', 'error');
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

function showNotification(message, type) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.form-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `form-notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Insert notification after form
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(notification, form.nextSibling);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Flip Card Function
function flipCard(button) {
    const card = button.closest('.flip-card');
    card.classList.toggle('flipped');
}
// Experience Responsibilities Modal
const experienceResponsibilities = {
    exp1: {
        title: 'Graduate Teaching & Research Assistant',
        company: 'University of Houston Clear-Lake',
        location: 'Houston, TX, USA',
        duration: 'Aug 2025 — Jan 2026',
        responsibilities: [
            'Assisted in teaching data analytics and SAP courses to graduate and undergraduate students',
            'Assisting with hands-on labs (Wireshark, Packet Tracer, SAP S/4 HANA, SAP Analytics Cloud)',
            'Grading assignments, projects, and exams fairly and in a timely manner.',
            'Conducted research on Agentic AI applications',
            'Guiding discussions on networking, ERP systems, and information systems strategy.',
            'Mentored undergraduate students in data science projects and research initiatives',
            'Collaborating with faculty to enhance student learning outcomes',
            'Collaborated with faculty on research projects involving machine learning and predictive analytics'
        ]
    },
    exp2: {
        title: 'Data Analyst',
        company: 'Archi Farming Equipment',
        location: 'Onsite - India',
        duration: 'Jan 2023 — Dec 2023',
        responsibilities: [
            'Built time series forecasting models in Python (Pandas) to predict monthly and seasonal demand, improving forecast accuracy by 22% and reducing stock-outs by 18%.',
            'Automated sales and expense reports, integrating real-time revenue and cost data into Tableau, saving 15 hours per week',
            'Improved data accuracy by 85% by automating data validation and transformation, reducing vendor transaction errors',
            'Performed EDA, trend analysis, seasonality decomposition, and feature engineering on 3+ years of historical data, identifying peak demand cycles and optimizing production planning by 15%.',
            'Developed interactive Power BI and Tableau dashboards and automated SQL-Python reporting pipelines, reducing manual reporting effort by 40% and supporting weekly decision-making for 10+ stakeholders',
            'Increased customer engagement by optimizing marketing campaigns through A/B testing on email promotions'
        ]
    },
    exp3: {
        title: 'Data Analyst - Intern',
        company: 'Atmiya Developers',
        location: 'Remote -India',
        duration: 'Oct 2022 — Dec 2022',
        responsibilities: [
            'Analyzed structured and semi-structured datasets using Microsoft Excel, SQL, and Python, supporting data-driven decision-making across product and engineering teams.',
            'Performed data cleaning, data transformation, and data validation using Excel formulas, SQL queries, and Python (Pandas, NumPy) to improve data accuracy and consistency.',
            'Learn & Developed interactive dashboards and reports using Power BI / Tableau to track key performance indicators (KPIs) and business metrics.',
            'Learned & Applied how to automate basic data ETL piplines using Python scripts and SQL.'
        ]
    }
};

function openResponsibilitiesModal(expId) {
    const modal = document.getElementById('responsibilitiesModal');
    const modalBody = document.getElementById('modalBody');
    const exp = experienceResponsibilities[expId];
    
    if (!exp) return;
    
    // Build modal content
    modalBody.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title gradient-text">${exp.title}</h2>
            <p class="modal-subtitle">${exp.company}</p>
            <div class="modal-meta">
                <span><i class="fas fa-map-marker-alt"></i> ${exp.location}</span>
            </div>
            <div class="modal-meta">
                <span><i class="fas fa-calendar-alt"></i> ${exp.duration}</span>
            </div>
        </div>
        <div class="modal-body">
            <h3 class="modal-section-title">Key Responsibilities & Achievements</h3>
            <ul class="modal-responsibilities">
                ${exp.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
            </ul>
        </div>
    `;
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeResponsibilitiesModal() {
    const modal = document.getElementById('responsibilitiesModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeResponsibilitiesModal();
    }
});