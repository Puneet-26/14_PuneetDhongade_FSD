"""
Full Stack Development - Practical Assignment Submission Generator
Student: Puneet Sudam Dhongade | Roll No: 14 | B.Tech (AI & DS) Semester V
Generates:
1. 14_PuneetDhongade_FSD_Assignment.docx
2. 14_PuneetDhongade_FSD_Assignment.pdf
"""

import os
import sys
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SCREENSHOTS_DIR = os.path.join(BASE_DIR, 'screenshots')
DOCX_OUTPUT = os.path.join(BASE_DIR, '14_PuneetDhongade_FSD_Assignment.docx')
PDF_OUTPUT = os.path.join(BASE_DIR, '14_PuneetDhongade_FSD_Assignment.pdf')

# Colors
COLOR_PRIMARY = RGBColor(30, 58, 138)       # Deep Navy #1E3A8A
COLOR_SECONDARY = RGBColor(37, 99, 235)     # Royal Blue #2563EB
COLOR_DARK = RGBColor(15, 23, 42)           # Dark Slate #0F172A
COLOR_GRAY = RGBColor(71, 85, 105)          # Slate #475569
COLOR_CODE_BG = "F8FAFC"
COLOR_TH_BG = "1E3A8A"
COLOR_ALT_ROW = "F1F5F9"
COLOR_BORDER = "CBD5E1"

def set_cell_background(cell, hex_color):
    """Sets cell background shading."""
    tcPr = cell._tc.get_or_add_tcPr()
    # Remove existing shading if any
    for child in list(tcPr):
        if child.tag.endswith('shd'):
            tcPr.remove(child)
    tcPr.append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>'))

def set_cell_margins(cell, top=120, bottom=120, left=160, right=160):
    """Sets cell internal padding in dxa (1 pt = 20 dxa)."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def style_table(table, col_widths, align_left=True):
    """Applies borders, zebra striping, and cell padding to a table."""
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r_idx, row in enumerate(table.rows):
        is_header = (r_idx == 0)
        # Prevent row split across pages
        trPr = row._tr.get_or_add_trPr()
        trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
        if is_header:
            trPr.append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))

        for c_idx, cell in enumerate(row.cells):
            if c_idx < len(col_widths):
                cell.width = Inches(col_widths[c_idx])
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            set_cell_margins(cell, top=100, bottom=100, left=140, right=140)

            if is_header:
                set_cell_background(cell, COLOR_TH_BG)
                for p in cell.paragraphs:
                    p.paragraph_format.space_before = Pt(2)
                    p.paragraph_format.space_after = Pt(2)
                    for run in p.runs:
                        run.font.bold = True
                        run.font.color.rgb = RGBColor(255, 255, 255)
                        run.font.size = Pt(9.5)
                        run.font.name = 'Calibri'
            else:
                if r_idx % 2 == 1:
                    set_cell_background(cell, "FFFFFF")
                else:
                    set_cell_background(cell, COLOR_ALT_ROW)
                for p in cell.paragraphs:
                    p.paragraph_format.space_before = Pt(1.5)
                    p.paragraph_format.space_after = Pt(1.5)
                    for run in p.runs:
                        run.font.size = Pt(9)
                        run.font.color.rgb = COLOR_DARK
                        run.font.name = 'Calibri'

def add_callout(doc, text, bold_prefix=""):
    """Adds a stylish callout box for notes."""
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, "EFF6FF")
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)

    # Left border only (accent)
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:left w:val="single" w:sz="24" w:space="0" w:color="2563EB"/>'
        f'<w:top w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'<w:bottom w:val="none"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)

    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r1 = p.add_run(bold_prefix + " ")
        r1.font.bold = True
        r1.font.color.rgb = COLOR_PRIMARY
        r1.font.size = Pt(9.5)
        r1.font.name = 'Calibri'
    r2 = p.add_run(text)
    r2.font.color.rgb = COLOR_DARK
    r2.font.size = Pt(9.5)
    r2.font.name = 'Calibri'

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

def add_heading_styled(doc, text, level=1):
    """Adds cleanly formatted headings."""
    h = doc.add_heading(text, level=level)
    h.paragraph_format.keep_with_next = True
    run = h.runs[0]
    if level == 1:
        h.paragraph_format.space_before = Pt(14)
        h.paragraph_format.space_after = Pt(6)
        run.font.size = Pt(15)
        run.font.bold = True
        run.font.color.rgb = COLOR_PRIMARY
        run.font.name = 'Calibri'
    elif level == 2:
        h.paragraph_format.space_before = Pt(10)
        h.paragraph_format.space_after = Pt(4)
        run.font.size = Pt(12)
        run.font.bold = True
        run.font.color.rgb = COLOR_SECONDARY
        run.font.name = 'Calibri'
    elif level == 3:
        h.paragraph_format.space_before = Pt(8)
        h.paragraph_format.space_after = Pt(2)
        run.font.size = Pt(10.5)
        run.font.bold = True
        run.font.color.rgb = COLOR_DARK
        run.font.name = 'Calibri'
    return h

def add_code_file(doc, file_rel_path, lang=""):
    """Reads a file from the repository and embeds it as a shaded code block."""
    full_path = os.path.join(BASE_DIR, file_rel_path)
    if not os.path.exists(full_path):
        return

    try:
        with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
            code_content = f.read()
    except Exception as e:
        code_content = f"// Error reading file: {e}"

    # File Label
    lbl_p = doc.add_paragraph()
    lbl_p.paragraph_format.space_before = Pt(8)
    lbl_p.paragraph_format.space_after = Pt(2)
    lbl_p.paragraph_format.keep_with_next = True
    r_tag = lbl_p.add_run(f"📄 File: {file_rel_path}")
    r_tag.font.bold = True
    r_tag.font.size = Pt(9)
    r_tag.font.color.rgb = COLOR_PRIMARY
    r_tag.font.name = 'Consolas'

    # Single-cell table for shaded container
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, COLOR_CODE_BG)
    set_cell_margins(cell, top=100, bottom=100, left=140, right=140)

    # Border
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:left w:val="single" w:sz="12" w:space="0" w:color="{COLOR_BORDER}"/>'
        f'<w:top w:val="single" w:sz="12" w:space="0" w:color="{COLOR_BORDER}"/>'
        f'<w:right w:val="single" w:sz="12" w:space="0" w:color="{COLOR_BORDER}"/>'
        f'<w:bottom w:val="single" w:sz="12" w:space="0" w:color="{COLOR_BORDER}"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)

    # Paragraph in cell
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.05

    run = p.add_run(code_content)
    run.font.name = 'Consolas'
    run.font.size = Pt(8.5)
    run.font.color.rgb = COLOR_DARK

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

def add_screenshot(doc, img_name, caption_text):
    """Embeds a screenshot image with a centered caption."""
    img_path = os.path.join(SCREENSHOTS_DIR, img_name)
    if not os.path.exists(img_path):
        print(f"Warning: Screenshot not found: {img_path}")
        return

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True

    run = p.add_run()
    run.add_picture(img_path, width=Inches(6.2))

    cap_p = doc.add_paragraph()
    cap_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    cap_p.paragraph_format.space_before = Pt(0)
    cap_p.paragraph_format.space_after = Pt(10)
    c_run = cap_p.add_run(caption_text)
    c_run.font.italic = True
    c_run.font.size = Pt(9.5)
    c_run.font.color.rgb = COLOR_GRAY
    c_run.font.name = 'Calibri'

def build_document():
    print("Building Document...")
    doc = docx.Document()

    # Page Margins: 0.8 inch left/right/top/bottom
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)
        section.different_first_page_header_footer = True

        # Header for later pages
        header = section.header
        hp = header.paragraphs[0]
        hp.text = "Full Stack Development (Web Dev) | Student Roll No: 14 (Puneet Dhongade)"
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hp.paragraph_format.space_after = Pt(0)
        for r in hp.runs:
            r.font.size = Pt(8.5)
            r.font.color.rgb = COLOR_GRAY
            r.font.name = 'Calibri'

        # Footer
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.text = "Department of Artificial Intelligence & Data Science | Bus Pass Management System | B.Tech Semester V"
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for r in fp.runs:
            r.font.size = Pt(8.5)
            r.font.color.rgb = COLOR_GRAY
            r.font.name = 'Calibri'

    # =========================================================================
    # PAGE 1: HEADER BLOCK & PRACTICAL SPECIFICATION
    # =========================================================================
    title_p = doc.add_paragraph()
    title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title_p.paragraph_format.space_before = Pt(0)
    title_p.paragraph_format.space_after = Pt(2)
    t_run = title_p.add_run("FULL STACK DEVELOPMENT – PROGRAMMING EXERCISE")
    t_run.font.bold = True
    t_run.font.size = Pt(17)
    t_run.font.color.rgb = COLOR_PRIMARY
    t_run.font.name = 'Calibri'

    sub_p = doc.add_paragraph()
    sub_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    sub_p.paragraph_format.space_before = Pt(0)
    sub_p.paragraph_format.space_after = Pt(2)
    s_run = sub_p.add_run("Individual Practical Assignment | B.Tech (AI & DS) | Semester V")
    s_run.font.size = Pt(11)
    s_run.font.color.rgb = COLOR_SECONDARY
    s_run.font.name = 'Calibri'

    dept_p = doc.add_paragraph()
    dept_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    dept_p.paragraph_format.space_before = Pt(0)
    dept_p.paragraph_format.space_after = Pt(10)
    d_run = dept_p.add_run("Department: Artificial Intelligence and Data Science")
    d_run.font.size = Pt(10)
    d_run.font.color.rgb = COLOR_GRAY
    d_run.font.name = 'Calibri'

    # Metadata Table
    meta_table = doc.add_table(rows=2, cols=4)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    col_w = [1.5, 2.0, 1.4, 1.6]
    row0 = meta_table.rows[0]
    row0.cells[0].paragraphs[0].text = "Student Roll No."
    row0.cells[1].paragraphs[0].text = "14"
    row0.cells[2].paragraphs[0].text = "Student Name"
    row0.cells[3].paragraphs[0].text = "Puneet Sudam Dhongade"

    row1 = meta_table.rows[1]
    row1.cells[0].paragraphs[0].text = "Subject"
    row1.cells[1].paragraphs[0].text = "Full Stack Development: Web Dev"
    row1.cells[2].paragraphs[0].text = "Programs Assigned"
    row1.cells[3].paragraphs[0].text = "5 (CO1 to CO6)"

    style_table(meta_table, col_w)
    # Style label cells specifically in metadata table
    for row in meta_table.rows:
        row.cells[0].paragraphs[0].runs[0].font.bold = True
        row.cells[2].paragraphs[0].runs[0].font.bold = True

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # Instructions
    add_heading_styled(doc, "Instructions", level=2)
    instructions = [
        "Complete all five assigned programs individually.",
        "Submit source code, screenshots of execution/output and a brief explanation for each program.",
        "Use meaningful variable names, input validation and appropriate error handling.",
        "For database/deployment tasks, submit schema or models, API endpoints and deployment links if available. Do not include passwords or secret keys.",
        "The five programs collectively cover all six course outcomes (CO1–CO6)."
    ]
    for inst in instructions:
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run(inst)
        r.font.size = Pt(9.5)
        r.font.color.rgb = COLOR_DARK
        r.font.name = 'Calibri'

    # Assigned Programs Table
    add_heading_styled(doc, "Assigned Programs & Curriculum Mapping", level=2)
    prog_table = doc.add_table(rows=6, cols=3)
    p_cols = [0.6, 5.0, 0.9]
    headers = ["No.", "Program Title / Task", "CO"]
    for i, h in enumerate(headers):
        prog_table.rows[0].cells[i].paragraphs[0].text = h

    tasks = [
        ("1", "Build a browser-based bus pass management interface using HTML, CSS and JavaScript. Use DOM manipulation and event handling to capture and validate user input; retrieve sample data with Fetch API and async/await, and display it dynamically. Demonstrate suitable HTTP methods and JSON request/response data, with search, filtering and input validation.", "CO1,\nCO2"),
        ("2", "Develop a React application for bus pass management using reusable functional components, JSX, props and state. Implement a data-entry form and listing view; use useState and useEffect, conditional rendering, event handling and React Router navigation.", "CO3"),
        ("3", "Create a Node.js server-side utility for bus pass management. Use the File System and Path modules to store and retrieve records, and use Streams or EventEmitter to process updates or notifications. Expose functionality through a basic HTTP server without Express.", "CO4"),
        ("4", "Develop an Express.js REST API for bus pass management. Implement CRUD routes using GET, POST, PUT and DELETE; add middleware for request logging and input validation, centralized error handling, and a protected route using JWT authentication with bcrypt-hashed passwords.", "CO5"),
        ("5", "Integrate the bus pass management React frontend with an Express.js backend and database. Persist application records using PostgreSQL with Sequelize or MongoDB with Mongoose; configure CORS and environment variables, connect the frontend to the API, and prepare deployment on Vercel (frontend) and Render (backend).", "CO6")
    ]
    for r_idx, (num, desc, co) in enumerate(tasks, start=1):
        row = prog_table.rows[r_idx]
        row.cells[0].paragraphs[0].text = num
        row.cells[1].paragraphs[0].text = desc
        row.cells[2].paragraphs[0].text = co

    style_table(prog_table, p_cols)

    # =========================================================================
    # PROGRAM 1
    # =========================================================================
    doc.add_page_break()
    add_heading_styled(doc, "PROGRAM 1: Browser-Based Bus Pass Management Interface", level=1)
    add_callout(doc, "Course Outcomes Covered: CO1 (Client-Side Markup & Responsive Styling), CO2 (Dynamic DOM Manipulation & Asynchronous Fetch API)", "Curriculum Alignment:")

    add_heading_styled(doc, "1. Aim", level=2)
    p = doc.add_paragraph("To design and develop an interactive, browser-based transit pass management interface using semantic HTML5, modern CSS3 card grids, and vanilla JavaScript (ES6+). The application captures and validates commuter inputs, fetches and displays JSON records asynchronously via Fetch API and async/await, provides instant search/filter capabilities, and visualizes network operations through a simulated HTTP activity console.")
    p.paragraph_format.line_spacing = 1.15
    p.paragraph_format.space_after = Pt(4)

    add_heading_styled(doc, "2. Theory", level=2)
    theory_p1 = (
        "Client-side web development relies on the coordinated interplay of HTML5 for structural semantics, "
        "CSS3 for responsive visual presentation, and JavaScript for dynamic Document Object Model (DOM) manipulation. "
        "Modern applications retrieve data asynchronously from backend endpoints using the Fetch API. Utilizing "
        "async/await syntax allows asynchronous promises to be handled in a readable, synchronous style without blocking "
        "the main UI thread. Event handling through DOM listeners enables reactive user experiences such as instant search "
        "filtering, while strict client-side validation guarantees data cleanliness before dispatching simulated HTTP requests "
        "(GET, POST, DELETE) to manage transit pass lifecycles."
    )
    p = doc.add_paragraph(theory_p1)
    p.paragraph_format.line_spacing = 1.15

    add_heading_styled(doc, "3. Technologies Used", level=2)
    for tech in ["Semantic HTML5 (Forms, Data Inputs, Badges, Metrics Containers)", "CSS3 (CSS Variables, Flexbox, CSS Grid Layout, Responsive Breakpoints)", "Vanilla JavaScript (ES6+, DOM Events, Async/Await, Array Filter/Map)", "Fetch API with Offline Fallback Mechanism (for file:// protocol resilience)", "JSON Data Format (sample_passes.json)"]:
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(1.5)
        p.add_run(tech).font.name = 'Calibri'

    add_heading_styled(doc, "4. Implementation Details", level=2)
    for item in [
        "Structured Layout: Designed an academic banner featuring Student Roll No. 14, Puneet Dhongade, B.Tech (AI & DS), accompanied by aggregate summary metrics (Total Passes, Student Passes, Monthly Passes, Gross Fare).",
        "Form & Validation: Configured inputs for Passenger Name, Mumbai Metropolitan Bus Route dropdown (with custom route option), Pass Category (Student, Monthly, Senior Citizen), and Validity Duration with live tariff computation.",
        "Asynchronous Data Loading: Executed loadPasses() utilizing fetch('sample_passes.json') with async/await. Implemented a robust in-memory array fallback to allow immediate execution under the browser's file:// security origin.",
        "Dynamic Filtering: Provided real-time live search across passenger names, pass identifiers, and routes, combined with a categorical filter selector.",
        "Simulated HTTP Console: Built an embedded logging stream displaying simulated HTTP methods (GET, POST, DELETE) with status codes (200, 201, 400) and timestamps to visually demonstrate RESTful request/response cycles."
    ]:
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(1.5)
        p.add_run(item).font.name = 'Calibri'

    add_heading_styled(doc, "5. Source Code", level=2)
    add_code_file(doc, "Program1/sample_passes.json")
    add_code_file(doc, "Program1/index.html")
    add_code_file(doc, "Program1/style.css")
    add_code_file(doc, "Program1/script.js")

    add_heading_styled(doc, "6. Execution Output & Screenshots", level=2)
    add_screenshot(doc, "p1_1.png", "Figure 1.1: Program 1 - Responsive Bus Pass Management Interface with Aggregate Metrics, Application Form, and Active Mumbai Route Passes")
    add_screenshot(doc, "p1_2.png", "Figure 1.2: Program 1 - Simulated HTTP Activity Console Visualizing Asynchronous GET, POST, and DELETE Request/Response Lifecycle")

    # =========================================================================
    # PROGRAM 2
    # =========================================================================
    doc.add_page_break()
    add_heading_styled(doc, "PROGRAM 2: React Application for Bus Pass Management", level=1)
    add_callout(doc, "Course Outcomes Covered: CO3 (Component-Based UI Architecture, JSX, State & React Router)", "Curriculum Alignment:")

    add_heading_styled(doc, "1. Aim", level=2)
    p = doc.add_paragraph("To engineer a single-page React application for transit bus pass administration using Vite, JSX, and React Router v6. The project establishes a reusable component hierarchy (Navbar, PassList, PassCard, PassForm), manages component state with useState, synchronizes state changes to browser localStorage with useEffect, and implements seamless client-side routing between the Pass Directory and the Pass Application Form.")
    p.paragraph_format.line_spacing = 1.15

    add_heading_styled(doc, "2. Theory", level=2)
    theory_p2 = (
        "React is a declarative, component-driven library for building reactive user interfaces. It organizes applications "
        "into modular functional components that manage state and receive configuration via immutable props. The useState hook "
        "maintains localized or lifted state, triggering efficient Virtual DOM re-renders upon updates. The useEffect hook manages "
        "side effects, allowing application state to be serialized and preserved in the browser's persistent localStorage. "
        "Client-side routing via React Router enables multi-view single-page applications without full-page browser reloads, "
        "enhancing performance and user experience."
    )
    p = doc.add_paragraph(theory_p2)
    p.paragraph_format.line_spacing = 1.15

    add_heading_styled(doc, "3. Technologies Used", level=2)
    for tech in ["React 18 (Functional Components, Hooks: useState, useEffect, useMemo)", "React Router v6 (BrowserRouter, Routes, Route, NavLink, useNavigate)", "Vite 5 (Next-Generation Frontend Build Tool & Dev Server)", "JSX (JavaScript XML Syntax Extension)", "Browser LocalStorage API (Persistent Client State)", "Modern CSS3 (Flexbox, Grid, Component-Scoped Theme Tokens)"]:
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(1.5)
        p.add_run(tech).font.name = 'Calibri'

    add_heading_styled(doc, "4. Implementation Details", level=2)
    for item in [
        "Component Modularization: Separated responsibilities into Navbar.jsx (navigation & student badge), PassList.jsx (directory listing with filters & metrics), PassCard.jsx (individual pass presentation), and PassForm.jsx (application data-entry).",
        "State Lifting & Synchronization: Lifted the master passes state into App.jsx, initialized from localStorage or default Mumbai seed data, with an automatic useEffect synchronization hook.",
        "Client-Side Navigation: Implemented declarative routing for '/' (Pass Directory) and '/apply' (Data Entry Form) using React Router v6.",
        "Conditional Rendering: Configured empty-state views displaying recovery actions if search queries yield no matching passes or if all records are cleared.",
        "Concession Calculation: Implemented automated tariff evaluation (Student 50% discount, Senior Citizen 40% discount) updating the UI dynamically as validity and category selections change."
    ]:
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(1.5)
        p.add_run(item).font.name = 'Calibri'

    add_heading_styled(doc, "5. Source Code", level=2)
    add_code_file(doc, "Program2/package.json")
    add_code_file(doc, "Program2/src/data/initialPasses.js")
    add_code_file(doc, "Program2/src/components/Navbar.jsx")
    add_code_file(doc, "Program2/src/components/PassCard.jsx")
    add_code_file(doc, "Program2/src/components/PassList.jsx")
    add_code_file(doc, "Program2/src/components/PassForm.jsx")
    add_code_file(doc, "Program2/src/App.jsx")

    add_heading_styled(doc, "6. Execution Output & Screenshots", level=2)
    add_screenshot(doc, "p2_1.png", "Figure 2.1: Program 2 - React Transit Portal Directory View with Dynamic Metrics, Live Search/Sort Bar, and Seeded Bus Passes")
    add_screenshot(doc, "p2_2.png", "Figure 2.2: Program 2 - React Data-Entry Pass Application Form (/apply) with Real-Time Concession Computation and Controlled Inputs")

    # =========================================================================
    # PROGRAM 3
    # =========================================================================
    doc.add_page_break()
    add_heading_styled(doc, "PROGRAM 3: Core Node.js Server Utility (Without Express)", level=1)
    add_callout(doc, "Course Outcomes Covered: CO4 (Server-Side JavaScript, Asynchronous File I/O & Event-Driven Architecture)", "Curriculum Alignment:")

    add_heading_styled(doc, "1. Aim", level=2)
    p = doc.add_paragraph("To build an asynchronous server-side utility for transit pass records using ONLY native Node.js standard modules (http, fs, path, and events) without Express or external dependencies. The server serves records from passes.json via Path and File System modules, processes requests through a custom EventEmitter (passEmitter), and logs events asynchronously to activity.log using fs.createWriteStream.")
    p.paragraph_format.line_spacing = 1.15

    add_heading_styled(doc, "2. Theory", level=2)
    theory_p3 = (
        "Node.js runs JavaScript on the server using Google Chrome's V8 engine and an asynchronous, non-blocking event loop. "
        "At its foundation, the native 'http' module allows developers to handle HTTP request and response streams directly. "
        "The 'fs' and 'path' modules provide cross-platform file system manipulation with non-blocking Promise-based file access. "
        "Event-driven programming in Node.js is powered by the 'EventEmitter' class, enabling a publisher-subscriber model "
        "where domain actions emit custom events. Writable streams ('fs.createWriteStream') allow high-throughput logging by "
        "piping data to disk asynchronously without accumulating memory overhead or blocking concurrent client requests."
    )
    p = doc.add_paragraph(theory_p3)
    p.paragraph_format.line_spacing = 1.15

    add_heading_styled(doc, "3. Technologies Used", level=2)
    for tech in ["Node.js Runtime (v24.x LTS)", "Built-in 'http' Module (Raw HTTP Server & Request Dispatcher)", "Built-in 'fs' & 'fs.promises' Modules (Asynchronous File I/O)", "Built-in 'path' Module (Cross-Platform Path Resolution)", "Built-in 'events' Module (Custom EventEmitter Implementation)", "Node.js Writable Streams (fs.createWriteStream for Persistent Logging)"]:
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(1.5)
        p.add_run(tech).font.name = 'Calibri'

    add_heading_styled(doc, "4. Implementation Details", level=2)
    for item in [
        "Native Server: Created an HTTP server on port 3001 using http.createServer() parsing chunked streams and routing endpoints.",
        "Custom EventEmitter: Subclassed EventEmitter into PassEventEmitter, listening for 'passFetched' and 'passAdded' events.",
        "Stream Logging: Configured an asynchronous write stream (fs.createWriteStream) writing timestamped ISO audit records to activity.log.",
        "JSON Storage: Stored and queried bus pass records in passes.json using path.join() and fs.promises.readFile/writeFile.",
        "Automated Test Script: Developed test_client.js using native http.request to automatically test GET /, GET /passes, POST /passes, verify persistence, and display the resulting activity.log stream."
    ]:
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(1.5)
        p.add_run(item).font.name = 'Calibri'

    add_heading_styled(doc, "5. Source Code", level=2)
    add_code_file(doc, "Program3/passes.json")
    add_code_file(doc, "Program3/server.js")
    add_code_file(doc, "Program3/test_client.js")

    add_heading_styled(doc, "6. Execution Output & Screenshots", level=2)
    add_screenshot(doc, "p3_1.png", "Figure 3.1: Program 3 - Core Node.js HTTP Server Status & Endpoint Manifest on Port 3001 (GET /) Indicating Student Roll No. 14")

    # =========================================================================
    # PROGRAM 4
    # =========================================================================
    doc.add_page_break()
    add_heading_styled(doc, "PROGRAM 4: Express.js REST API with JWT Authentication", level=1)
    add_callout(doc, "Course Outcomes Covered: CO5 (RESTful Architecture, Custom Middleware, Password Hashing & JWT Security)", "Curriculum Alignment:")

    add_heading_styled(doc, "1. Aim", level=2)
    p = doc.add_paragraph("To architect and implement a production-grade Express.js REST API providing complete CRUD operations for a Bus Pass Management system, secured with JSON Web Token (JWT) Bearer authentication and bcrypt password encryption. The architecture includes modular routers, custom request logging middleware, input validation middleware, and centralized error handling.")
    p.paragraph_format.line_spacing = 1.15

    add_heading_styled(doc, "2. Theory", level=2)
    theory_p4 = (
        "REST (Representational State Transfer) is an architectural style for distributed web services using standard HTTP verbs "
        "(GET, POST, PUT, DELETE). Express.js streamlines web application development via its middleware pipeline, where requests "
        "pass sequentially through logging, parsing, authentication, and error-handling layers. Stateless authentication is implemented "
        "using JSON Web Tokens (JWT), which cryptographically sign identity payloads with a secret key. Passwords must never be stored "
        "in plaintext; bcryptjs applies a cryptographic one-way hashing function combined with unique salt rounds to defend against "
        "rainbow table and brute-force attacks."
    )
    p = doc.add_paragraph(theory_p4)
    p.paragraph_format.line_spacing = 1.15

    add_heading_styled(doc, "3. Technologies Used", level=2)
    for tech in ["Express.js (Web Framework & Middleware Pipeline)", "jsonwebtoken (JWT Creation & Bearer Verification)", "bcryptjs (Salted Cryptographic Password Hashing)", "CORS (Cross-Origin Resource Sharing Middleware)", "dotenv (Environment Variable Configuration)"]:
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(1.5)
        p.add_run(tech).font.name = 'Calibri'

    add_heading_styled(doc, "4. Implementation Details", level=2)
    for item in [
        "Custom Middleware: Built requestLogger.js (measuring response latency and status codes), validator.js (schema constraints), and errorHandler.js (standardized JSON error responder).",
        "Authentication Routes: Implemented POST /api/auth/register (10 salt rounds with bcrypt) and POST /api/auth/login (returning signed JWT with 2h expiration).",
        "Protected CRUD Routes: Guarded state-mutating endpoints (POST, PUT, DELETE on /api/passes) with authenticateToken middleware, while keeping retrieval (GET /api/passes) public.",
        "Comprehensive Test Suite: Developed test_api.js executing the entire flow (Register -> Login -> Unauthorized 401 Check -> Authorized POST 201 -> GET 200 -> PUT 200 -> DELETE 200) in a single run."
    ]:
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(1.5)
        p.add_run(item).font.name = 'Calibri'

    add_heading_styled(doc, "API Endpoints Specification Table", level=3)
    api_table = doc.add_table(rows=9, cols=4)
    api_cols = [0.9, 1.8, 1.2, 2.6]
    api_headers = ["Method", "Endpoint", "Auth Required", "Description & Response Status"]
    for i, h in enumerate(api_headers):
        api_table.rows[0].cells[i].paragraphs[0].text = h

    routes_data = [
        ("GET", "/", "Public", "API discovery, student metadata, status check (200 OK)"),
        ("POST", "/api/auth/register", "Public", "Registers new user with bcrypt password hashing (201 Created)"),
        ("POST", "/api/auth/login", "Public", "Validates credentials, returns signed Bearer JWT (200 OK)"),
        ("GET", "/api/passes", "Public", "Retrieves all passes with search/type filters (200 OK)"),
        ("GET", "/api/passes/:id", "Public", "Retrieves single pass by identifier (200 OK / 404)"),
        ("POST", "/api/passes", "Bearer JWT", "Issues new bus pass with validation (201 Created / 401)"),
        ("PUT", "/api/passes/:id", "Bearer JWT", "Updates route, validity, or status (200 OK / 401 / 404)"),
        ("DELETE", "/api/passes/:id", "Bearer JWT", "Revokes and removes pass from system (200 OK / 401 / 404)")
    ]
    for r_idx, (m, ep, auth, desc) in enumerate(routes_data, start=1):
        r = api_table.rows[r_idx]
        r.cells[0].paragraphs[0].text = m
        r.cells[1].paragraphs[0].text = ep
        r.cells[2].paragraphs[0].text = auth
        r.cells[3].paragraphs[0].text = desc

    style_table(api_table, api_cols)

    add_heading_styled(doc, "5. Source Code", level=2)
    add_code_file(doc, "Program4/package.json")
    add_code_file(doc, "Program4/middleware/requestLogger.js")
    add_code_file(doc, "Program4/middleware/validator.js")
    add_code_file(doc, "Program4/middleware/auth.js")
    add_code_file(doc, "Program4/middleware/errorHandler.js")
    add_code_file(doc, "Program4/routes/authRoutes.js")
    add_code_file(doc, "Program4/routes/passRoutes.js")
    add_code_file(doc, "Program4/server.js")
    add_code_file(doc, "Program4/test_api.js")

    add_heading_styled(doc, "6. Execution Output & Screenshots", level=2)
    add_screenshot(doc, "p4_1.png", "Figure 4.1: Program 4 - Express.js REST API Root Explorer & Endpoint Documentation on Port 5001 with Roll No. 14 Identity")

    # =========================================================================
    # PROGRAM 5
    # =========================================================================
    doc.add_page_break()
    add_heading_styled(doc, "PROGRAM 5: Full-Stack Integration (MERN Stack & Cloud Deployment)", level=1)
    add_callout(doc, "Course Outcomes Covered: CO6 (Full-Stack MERN Architecture, Database Modeling, CORS & Cloud Deployment)", "Curriculum Alignment:")

    add_heading_styled(doc, "1. Aim", level=2)
    p = doc.add_paragraph("To develop, integrate, and configure an end-to-end full-stack Bus Pass Management system connecting a React + Vite frontend with an Express.js backend and a MongoDB database modeled via Mongoose. The system supports full-stack JWT authentication, real-time API communication, strict database schema enforcement, and contains production deployment blueprints for Vercel (frontend) and Render (backend).")
    p.paragraph_format.line_spacing = 1.15

    add_heading_styled(doc, "2. Theory", level=2)
    theory_p5 = (
        "Full-stack web engineering combines client-side presentation, application business logic, and persistent database storage. "
        "The MERN stack (MongoDB, Express, React, Node.js) utilizes JavaScript across all tiers, eliminating impedance mismatch. "
        "Mongoose acts as an Object Data Modeling (ODM) library for MongoDB, providing strong schema definitions, type casting, "
        "validation rules, and document lifecycle hooks. Cross-Origin Resource Sharing (CORS) allows the React client running on a "
        "distinct port/domain to communicate securely with the backend API. Modern cloud platforms such as Vercel (specialized in "
        "edge static site and SPA hosting) and Render (containerized backend web service hosting) enable automated CI/CD deployments "
        "driven by declarative configuration manifests (vercel.json, render.yaml)."
    )
    p = doc.add_paragraph(theory_p5)
    p.paragraph_format.line_spacing = 1.15

    add_heading_styled(doc, "3. Technologies Used", level=2)
    for tech in ["MongoDB & Mongoose ODM (Schema Validation, Indexes, Virtuals, Pre-Save Hooks)", "Express.js & Node.js (RESTful Backend API Layer)", "React 18 & Vite (Client-Side SPA Architecture)", "JSON Web Tokens (JWT) & bcryptjs (Full-Stack Security)", "CORS Middleware (Cross-Origin Resource Sharing)", "Vercel Deployment (vercel.json SPA Rewrite Configuration)", "Render Deployment (render.yaml Infrastructure-as-Code Blueprint)"]:
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(1.5)
        p.add_run(tech).font.name = 'Calibri'

    add_heading_styled(doc, "4. Implementation Details", level=2)
    for item in [
        "Backend Architecture: Configured an Express server connected to MongoDB via Mongoose. Designed graceful in-memory fallback handling to guarantee full functionality both offline and with MongoDB Atlas.",
        "Database Schemas: Engineered BusPass.js (with passId, passengerName, route, category enums, validityDays, price, expiryDate, status) and User.js (with encrypted password hashing).",
        "Frontend API Layer: Created api.js centralizing HTTP requests, injecting Authorization: Bearer tokens automatically from localStorage.",
        "Authentication Workflow: Designed AuthModal.jsx supporting Tab-based switching between Sign In and Create Account.",
        "Cloud Deployment Manifests: Authored render.yaml for automated backend provisioning on Render and vercel.json with SPA rewrites for Vercel."
    ]:
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(1.5)
        p.add_run(item).font.name = 'Calibri'

    add_heading_styled(doc, "Mongoose Schema Specification: BusPass", level=3)
    schema_table = doc.add_table(rows=11, cols=4)
    schema_cols = [1.3, 1.2, 1.8, 2.2]
    schema_headers = ["Field Name", "Mongoose Type", "Constraints / Validation", "Description"]
    for i, h in enumerate(schema_headers):
        schema_table.rows[0].cells[i].paragraphs[0].text = h

    schema_data = [
        ("passId", "String", "Required, Unique, Indexed, Trimmed", "Unique identifier (e.g. BP-M101)"),
        ("passengerName", "String", "Required, Min: 3 chars, Trimmed", "Full legal name of passenger"),
        ("route", "String", "Required, Trimmed", "Mumbai transit route corridor"),
        ("passType", "String", "Required, Enum: Student, Monthly, Senior", "Concession category for fare"),
        ("validityDays", "Number", "Required, Minimum: 1, Default: 30", "Active validity period in days"),
        ("price", "Number", "Required, Minimum: 0", "Fare after applying concession rate"),
        ("issueDate", "Date", "Required, Default: Date.now", "Timestamp of pass generation"),
        ("expiryDate", "Date", "Required", "Calculated pass expiration date"),
        ("status", "String", "Enum: Active, Expired, Suspended", "Current pass lifecycle status"),
        ("issuedBy", "String", "Default: BEST Transit Authority", "Issuing transit administrative unit")
    ]
    for r_idx, (fn, tp, cns, dsc) in enumerate(schema_data, start=1):
        r = schema_table.rows[r_idx]
        r.cells[0].paragraphs[0].text = fn
        r.cells[1].paragraphs[0].text = tp
        r.cells[2].paragraphs[0].text = cns
        r.cells[3].paragraphs[0].text = dsc

    style_table(schema_table, schema_cols)

    add_heading_styled(doc, "User Authentication Schema: User", level=3)
    user_table = doc.add_table(rows=5, cols=4)
    u_cols = [1.3, 1.2, 1.8, 2.2]
    u_headers = ["Field Name", "Type", "Constraints", "Description"]
    for i, h in enumerate(u_headers):
        user_table.rows[0].cells[i].paragraphs[0].text = h

    u_data = [
        ("username", "String", "Required, Unique, Min: 3 chars", "Commuter unique login handle"),
        ("email", "String", "Required, Unique, Email Regex Match", "User contact email address"),
        ("password", "String", "Required, Min: 6, Salted Hash", "bcrypt-hashed encrypted string"),
        ("role", "String", "Enum: Student, Admin, Officer", "Role-based access level")
    ]
    for r_idx, (fn, tp, cns, dsc) in enumerate(u_data, start=1):
        r = user_table.rows[r_idx]
        r.cells[0].paragraphs[0].text = fn
        r.cells[1].paragraphs[0].text = tp
        r.cells[2].paragraphs[0].text = cns
        r.cells[3].paragraphs[0].text = dsc

    style_table(user_table, u_cols)

    add_heading_styled(doc, "Deployment Configuration Summary", level=3)
    deploy_table = doc.add_table(rows=3, cols=3)
    d_cols = [1.5, 2.2, 2.8]
    d_headers = ["Tier", "Target Platform & Config", "Operational Functionality"]
    for i, h in enumerate(d_headers):
        deploy_table.rows[0].cells[i].paragraphs[0].text = h

    d_data = [
        ("Backend Web API", "Render (render.yaml Blueprint)", "Builds Express application, exposes port 10000, connects to MongoDB Atlas URI via environment variables."),
        ("Frontend Client SPA", "Vercel (vercel.json SPA Rewrite)", "Builds React Vite bundle, redirects all routing to /index.html, communicates with backend via VITE_API_URL.")
    ]
    for r_idx, (tr, tgt, fn) in enumerate(d_data, start=1):
        r = deploy_table.rows[r_idx]
        r.cells[0].paragraphs[0].text = tr
        r.cells[1].paragraphs[0].text = tgt
        r.cells[2].paragraphs[0].text = fn

    style_table(deploy_table, d_cols)

    add_heading_styled(doc, "5. Source Code", level=2)
    add_code_file(doc, "Program5/backend/models/BusPass.js")
    add_code_file(doc, "Program5/backend/models/User.js")
    add_code_file(doc, "Program5/backend/middleware/auth.js")
    add_code_file(doc, "Program5/backend/routes/authRoutes.js")
    add_code_file(doc, "Program5/backend/routes/passRoutes.js")
    add_code_file(doc, "Program5/backend/server.js")
    add_code_file(doc, "Program5/backend/render.yaml")
    add_code_file(doc, "Program5/frontend/src/services/api.js")
    add_code_file(doc, "Program5/frontend/src/components/AuthModal.jsx")
    add_code_file(doc, "Program5/frontend/src/components/PassCard.jsx")
    add_code_file(doc, "Program5/frontend/src/components/PassList.jsx")
    add_code_file(doc, "Program5/frontend/src/components/PassForm.jsx")
    add_code_file(doc, "Program5/frontend/src/App.jsx")
    add_code_file(doc, "Program5/frontend/vercel.json")

    add_heading_styled(doc, "6. Execution Output & Screenshots", level=2)
    add_screenshot(doc, "p5_1.png", "Figure 5.1: Program 5 - Full-Stack React Frontend Dashboard connected to Express/MongoDB with Database Records Indicator")
    add_screenshot(doc, "p5_2.png", "Figure 5.2: Program 5 - Express Backend API Health & Render Deployment Target on Port 5000 (GET /)")
    add_screenshot(doc, "p5_3.png", "Figure 5.3: Program 5 - JWT Authentication Modal (Sign In Tab) Authenticating User and Storing Bearer Token")
    add_screenshot(doc, "p5_4.png", "Figure 5.4: Program 5 - JWT Authentication Modal (Create Account Tab) for Commuter/Student Registration")

    # Save document
    print(f"Saving Word Document to {DOCX_OUTPUT}...")
    doc.save(DOCX_OUTPUT)
    print("DOCX successfully generated!")

def convert_to_pdf():
    print("Converting DOCX to PDF...")
    try:
        from docx2pdf import convert
        convert(DOCX_OUTPUT, PDF_OUTPUT)
        print(f"PDF successfully generated at {PDF_OUTPUT}!")
        return True
    except Exception as e:
        print(f"docx2pdf conversion encountered an issue: {e}")
        # Try win32com fallback
        try:
            import win32com.client
            word = win32com.client.Dispatch("Word.Application")
            word.Visible = False
            doc = word.Documents.Open(os.path.abspath(DOCX_OUTPUT))
            doc.SaveAs(os.path.abspath(PDF_OUTPUT), FileFormat=17) # 17 = wdFormatPDF
            doc.Close()
            word.Quit()
            print(f"PDF successfully generated via Word COM at {PDF_OUTPUT}!")
            return True
        except Exception as e2:
            print(f"Word COM fallback failed: {e2}")
            return False

if __name__ == '__main__':
    build_document()
    convert_to_pdf()
