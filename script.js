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
    
    // Initialize lightbox functionality
    initializeLightbox();
    
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

// Lightbox functionality
let currentImageIndex = 0;
const galleryImages = [
    {
        src: 'optimized_pics/vistaMar_optimized.jpg',
        caption: { es: 'Vista del Apartamento', en: 'Apartment View' }
    },
    {
        src: 'optimized_pics/sala_optimized.jpg',
        caption: { es: 'Sala', en: 'Living Room' }
    },
    {
        src: 'optimized_pics/sala2_optimized.jpg',
        caption: { es: 'Sala Vista 2', en: 'Living Room View 2' }
    },
    {
        src: 'optimized_pics/comedor_optimized.jpg',
        caption: { es: 'Comedor', en: 'Dining Room' }
    },
    {
        src: 'optimized_pics/cocina2_optimized.jpg',
        caption: { es: 'Cocina Equipada', en: 'Equipped Kitchen' }
    },
    {
        src: 'optimized_pics/habitacion_optimized.jpg',
        caption: { es: 'Habitación Principal', en: 'Master Bedroom' }
    },
    {
        src: 'optimized_pics/hab1_optimized.jpg',
        caption: { es: 'Habitación 1', en: 'Bedroom 1' }
    },
    {
        src: 'optimized_pics/hab111_optimized.jpg',
        caption: { es: 'Habitación Vista', en: 'Bedroom View' }
    },
    {
        src: 'optimized_pics/habitv_optimized.jpg',
        caption: { es: 'Habitación con Vista', en: 'Bedroom with View' }
    },
    {
        src: 'optimized_pics/bath_optimized.jpg',
        caption: { es: 'Baño', en: 'Bathroom' }
    },
    {
        src: 'optimized_pics/bath1_optimized.jpg',
        caption: { es: 'Baño 1', en: 'Bathroom 1' }
    },
    {
        src: 'optimized_pics/bath2_optimized.jpg',
        caption: { es: 'Baño 2', en: 'Bathroom 2' }
    },
    {
        src: 'optimized_pics/lavadero_optimized.jpg',
        caption: { es: 'Zona de Lavado', en: 'Laundry Area' }
    },
    {
        src: 'optimized_pics/balcon_optimized.jpg',
        caption: { es: 'Balcón con Vista al Mar', en: 'Balcony with Sea View' }
    },
    {
        src: 'optimized_pics/sea_optimized.jpg',
        caption: { es: 'Vista al Mar', en: 'Sea View' }
    },
    {
        src: 'optimized_pics/piscina_optimized.jpg',
        caption: { es: 'Piscina del Edificio', en: 'Building Pool' }
    },
    {
        src: 'optimized_pics/afuera_optimized.jpg',
        caption: { es: 'Vista Exterior', en: 'Exterior View' }
    },
    {
        src: 'optimized_pics/afuera2_optimized.jpg',
        caption: { es: 'Vista Exterior 2', en: 'Exterior View 2' }
    },
    {
        src: 'optimized_pics/out2_optimized.jpg',
        caption: { es: 'Área Externa', en: 'External Area' }
    },
    {
        src: 'optimized_pics/rodadero_optimized.jpg',
        caption: { es: 'El Rodadero', en: 'El Rodadero' }
    },
    {
        src: 'optimized_pics/zona_optimized.jpg',
        caption: { es: 'Zona del Edificio', en: 'Building Area' }
    },
    {
        src: 'optimized_pics/natas_optimized.jpg',
        caption: { es: 'Amenidades', en: 'Amenities' }
    },
    {
        src: 'optimized_pics/asadir_optimized.jpg',
        caption: { es: 'Instalaciones', en: 'Facilities' }
    }
];

function initializeLightbox() {
    // Add keyboard event listener for arrow keys and escape
    document.addEventListener('keydown', (e) => {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.style.display === 'block') {
            switch(e.key) {
                case 'ArrowLeft':
                    changeImage(-1);
                    break;
                case 'ArrowRight':
                    changeImage(1);
                    break;
                case 'Escape':
                    closeLightbox();
                    break;
            }
        }
    });
}

function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCounter = document.getElementById('lightbox-counter');
    
    const currentImage = galleryImages[currentImageIndex];
    
    lightboxImage.src = currentImage.src;
    lightboxCaption.textContent = currentImage.caption[currentLang];
    lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
    
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

function changeImage(direction) {
    currentImageIndex += direction;
    
    // Loop around if at the beginning or end
    if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    } else if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    }
    
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCounter = document.getElementById('lightbox-counter');
    
    const currentImage = galleryImages[currentImageIndex];
    
    // Add fade effect
    lightboxImage.style.opacity = '0.5';
    
    setTimeout(() => {
        lightboxImage.src = currentImage.src;
        lightboxCaption.textContent = currentImage.caption[currentLang];
        lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
        lightboxImage.style.opacity = '1';
    }, 150);
}

