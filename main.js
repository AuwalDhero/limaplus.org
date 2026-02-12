// Lima-Plus Main JavaScript
// Interactive components and animations

class LimaPlusApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollAnimations();
        this.setupInteractiveComponents();
        this.setupFormValidation();
        this.setupMobileMenu();
        this.initializeAnimations();
    }

    // Navigation functionality
    setupNavigation() {
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Active navigation highlighting
        window.addEventListener('scroll', () => {
            this.updateActiveNavigation();
        });
    }

    updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Scroll animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    // Interactive components
    setupInteractiveComponents() {
        this.setupClimateCalculator();
        this.setupImpactMetrics();
        this.setupResourceLibrary();
        this.setupPartnershipForm();
    }

    // Climate Resilience Calculator
    setupClimateCalculator() {
        const calculator = document.getElementById('climate-calculator');
        if (!calculator) return;

        const districtSelect = calculator.querySelector('#district');
        const cropSelect = calculator.querySelector('#crop');
        const seasonSelect = calculator.querySelector('#season');
        const resultsDiv = calculator.querySelector('#calculator-results');

        const climateData = {
            'central': {
                'maize': { 'rainy': 'High yield potential', 'dry': 'Moderate drought risk' },
                'beans': { 'rainy': 'Excellent conditions', 'dry': 'Water stress likely' },
                'coffee': { 'rainy': 'Optimal growing', 'dry': 'Requires irrigation' }
            },
            'western': {
                'maize': { 'rainy': 'Good yield expected', 'dry': 'High drought risk' },
                'beans': { 'rainy': 'Very good conditions', 'dry': 'Moderate stress' },
                'banana': { 'rainy': 'Excellent growth', 'dry': 'Needs mulching' }
            },
            'northern': {
                'sorghum': { 'rainy': 'Drought-resistant variety', 'dry': 'Well adapted' },
                'millet': { 'rainy': 'Good production', 'dry': 'Traditional resilience' },
                'maize': { 'rainy': 'Variable yield', 'dry': 'High risk area' }
            }
        };

        const updateResults = () => {
            const district = districtSelect?.value;
            const crop = cropSelect?.value;
            const season = seasonSelect?.value;

            if (district && crop && season && climateData[district]?.[crop]?.[season]) {
                const recommendation = climateData[district][crop][season];
                const riskLevel = recommendation.includes('risk') ? 'high' : 
                                 recommendation.includes('stress') ? 'medium' : 'low';
                
                resultsDiv.innerHTML = `
                    <div class="bg-white p-6 rounded-lg shadow-lg mt-4">
                        <h4 class="text-lg font-semibold text-gray-800 mb-2">Climate Resilience Assessment</h4>
                        <div class="flex items-center mb-3">
                            <div class="w-4 h-4 rounded-full mr-2 ${
                                riskLevel === 'low' ? 'bg-green-500' :
                                riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                            }"></div>
                            <span class="text-sm font-medium capitalize">${riskLevel} Risk</span>
                        </div>
                        <p class="text-gray-700">${recommendation}</p>
                        <div class="mt-4 p-3 bg-green-50 rounded">
                            <p class="text-sm text-green-800">
                                <strong>Recommendation:</strong> ${this.getRecommendation(district, crop, season)}
                            </p>
                        </div>
                    </div>
                `;
                
                // Animate results
                anime({
                    targets: resultsDiv.firstElementChild,
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 500,
                    easing: 'easeOutQuart'
                });
            }
        };

        [districtSelect, cropSelect, seasonSelect].forEach(select => {
            if (select) select.addEventListener('change', updateResults);
        });
    }

    getRecommendation(district, crop, season) {
        const recommendations = {
            'central-maize-rainy': 'Apply nitrogen fertilizer in splits for optimal yield',
            'central-maize-dry': 'Consider drought-resistant varieties and mulching',
            'western-banana-rainy': 'Maintain good drainage to prevent root rot',
            'northern-sorghum-dry': 'Your traditional practices are well-suited for this climate'
        };
        
        return recommendations[`${district}-${crop}-${season}`] || 
               'Consider climate-smart agricultural practices and regular monitoring.';
    }

    // Impact Metrics Dashboard
    setupImpactMetrics() {
        const metricsContainer = document.getElementById('impact-metrics');
        if (!metricsContainer) return;

        const metrics = [
            { id: 'farmers-reached', value: 0, target: 1200, suffix: '+' },
            { id: 'yield-increase', value: 0, target: 45, suffix: '%' },
            { id: 'communities', value: 0, target: 12, suffix: '' },
            { id: 'co2-reduced', value: 0, target: 1200, suffix: ' tons' }
        ];

        const animateCounter = (element, target, suffix) => {
            anime({
                targets: { value: 0 },
                value: target,
                duration: 2000,
                easing: 'easeOutQuart',
                update: function(anim) {
                    element.textContent = Math.round(anim.animatables[0].target.value) + suffix;
                }
            });
        };

        // Trigger animation when metrics section is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    metrics.forEach(metric => {
                        const element = document.getElementById(metric.id);
                        if (element) {
                            animateCounter(element, metric.target, metric.suffix);
                        }
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(metricsContainer);
    }

    // Resource Library
    setupResourceLibrary() {
        const library = document.getElementById('resource-library');
        if (!library) return;

        const searchInput = library.querySelector('#resource-search');
        const categoryFilter = library.querySelector('#category-filter');
        const resourceGrid = library.querySelector('#resource-grid');

        const resources = [
            {
                title: 'Climate-Smart Agriculture Guide',
                category: 'practices',
                description: 'Comprehensive guide to climate adaptation techniques',
                type: 'PDF',
                icon: '🌱'
            },
            {
                title: 'Drought-Resistant Crop Varieties',
                category: 'crops',
                description: 'List of recommended seed varieties for different regions',
                type: 'Document',
                icon: '🌾'
            },
            {
                title: 'Water Conservation Techniques',
                category: 'water',
                description: 'Methods for efficient water use in smallholder farming',
                type: 'Guide',
                icon: '💧'
            },
            {
                title: 'Soil Health Assessment',
                category: 'soil',
                description: 'Simple methods to test and improve soil quality',
                type: 'Toolkit',
                icon: '🌍'
            },
            {
                title: 'Weather Monitoring Basics',
                category: 'climate',
                description: 'Understanding weather patterns for better planning',
                type: 'Course',
                icon: '🌤️'
            },
            {
                title: 'Market Price Tracking',
                category: 'market',
                description: 'Tools for monitoring agricultural commodity prices',
                type: 'App',
                icon: '📊'
            }
        ];

        const renderResources = (filteredResources) => {
            resourceGrid.innerHTML = filteredResources.map(resource => `
                <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                    <div class="text-3xl mb-3">${resource.icon}</div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">${resource.title}</h3>
                    <p class="text-gray-600 text-sm mb-3">${resource.description}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">${resource.type}</span>
                        <button class="text-green-600 hover:text-green-800 text-sm font-medium">Access →</button>
                    </div>
                </div>
            `).join('');
        };

        const filterResources = () => {
            const searchTerm = searchInput?.value.toLowerCase() || '';
            const selectedCategory = categoryFilter?.value || 'all';

            const filtered = resources.filter(resource => {
                const matchesSearch = resource.title.toLowerCase().includes(searchTerm) ||
                                    resource.description.toLowerCase().includes(searchTerm);
                const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
                return matchesSearch && matchesCategory;
            });

            renderResources(filtered);
        };

        if (searchInput) searchInput.addEventListener('input', filterResources);
        if (categoryFilter) categoryFilter.addEventListener('change', filterResources);

        // Initial render
        renderResources(resources);
    }

    // Partnership Form
    setupPartnershipForm() {
        const form = document.getElementById('partnership-form');
        if (!form) return;

        const steps = form.querySelectorAll('.form-step');
        const nextBtns = form.querySelectorAll('.next-step');
        const prevBtns = form.querySelectorAll('.prev-step');
        const progressBar = form.querySelector('.progress-bar');
        let currentStep = 0;

        const showStep = (stepIndex) => {
            steps.forEach((step, index) => {
                step.classList.toggle('active', index === stepIndex);
            });
            
            if (progressBar) {
                const progress = ((stepIndex + 1) / steps.length) * 100;
                progressBar.style.width = `${progress}%`;
            }
        };

        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    showStep(currentStep);
                }
            });
        });

        prevBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (currentStep > 0) {
                    currentStep--;
                    showStep(currentStep);
                }
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitPartnershipForm(form);
        });

        // Initialize first step
        showStep(0);
    }

    submitPartnershipForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4';
        successMessage.innerHTML = `
            <strong>Thank you!</strong> Your partnership inquiry has been received. 
            We'll contact you within 2 business days.
        `;
        
        form.appendChild(successMessage);
        
        // Animate success message
        anime({
            targets: successMessage,
            opacity: [0, 1],
            translateY: [-20, 0],
            duration: 500,
            easing: 'easeOutQuart'
        });

        // Reset form after delay
        setTimeout(() => {
            form.reset();
            successMessage.remove();
        }, 5000);
    }

    // Form validation
    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('input', () => {
                    if (input.classList.contains('error')) {
                        this.validateField(input);
                    }
                });
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'This field is required';
        } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        } else if (field.type === 'tel' && value && !this.isValidPhone(value)) {
            isValid = false;
            message = 'Please enter a valid phone number';
        }

        this.showFieldValidation(field, isValid, message);
        return isValid;
    }

    showFieldValidation(field, isValid, message) {
        const errorElement = field.parentNode.querySelector('.error-message');
        
        if (isValid) {
            field.classList.remove('error');
            field.classList.add('valid');
            if (errorElement) errorElement.remove();
        } else {
            field.classList.remove('valid');
            field.classList.add('error');
            
            if (!errorElement) {
                const error = document.createElement('div');
                error.className = 'error-message text-red-500 text-sm mt-1';
                error.textContent = message;
                field.parentNode.appendChild(error);
            } else {
                errorElement.textContent = message;
            }
        }
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    isValidPhone(phone) {
        return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/\s/g, ''));
    }

    // Mobile menu
    setupMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                menuToggle.classList.toggle('active');
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                    mobileMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            });
        }
    }

    // Initialize animations
    initializeAnimations() {
        // Typewriter effect for hero text
        const heroText = document.querySelector('.hero-typewriter');
        if (heroText && typeof Typed !== 'undefined') {
            new Typed(heroText, {
                strings: [
                    'Building Climate Resilience for Uganda\'s Smallholder Farmers',
                    'Empowering Communities Through Smart Agriculture',
                    'Adapting Agriculture for a Changing Climate'
                ],
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 2000,
                loop: true,
                showCursor: true,
                cursorChar: '|'
            });
        }

        // Floating animation for hero elements
        anime({
            targets: '.hero-floating',
            translateY: [-10, 10],
            duration: 3000,
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutSine'
        });

        // Stagger animation for feature cards
        anime({
            targets: '.feature-card',
            translateY: [50, 0],
            opacity: [0, 1],
            delay: anime.stagger(200),
            duration: 800,
            easing: 'easeOutQuart'
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LimaPlusApp();
});

// Utility functions
const utils = {
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LimaPlusApp, utils };
}
document.querySelectorAll('nav a[href^="#"]')
