// Variables globales
let visitorCount = 1;
// currentLang is already declared in script.js

// EmailJS Configuration - Alternative approach for GitHub Pages
const EMAILJS_CONFIG = {
    publicKey: 'Xx4Cu2Aj_miGE08FJ', // Your EmailJS public key
    serviceId: 'service_412zyze', // You need to create this service in EmailJS
    templateId: 'template_k60k75j' // Your actual template ID from EmailJS
};


// Datos constantes del propietario
const OWNER_DATA = {
    name: 'Nestor Fernando Alvarez Gomez',
    idType: 'CC',
    idNumber: '1015398879',
    idDate: '2005-04-11',
    apartment: '505',
    phone: '3124894828',
    email: 'nescool101@gmail.com',
    tourismRegistry: '262595'
};

// Código de autorización válido
const VALID_AUTH_CODE = 'nesc@ovitas';

// Zona horaria fija para evitar desfases (COT/EST sin DST)
const TIME_ZONE = 'America/Bogota';

// Utilidades locales para fechas en formato yyyy-mm-dd sin TZ
function toLocalYYYYMMDD(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function parseDateInput(value) {
    if (!value) return null;
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1); // Fecha local a medianoche
}

function getZonedTodayMidnight() {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('es-ES', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
    const y = Number(parts.find(p => p.type === 'year').value);
    const m = Number(parts.find(p => p.type === 'month').value);
    const d = Number(parts.find(p => p.type === 'day').value);
    return new Date(y, m - 1, d);
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Configurar fechas por defecto y restricciones (manejo sin desfase de zona horaria)
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    // Establecer fecha mínima de inicio como ayer (permitir hoy y ayer)
    const today = getZonedTodayMidnight();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    startDateInput.min = toLocalYYYYMMDD(yesterday);
    // Para fin, como mínimo permitir ayer también (luego validamos lógica contra inicio)
    endDateInput.min = toLocalYYYYMMDD(yesterday);

    // No establecer valores por defecto - dejar campos vacíos
    
    // Configurar validación de fechas
    setupDateValidation();
    
    // Configurar transformación de placa a mayúsculas
    const plateInput = document.getElementById('vehiclePlate');
    if (plateInput) {
        plateInput.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
        });
    }
    
    // Configurar validación del formulario
    setupFormValidation();
    
    // Inicializar EmailJS si está disponible
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }
});

// Configurar validación de fechas
function setupDateValidation() {
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    
    startDate.addEventListener('change', function() {
        if (!this.value) return; // Si no hay valor, no validar
        
        const startValue = parseDateInput(this.value);
        const endValue = endDate.value ? parseDateInput(endDate.value) : null;
        const today = getZonedTodayMidnight();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Validar que la fecha no sea anterior a ayer
        if (startValue < yesterday) {
            alert(currentLang === 'es' 
                ? 'La fecha de inicio no puede ser anterior a ayer' 
                : 'The start date cannot be earlier than yesterday');
            this.value = '';
            return;
        }
        
        // Actualizar fecha de fin si es necesaria
        if (endValue && endValue <= startValue) {
            endDate.value = '';
        }
        
        endDate.min = this.value;
    });
    
    endDate.addEventListener('change', function() {
        if (!this.value) return; // Si no hay valor, no validar
        
        const startValue = startDate.value ? parseDateInput(startDate.value) : null;
        const endValue = parseDateInput(this.value);
        const today = getZonedTodayMidnight();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Validar que la fecha no sea anterior a ayer
        if (endValue < yesterday) {
            alert(currentLang === 'es' 
                ? 'La fecha de finalización no puede ser anterior a ayer' 
                : 'The end date cannot be earlier than yesterday');
            this.value = '';
            return;
        }
        
        // Validar que la fecha de fin sea posterior a la de inicio
        if (startValue && endValue <= startValue) {
            alert(currentLang === 'es' 
                ? 'La fecha de finalización debe ser posterior a la fecha de inicio' 
                : 'The end date must be after the start date');
            this.value = '';
        }
    });
}

// Configurar validación del formulario
function setupFormValidation() {
    const form = document.getElementById('authorizationForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });

    // Check URL parameters for authorization code
    const urlParams = new URLSearchParams(window.location.search);
    const authCodeFromUrl = urlParams.get('auth') || urlParams.get('code');
    
    if (authCodeFromUrl) {
        const authCodeInput = document.getElementById('authCode');
        if (authCodeInput) {
            authCodeInput.value = authCodeFromUrl;
            // Lock the field if it matches the valid code
            if (authCodeFromUrl === VALID_AUTH_CODE) {
                authCodeInput.readOnly = true;
                authCodeInput.style.backgroundColor = '#e8f5e8';
                authCodeInput.style.border = '2px solid #22c55e';
                
                // Add a small indicator
                const indicator = document.createElement('small');
                indicator.style.color = '#22c55e';
                indicator.style.fontWeight = 'bold';
                indicator.textContent = currentLang === 'es' ? '✓ Código válido' : '✓ Valid code';
                authCodeInput.parentNode.appendChild(indicator);
            }
        }
    }
}

// Agregar visitante
function addVisitor() {
    visitorCount++;
    const container = document.getElementById('visitorsContainer');
    
    const visitorDiv = document.createElement('div');
    visitorDiv.className = 'visitor-entry';
    visitorDiv.innerHTML = `
        <div class="visitor-header">
            <h4 data-es="Visitante ${visitorCount}" data-en="Visitor ${visitorCount}">Visitante ${visitorCount}</h4>
            <button type="button" class="remove-visitor" onclick="removeVisitor(this)" data-es="Eliminar" data-en="Remove">Eliminar</button>
        </div>
        <div class="form-grid">
            <div class="form-group">
                <label for="visitorName${visitorCount}" data-es="Nombre Completo" data-en="Full Name">Nombre Completo</label>
                <input type="text" id="visitorName${visitorCount}" name="visitorName[]" required>
            </div>
            <div class="form-group">
                <label for="visitorIdType${visitorCount}" data-es="Tipo de Documento" data-en="Document Type">Tipo de Documento</label>
                <select id="visitorIdType${visitorCount}" name="visitorIdType[]" required>
                    <option value="" data-es="Seleccionar" data-en="Select">Seleccionar</option>
                    <option value="CC" data-es="Cédula de Ciudadanía (CC)" data-en="Citizenship ID (CC)">Cédula de Ciudadanía (CC)</option>
                    <option value="TI" data-es="Tarjeta de Identidad (TI)" data-en="Identity Card (TI)">Tarjeta de Identidad (TI)</option>
                    <option value="RC" data-es="Registro Civil (RC)" data-en="Civil Registry (RC)">Registro Civil (RC)</option>
                    <option value="CE" data-es="Cédula de Extranjería (CE)" data-en="Foreigner ID (CE)">Cédula de Extranjería (CE)</option>
                </select>
            </div>
            <div class="form-group">
                <label for="visitorIdNumber${visitorCount}" data-es="Número de Documento" data-en="Document Number">Número de Documento</label>
                <input type="text" id="visitorIdNumber${visitorCount}" name="visitorIdNumber[]" required>
            </div>
            <div class="form-group">
                <label for="visitorAge${visitorCount}" data-es="Edad" data-en="Age">Edad</label>
                <input type="number" id="visitorAge${visitorCount}" name="visitorAge[]" min="0" max="120" required>
            </div>
        </div>
    `;
    
    container.appendChild(visitorDiv);
    
    // Aplicar traducciones si es necesario
    if (currentLang === 'en') {
        updateLanguage();
    }
    
    // Mostrar botón de eliminar en todos los visitantes si hay más de uno
    updateRemoveButtons();
}

// Remover visitante
function removeVisitor(button) {
    const visitorEntry = button.closest('.visitor-entry');
    
    if (document.querySelectorAll('.visitor-entry').length > 1) {
        visitorEntry.classList.add('removing');
        setTimeout(() => {
            visitorEntry.remove();
            updateVisitorNumbers();
            updateRemoveButtons();
        }, 300);
    } else {
        alert('Debe haber al menos un visitante autorizado');
    }
}

// Actualizar numeración de visitantes
function updateVisitorNumbers() {
    const visitors = document.querySelectorAll('.visitor-entry');
    visitors.forEach((visitor, index) => {
        const header = visitor.querySelector('.visitor-header h4');
        header.textContent = `Visitante ${index + 1}`;
    });
    visitorCount = visitors.length;
}

// Actualizar botones de eliminar
function updateRemoveButtons() {
    const removeButtons = document.querySelectorAll('.remove-visitor');
    const shouldShow = removeButtons.length > 1;
    
    removeButtons.forEach(button => {
        button.style.display = shouldShow ? 'block' : 'none';
    });
}

// Mostrar/ocultar sección de vehículo
function toggleVehicleSection() {
    const checkbox = document.getElementById('hasVehicle');
    const section = document.getElementById('vehicleSection');
    const vehicleInputs = section.querySelectorAll('input, select');
    
    if (checkbox.checked) {
        section.style.display = 'block';
        vehicleInputs.forEach(input => {
            if (input.id !== 'vehicleType') {
                input.required = true;
            }
        });
    } else {
        section.style.display = 'none';
        vehicleInputs.forEach(input => {
            input.required = false;
            input.value = '';
        });
    }
}

// Validar formulario
function validateForm() {
    const form = document.getElementById('authorizationForm');
    const formData = new FormData(form);
    
    // Validar código de autorización
    const authCode = formData.get('authCode');
    if (!authCode || authCode.trim() !== VALID_AUTH_CODE) {
        alert(currentLang === 'es' 
            ? 'Código de autorización no válido' 
            : 'Invalid authorization code');
        return false;
    }
    
    // Validar fechas (sin desfase y permitiendo ayer)
    const startDate = parseDateInput(formData.get('startDate'));
    const endDate = parseDateInput(formData.get('endDate'));
    const today = getZonedTodayMidnight();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (startDate < yesterday) {
        alert(currentLang === 'es' 
            ? 'La fecha de inicio no puede ser anterior a ayer' 
            : 'The start date cannot be earlier than yesterday');
        return false;
    }
    
    if (endDate <= startDate) {
        alert(currentLang === 'es' 
            ? 'La fecha de finalización debe ser posterior a la fecha de inicio' 
            : 'The end date must be after the start date');
        return false;
    }
    
    // Validar visitantes
    const visitorNames = formData.getAll('visitorName[]');
    if (visitorNames.length === 0 || visitorNames.some(name => !name.trim())) {
        alert(currentLang === 'es' 
            ? 'Debe agregar al menos un visitante con nombre completo' 
            : 'You must add at least one visitor with full name');
        return false;
    }
    
    // Validar tratamiento de datos
    if (!formData.get('acceptDataTreatment')) {
        alert(currentLang === 'es' 
            ? 'Debe autorizar el tratamiento de datos personales' 
            : 'You must authorize the processing of personal data');
        return false;
    }
    
    // Validar términos y condiciones
    if (!formData.get('acceptTerms')) {
        alert(currentLang === 'es' 
            ? 'Debe aceptar los términos y condiciones' 
            : 'You must accept the terms and conditions');
        return false;
    }
    
    return true;
}

// Vista previa del documento
function previewDocument() {
    if (!validateForm()) return;
    
    const formData = new FormData(document.getElementById('authorizationForm'));
    const previewContent = generateDocumentHTML(formData);
    
    document.getElementById('previewContent').innerHTML = previewContent;
    document.getElementById('previewModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Cerrar vista previa
function closePreview() {
    document.getElementById('previewModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Generar HTML del documento
function generateDocumentHTML(formData) {
    const startDate = parseDateInput(formData.get('startDate')).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    const endDate = parseDateInput(formData.get('endDate')).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    const ownerIdDate = new Date(OWNER_DATA.idDate).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    // Generar tabla de visitantes
    const visitorNames = formData.getAll('visitorName[]');
    const visitorIdTypes = formData.getAll('visitorIdType[]');
    const visitorIdNumbers = formData.getAll('visitorIdNumber[]');
    const visitorAges = formData.getAll('visitorAge[]');
    
    let visitorsTableHTML = `
        <table class="visitors-table">
            <thead>
                <tr>
                    <th>NOMBRE COMPLETO</th>
                    <th>TIPO DOC.</th>
                    <th># DOCUMENTO IDENTIDAD</th>
                    <th>EDAD</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    for (let i = 0; i < visitorNames.length; i++) {
        visitorsTableHTML += `
            <tr>
                <td>${visitorNames[i]}</td>
                <td>${visitorIdTypes[i]}</td>
                <td>${visitorIdNumbers[i]}</td>
                <td>${visitorAges[i]}</td>
            </tr>
        `;
    }
    
    visitorsTableHTML += `
            </tbody>
        </table>
    `;
    
    // Generar tabla de vehículo si aplica
    let vehicleTableHTML = '';
    if (formData.get('hasVehicle')) {
        vehicleTableHTML = `
            <h3>VEHÍCULO AUTORIZADO</h3>
            <table class="vehicle-table">
                <thead>
                    <tr>
                        <th>TIPO DE VEHÍCULO</th>
                        <th>MARCA</th>
                        <th>PLACA</th>
                        <th>NOMBRE PROPIETARIO VEHÍCULO</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${formData.get('vehicleType') || 'N/A'}</td>
                        <td>${formData.get('vehicleBrand') || 'N/A'}</td>
                        <td>${formData.get('vehiclePlate') || 'N/A'}</td>
                        <td>${formData.get('vehicleOwner') || 'N/A'}</td>
                    </tr>
                </tbody>
            </table>
        `;
    }
    
    return `
        <div class="document-header">
            <div class="document-title">AUTORIZACIÓN INGRESO VISITANTES</div>
            <div class="document-subtitle">FORMATO ÚNICO VITA 219</div>
        </div>
        
        <div class="document-content">
            <p><strong>Señores:</strong><br>
            Administración Conjunto Residencial Vita 219<br>
            Santa Marta - Magdalena</p>
            
            <p>Yo, <strong>${OWNER_DATA.name}</strong>, identificado con ${OWNER_DATA.idType} número <strong>${OWNER_DATA.idNumber}</strong>, expedida el <strong>${ownerIdDate}</strong>, propietario del apartamento <strong>${OWNER_DATA.apartment}</strong>, me permito informar que durante los días <strong>${startDate} al ${endDate}</strong>, las personas que a continuación relaciono están autorizadas para ingresar a mi apartamento.</p>
            
            <p><strong>Huésped Responsable:</strong> ${formData.get('renterName')} - ${formData.get('renterEmail')} - ${formData.get('renterPhone')}</p>
            
            <p>Me hago responsable por cualquier eventualidad que suceda durante su estadía y soy consciente del Reglamento Interno de Convivencia del Conjunto Residencial Vita 219, el Código Nacional de Policía y Convivencia, el Reglamento de Propiedad Horizontal, la Ley 675 de 2001 y demás normas aplicables, así como de las sanciones legales y económicas que acarree su incumplimiento.</p>
        </div>
        
        <h3>VISITANTES AUTORIZADOS</h3>
        ${visitorsTableHTML}
        
        ${vehicleTableHTML}
        
        <div class="signature-section">
            <p><strong>Att</strong></p>
            <div class="signature-line"></div>
            <p><strong>${OWNER_DATA.name}</strong><br>
            Tel: ${OWNER_DATA.phone}<br>
            Email: ${OWNER_DATA.email}</p>
            <p>Registro Nacional de Turismo: ${OWNER_DATA.tourismRegistry}</p>
        </div>
    `;
}

// Generar versión de texto del documento
function generateDocumentText(formData) {
    const startDate = parseDateInput(formData.get('startDate')).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    const endDate = parseDateInput(formData.get('endDate')).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    const ownerIdDate = new Date(OWNER_DATA.idDate).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    // Generar lista de visitantes
    const visitorNames = formData.getAll('visitorName[]');
    const visitorIdTypes = formData.getAll('visitorIdType[]');
    const visitorIdNumbers = formData.getAll('visitorIdNumber[]');
    const visitorAges = formData.getAll('visitorAge[]');
    
    let visitorsText = 'VISITANTES AUTORIZADOS:\n\n';
    for (let i = 0; i < visitorNames.length; i++) {
        visitorsText += `${i + 1}. ${visitorNames[i]}\n`;
        visitorsText += `   ${visitorIdTypes[i]}: ${visitorIdNumbers[i]}\n`;
        visitorsText += `   Edad: ${visitorAges[i]} años\n\n`;
    }
    
    // Generar información de vehículo si aplica
    let vehicleText = '';
    if (formData.get('hasVehicle')) {
        vehicleText = `\nVEHÍCULO AUTORIZADO:\n`;
        vehicleText += `Tipo: ${formData.get('vehicleType') || 'N/A'}\n`;
        vehicleText += `Marca: ${formData.get('vehicleBrand') || 'N/A'}\n`;
        vehicleText += `Placa: ${formData.get('vehiclePlate') || 'N/A'}\n`;
        vehicleText += `Propietario: ${formData.get('vehicleOwner') || 'N/A'}\n`;
    }
    
    return `
AUTORIZACIÓN INGRESO VISITANTES
FORMATO ÚNICO VITA 219

Señores:
Administración Conjunto Residencial Vita 219
Santa Marta - Magdalena

Yo, ${OWNER_DATA.name}, identificado con ${OWNER_DATA.idType} número ${OWNER_DATA.idNumber}, expedida el ${ownerIdDate}, propietario del apartamento ${OWNER_DATA.apartment}, me permito informar que durante los días ${startDate} al ${endDate}, las personas que a continuación relaciono están autorizadas para ingresar a mi apartamento.

Huésped Responsable: ${formData.get('renterName')} - ${formData.get('renterEmail')} - ${formData.get('renterPhone')}

Me hago responsable por cualquier eventualidad que suceda durante su estadía y soy consciente del Reglamento Interno de Convivencia del Conjunto Residencial Vita 219, el Código Nacional de Policía y Convivencia, el Reglamento de Propiedad Horizontal, la Ley 675 de 2001 y demás normas aplicables, así como de las sanciones legales y económicas que acarree su incumplimiento.

${visitorsText}${vehicleText}

Att
${OWNER_DATA.name}
Tel: ${OWNER_DATA.phone}
Email: ${OWNER_DATA.email}
Registro Nacional de Turismo: ${OWNER_DATA.tourismRegistry}

---
Documento generado desde: https://vita219.com/autorizacion.html
Fecha de generación: ${new Intl.DateTimeFormat('es-ES', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())} ${new Intl.DateTimeFormat('es-ES', { timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit' }).format(new Date())}
    `;
}

// Print and PDF functions removed as requested

// Enviar formulario
async function submitForm() {
    const form = document.getElementById('authorizationForm');
    const formData = new FormData(form);
    
    try {
        // Mostrar indicador de carga
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.textContent = currentLang === 'es' ? 'Enviando...' : 'Sending...';
        submitButton.disabled = true;
        
        // Generar documento HTML y texto
        const documentHTML = generateDocumentHTML(formData);
        const documentText = generateDocumentText(formData);
        
        // Preparar datos para envío
        const apartmentNum = OWNER_DATA.apartment;
        const ownerName = OWNER_DATA.name;
        const renterName = formData.get('renterName') ? String(formData.get('renterName')) : '';
        const renterEmail = formData.get('renterEmail') ? String(formData.get('renterEmail')) : '';
        const renterPhone = formData.get('renterPhone') ? String(formData.get('renterPhone')) : '';
        
        const subject = `Autorización de Visitantes - Apartamento ${apartmentNum} - ${ownerName}`;
        
        // Try EmailJS first (if configured), otherwise fall back to mailto
        let emailSent = false;
        
        // Debug: Check if EmailJS is available
        console.log('EmailJS available:', typeof emailjs !== 'undefined');
        console.log('EmailJS config:', EMAILJS_CONFIG);
        
        if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY') {
            try {
                console.log('Attempting to send via EmailJS...');
                
                // Initialize EmailJS
                emailjs.init(EMAILJS_CONFIG.publicKey);
                
                // Send email directly using EmailJS send method
                const templateParams = {
                    to_name: 'Administración Vita 219',
                    from_name: renterName,
                    from_email: renterEmail,
                    message: documentHTML,
                    reply_to: renterEmail
                };
                
                console.log('Sending with params:', templateParams);
                
                const result = await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams);
                console.log('EmailJS success:', result);
                
                emailSent = true;
                
                alert(currentLang === 'es' 
                    ? '✅ Autorización enviada exitosamente por email via EmailJS.' 
                    : '✅ Authorization sent successfully by email via EmailJS.');
                    
            } catch (emailError) {
                console.error('EmailJS error details:', emailError);
                alert(currentLang === 'es' 
                    ? 'Error al enviar email: ' + emailError.message 
                    : 'Error sending email: ' + emailError.message);
                return; // Don't continue if email fails
            }
        } else {
            alert(currentLang === 'es' 
                ? 'Error: EmailJS no está configurado correctamente.' 
                : 'Error: EmailJS is not configured properly.');
            return;
        }
        
        // WhatsApp como alternativa
        const whatsappMessage = `Hola, envío autorización de visitantes para apartamento ${apartmentNum}. Fechas: ${parseDateInput(formData.get('startDate')).toLocaleDateString('es-ES')} al ${parseDateInput(formData.get('endDate')).toLocaleDateString('es-ES')}. Huésped: ${renterName}. ${emailSent ? 'Autorización enviada por email.' : 'Detalles enviados por email.'}`;
        const whatsappLink = `https://wa.me/573124894828?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Removed WhatsApp confirmation prompt as requested
        
        // Mostrar vista previa automáticamente
        document.getElementById('previewContent').innerHTML = documentHTML;
        document.getElementById('previewModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
        
    } catch (error) {
        console.error('Error al enviar la autorización:', error);
        alert(currentLang === 'es' 
            ? 'Error al enviar la autorización: ' + error.message + '. Por favor, intente nuevamente.' 
            : 'Error sending authorization: ' + error.message + '. Please try again.');
    } finally {
        // Restaurar botón
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.textContent = currentLang === 'es' ? 'Generar y Enviar Autorización' : 'Generate and Send Authorization';
        submitButton.disabled = false;
    }
}


// Funciones de idioma (compatibilidad con script.js)
function toggleLanguage() {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    updateLanguage();
    const langText = document.querySelector('.lang-text');
    if (langText) {
        langText.textContent = currentLang === 'es' ? 'EN' : 'ES';
    }
}

function updateLanguage() {
    const elements = document.querySelectorAll('[data-es][data-en]');
    
    elements.forEach(element => {
        const text = currentLang === 'es' ? element.getAttribute('data-es') : element.getAttribute('data-en');
        
        if (element.tagName === 'INPUT') {
            if (element.type === 'text' || element.type === 'email' || element.type === 'tel') {
                element.placeholder = text;
            } else {
                element.textContent = text;
            }
        } else if (element.tagName === 'TEXTAREA') {
            element.placeholder = text;
        } else if (element.tagName === 'BUTTON' || element.tagName === 'A') {
            element.textContent = text;
        } else if (element.tagName === 'OPTION') {
            element.textContent = text;
        } else {
            element.textContent = text;
        }
    });
    
    document.documentElement.lang = currentLang;
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
    
    const toggle = document.querySelector('.mobile-menu-toggle');
    if (toggle) {
        toggle.classList.toggle('active');
    }
}
