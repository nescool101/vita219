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
        src: 'optimized_pics/vistaMar_optimized.webp',
        caption: { es: 'Vista del Apartamento', en: 'Apartment View' }
    },
    {
        src: 'optimized_pics/sala_optimized.webp',
        caption: { es: 'Sala', en: 'Living Room' }
    },
    {
        src: 'optimized_pics/sala2_optimized.webp',
        caption: { es: 'Sala Vista 2', en: 'Living Room View 2' }
    },
    {
        src: 'optimized_pics/comedor_optimized.webp',
        caption: { es: 'Comedor', en: 'Dining Room' }
    },
    {
        src: 'optimized_pics/cocina2_optimized.webp',
        caption: { es: 'Cocina Equipada', en: 'Equipped Kitchen' }
    },
    {
        src: 'optimized_pics/habitacion_optimized.webp',
        caption: { es: 'Habitación Principal', en: 'Master Bedroom' }
    },
    {
        src: 'optimized_pics/hab1_optimized.webp',
        caption: { es: 'Habitación 1', en: 'Bedroom 1' }
    },
    {
        src: 'optimized_pics/hab111_optimized.webp',
        caption: { es: 'Habitación Vista', en: 'Bedroom View' }
    },
    {
        src: 'optimized_pics/habitv_optimized.webp',
        caption: { es: 'Habitación con Vista', en: 'Bedroom with View' }
    },
    {
        src: 'optimized_pics/bath_optimized.webp',
        caption: { es: 'Baño', en: 'Bathroom' }
    },
    {
        src: 'optimized_pics/bath1_optimized.webp',
        caption: { es: 'Baño 1', en: 'Bathroom 1' }
    },
    {
        src: 'optimized_pics/bath2_optimized.webp',
        caption: { es: 'Baño 2', en: 'Bathroom 2' }
    },
    {
        src: 'optimized_pics/lavadero_optimized.webp',
        caption: { es: 'Zona de Lavado', en: 'Laundry Area' }
    },
    {
        src: 'optimized_pics/balcon_optimized.webp',
        caption: { es: 'Balcón con Vista al Mar', en: 'Balcony with Sea View' }
    },
    {
        src: 'optimized_pics/sea_optimized.webp',
        caption: { es: 'Vista al Mar', en: 'Sea View' }
    },
    {
        src: 'optimized_pics/piscina_optimized.webp',
        caption: { es: 'Piscina del Edificio', en: 'Building Pool' }
    },
    {
        src: 'optimized_pics/afuera_optimized.webp',
        caption: { es: 'Vista Exterior', en: 'Exterior View' }
    },
    {
        src: 'optimized_pics/afuera2_optimized.webp',
        caption: { es: 'Vista Exterior 2', en: 'Exterior View 2' }
    },
    {
        src: 'optimized_pics/out2_optimized.webp',
        caption: { es: 'Área Externa', en: 'External Area' }
    },
    {
        src: 'optimized_pics/rodadero_optimized.webp',
        caption: { es: 'El Rodadero', en: 'El Rodadero' }
    },
    {
        src: 'optimized_pics/zona_optimized.webp',
        caption: { es: 'Zona del Edificio', en: 'Building Area' }
    },
    {
        src: 'optimized_pics/natas_optimized.webp',
        caption: { es: 'Amenidades', en: 'Amenities' }
    },
    {
        src: 'optimized_pics/asadir_optimized.webp',
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

// =====================
// Availability Calendar
// =====================
const ICAL_URL = 'https://www.airbnb.com.co/calendar/ical/1518789764474235542.ics?t=f78ac2e8eb1845c4bee17569c6fed2dc';
const CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?url='
];

let reservedRanges = [];
let calendarOffset = 0;

const MONTH_NAMES = {
    es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};

const DAY_NAMES = {
    es: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'],
    en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
};

function parseIcal(icalText) {
    const events = [];
    const eventBlocks = icalText.split('BEGIN:VEVENT');
    for (let i = 1; i < eventBlocks.length; i++) {
        const block = eventBlocks[i].split('END:VEVENT')[0];
        const dtstart = block.match(/DTSTART;VALUE=DATE:(\d{8})/);
        const dtend = block.match(/DTEND;VALUE=DATE:(\d{8})/);
        if (dtstart && dtend) {
            const start = parseIcalDate(dtstart[1]);
            const end = parseIcalDate(dtend[1]);
            events.push({ start, end });
        }
    }
    return events;
}

function parseIcalDate(str) {
    return new Date(
        parseInt(str.substring(0, 4)),
        parseInt(str.substring(4, 6)) - 1,
        parseInt(str.substring(6, 8))
    );
}

function isDateReserved(date) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    for (const range of reservedRanges) {
        if (d >= range.start && d < range.end) return true;
    }
    return false;
}

function renderCalendar() {
    const container = document.getElementById('calendarMonths');
    if (!container) return;
    container.innerHTML = '';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'es';
    const months = MONTH_NAMES[lang] || MONTH_NAMES.es;
    const days = DAY_NAMES[lang] || DAY_NAMES.es;

    for (let m = 0; m < 2; m++) {
        const targetDate = new Date(today.getFullYear(), today.getMonth() + calendarOffset + m, 1);
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startOffset = (firstDay === 0 ? 6 : firstDay - 1);

        const monthEl = document.createElement('div');
        monthEl.className = 'calendar-month';

        const header = document.createElement('div');
        header.className = 'calendar-month-header';
        header.textContent = months[month] + ' ' + year;
        monthEl.appendChild(header);

        const grid = document.createElement('div');
        grid.className = 'calendar-grid';

        days.forEach(function(day) {
            const dh = document.createElement('div');
            dh.className = 'calendar-day-header';
            dh.textContent = day;
            grid.appendChild(dh);
        });

        for (let i = 0; i < startOffset; i++) {
            const empty = document.createElement('div');
            empty.className = 'calendar-day empty';
            grid.appendChild(empty);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = d;

            const thisDate = new Date(year, month, d);
            if (thisDate.getFullYear() === today.getFullYear() &&
                thisDate.getMonth() === today.getMonth() &&
                thisDate.getDate() === today.getDate()) {
                dayEl.classList.add('today');
            } else if (thisDate < today) {
                dayEl.classList.add('past');
            } else if (isDateReserved(thisDate)) {
                dayEl.classList.add('reserved');
            } else {
                dayEl.classList.add('available');
            }

            grid.appendChild(dayEl);
        }

        monthEl.appendChild(grid);
        container.appendChild(monthEl);
    }

    const titleEl = document.getElementById('calTitle');
    if (titleEl) {
        const first = new Date(today.getFullYear(), today.getMonth() + calendarOffset, 1);
        const second = new Date(today.getFullYear(), today.getMonth() + calendarOffset + 1, 1);
        titleEl.textContent = months[first.getMonth()] + ' - ' + months[second.getMonth()] + ' ' + second.getFullYear();
    }
}

function changeMonth(dir) {
    calendarOffset += dir;
    if (calendarOffset < 0) calendarOffset = 0;
    renderCalendar();
}

async function fetchCalendar() {
    for (const proxy of CORS_PROXIES) {
        try {
            const response = await fetch(proxy + encodeURIComponent(ICAL_URL));
            if (response.ok) {
                const text = await response.text();
                if (text.includes('BEGIN:VCALENDAR')) {
                    reservedRanges = parseIcal(text);
                    renderCalendar();
                    return;
                }
            }
        } catch (e) {
            // Try next proxy
        }
    }
    // If all proxies fail, render calendar without reservation data
    renderCalendar();
}

document.addEventListener('DOMContentLoaded', function() {
    fetchCalendar();
});

