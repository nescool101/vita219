// Variables globales para los datos
let actividades = [];
let filteredData = [];
let currentActivity = null;

// Función para cargar automáticamente el archivo CSV por defecto
function loadDefaultCSVFile() {
    const defaultFileName = 'actividades-madrid.csv';
    
    fetch(defaultFileName)
        .then(response => {
            if (!response.ok) {
                throw new Error(`No se pudo cargar el archivo: ${response.status}`);
            }
            return response.text();
        })
        .then(csvText => {
            // Procesar los datos CSV
            processCSVData(csvText);
            
            document.getElementById('file-status').innerHTML = 
                `<span style="color: green;">✓ Archivo CSV cargado: ${actividades.length} actividades encontradas</span>`;
                
        })
        .catch(error => {
            console.error('Error al cargar el archivo por defecto:', error);
            document.getElementById('file-status').innerHTML = 
                `<span style="color: red;">✗ Error al cargar archivo por defecto. Usando datos de ejemplo.</span>`;
            loadSampleData();
        });
}

// Función para leer archivo CSV subido por el usuario
function readCSVFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csvText = e.target.result;
            
            // Procesar los datos CSV
            processCSVData(csvText);
            
            document.getElementById('file-status').innerHTML = 
                `<span style="color: green;">✓ Archivo CSV cargado: ${actividades.length} actividades encontradas</span>`;
            
        } catch (error) {
            console.error('Error al leer el archivo:', error);
            document.getElementById('file-status').innerHTML = 
                `<span style="color: red;">✗ Error al leer el archivo: ${error.message}</span>`;
        }
    };
    reader.readAsText(file, 'utf-8');
}

// Función para procesar los datos del CSV
function processCSVData(csvText) {
    const lines = csvText.split('\n');
    if (lines.length < 2) {
        throw new Error('El archivo CSV no contiene suficientes datos');
    }
    
    // La primera línea contiene los headers
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    
    console.log('CSV Headers:', headers);
    
    // Mapear los headers específicos del archivo de Madrid
    const headerMap = {};
    headers.forEach((header, index) => {
        const normalizedHeader = header.toLowerCase().trim();
        
        if (normalizedHeader.includes('id-evento')) headerMap.id = index;
        if (normalizedHeader.includes('titulo')) headerMap.titulo = index;
        if (normalizedHeader.includes('precio')) headerMap.precio = index;
        if (normalizedHeader.includes('gratuito')) headerMap.gratuito = index;
        if (normalizedHeader.includes('tipo')) headerMap.tipo = index;
        if (normalizedHeader.includes('distrito')) headerMap.distrito = index;
        if (normalizedHeader.includes('fecha') && !normalizedHeader.includes('fin')) headerMap.fecha = index;
        if (normalizedHeader.includes('hora')) headerMap.hora = index;
        if (normalizedHeader.includes('descripcion')) headerMap.descripcion = index;
        if (normalizedHeader.includes('lugar')) headerMap.lugar = index;
        if (normalizedHeader.includes('direccion')) headerMap.direccion = index;
        if (normalizedHeader.includes('barrio')) headerMap.barrio = index;
        if (normalizedHeader.includes('transporte')) headerMap.transporte = index;
    });
    
    console.log('Header mapping:', headerMap);
    
    // Procesar las filas de datos
    actividades = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Parse CSV line (handling quotes and commas)
        const row = parseCSVLine(line);
        if (!row || row.length === 0) continue;
        
        try {
            const actividad = {
                id: headerMap.id !== undefined ? (row[headerMap.id] || i) : i,
                titulo: headerMap.titulo !== undefined ? cleanText(row[headerMap.titulo]) : 'Sin título',
                precio: headerMap.precio !== undefined ? parseFloat(row[headerMap.precio]) || 0 : 0,
                gratuito: headerMap.gratuito !== undefined ? (row[headerMap.gratuito] === '1' ? 1 : 0) : 0,
                tipo: headerMap.tipo !== undefined ? cleanText(row[headerMap.tipo]) : 'Sin categoría',
                distrito: headerMap.distrito !== undefined ? cleanText(row[headerMap.distrito]) : 'Sin distrito',
                fecha: headerMap.fecha !== undefined ? formatDate2(row[headerMap.fecha]) : '2025-01-01',
                hora: headerMap.hora !== undefined ? cleanText(row[headerMap.hora]) : '',
                descripcion: headerMap.descripcion !== undefined ? cleanText(row[headerMap.descripcion]) : '',
                lugar: headerMap.lugar !== undefined ? cleanText(row[headerMap.lugar]) : '',
                direccion: headerMap.direccion !== undefined ? cleanText(row[headerMap.direccion]) : '',
                barrio: headerMap.barrio !== undefined ? cleanText(row[headerMap.barrio]) : '',
                transporte: headerMap.transporte !== undefined ? cleanText(row[headerMap.transporte]) : ''
            };
            
            // Validar que el precio sea gratuito si está marcado como tal
            if (actividad.gratuito === 1) {
                actividad.precio = 0;
            }
            
            // Limpiar datos vacíos o inválidos
            if (actividad.titulo && actividad.titulo.trim() !== '' && actividad.titulo !== 'Sin título') {
                actividades.push(actividad);
            }
        } catch (error) {
            console.warn(`Error procesando fila ${i}:`, error);
        }
    }
    
    console.log(`Procesadas ${actividades.length} actividades`);
    
    // Actualizar los datos filtrados y re-renderizar
    filteredData = [...actividades];
    populateFilters();
    renderCharts();
    renderActivityList();
}

// Función auxiliar para parsear líneas CSV
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current.trim());
    return result;
}

// Función auxiliar para limpiar texto
function cleanText(text) {
    if (!text) return '';
    return text.replace(/"/g, '').trim();
}

// Función auxiliar para formatear fechas del CSV
function formatDate2(dateString) {
    if (!dateString) return '2025-01-01';
    
    try {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
        }
    } catch (error) {
        console.warn('Error parsing date:', dateString);
    }
    
    return '2025-01-01';
}

// Función para formatear fechas de Excel
function formatExcelDate(excelDate) {
    if (!excelDate) return '2025-01-01';
    
    // Si ya es una fecha en formato string
    if (typeof excelDate === 'string') {
        // Intentar parsear diferentes formatos
        const date = new Date(excelDate);
        if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
        }
        return '2025-01-01';
    }
    
    // Si es un número de Excel (días desde 1900-01-01)
    if (typeof excelDate === 'number') {
        const date = new Date((excelDate - 25569) * 86400 * 1000);
        return date.toISOString().split('T')[0];
    }
    
    return '2025-01-01';
}

// Función para formatear hora - FIX para el error
function formatHora(hora) {
    if (!hora) return '';
    
    // Si es string, devolverlo tal como está
    if (typeof hora === 'string') {
        return hora;
    }
    
    // Si es número (formato Excel de tiempo)
    if (typeof hora === 'number') {
        // Convertir número decimal a horas:minutos
        const totalMinutes = Math.round(hora * 24 * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    }
    
    // Si es objeto Date
    if (hora instanceof Date) {
        return hora.toTimeString().split(' ')[0];
    }
    
    return '';
}

// Cargar datos de ejemplo como fallback
function loadSampleData() {
    actividades = [
        {
            id: 1,
            titulo: "Visita Comentada al Museo Centro de Arte Reina Sofía",
            precio: 1,
            gratuito: 0,
            tipo: "ExcursionesItinerariosVisitas",
            distrito: "VILLAVERDE",
            fecha: "2025-05-07",
            hora: "17:30:00",
            descripcion: "El Museo Reina Sofía se reconoce como un espacio dinamizador y abierto a la ciudadanía en toda su diversidad...",
            lugar: "Museo Reina Sofía",
            direccion: "Calle de Santa Isabel, 52"
        },
        {
            id: 2,
            titulo: "El mundo del revés",
            precio: 10,
            gratuito: 0,
            tipo: "RecitalesPresentacionesActosLiterarios",
            distrito: "ARGANZUELA",
            fecha: "2025-05-31",
            hora: "17:00:00",
            descripcion: "",
            lugar: "Centro Cultural",
            direccion: ""
        },
        {
            id: 3,
            titulo: "Marco Flores - Espectáculo Gratuito",
            precio: 0,
            gratuito: 1,
            tipo: "DanzaBaile",
            distrito: "ARGANZUELA",
            fecha: "2025-05-27",
            hora: "20:00:00",
            descripcion: "Profundo, solido, austero, silencioso, provocador, etéreo, verdadero...",
            lugar: "Teatro Municipal",
            direccion: "Plaza Mayor, 1"
        }
    ];
    
    filteredData = [...actividades];
    populateFilters();
    renderCharts();
    renderActivityList();
}

// Inicializar el tablero
function initDashboard() {
    // Cargar archivo CSV por defecto automáticamente
    loadDefaultCSVFile();
    setupEventListeners();
}

// Poblar los filtros
function populateFilters() {
    // Limpiar filtros existentes
    d3.select("#type-filter").selectAll("option:not(:first-child)").remove();
    d3.select("#district-filter").selectAll("option:not(:first-child)").remove();
    
    // Obtener tipos únicos
    const tipos = [...new Set(actividades.map(a => a.tipo))];
    const tipoSelect = d3.select("#type-filter");
    
    tipos.forEach(tipo => {
        tipoSelect.append("option")
            .attr("value", tipo)
            .text(tipo.replace(/([A-Z])/g, ' $1').trim());
    });

    // Obtener distritos únicos
    const distritos = [...new Set(actividades.map(a => a.distrito))];
    const distritoSelect = d3.select("#district-filter");
    
    distritos.forEach(distrito => {
        distritoSelect.append("option")
            .attr("value", distrito)
            .text(distrito);
    });
}

// Configurar event listeners
function setupEventListeners() {
    d3.select("#price-filter").on("change", applyFilters);
    d3.select("#type-filter").on("change", applyFilters);
    d3.select("#district-filter").on("change", applyFilters);
    d3.select("#date-filter").on("change", applyFilters);
    d3.select("#reset-filters").on("click", resetFilters);
    
    // Event listeners para carga de archivos
    document.getElementById('csv-file').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            document.getElementById('file-status').innerHTML = 
                '<span style="color: orange;">⏳ Cargando archivo CSV...</span>';
            readCSVFile(file);
        }
    });
    
    document.getElementById('load-default').addEventListener('click', function() {
        loadDefaultCSVFile();
        document.getElementById('csv-file').value = ''; // Limpiar input
    });
}

// Aplicar filtros
function applyFilters() {
    const priceFilter = d3.select("#price-filter").node().value;
    const typeFilter = d3.select("#type-filter").node().value;
    const districtFilter = d3.select("#district-filter").node().value;
    const dateFilter = d3.select("#date-filter").node().value;

    filteredData = actividades.filter(actividad => {
        // Filtrar por precio
        if (priceFilter !== "all") {
            if (priceFilter === "free" && actividad.gratuito !== 1) return false;
            if (priceFilter === "paid" && actividad.gratuito === 1) return false;
            if (priceFilter === "0-5" && (actividad.precio > 5 || actividad.gratuito === 1)) return false;
            if (priceFilter === "5-10" && (actividad.precio <= 5 || actividad.precio > 10 || actividad.gratuito === 1)) return false;
            if (priceFilter === "10-20" && (actividad.precio <= 10 || actividad.precio > 20 || actividad.gratuito === 1)) return false;
            if (priceFilter === "20+" && (actividad.precio <= 20 || actividad.gratuito === 1)) return false;
        }

        // Filtrar por tipo
        if (typeFilter !== "all" && actividad.tipo !== typeFilter) return false;

        // Filtrar por distrito
        if (districtFilter !== "all" && actividad.distrito !== districtFilter) return false;

        // Filtrar por fecha
        if (dateFilter && actividad.fecha !== dateFilter) return false;

        return true;
    });

    renderCharts();
    renderActivityList();
}

// Restablecer filtros
function resetFilters() {
    d3.select("#price-filter").node().value = "all";
    d3.select("#type-filter").node().value = "all";
    d3.select("#district-filter").node().value = "all";
    d3.select("#date-filter").node().value = "";
    
    filteredData = [...actividades];
    renderCharts();
    renderActivityList();
}

// Renderizar gráficos
function renderCharts() {
    renderLineChart();
    renderDistrictChart();
    renderPriceChart();
    renderTypeChart();
}

// Gráfico de líneas - Evolución temporal
function renderLineChart() {
    // Agrupar actividades por mes
    const monthlyData = d3.rollup(
        filteredData,
        v => v.length,
        d => {
            const date = new Date(d.fecha);
            return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        }
    );
    
    // Convertir a array y ordenar por fecha
    const lineData = Array.from(monthlyData, ([fecha, count]) => ({ fecha, count }))
        .sort((a, b) => a.fecha.localeCompare(b.fecha));
    
    // Limpiar el contenedor
    d3.select("#line-chart").html("");
    
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;
    
    const svg = d3.select("#line-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Escalas
    const x = d3.scalePoint()
        .domain(lineData.map(d => d.fecha))
        .range([0, width])
        .padding(0.5);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(lineData, d => d.count)])
        .nice()
        .range([height, 0]);
    
    // Crear línea
    const line = d3.line()
        .x(d => x(d.fecha))
        .y(d => y(d.count))
        .curve(d3.curveMonotoneX);
    
    // Añadir cuadrícula
    svg.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y)
            .ticks(5)
            .tickSize(-width)
            .tickFormat("")
        );
    
    // Añadir ejes
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");
    
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y));
    
    // Añadir línea
    svg.append("path")
        .datum(lineData)
        .attr("class", "line")
        .attr("d", line);
    
    // Añadir puntos
    svg.selectAll(".dot")
        .data(lineData)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.fecha))
        .attr("cy", d => y(d.count))
        .attr("r", 5)
        .on("mouseover", function(event, d) {
            d3.select(this).attr("r", 7);
            
            // Mostrar tooltip
            const tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
            
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            
            tooltip.html(`${d.fecha}: ${d.count} actividades`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.select(this).attr("r", 5);
            d3.selectAll(".tooltip").remove();
        });
    
    // Añadir etiqueta del eje Y
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Número de Actividades");
}

// Gráfico de actividades por distrito
function renderDistrictChart() {
    const districtCounts = d3.rollup(
        filteredData,
        v => v.length,
        d => d.distrito
    );
    
    const districtData = Array.from(districtCounts, ([distrito, count]) => ({ distrito, count }));
    
    // Limpiar el contenedor
    d3.select("#district-chart").html("");
    
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;
    
    const svg = d3.select("#district-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    const x = d3.scaleBand()
        .domain(districtData.map(d => d.distrito))
        .range([0, width])
        .padding(0.1);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(districtData, d => d.count)])
        .nice()
        .range([height, 0]);
    
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");
    
    svg.append("g")
        .call(d3.axisLeft(y));
    
    svg.selectAll(".bar")
        .data(districtData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.distrito))
        .attr("y", d => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.count))
        .attr("fill", "#3498db")
        .on("mouseover", function(event, d) {
            d3.select(this).attr("fill", "#2980b9");
            
            // Mostrar tooltip
            const tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
            
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            
            tooltip.html(`${d.distrito}: ${d.count} actividades`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.select(this).attr("fill", "#3498db");
            d3.selectAll(".tooltip").remove();
        });
}

// Gráfico de distribución de precios
function renderPriceChart() {
    const priceRanges = {
        "Gratuitas": filteredData.filter(d => d.gratuito === 1).length,
        "0-5 €": filteredData.filter(d => d.gratuito === 0 && d.precio <= 5).length,
        "5-10 €": filteredData.filter(d => d.gratuito === 0 && d.precio > 5 && d.precio <= 10).length,
        "10-20 €": filteredData.filter(d => d.gratuito === 0 && d.precio > 10 && d.precio <= 20).length,
        "20+ €": filteredData.filter(d => d.gratuito === 0 && d.precio > 20).length
    };
    
    const priceData = Object.entries(priceRanges).map(([range, count]) => ({ range, count }));
    
    // Limpiar el contenedor
    d3.select("#price-chart").html("");
    
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;
    
    const svg = d3.select("#price-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    const x = d3.scaleBand()
        .domain(priceData.map(d => d.range))
        .range([0, width])
        .padding(0.1);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(priceData, d => d.count)])
        .nice()
        .range([height, 0]);
    
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .call(d3.axisLeft(y));
    
    svg.selectAll(".bar")
        .data(priceData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.range))
        .attr("y", d => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.count))
        .attr("fill", d => d.range === "Gratuitas" ? "#2ecc71" : "#3498db")
        .on("mouseover", function(event, d) {
            d3.select(this).attr("fill", d.range === "Gratuitas" ? "#27ae60" : "#2980b9");
            
            // Mostrar tooltip
            const tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
            
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            
            tooltip.html(`${d.range}: ${d.count} actividades`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(event, d) {
            d3.select(this).attr("fill", d.range === "Gratuitas" ? "#2ecc71" : "#3498db");
            d3.selectAll(".tooltip").remove();
        });
}

// Gráfico de actividades por tipo
function renderTypeChart() {
    const typeCounts = d3.rollup(
        filteredData,
        v => v.length,
        d => d.tipo
    );
    
    const typeData = Array.from(typeCounts, ([tipo, count]) => ({
        tipo: tipo.replace(/([A-Z])/g, ' $1').trim(),
        count
    }));
    
    // Limpiar el contenedor
    d3.select("#type-chart").html("");
    
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;
    
    const svg = d3.select("#type-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    const x = d3.scaleBand()
        .domain(typeData.map(d => d.tipo))
        .range([0, width])
        .padding(0.1);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(typeData, d => d.count)])
        .nice()
        .range([height, 0]);
    
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");
    
    svg.append("g")
        .call(d3.axisLeft(y));
    
    svg.selectAll(".bar")
        .data(typeData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.tipo))
        .attr("y", d => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.count))
        .attr("fill", "#9b59b6")
        .on("mouseover", function(event, d) {
            d3.select(this).attr("fill", "#8e44ad");
            
            // Mostrar tooltip
            const tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
            
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            
            tooltip.html(`${d.tipo}: ${d.count} actividades`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.select(this).attr("fill", "#9b59b6");
            d3.selectAll(".tooltip").remove();
        });
}

// Renderizar lista de actividades
function renderActivityList() {
    const activityList = d3.select("#activity-list");
    activityList.html("");
    
    if (filteredData.length === 0) {
        activityList.append("div")
            .text("No hay actividades que coincidan con los filtros seleccionados");
        return;
    }
    
    const activities = activityList.selectAll(".activity-item")
        .data(filteredData)
        .enter()
        .append("div")
        .attr("class", "activity-item")
        .on("click", function(event, d) {
            showActivityDetails(d);
        });
    
    activities.append("div")
        .attr("class", "activity-title")
        .html(d => {
            const priceTag = d.gratuito === 1 ?
                '<span class="price-tag free">GRATIS</span>' :
                `<span class="price-tag">${d.precio} €</span>`;
            return `${priceTag} ${d.titulo}`;
        });
    
    activities.append("div")
        .attr("class", "activity-details")
        .html(d => `
            ${d.distrito} | ${formatDate(d.fecha)} ${d.hora ? '| ' + d.hora.substring(0,5) : ''}
        `);
}

// Mostrar detalles de la actividad
function showActivityDetails(activity) {
    currentActivity = activity;
    const detailsContainer = d3.select("#activity-details");
    detailsContainer.html("");
    
    detailsContainer.append("h3")
        .text(activity.titulo);
    
    detailsContainer.append("div")
        .html(`
            <p><strong>Precio:</strong> ${activity.gratuito === 1 ? 'Gratuito' : activity.precio + ' €'}</p>
            <p><strong>Distrito:</strong> ${activity.distrito}</p>
            <p><strong>Fecha:</strong> ${formatDate(activity.fecha)}</p>
            <p><strong>Hora:</strong> ${activity.hora || 'No especificada'}</p>
            <p><strong>Tipo:</strong> ${activity.tipo.replace(/([A-Z])/g, ' $1').trim()}</p>
            ${activity.lugar ? `<p><strong>Lugar:</strong> ${activity.lugar}</p>` : ''}
            ${activity.direccion ? `<p><strong>Dirección:</strong> ${activity.direccion}</p>` : ''}
        `);
    
    if (activity.descripcion) {
        detailsContainer.append("div")
            .html(`<p><strong>Descripción:</strong> ${activity.descripcion}</p>`);
    }
}

// Función auxiliar para formatear fechas
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Inicializar el tablero cuando se carga la página
document.addEventListener("DOMContentLoaded", initDashboard);
