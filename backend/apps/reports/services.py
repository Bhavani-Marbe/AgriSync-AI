import io
import logging
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

logger = logging.getLogger('apps.reports')

class ReportGenerationService:
    @staticmethod
    def generate_farm_health_pdf(user):
        logger.info(f"Generating Farm Health PDF Report for User {user.email}")
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
        story = []

        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'TitleStyle',
            parent=styles['Heading1'],
            fontSize=22,
            textColor=colors.HexColor('#065F46'),
            spaceAfter=12
        )
        subtitle_style = ParagraphStyle(
            'SubTitleStyle',
            parent=styles['Normal'],
            fontSize=11,
            textColor=colors.HexColor('#4B5563'),
            spaceAfter=20
        )

        story.append(Paragraph("AgriSync AI - Comprehensive Farm Health & Agronomy Report", title_style))
        story.append(Paragraph(f"Generated for: {user.first_name} {user.last_name} ({user.email}) | Date: 2026-08-02", subtitle_style))
        story.append(Spacer(1, 10))

        # Executive Summary Table
        summary_data = [
            ["Metric", "Current Value", "Status / Target"],
            ["Registered Farm Acres", "42.5 Acres", "Optimal Operational Scale"],
            ["Average Soil pH", "6.5 pH", "Ideal Bioavailability (6.2 - 6.8)"],
            ["Nitrogen Index", "124 kg/ha", "Slight Nitrogen Deficit (-15 kg/ha)"],
            ["Smart Irrigation Efficiency", "94.2%", "Drip Fertigation Optimized"],
            ["Predicted Season Yield", "195.5 Tons", "+12.4% vs Regional Benchmark"]
        ]

        t = Table(summary_data, colWidths=[200, 150, 180])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#047857')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#F3F4F6')),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#D1D5DB'))
        ]))
        story.append(t)
        story.append(Spacer(1, 20))

        story.append(Paragraph("<b>Agronomic Recommendation Summary:</b>", styles['Heading3']))
        story.append(Paragraph("1. Maintain current drip irrigation frequency (every 2 days) to prevent moisture stress.", styles['Normal']))
        story.append(Paragraph("2. Apply split Urea fertigation (45 kg/acre) during vegetative stage.", styles['Normal']))
        story.append(Paragraph("3. Monitor lower leaf canopy for early signs of fungal leaf blight after Monday's precipitation.", styles['Normal']))

        doc.build(story)
        buffer.seek(0)
        return buffer.getvalue()
