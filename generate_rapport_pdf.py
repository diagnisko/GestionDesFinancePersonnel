# -*- coding: utf-8 -*-
"""Génère le rapport PDF du projet FinanceFlow (Groupe 4)."""
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

FONT_PATHS = [
    Path(r"C:\Windows\Fonts\arial.ttf"),
    Path(r"C:\Windows\Fonts\calibri.ttf"),
]
FONT_BOLD_PATHS = [
    Path(r"C:\Windows\Fonts\arialbd.ttf"),
    Path(r"C:\Windows\Fonts\calibrib.ttf"),
]


def register_fonts() -> tuple[str, str]:
    body = bold = "Helvetica"
    for p in FONT_PATHS:
        if p.exists():
            pdfmetrics.registerFont(TTFont("RapportBody", str(p)))
            body = "RapportBody"
            break
    for p in FONT_BOLD_PATHS:
        if p.exists():
            pdfmetrics.registerFont(TTFont("RapportBold", str(p)))
            bold = "RapportBold"
            break
    return body, bold


def main() -> None:
    out = Path(__file__).resolve().parent / "Rapport-Projet-FinanceFlow-G4.pdf"
    body_font, bold_font = register_fonts()

    doc = SimpleDocTemplate(
        str(out),
        pagesize=A4,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
    )

    styles = getSampleStyleSheet()
    title = ParagraphStyle(
        "CustomTitle",
        parent=styles["Heading1"],
        fontName=bold_font,
        fontSize=18,
        alignment=TA_CENTER,
        spaceAfter=12,
        textColor=colors.HexColor("#1a365d"),
    )
    h2 = ParagraphStyle(
        "CustomH2",
        parent=styles["Heading2"],
        fontName=bold_font,
        fontSize=14,
        spaceBefore=14,
        spaceAfter=8,
        textColor=colors.HexColor("#2c5282"),
    )
    body = ParagraphStyle(
        "CustomBody",
        parent=styles["Normal"],
        fontName=body_font,
        fontSize=11,
        leading=14,
        alignment=TA_JUSTIFY,
        spaceAfter=8,
    )
    small_center = ParagraphStyle(
        "SmallCenter",
        parent=styles["Normal"],
        fontName=body_font,
        fontSize=10,
        alignment=TA_CENTER,
        textColor=colors.grey,
    )

    story: list = []

    story.append(Paragraph("Rapport de projet", title))
    story.append(Paragraph("<b>FinanceFlow — Gestion des finances personnelles</b>", title))
    story.append(Spacer(1, 0.5 * cm))
    story.append(Paragraph("Application web — Groupe 4", small_center))
    story.append(Paragraph("Année universitaire 2025–2026", small_center))
    story.append(Spacer(1, 1 * cm))

    story.append(Paragraph("1. Présentation du projet", h2))
    story.append(
        Paragraph(
            "FinanceFlow est une application web dédiée à la <b>gestion des finances personnelles</b>. "
            "Elle permet aux utilisateurs de suivre leurs revenus et dépenses, de visualiser leur solde "
            "et d’analyser leurs habitudes financières grâce à des graphiques interactifs. "
            "Le projet a été mené en équipe de quatre personnes, avec répartition des tâches par branches Git "
            "et intégration finale dans une application unifiée.",
            body,
        )
    )

    story.append(Paragraph("2. Objectifs", h2))
    story.append(
        Paragraph(
            "• Offrir une interface claire (landing page, authentification, tableau de bord).<br/>"
            "• Permettre l’enregistrement des transactions et la consultation des statistiques.<br/>"
            "• Assurer la sécurisation de l’accès aux pages sensibles (routes protégées).<br/>"
            "• Déployer une version accessible en ligne pour démonstration.",
            body,
        )
    )

    story.append(Paragraph("3. Composition du groupe et rôles sur Git", h2))
    data = [
        ["Membre", "Rôle dans le groupe", "Branche Git", "Tâches principales"],
        [
            "Serigne Fallou Diagne",
            "Chef de projet",
            "feature/dashboard-logic",
            "Logique métier, gestion des données, validation, fusion du projet",
        ],
        [
            "Mamadou Sy",
            "Membre",
            "feature/landing",
            "Page d’accueil, design de base, animations",
        ],
        [
            "Mouhamed Liamidi Adeoti",
            "Membre",
            "feature/auth",
            "Connexion, inscription, sécurité",
        ],
        [
            "Mouhamed Ndiaye",
            "Membre",
            "feature/dashboard",
            "Interface du dashboard, affichage des graphiques",
        ],
    ]
    t = Table(data, colWidths=[3.2 * cm, 2.8 * cm, 3.5 * cm, 5.5 * cm])
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2c5282")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
                ("FONTNAME", (0, 0), (-1, 0), bold_font),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("FONTNAME", (0, 1), (-1, -1), body_font),
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f7fafc")]),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(t)
    story.append(Spacer(1, 0.3 * cm))

    story.append(Paragraph("4. Technologies et architecture", h2))
    story.append(
        Paragraph(
            "L’application est développée avec <b>React 19</b>, <b>TypeScript</b> et <b>Vite</b> pour le front-end. "
            "Le routage est assuré par <b>React Router</b>. Le style utilise <b>Tailwind CSS</b>. "
            "Les graphiques (courbes, barres, camembert) sont réalisés avec <b>Recharts</b>. "
            "Les données utilisateur et financières sont persistées côté client via le <b>localStorage</b> du navigateur. "
            "Un contexte d’authentification centralise la session et protège les routes du tableau de bord, "
            "des transactions, des statistiques et du profil.",
            body,
        )
    )

    story.append(Paragraph("5. Fonctionnalités livrées", h2))
    story.append(
        Paragraph(
            "• Landing page responsive (présentation, fonctionnalités, témoignages, pied de page).<br/>"
            "• Inscription, connexion et page mot de passe oublié.<br/>"
            "• Dashboard : solde, revenus, dépenses, cartes récapitulatives.<br/>"
            "• Pages Transactions, Statistiques et Profil accessibles après authentification.<br/>"
            "• Visualisations : graphiques en ligne, en barres et en secteurs.",
            body,
        )
    )

    story.append(Paragraph("6. Déploiement", h2))
    story.append(
        Paragraph(
            "Une version déployée de l’application est accessible à l’adresse suivante :<br/><br/>"
            '<a href="https://projet-gestion-des-finances.vercel.app/" color="blue">'
            "https://projet-gestion-des-finances.vercel.app/</a>",
            body,
        )
    )

    story.append(Paragraph("7. Conclusion", h2))
    story.append(
        Paragraph(
            "Le projet FinanceFlow illustre une démarche de développement collaboratif : "
            "travail en parallèle sur des branches thématiques, puis fusion et harmonisation du code. "
            "Les objectifs fonctionnels fixés (accueil, authentification, tableau de bord et analyses visuelles) "
            "sont couverts par l’application déployée. Des évolutions possibles incluent une API backend "
            "et une base de données pour remplacer ou compléter le stockage local.",
            body,
        )
    )

    story.append(Spacer(1, 1 * cm))
    story.append(Paragraph("Document généré automatiquement pour le rendu du rapport de groupe.", small_center))

    doc.build(story)
    print(f"PDF créé : {out}")


if __name__ == "__main__":
    main()
