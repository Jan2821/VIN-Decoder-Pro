import jsPDF from 'jspdf';
import { VehicleData } from '../types';

export const generateVehiclePdf = (data: VehicleData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  // Header
  doc.setFontSize(22);
  doc.setTextColor(33, 37, 41); // Dark Gray
  doc.text(`${data.make || ''} ${data.model || ''}`, margin, yPos);
  
  yPos += 10;
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text(`FIN: ${data.vin || 'N/A'}`, margin, yPos);
  
  // Line separator
  yPos += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 15;

  // Main Info Grid Simulation
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Fahrzeugübersicht', margin, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  
  const addInfoLine = (label: string, value: string | number | undefined) => {
    if (yPos > 280) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, margin, yPos);
    doc.setFont("helvetica", "normal");
    const safeValue = value !== undefined && value !== null ? String(value) : "N/A";
    doc.text(safeValue, margin + 50, yPos);
    yPos += 7;
  };

  addInfoLine("Baujahr", data.year);
  addInfoLine("Ausstattungslinie", data.trimLevel);
  addInfoLine("Karosserieform", data.bodyType);
  addInfoLine("Motor", data.technicalData?.engineType);
  addInfoLine("Leistung", `${data.technicalData?.horsepower || 0} PS (${data.technicalData?.kilowatts || 0} kW)`);
  addInfoLine("Getriebe", data.technicalData?.transmission);
  addInfoLine("Kraftstoff", data.technicalData?.fuelType);
  
  yPos += 10;

  // Technical Details
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text('Technische Daten', margin, yPos);
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  addInfoLine("Hubraum", data.technicalData?.displacement);
  addInfoLine("Drehmoment", data.technicalData?.torque);
  addInfoLine("Antrieb", data.technicalData?.drivetrain);
  addInfoLine("Höchstgeschwindigkeit", data.technicalData?.topSpeed);
  addInfoLine("Beschleunigung (0-100)", data.technicalData?.acceleration);
  addInfoLine("Verbrauch (komb.)", data.technicalData?.fuelConsumption);
  addInfoLine("CO2 Emissionen", data.technicalData?.co2Emissions);

  yPos += 10;

  // Function to print list sections
  const printSection = (title: string, equipmentList: { category: string, items: string[] }[]) => {
     if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(title, margin, yPos);
    yPos += 8;

    if (!equipmentList || equipmentList.length === 0) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(100, 100, 100);
        doc.text("Keine Daten verfügbar", margin, yPos);
        yPos += 10;
        return;
    }

    equipmentList.forEach((cat) => {
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(50, 50, 50);
        doc.text(cat.category, margin, yPos);
        yPos += 6;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 80);
        
        cat.items.forEach(item => {
            if (yPos > 280) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(`• ${item}`, margin + 5, yPos);
            yPos += 5;
        });
        yPos += 5;
    });
  };

  printSection("Serienausstattung", data.standardEquipment || []);
  yPos += 5;
  printSection("Sonderausstattung (Wahrscheinlich)", data.optionalEquipment || []);

  // Footer
  const pageCount = doc.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Seite ${i} von ${pageCount} | Generiert mit VIN Decoder Pro`, margin, doc.internal.pageSize.getHeight() - 10);
  }

  const filename = `${data.make || 'Fahrzeug'}_${data.model || 'Bericht'}_${data.vin || 'Daten'}.pdf`.replace(/[^a-z0-9]/gi, '_');
  doc.save(filename);
};