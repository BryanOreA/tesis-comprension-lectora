// @ts-nocheck
import jsPDF from 'jspdf';

// Colores de la paleta
const COLORS = {
  primary: [23, 107, 135],
  secondary: [42, 157, 143],
  text: [24, 59, 78],
  muted: [102, 121, 133],
  light: [220, 230, 234],
  bg: [247, 250, 252],
  success: [39, 174, 96],
  warning: [243, 156, 18],
  error: [217, 83, 79]
};

function drawHeader(doc, title, subtitle) {
  // Fondo superior
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, 210, 35, 'F');

  // Título
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 15, 18);

  // Subtítulo
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(subtitle, 15, 27);
}

function drawFooter(doc) {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    doc.text(
      `Comprensión Lectora · Página ${i} de ${pageCount}`,
      105,
      290,
      { align: 'center' }
    );
  }
}

/**
 * Genera un reporte PDF del estudiante
 */
export function exportStudentPDF(studentData, evolutionData, studentName) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  drawHeader(doc, 'Reporte de Progreso', `Estudiante: ${studentName}`);

  let y = 50;

  // Fecha
  doc.setTextColor(...COLORS.muted);
  doc.setFontSize(9);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-PE', {
    day: '2-digit', month: 'long', year: 'numeric'
  })}`, 15, y);
  y += 12;

  // Resumen general
  doc.setTextColor(...COLORS.text);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumen general', 15, y);
  y += 8;

  // Línea separadora
  doc.setDrawColor(...COLORS.light);
  doc.setLineWidth(0.5);
  doc.line(15, y, pageWidth - 15, y);
  y += 8;

  // Estadísticas en cajas
  const stats = [
    { label: 'Nivel actual', value: studentData.level || 'En Inicio' },
    { label: 'Promedio', value: `${studentData.averageScore || 0}%` },
    { label: 'Sesiones', value: studentData.totalSessions || 0 },
    { label: 'Puntos totales', value: studentData.totalPoints || 0 }
  ];

  const boxWidth = (pageWidth - 30 - 15) / 4;
  const boxHeight = 25;

  stats.forEach((stat, i) => {
    const x = 15 + i * (boxWidth + 5);
    doc.setFillColor(...COLORS.bg);
    doc.roundedRect(x, y, boxWidth, boxHeight, 2, 2, 'F');

    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.muted);
    doc.text(stat.label.toUpperCase(), x + boxWidth / 2, y + 8, { align: 'center' });

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.primary);
    doc.text(String(stat.value), x + boxWidth / 2, y + 19, { align: 'center' });
  });

  y += boxHeight + 15;

  // Alertas
  if (studentData.alerts && studentData.alerts.length > 0) {
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.text);
    doc.text('Alertas y observaciones', 15, y);
    y += 8;

    doc.setDrawColor(...COLORS.light);
    doc.line(15, y, pageWidth - 15, y);
    y += 6;

    studentData.alerts.forEach((alert) => {
      const colors = alert.type === 'danger' ? COLORS.error
        : alert.type === 'warning' ? COLORS.warning
        : alert.type === 'success' ? COLORS.success
        : COLORS.primary;

      doc.setFillColor(colors[0], colors[1], colors[2], 0.1);
      doc.roundedRect(15, y, pageWidth - 30, 10, 2, 2, 'F');

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors);
      doc.text(`• ${alert.message}`, 19, y + 7);

      y += 13;
    });

    y += 5;
  }

  // Evolución (tabla)
  if (evolutionData && evolutionData.length > 0) {
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.text);
    doc.text('Historial de sesiones', 15, y);
    y += 8;

    doc.setDrawColor(...COLORS.light);
    doc.line(15, y, pageWidth - 15, y);
    y += 6;

    // Encabezado de tabla
    doc.setFillColor(...COLORS.primary);
    doc.rect(15, y, pageWidth - 30, 8, 'F');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('Fecha', 20, y + 5.5);
    doc.text('Puntaje', 75, y + 5.5);
    doc.text('Nivel', 125, y + 5.5);

    y += 8;

    // Filas
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.text);

    const maxRows = Math.min(evolutionData.length, 20);
    const recentData = evolutionData.slice(-maxRows).reverse();

    recentData.forEach((session, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(...COLORS.bg);
        doc.rect(15, y, pageWidth - 30, 7, 'F');
      }

      doc.setFontSize(9);
      doc.text(session.date || '-', 20, y + 5);

      const scoreColor = session.score >= 75 ? COLORS.success
        : session.score >= 50 ? COLORS.warning
        : COLORS.error;
      doc.setTextColor(...scoreColor);
      doc.setFont('helvetica', 'bold');
      doc.text(`${session.score}%`, 75, y + 5);

      doc.setTextColor(...COLORS.text);
      doc.setFont('helvetica', 'normal');
      doc.text(session.level || '-', 125, y + 5);

      y += 7;

      // Nueva página si es necesario
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
    });

    y += 10;
  }

  // Recomendaciones
  if (studentData.recommendations && studentData.recommendations.length > 0) {
    if (y > 220) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.text);
    doc.text('Recomendaciones', 15, y);
    y += 8;

    doc.setDrawColor(...COLORS.light);
    doc.line(15, y, pageWidth - 15, y);
    y += 6;

    studentData.recommendations.forEach((rec, i) => {
      doc.setFillColor(...COLORS.bg);
      doc.roundedRect(15, y, pageWidth - 30, 10, 2, 2, 'F');

      // Número
      doc.setFillColor(...COLORS.secondary);
      doc.circle(20, y + 5, 2.5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(String(i + 1), 20, y + 6, { align: 'center' });

      doc.setTextColor(...COLORS.text);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(rec, pageWidth - 55);
      doc.text(lines, 25, y + 6.5);

      y += 13;
    });
  }

  drawFooter(doc);

  // Guardar
  const fileName = `reporte_${studentName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

/**
 * Genera un reporte PDF de la clase
 */
export function exportClassPDF(students) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  drawHeader(doc, 'Reporte de Clase', `Total de estudiantes: ${students.length}`);

  let y = 50;

  // Fecha
  doc.setTextColor(...COLORS.muted);
  doc.setFontSize(9);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-PE', {
    day: '2-digit', month: 'long', year: 'numeric'
  })}`, 15, y);
  y += 12;

  // Resumen
  const total = students.length;
  const conAlerta = students.filter(s => s.needsAlert).length;
  const promedio = total > 0
    ? Math.round(students.reduce((a, s) => a + (s.progress || 0), 0) / total)
    : 0;

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.text);
  doc.text('Resumen general', 15, y);
  y += 8;

  doc.setDrawColor(...COLORS.light);
  doc.line(15, y, pageWidth - 15, y);
  y += 8;

  const stats = [
    { label: 'Estudiantes', value: total },
    { label: 'Alertas', value: conAlerta },
    { label: 'Promedio general', value: `${promedio}%` }
  ];

  const boxWidth = (pageWidth - 30 - 10) / 3;
  stats.forEach((stat, i) => {
    const x = 15 + i * (boxWidth + 5);
    doc.setFillColor(...COLORS.bg);
    doc.roundedRect(x, y, boxWidth, 22, 2, 2, 'F');

    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.muted);
    doc.text(stat.label.toUpperCase(), x + boxWidth / 2, y + 7, { align: 'center' });

    doc.setFontSize(13);
    doc.setTextColor(...COLORS.primary);
    doc.text(String(stat.value), x + boxWidth / 2, y + 17, { align: 'center' });
  });

  y += 35;

  // Tabla de estudiantes
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.text);
  doc.text('Lista de estudiantes', 15, y);
  y += 8;

  // Encabezado
  doc.setFillColor(...COLORS.primary);
  doc.rect(15, y, pageWidth - 30, 8, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Nombre', 20, y + 5.5);
  doc.text('Nivel', 100, y + 5.5);
  doc.text('Progreso', 135, y + 5.5);
  doc.text('Sesiones', 170, y + 5.5);

  y += 8;

  doc.setFont('helvetica', 'normal');
  students.forEach((s, i) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
      // Re-dibujar encabezado
      doc.setFillColor(...COLORS.primary);
      doc.rect(15, y, pageWidth - 30, 8, 'F');
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('Nombre', 20, y + 5.5);
      doc.text('Nivel', 100, y + 5.5);
      doc.text('Progreso', 135, y + 5.5);
      doc.text('Sesiones', 170, y + 5.5);
      y += 8;
    }

    if (i % 2 === 0) {
      doc.setFillColor(...COLORS.bg);
      doc.rect(15, y, pageWidth - 30, 7, 'F');
    }

    doc.setFontSize(9);
    doc.setTextColor(...COLORS.text);
    doc.setFont('helvetica', 'normal');
    doc.text(s.name.substring(0, 40), 20, y + 5);
    doc.text(s.level || 'En Inicio', 100, y + 5);

    const progressColor = s.progress >= 75 ? COLORS.success
      : s.progress >= 50 ? COLORS.warning
      : COLORS.error;
    doc.setTextColor(...progressColor);
    doc.setFont('helvetica', 'bold');
    doc.text(`${s.progress || 0}%`, 135, y + 5);

    doc.setTextColor(...COLORS.text);
    doc.setFont('helvetica', 'normal');
    doc.text(String(s.totalSessions || 0), 170, y + 5);

    y += 7;
  });

  drawFooter(doc);

  const fileName = `reporte_clase_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}