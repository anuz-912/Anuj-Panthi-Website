// Theme handling
const themeToggleBtn = document.querySelector('.theme-toggle');
const toggleIcon = document.querySelector('.toggle-icon');

// Check for saved theme preference or use system preference
const getCurrentTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Apply the theme
const setTheme = (theme) => {
    document.body.classList.add('theme-transition');
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    toggleIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    setTimeout(() => document.body.classList.remove('theme-transition'), 500);
};

// Initialize theme
setTheme(getCurrentTheme());

// Toggle theme on button click
themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// Mobile menu toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => navLinks.classList.toggle('active'));

document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container') && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
    }
});

// Animate skill bars when they come into view
const animateSkillBars = () => {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
    });
};

// Intersection Observer for skill bars animation
const skillsSection = document.getElementById('skills');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkillBars();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

observer.observe(skillsSection);

// Particles.js configuration
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: getCurrentTheme() === 'dark' ? '#3b82f6' : '#2563eb' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: {
            enable: true,
            distance: 150,
            color: getCurrentTheme() === 'dark' ? '#3b82f6' : '#2563eb',
            opacity: 0.4,
            width: 1
        },
        move: { enable: true, speed: 2, random: true, out_mode: 'out' }
    },
    interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true }
    },
    retina_detect: true
});

// Update particles color when theme changes
const updateParticlesColor = (theme) => {
    if (window.pJSDom?.[0]?.pJS) {
        const pJS = window.pJSDom[0].pJS;
        const color = theme === 'dark' ? '#3b82f6' : '#2563eb';
        pJS.particles.color.value = color;
        pJS.particles.line_linked.color = color;
        pJS.fn.particlesRefresh();
    }
};

// Listen for theme changes
const themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            updateParticlesColor(currentTheme);
        }
    });
});
themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            navLinks.classList.remove('active');
        }
    });
});

// Scroll animation for sections
const animateOnScroll = () => {
    document.querySelectorAll('.academic-card, .project-card, .skill-category').forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < window.innerHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

document.querySelectorAll('.academic-card, .project-card, .skill-category').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// GitHub stats animation
const animateGitHubStats = () => {
    const repoCount = document.getElementById('repo-count');
    const followers = document.getElementById('followers');
    if (repoCount && followers) {
        let repoCountNum = 0, followersNum = 0;
        const targetRepoCount = 5, targetFollowers = 0;
        const incrementStats = () => {
            if (repoCountNum < targetRepoCount) {
                repoCountNum += Math.ceil(targetRepoCount / 50);
                repoCount.textContent = repoCountNum + '+';
            }
            if (followersNum < targetFollowers) {
                followersNum += Math.ceil(targetFollowers / 50);
                followers.textContent = followersNum + '+';
            }
            if (repoCountNum < targetRepoCount || followersNum < targetFollowers) requestAnimationFrame(incrementStats);
        };
        incrementStats();
    }
};

const githubSection = document.getElementById('github');
const githubObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateGitHubStats();
            githubObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
githubObserver.observe(githubSection);

// Floating elements animation enhancement
document.querySelectorAll('.floating-element').forEach((element, index) => {
    element.style.animationDelay = `${index * 3}s`;
});

// ✅ Typing animation for hero text
const heroMain = document.querySelector('.hero-main');
const heroSub = document.querySelector('.hero-sub');

if (heroMain && heroSub) {
    const mainText = heroMain.textContent.trim();
    heroMain.textContent = ''; // clear for typing
    heroSub.style.opacity = '0'; // hide subtitle

    let i = 0;
    const typeMain = () => {
        if (i < mainText.length) {
            heroMain.textContent += mainText.charAt(i);
            i++;
            setTimeout(typeMain, 50);
        } else {
            // Fade in subtitle after typing finishes
            setTimeout(() => {
                heroSub.style.opacity = '1';
                heroSub.style.transition = 'opacity 1s ease';
            }, 500);
        }
    };
    setTimeout(typeMain, 500);
}

// Hover effects for project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(-5px) scale(1)';
    });
});

// Throttle scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            animateOnScroll();
            scrollTimeout = null;
        }, 100);
    }
});

// Error handling for particles.js
window.addEventListener('error', (e) => {
    if (e.message.includes('particles')) {
        console.warn('Particles.js failed to load, continuing without background animation.');
    }
});

// Fade-in animation on load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio website loaded successfully!');
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
