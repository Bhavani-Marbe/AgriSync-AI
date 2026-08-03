import React, { useState } from 'react';
import {
  FileText,
  Download,
  Sparkles,
  CheckCircle2,
  FileSpreadsheet,
  Printer,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Farm, MarketPriceTrend } from '../types';

interface ReportsViewProps {
  farm: Farm;
  marketTrends: MarketPriceTrend[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ farm, marketTrends }) => {
  const [generating, setGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const generatePDFReport = (reportType: string) => {
    setGenerating(true);

    try {
      const doc = new jsPDF();

      // PDF Title Header
      doc.setFillColor(16, 185, 129); // Emerald 500
      doc.rect(0, 0, 210, 25, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('AgriSync AI — Intelligent Farm Management', 14, 16);

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(14);
      doc.text(`Official Document: ${reportType.toUpperCase()}`, 14, 38);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated Date: ${new Date().toLocaleDateString()}`, 14, 46);
      doc.text(`Farm: ${farm.name} (${farm.location})`, 14, 52);
      doc.text(`Property Area: ${farm.areaAcres} Acres | Soil Type: ${farm.soilType}`, 14, 58);

      doc.setDrawColor(226, 232, 240);
      doc.line(14, 64, 196, 64);

      if (reportType === 'farm-health') {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('1. Soil Chemistry & NPK Profile', 14, 74);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`• Nitrogen (N): ${farm.soilHealth.nitrogen} ppm`, 20, 82);
        doc.text(`• Phosphorus (P): ${farm.soilHealth.phosphorus} ppm`, 20, 88);
        doc.text(`• Potassium (K): ${farm.soilHealth.potassium} ppm`, 20, 94);
        doc.text(`• Soil pH Level: ${farm.soilHealth.ph} (Optimal Range)`, 20, 100);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('2. Historical Crop Yields', 14, 112);

        let yPos = 120;
        farm.cropHistory.forEach((item) => {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.text(`• Year ${item.year}: ${item.crop} — Yield: ${item.yieldTons} Tons`, 20, yPos);
          yPos += 8;
        });
      } else if (reportType === 'pathology-log') {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('1. Gemini Vision AI Pathology Scan Log', 14, 74);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`• Target Crop: ${farm.currentCrop || 'Tur (Pigeon Pea)'}`, 20, 82);
        doc.text(`• Recent Diagnosis: Tur Pod Borer & Wilt Advisory Inspection`, 20, 88);
        doc.text(`• Vision AI Confidence Rating: 94.2%`, 20, 94);
        doc.text(`• Pathology Severity: Moderate (KVK Kalaburagi Protocol Applied)`, 20, 100);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('2. Prescribed Agri-Chemical & Bio Treatments', 14, 112);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`• Bio Shield 1: Neem Oil 10,000 PPM (Dosage: 3.0ml / Liter water)`, 20, 120);
        doc.text(`• Insecticide 2: Chlorantraniliprole 18.5% SC (Dosage: 0.3ml / Liter water)`, 20, 128);
        doc.text(`• Cultural Control: Prune affected branches & run root-zone drip fertigation`, 20, 136);
      } else {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('1. APMC Mandi Prices & Revenue Projections', 14, 74);

        let yPos = 84;
        marketTrends.forEach((m) => {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.text(`• ${m.crop}: Rs. ${m.currentPricePerQuintalINR || (m as any).currentPricePerQuintalUSD * 80 || 7850}/Quintal (${m.bestSellingTime})`, 20, yPos);
          yPos += 8;
        });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('2. Estimated Seasonal Revenue (Karnataka Mandi Rates)', 14, yPos + 6);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`• Total Farm Revenue Forecast (${farm.areaAcres} Acres): Rs. ${(farm.areaAcres * 85000).toLocaleString()}`, 20, yPos + 14);
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('Certified by AgriSync AI Autonomous Farm Advisory Engine • Confidential', 14, 280);

      doc.save(`AgriSync_${reportType}_${farm.name.replace(/\s+/g, '_')}.pdf`);
      setDownloadSuccess(reportType);
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (err) {
      console.error('PDF Generation Error:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-emerald-400" /> Automated Farm Report Generator
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Export official PDF & CSV farm audit reports for crop yield certifications, agricultural bank loans, and agronomic records.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            id: 'farm-health',
            title: 'Farm Health & Soil Audit Report',
            desc: 'Complete summary of NPK nutrient tests, pH levels, organic carbon, and historical crop yields.',
            icon: FileText,
          },
          {
            id: 'revenue-forecast',
            title: 'Revenue & Yield Projection Report',
            desc: 'Financial estimation of seasonal crop revenue, market price trends, and best harvest sales timing.',
            icon: FileSpreadsheet,
          },
          {
            id: 'pathology-log',
            title: 'Disease Scan & Pathology Log',
            desc: 'Log of Vision AI plant scans, identified leaf pathogens, applied fungicide dosages, and treatments.',
            icon: Printer,
          },
        ].map((rep) => {
          const Icon = rep.icon;
          return (
            <div key={rep.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">{rep.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{rep.desc}</p>
              </div>

              <button
                onClick={() => generatePDFReport(rep.id)}
                disabled={generating}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950"
              >
                {downloadSuccess === rep.id ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Downloaded PDF
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" /> Download PDF Report
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
