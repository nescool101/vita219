let currentLang = 'es';

function toggleLanguage() {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    updateLanguage();
    
    const langText = document.querySelector('.lang-text');
    langText.textContent = currentLang === 'es' ? 'EN' : 'ES';
}

function updateLanguage() {
    const elements = document.querySelectorAll('[data-es][data-en]');
    
    elements.forEach(element => {
        const text = currentLang === 'es' ? element.getAttribute('data-es') : element.getAttribute('data-en');
        
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = text;
        } else if (element.tagName === 'BUTTON' || element.tagName === 'A') {
            element.textContent = text;
            
            if (element.querySelector('.whatsapp-icon')) {
                element.innerHTML = '<span class="whatsapp-icon">📱</span><span>' + text + '</span>';
            }
        } else {
            element.textContent = text;
        }
    });
    
    document.documentElement.lang = currentLang;
    
    localStorage.setItem('vita219-lang', currentLang);
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
    
    const toggle = document.querySelector('.mobile-menu-toggle');
    toggle.classList.toggle('active');
}

function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const message = formData.get('message');
    
    const emailBody = currentLang === 'es' 
        ? `Hola, mi nombre es ${name}.\n\nTeléfono: ${phone}\nCorreo: ${email}\n\nMensaje:\n${message}\n\nEstoy interesado en el proyecto Vita 219.`
        : `Hello, my name is ${name}.\n\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}\n\nI am interested in the Vita 219 project.`;
    
    const mailtoLink = `mailto:nescool101@gmail.com?subject=${encodeURIComponent('Vita 219 - Consulta')}&body=${encodeURIComponent(emailBody)}`;
    
    window.location.href = mailtoLink;
    
    const whatsappMessage = currentLang === 'es'
        ? `Hola, soy ${name}. Estoy interesado en Vita 219. ${message}`
        : `Hello, I am ${name}. I am interested in Vita 219. ${message}`;
    
    const whatsappLink = `https://wa.me/573124894828?text=${encodeURIComponent(whatsappMessage)}`;
    
    setTimeout(() => {
        if (confirm(currentLang === 'es' ? '¿Desea también contactarnos por WhatsApp?' : 'Would you also like to contact us via WhatsApp?')) {
            window.open(whatsappLink, '_blank');
        }
    }, 1000);
    
    form.reset();
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('vita219-lang');
    if (savedLang && savedLang !== currentLang) {
        currentLang = savedLang;
        updateLanguage();
        const langText = document.querySelector('.lang-text');
        langText.textContent = currentLang === 'es' ? 'EN' : 'ES';
    }
    
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                const mobileMenu = document.querySelector('.nav-links');
                if (mobileMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });
    
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.style.boxShadow = 'var(--shadow)';
        } else if (currentScroll > lastScroll) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
            navbar.style.boxShadow = 'var(--shadow-lg)';
        }
        
        lastScroll = currentScroll;
    });
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.feature-card, .amenity-item, .place-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
    
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: zoom-out;
                animation: fadeIn 0.3s ease;
            `;
            
            const enlargedImg = document.createElement('img');
            enlargedImg.src = img.src;
            enlargedImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                border-radius: 10px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            `;
            
            overlay.appendChild(enlargedImg);
            document.body.appendChild(overlay);
            
            overlay.addEventListener('click', () => {
                overlay.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => overlay.remove(), 300);
            });
        });
    });
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});

