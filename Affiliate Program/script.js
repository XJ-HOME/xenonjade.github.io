// Main application script
class XenonJadeAffiliateApp {
    constructor() {
        this.init();
    }

    init() {
        this.initializeFeatherIcons();
        this.setupEventListeners();
        this.loadFAQData();
        this.setupSmoothScrolling();
        this.initializeAnimations();
    }

    initializeFeatherIcons() {
        // Initialize Feather icons after DOM is loaded
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    setupEventListeners() {
        // Apply button click handlers
        const applyButtonIds = [
            'apply-btn-header',
            'apply-btn-hero', 
            'apply-btn-benefits', // Added new button ID
            'apply-btn-main',
            'apply-btn-final'
        ];

        applyButtonIds.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', this.handleApplyClick.bind(this));
            }
        });

        // Footer apply now link
        document.querySelectorAll('.apply-now-footer').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default anchor behavior if it's an #apply link
                const applySection = document.getElementById('apply');
                if (applySection) {
                     // First scroll to the apply section smoothly
                    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                    const elementPosition = applySection.offsetTop - headerHeight - 20;
                    window.scrollTo({
                        top: elementPosition,
                        behavior: 'smooth'
                    });
                    // Optionally, trigger the modal directly if that's preferred after scroll
                    // this.handleApplyClick(); 
                } else {
                    this.handleApplyClick(); // Fallback to modal if #apply section isn't found
                }
            });
        });


        // Smooth scroll for navigation links handled by setupSmoothScrolling
        // FAQ toggle functionality
        document.addEventListener('click', (e) => {
            const faqQuestion = e.target.closest('.faq-question');
            if (faqQuestion) {
                this.toggleFAQ(faqQuestion);
            }
        });
    }

    handleApplyClick() {
        // Simulate application form modal or redirect
        Analytics.trackApplyClick('generic_apply_button'); // Track click
        this.showApplicationModal();
    }

    showApplicationModal() {
        // Remove existing modal if any
        const existingModal = document.querySelector('.xenonjade-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'xenonjade-modal fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4 transition-opacity duration-300 opacity-0';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl p-8 max-w-md w-full relative shadow-2xl transform scale-95 transition-transform duration-300">
                <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors" onclick="this.closest('.xenonjade-modal').remove()">
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
                <div class="text-center">
                    <div class="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                           <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-4">Ready to Apply?</h3>
                    <p class="text-gray-600 mb-6">
                        Thank you for your interest in the XenonJade Affiliate Program! 
                        Our application process is quick and easy.
                    </p>
                    <p class="text-gray-600 mb-8">
                        To begin, please contact our affiliate team. We'll guide you through the next steps:
                    </p>
                    <a href="mailto:affiliates@xenonjade.com?subject=Affiliate Program Application Inquiry" 
                       class="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300 ease-in-out inline-block transform hover:scale-105 shadow-md hover:shadow-lg">
                        Contact Affiliate Team to Apply
                    </a>
                     <p class="text-xs text-gray-500 mt-6">
                        We'll typically respond within 1-2 business days.
                    </p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        // Trigger transitions
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modal.querySelector('.bg-white').classList.remove('scale-95');
        }, 10); // Small delay to ensure CSS transitions apply
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    async loadFAQData() {
        try {
            const response = await fetch('faq-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const faqData = await response.json();
            this.renderFAQ(faqData.faqs);
        } catch (error) {
            console.warn('Could not load FAQ data:', error, 'Using fallback.');
            this.renderFAQ(this.getFallbackFAQData());
        }
    }

    getFallbackFAQData() { // Kept for robustness
        return [
            { question: "How do I track my clicks and earnings?", answer: "Once approved, you'll gain access to our dedicated affiliate dashboard where you can track clicks, conversions, sales, and commissions in real-time. The dashboard provides comprehensive analytics to help you optimize your promotional efforts." },
            { question: "When and how do I get paid?", answer: "Payments are processed monthly via PayPal or US bank transfer. The minimum payout threshold is $50-$100. You'll receive detailed payment reports and can track your earnings through the affiliate dashboard." },
            { question: "Can I get free products for review?", answer: "Yes! We have a Free Sample Program for qualifying affiliates. Applications are evaluated based on audience size, content quality, and relevance to our brand. This program allows you to experience our products firsthand before promoting them." },
            { question: "Are there specific content guidelines I need to follow?", answer: "Yes, we require high-quality, relevant content focused on vinyl, audio equipment, or music lifestyle. Most importantly, you MUST include clear FTC disclosure in ALL promotional content indicating your material connection to XenonJade." },
            { question: "What kind of marketing materials are available?", answer: "Our affiliate resource library includes product images, logos, banners, product descriptions, and suggested promotional copy. All materials are professionally designed and optimized for various platforms and formats." },
            { question: "Who can I contact for support?", answer: "For all affiliate program questions, support, and assistance, please contact our dedicated affiliate team at affiliates@xenonjade.com. We're committed to helping our partners succeed." }
        ];
    }

    renderFAQ(faqData) {
        const container = document.getElementById('faq-container');
        if (!container) return;

        container.innerHTML = faqData.map((faq, index) => `
            <div class="faq-item bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div class="faq-question cursor-pointer p-5 md:p-6 flex justify-between items-center" data-index="${index}">
                    <span class="font-semibold text-gray-800 text-base md:text-lg">${faq.question}</span>
                    <svg class="faq-icon w-5 h-5 text-gray-500 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
                <div class="faq-answer text-gray-600 px-5 md:px-6 pb-5 leading-relaxed" data-index="${index}" style="display: none; max-height: 0; overflow: hidden; transition: max-height 0.5s ease-in-out, padding-bottom 0.5s ease-in-out;">
                    ${faq.answer}
                </div>
            </div>
        `).join('');
        
        if (typeof feather !== 'undefined') {
            feather.replace(); // Ensure icons are replaced if any are in FAQ answers
        }
    }

    toggleFAQ(questionElement) {
        const index = questionElement.getAttribute('data-index');
        const answer = document.querySelector(`.faq-answer[data-index="${index}"]`);
        const icon = questionElement.querySelector('.faq-icon');
        
        if (!answer) return;

        const isOpening = answer.style.display === 'none';

        // Close all other FAQ items
        document.querySelectorAll('.faq-answer.show').forEach(openAnswer => {
            if (openAnswer !== answer) {
                openAnswer.style.maxHeight = '0';
                openAnswer.style.paddingBottom = '0';
                setTimeout(() => { openAnswer.style.display = 'none'; }, 500);
                openAnswer.classList.remove('show');
                const otherIcon = openAnswer.previousElementSibling.querySelector('.faq-icon');
                if (otherIcon) otherIcon.classList.remove('rotate-180');
            }
        });
        
        if (isOpening) {
            answer.style.display = 'block';
            // Calculate scrollHeight after display is block but before setting max-height
            const scrollHeight = answer.scrollHeight;
            answer.style.maxHeight = scrollHeight + 'px';
            answer.style.paddingBottom = '1.25rem'; // Tailwind's pb-5
            answer.classList.add('show');
            if (icon) icon.classList.add('rotate-180');
        } else {
            answer.style.maxHeight = '0';
            answer.style.paddingBottom = '0';
            setTimeout(() => { answer.style.display = 'none'; }, 500);
            answer.classList.remove('show');
            if (icon) icon.classList.remove('rotate-180');
        }
    }

    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            // Exclude footer apply now links if they are handled separately
            if (link.classList.contains('apply-now-footer')) return;

            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === "#") { // Prevent scrolling for empty hash links
                    e.preventDefault();
                    return;
                }
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    const header = document.querySelector('header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    const elementPosition = target.offsetTop - headerHeight - 20; // 20px offset for padding
                    
                    window.scrollTo({
                        top: elementPosition,
                        behavior: 'smooth'
                    });
                     // Optionally close mobile menu if one exists
                }
            });
        });
    }

    initializeAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up-on-scroll');
                    entry.target.classList.remove('opacity-0'); // Ensure visibility
                    obs.unobserve(entry.target); // Optional: stop observing after animation
                }
            });
        }, observerOptions);

        document.querySelectorAll('section > div, section > h2, section > p, .grid > div, .space-y-8 > div').forEach(el => {
             el.classList.add('opacity-0'); // Initially hide for animation
            observer.observe(el);
        });

        // Add this style to CSS or a <style> tag in HTML for the animation
        // Opacity 0 is handled by JS adding/removing the class for better control
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInUpScroll {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-up-on-scroll { animation: fadeInUpScroll 0.6s ease-out forwards; }
            .opacity-0 { opacity: 0; }
        `;
        document.head.appendChild(style);
    }
}

// Analytics and tracking functions (Simplified)
class Analytics {
    static trackEvent(eventName, eventDetails = {}) {
        console.log('Analytics Event:', eventName, eventDetails);
    }
    static trackApplyClick(buttonLocation) {
        this.trackEvent('affiliate_apply_click', { button_location: buttonLocation, timestamp: new Date().toISOString() });
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new XenonJadeAffiliateApp();
    Analytics.trackEvent('page_load', { page: 'affiliate_program', timestamp: new Date().toISOString() });
});

// Handle window resize for responsive adjustments
window.addEventListener('resize', () => {
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});

// Export classes for potential external use (optional)
window.XenonJadeAppGlobal = {
    Analytics
};

