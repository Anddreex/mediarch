let volumen, a_metros_cuadrados, a_metros_lineales, a_toneladas, a_kilos;

// Función auxiliar para formatear números con separador de miles
const formatoMiles = n => Number(n).toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

// === NUEVA FUNCIÓN: Alternar visibilidad de campos ===
function alternarCampos() {
    const forma = document.getElementById('formaGeometrica').value;
    const rectFields = document.getElementById('rectangularFields');
    const truncFields = document.getElementById('truncatedFields');

    // Limpiar campos al cambiar de modo
    document.getElementById('largo').value = '';
    document.getElementById('ancho').value = '';
    document.getElementById('alto').value = '';
    document.getElementById('altura').value = '';
    document.getElementById('radioMayor').value = '';
    document.getElementById('radioMenor').value = '';

    if (forma === "Cubo" || forma === "Paralelepipedo") {
        rectFields.style.display = 'block';
        truncFields.style.display = 'none';
    } else if (forma === "Cono Recto Truncado" || forma === "Cono Rectangular Truncado") {
        rectFields.style.display = 'none';
        truncFields.style.display = 'block';
    }
}

function calcular() {
    // 1. Obtener la forma geométrica seleccionada
    const forma = document.getElementById('formaGeometrica').value;
    const unidad = document.getElementById('unidad').value;
    const ml_input = parseFloat(document.getElementById('ml').value);
    const volumenInfo = parseFloat(document.getElementById('volumenInfo').value);
    const tipoVolumen = document.getElementById('tipoVolumen').value;
    
    let resultado = '';
    let ml = 0; // Metros lineales unificados
    let volumen_calculado = NaN; // Usaremos esta variable para el volumen en m³

    // === 2. CÁLCULO DE VOLUMEN SEGÚN LA FORMA ===
    
    // Bloque 2A: Cubo o Paralelepípedo
    if (forma === "Cubo" || forma === "Paralelepipedo") {
        const largo = parseFloat(document.getElementById('largo').value);
        const ancho = parseFloat(document.getElementById('ancho').value);
        const alto = parseFloat(document.getElementById('alto').value);
        
        if (!isNaN(largo) && !isNaN(ancho) && !isNaN(alto)) {
            // V = largo × ancho × alto
            volumen_calculado = largo * ancho * alto; 
        } else if (forma === "Cubo" && !isNaN(largo)) {
            // Para el cubo, si solo se da el largo, se asume que largo=ancho=alto
            volumen_calculado = largo * largo * largo;
        }
    } 
    // Bloque 2B: Cono Truncado
    else if (forma === "Cono Recto Truncado" || forma === "Cono Rectangular Truncado") {
        const h = parseFloat(document.getElementById('altura').value);
        const R = parseFloat(document.getElementById('radioMayor').value);
        const r = parseFloat(document.getElementById('radioMenor').value);

        if (!isNaN(h) && !isNaN(R) && !isNaN(r) && R >= r) {
            // R = D/2, r = d/2
            
            
            // FÓRMULA TRONCO DE CONO: V = (π * h / 3) * (R² + r² + R*r)
           volumen_calculado = (Math.PI * h / 3) * (R * R + r * r + R * r);


        }
    }


    // === 3. CÁLCULO DE CONVERSIONES (Usa volumen_calculado) ===
    if (!isNaN(volumen_calculado)) {
        volumen = volumen_calculado; // m³
        a_metros_cuadrados = volumen * 2.49;
        a_metros_lineales = volumen * 14.4362;
        a_toneladas = volumen * 0.48484;
        a_kilos = a_toneladas * 1000;
        ml = a_metros_lineales; // Metros lineales (ml) se calcula a partir del volumen

        resultado += `
            <h3>Unidad de conservación: ${unidad}</h3>
            <table class="tabla-resultados">
            <tr><td>Volumen (${forma})</td><td>${volumen.toFixed(2)} m³</td></tr>
            <tr><td>Metros lineales</td><td>${a_metros_lineales.toFixed(2)} m</td></tr>
            <tr><td>Metros cuadrados</td><td>${a_metros_cuadrados.toFixed(2)} m²</td></tr>
            <tr><td>Toneladas</td><td>${a_toneladas.toFixed(2)} t</td></tr>
            <tr><td>Kilos</td><td>${a_kilos.toFixed(2)} kg</td></tr>
            </table>
        `;
        
        let folios_ml = 0, folios_m3 = 0, titulo = '';

        if (unidad === "legajo") {
        folios_ml = ml * 9450;
        folios_m3 = volumen * 132300;
        titulo = "Legajo";
        } else if (unidad === "carpeta") {
        folios_ml = ml * 9000;
        folios_m3 = volumen * 126000;
        titulo = "Carpeta";
        } else if (unidad === "Caja") {
        folios_ml = ml * 6300;
        folios_m3 = volumen * 88200;
        titulo = "Caja";
        } else if (unidad === "otros") {
        folios_ml = ml * 8700;
        folios_m3 = volumen * 96000;
        titulo = "Otros";
        }

        resultado += `
        <h4>Promedio de folios (${titulo})</h4>
        <table class="tabla-resultados">
        <tr><td>Por metro lineal</td><td>${folios_ml.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} folios</td></tr>
        <tr><td>Por metro cúbico</td><td>${folios_m3.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} folios</td></tr>
        </table>
        `;
    }
    
    // === Bloque 4: Cálculo desde metros lineales directos ===
    else if (!isNaN(ml_input)) {
        ml = ml_input;
        const m2 = ml * 0.172413;
        const m3 = ml * 0.06927;
        const toneladas = ml * 0.0336;
        const kilos = toneladas * 1000;

        resultado += `
            <h3>Unidad de conservación: ${unidad}</h3>
            <table class="tabla-resultados">
            <tr><td>Metros lineales ingresados</td><td>${ml.toFixed(2)} m</td></tr>
            <tr><td>Metros cuadrados</td><td>${m2.toFixed(2)} m²</td></tr>
            <tr><td>Metros cúbicos</td><td>${m3.toFixed(2)} m³</td></tr>
            <tr><td>Toneladas</td><td>${toneladas.toFixed(2)} t</td></tr>
            <tr><td>Kilos</td><td>${kilos.toFixed(2)} kg</td></tr>
            </table>
        `;
        
        let folios_ml = 0, folios_m3 = 0, titulo = '';

        if (unidad === "legajo") {
        folios_ml = ml * 9450;
        folios_m3 = m3 * 132300;
        titulo = "Legajo";
        } else if (unidad === "carpeta") {
        folios_ml = ml * 9000;
        folios_m3 = m3 * 126000;
        titulo = "Carpeta";
        } else if (unidad === "Caja") {
        folios_ml = ml * 6300;
        folios_m3 = m3 * 88200;
        titulo = "Caja";
        } else if (unidad === "otros") {
        folios_ml = ml * 8700;
        folios_m3 = m3 * 96000;
        titulo = "Otros";
        }

        resultado += `
        <h4>Promedio de folios (${titulo})</h4>
        <table class="tabla-resultados">
            <tr><td>Por metro lineal</td><td>${folios_ml.toLocaleString('es-CO', {minimumFractionDigits: 0, maximumFractionDigits: 0})} folios</td></tr>
            <tr><td>Por metro cúbico</td><td>${folios_m3.toLocaleString('es-CO', {minimumFractionDigits: 0, maximumFractionDigits:0})} folios</td></tr>
        </table>
        `;
    }
    
    // === Bloque INSUMOS (Unificado) ===
    if (ml > 0) {
        if (unidad === "Caja") {
        // Fórmula de Insumos para Cajas (diferente)
        const estante = (ml * 0.236).toFixed(1);
        const cajas = (ml * 4.71).toFixed(0);
        const carpetas = (ml * 130).toFixed(0);
        const folios = (ml * 28600).toFixed(0);
        const ganchos = carpetas;
        
        resultado += `
            <h4>Insumos Estantería (Caja)</h4>
            <table class="tabla-resultados">
            <tr><td>Estante</td><td>${estante}</td></tr>
            <tr><td>Cajas</td><td>${formatoMiles(cajas)}</td></tr>
            <tr><td>Carpetas</td><td>${formatoMiles(carpetas)}</td></tr>
            <tr><td>Folios</td><td>${formatoMiles(folios)}</td></tr>
            <tr><td>Ganchos</td><td>${formatoMiles(ganchos)}</td></tr>
            </table>
        `;
        } else if (unidad === "legajo" || unidad === "carpeta" || unidad === "otros") {
        // Fórmula de Insumos para Legajo, Carpeta y Otros (Estándar)
        const estante = (ml / 4.25).toFixed(1);
        const cajas = (estante * 20).toFixed(0);
        const carpetas = (cajas * 6.5).toFixed(0);
        const folios = (carpetas * 220).toFixed(0);
        const ganchos = carpetas;

        resultado += `
            <h4>Insumos Estantería (${unidad.charAt(0).toUpperCase() + unidad.slice(1)})</h4>
            <table class="tabla-resultados">
            <tr><td>Estante</td><td>${estante}</td></tr>
            <tr><td>Cajas</td><td>${formatoMiles(cajas)}</td></tr>
            <tr><td>Carpetas</td><td>${formatoMiles(carpetas)}</td></tr>
            <tr><td>Folios</td><td>${formatoMiles(folios)}</td></tr>
            <tr><td>Ganchos</td><td>${formatoMiles(ganchos)}</td></tr>
            </table>
        `;
        }
    }

    // === Volumen de información (independiente) ===
    if (!isNaN(volumenInfo)) {
        const personas = parseInt(document.getElementById('personas').value) || 1;
        const tipoProceso = document.getElementById('tipoProceso').value;
        let diasAlistamiento = 0, diasFoliacion = 0, diasDigitalizacion = 0;

        // Definir valores según el proceso
        let rendimientos = {};
        
        if (tipoProceso === "Gestion Financiera") {
            rendimientos = {
                folios: { alistamiento: 3061, foliacion: 2841, digitalizacion: 3553 },
                carpetas: { alistamiento: 15, foliacion: 14, digitalizacion: 16 }
            };
        } else if (tipoProceso === "Gestion Bascula") {
            // Valores corregidos para "Gestion Bascula"
            rendimientos = {
                folios: { alistamiento: 1702, foliacion: 1650, digitalizacion: 709 }, 
                carpetas: { alistamiento: 7, foliacion: 8, digitalizacion: 3 }
            };
        }

        if (tipoVolumen === "folios") {
            diasAlistamiento = volumenInfo / (rendimientos.folios.alistamiento * personas);
            diasFoliacion = volumenInfo / (rendimientos.folios.foliacion * personas);
            diasDigitalizacion = volumenInfo / (rendimientos.folios.digitalizacion * personas);
        
        } else if (tipoVolumen === "carpetas") {
            diasAlistamiento = volumenInfo / (rendimientos.carpetas.alistamiento * personas);
            diasFoliacion = volumenInfo / (rendimientos.carpetas.foliacion * personas);
            diasDigitalizacion = volumenInfo / (rendimientos.carpetas.digitalizacion * personas);
        }
        
        const totalDias = diasAlistamiento + diasFoliacion + diasDigitalizacion;

        resultado += `
            <h4>Volumen de Información</h4>
            <table class="tabla-resultados">
            <tr><td>Proceso</td><td>${tipoProceso}</td></tr>
            <tr><td>Dato ingresado</td><td>${volumenInfo.toLocaleString()} ${tipoVolumen}</td></tr>
            <tr><td>Días Alistamiento</td><td>${diasAlistamiento.toFixed(0)} días</td></tr>
            <tr><td>Días Foliación</td><td>${diasFoliacion.toFixed(0)} días</td></tr>
            <tr><td>Días Digitalización</td><td>${diasDigitalizacion.toFixed(0)} días</td></tr>
            <tr><td><strong>Total Días Estimados</strong></td><td><strong>${totalDias.toFixed(0)} días</strong></td></tr>
            </table>
        `;
    }

    // Validación final
    if (resultado === '') {
        resultado = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Por favor completa los campos con números válidos (Largo/Ancho/Alto o Metros Lineales) y vuelve a intentar.</p></div>';
    }

    // Mostrar resultados y panel lateral
    document.getElementById('resultado').innerHTML = resultado;
    showResults();
}

// Función para mostrar el panel de resultados
function showResults() {
    const resultsPanel = document.getElementById('resultsPanel');
    resultsPanel.classList.add('show');
}

// Función para ocultar el panel de resultados
function toggleResults() {
    const resultsPanel = document.getElementById('resultsPanel');
    resultsPanel.classList.remove('show');
}

// === FUNCIÓN LIMPIAR ACTUALIZADA ===
function limpiar() {
    document.getElementById('largo').value = '';
    document.getElementById('ancho').value = '';
    document.getElementById('alto').value = '';
    document.getElementById('altura').value = ''; 
    document.getElementById('radioMayor').value = ''; 
    document.getElementById('radioMenor').value = ''; 
    document.getElementById('ml').value = '';
    document.getElementById('volumenInfo').value = '';
    document.getElementById('unidad').selectedIndex = 0;
    document.getElementById('tipoVolumen').selectedIndex = 0;
    document.getElementById('tipoProceso').selectedIndex = 0;
    document.getElementById('personas').selectedIndex = 0;
    document.getElementById('formaGeometrica').selectedIndex = 0;
    
    // Restaurar la vista inicial
    alternarCampos(); 
    
    document.getElementById('resultado').innerHTML = `
        <div class="empty-state">
        <i class="fas fa-calculator"></i>
        <p>Los resultados aparecerán aquí después del cálculo</p>
        </div>
    `;
    
    toggleResults();
}

// === FUNCIÓN EXPORTAR EXCEL ACTUALIZADA CON LÓGICA GEOMÉTRICA ===
function exportarExcel() {
  const forma = document.getElementById('formaGeometrica').value; // Nuevo
  const unidad = document.getElementById('unidad').value;
  
  // Variables para la forma rectangular (Rectangular Fields)
  const largo = parseFloat(document.getElementById('largo').value);
  const ancho = parseFloat(document.getElementById('ancho').value);
  const alto = parseFloat(document.getElementById('alto').value);

  // Variables para la forma truncada (Truncated Fields)
  const h = parseFloat(document.getElementById('altura').value);
  const D = parseFloat(document.getElementById('radioMayor').value);
  const d = parseFloat(document.getElementById('radioMenor').value);
  
  const ml_input = parseFloat(document.getElementById('ml').value);
  const volumenInfo = parseFloat(document.getElementById('volumenInfo').value);
  const tipoVolumen = document.getElementById('tipoVolumen').value;
  const tipoProceso = document.getElementById('tipoProceso').value;
  const personas = parseInt(document.getElementById('personas').value) || 1;

  const datos = [
    ["Forma geométrica", forma], // Nuevo
    ["Unidad de conservación", unidad]
  ];
  let ml = 0;
  let volumen_calculado = NaN;

  // --- 1. CÁLCULO DE VOLUMEN SEGÚN LA FORMA ---
  if (forma === "Cubo" || forma === "Paralelepipedo") {
      if (!isNaN(largo) && !isNaN(ancho) && !isNaN(alto)) {
          // V = largo × ancho × alto
          volumen_calculado = largo * ancho * alto; 
          datos.push(["Largo (metros)", largo.toFixed(2)]);
          datos.push(["Ancho (metros)", ancho.toFixed(2)]);
          datos.push(["Alto (metros)", alto.toFixed(2)]);
      } else if (forma === "Cubo" && !isNaN(largo)) {
          // Asumir cubo si solo se da el largo
          volumen_calculado = largo * largo * largo;
          datos.push(["Lado del Cubo (metros)", largo.toFixed(2)]); 
      }
  } else if (forma === "Cono Recto Truncado" || forma === "Cono Rectangular Truncado") {
      if (!isNaN(h) && !isNaN(R) && !isNaN(r) && R >= r) {
         
          // FÓRMULA TRONCO DE CONO: V = (π * h / 3) * (R² + r² + R*r)
          volumen_calculado = (Math.PI * h / 3) * (R * R + r * r + R * r); 
          datos.push(["Altura (h) (metros)", h.toFixed(2)]); 
          datos.push(["Radio Mayor (metros)", R.toFixed(2)]); 
          datos.push(["Radio Menor (metros)", r.toFixed(2)]); 
      }
  }


  // --- 2. CONVERSIONES Y CÁLCULO DE PROMEDIO (Desde Volumen) ---
  if (!isNaN(volumen_calculado)) {
    const volumen = volumen_calculado; // m³
    const m2 = volumen * 2.49;
    ml = volumen * 14.4362;
    const toneladas = volumen * 0.48484;
    const kilos = toneladas * 1000;

    datos.push(["Volumen (m³)", volumen.toFixed(4)]);
    datos.push(["Metros cuadrados", m2.toFixed(4)]);
    datos.push(["Metros lineales", ml.toFixed(4)]);
    datos.push(["Toneladas", toneladas.toFixed(4)]);
    datos.push(["Kilos", kilos.toFixed(2)]);

    // Promedio folios
    let folios_ml = 0, folios_m3 = 0;
    if (unidad === "legajo") {
      folios_ml = ml * 9450; folios_m3 = volumen * 132300;
    } else if (unidad === "carpeta") {
      folios_ml = ml * 9000; folios_m3 = volumen * 126000;
    } else if (unidad === "Caja") {
      folios_ml = ml * 6300; folios_m3 = volumen * 88200;
    } else if (unidad === "otros") {
      folios_ml = ml * 8700; folios_m3 = volumen * 96000;
    }

    datos.push(["Promedio folios por metro lineal", folios_ml.toFixed(0)]);
    datos.push(["Promedio folios por metro cúbico", folios_m3.toFixed(0)]);

  // --- 3. CONVERSIONES Y CÁLCULO DE PROMEDIO (Desde Metros Lineales Directos) ---
  } else if (!isNaN(ml_input)) {
    ml = ml_input;
    const m2 = ml * 0.172413;
    const m3 = ml * 0.06927;
    const toneladas = ml * 0.0336;
    const kilos = toneladas * 1000;

    datos.push(["Metros lineales ingresados", ml.toFixed(4)]);
    datos.push(["Metros cuadrados", m2.toFixed(4)]);
    datos.push(["Metros cúbicos", m3.toFixed(4)]);
    datos.push(["Toneladas", toneladas.toFixed(4)]);
    datos.push(["Kilos", kilos.toFixed(2)]);

    // Promedio folios
    let folios_ml = 0, folios_m3 = 0;
    if (unidad === "legajo") {
      folios_ml = ml * 9450; folios_m3 = m3 * 132300;
    } else if (unidad === "carpeta") {
      folios_ml = ml * 9000; folios_m3 = m3 * 126000;
    } else if (unidad === "Caja") {
      folios_ml = ml * 6300; folios_m3 = m3 * 88200;
    } else if (unidad === "otros") {
      folios_ml = ml * 8700; folios_m3 = m3 * 96000;
    }

    datos.push(["Promedio folios por metro lineal", folios_ml.toFixed(0)]);
    datos.push(["Promedio folios por metro cúbico", folios_m3.toFixed(0)]);
  }
  
  // --- Insumos (Unificado) ---
  if (ml > 0) {
      let estante, cajas, carpetas, folios, ganchos;
      
      if (unidad === "Caja") {
          // Insumos para Cajas
          estante = (ml * 0.236);
          cajas = (ml * 4.71);
          carpetas = (ml * 130);
          folios = (ml * 28600);
          ganchos = carpetas;
      } else if (unidad === "legajo" || unidad === "carpeta" || unidad === "otros") {
          // Insumos para Legajo, Carpeta, Otros
          estante = (ml / 4.25);
          cajas = (estante * 20);
          carpetas = (cajas * 6.5);
          folios = (carpetas * 220);
          ganchos = carpetas;
      }

      // Solo añadir si se calculó
      if (estante) {
          datos.push(["Insumos - Estante", estante.toFixed(2)]);
          datos.push(["Insumos - Cajas", cajas.toFixed(0)]);
          datos.push(["Insumos - Carpetas", carpetas.toFixed(0)]);
          datos.push(["Insumos - Folios", folios.toFixed(0)]);
          datos.push(["Insumos - Ganchos", ganchos.toFixed(0)]);
      }
  }


  // --- Volumen de información ---
  if (!isNaN(volumenInfo)) {
    let diasAlistamiento = 0, diasFoliacion = 0, diasDigitalizacion = 0;

    // Definir valores según el proceso
    let rendimientos = {};
    
    if (tipoProceso === "Gestion Financiera") {
      rendimientos = {
        folios: { alistamiento: 3061, foliacion: 2841, digitalizacion: 3553 },
        carpetas: { alistamiento: 15, foliacion: 14, digitalizacion: 16 }
      };
    } else if (tipoProceso === "Gestion Bascula") {
      // Usando los valores corregidos para "Gestion Bascula"
      rendimientos = {
        folios: { alistamiento: 1702, foliacion: 1650, digitalizacion: 709 }, 
        carpetas: { alistamiento: 7, foliacion: 8, digitalizacion: 3 }
      };
    }

    if (tipoVolumen === "folios") {
      diasAlistamiento = volumenInfo / (rendimientos.folios.alistamiento * personas);
      diasFoliacion = volumenInfo / (rendimientos.folios.foliacion * personas);
      diasDigitalizacion = volumenInfo / (rendimientos.folios.digitalizacion * personas);
    } else if (tipoVolumen === "carpetas") {
      diasAlistamiento = volumenInfo / (rendimientos.carpetas.alistamiento * personas);
      diasFoliacion = volumenInfo / (rendimientos.carpetas.foliacion * personas);
      diasDigitalizacion = volumenInfo / (rendimientos.carpetas.digitalizacion * personas);
    }

    datos.push(["Proceso", tipoProceso]);
    datos.push(["Volumen de información", `${volumenInfo.toLocaleString()} ${tipoVolumen}`]);
    datos.push(["Días Alistamiento", diasAlistamiento.toFixed(1)]);
    datos.push(["Días Foliación", diasFoliacion.toFixed(1)]);
    datos.push(["Días Digitalización", diasDigitalizacion.toFixed(1)]);
    datos.push(["Total Días Estimados", (diasAlistamiento + diasFoliacion + diasDigitalizacion).toFixed(1)]);
  }

  // --- Validación final ---
  if (datos.length <= 2) { 
    alert("Por favor completa los campos de volumen o metros lineales antes de exportar a Excel.");
    return;
  }

  // --- Crear hoja de Excel ---
  const ws = XLSX.utils.aoa_to_sheet(datos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Cálculos");
  XLSX.writeFile(wb, "Resultados_CalculadoraGD.xlsx");
}