# Question Paper Builder

A comprehensive multilingual question paper builder designed for teachers in madrasas, schools, and coaching centers. Create professional question papers with support for Arabic, Bangla, Urdu, and English languages.

## Features

### 🌐 Multilingual Support
- **Arabic**: RTL direction with Amiri font and Arabic numerals
- **Bangla**: LTR direction with SolaimanLipi font and Bangla numerals  
- **Urdu**: RTL direction with Jameel Noori Nastaleeq font
- **English**: LTR direction with Roboto font

### 📝 Section-Based Structure
- Organize questions into named sections (e.g., "Section A", "القسم الأول", "প্রথম অংশ")
- Each section contains multiple sub-questions with labels (a), (أ), (ক)
- Drag and drop to reorder sections and sub-questions
- Section-specific instructions and language settings

### ✍️ Rich Text Editing
- TipTap-powered rich text editor with formatting options
- Bold, italic, underline, and text alignment
- Support for tables, lists, and inline content
- Language-aware font rendering and direction

### 🎯 Question Templates
- **Translation**: Text translation exercises
- **Fill in the Blanks**: Complete sentences with missing words
- **Vocabulary**: Define terms and concepts
- **Grammar Correction**: Fix grammatical errors
- **Essay Questions**: Long-form writing prompts
- **Matching**: Connect items between columns

### 🧠 Smart Features
- Auto-save every 30 seconds to localStorage
- Answer key toggle for each sub-question
- Marks allocation per sub-question
- Dark/light theme support
- Live preview mode
- Export/import functionality

### 📄 Export Options
- **PDF Export**: Professional formatting with proper fonts
- **JSON Export**: Save and share question templates
- Print-ready layout with page breaks
- Header/footer with exam metadata

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage Guide

### 1. Paper Information
- Click "Paper Information" to expand metadata fields
- Fill in class, subject, marks, duration, teacher name, etc.
- Add general instructions for the entire paper

### 2. Creating Sections
- Use "Add Section" to create new sections
- Each section can have its own language and instructions
- Drag section tabs to reorder them

### 3. Adding Sub-Questions
- Click "Add Sub-Question" within a section
- Choose from predefined templates or create custom questions
- Use the rich text editor for formatting
- Set marks for each sub-question

### 4. Language Settings
- Select language per section (English, Arabic, Bangla, Urdu)
- Font and text direction automatically adjust
- Sub-question labels adapt to selected language

### 5. Answer Keys
- Toggle answer visibility for each sub-question
- Add detailed answers for teacher reference
- Answers can be shown/hidden in preview and export

### 6. Preview and Export
- Use "Preview" button to see the final formatted paper
- Export to PDF for printing and distribution
- Save as JSON for backup and sharing

## Keyboard Shortcuts

- `Ctrl/Cmd + N`: Add new section
- `Ctrl/Cmd + P`: Toggle preview mode
- `Ctrl/Cmd + Shift + D`: Toggle dark mode
- `Delete`: Delete selected item (when not in input)

## Technical Stack

- **React 18**: Modern React with hooks
- **Zustand**: Lightweight state management
- **Tailwind CSS**: Utility-first styling
- **TipTap**: Rich text editing
- **html2pdf.js**: PDF generation
- **React Beautiful DnD**: Drag and drop
- **Heroicons**: Icon library

## Font Support

The application includes web fonts for multilingual support:
- **Arabic**: Amiri font family
- **Bangla**: SolaimanLipi font family
- **English**: Roboto font family
- **Urdu**: Jameel Noori Nastaleeq (requires local installation)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

This is an educational project. Feel free to fork and modify for your needs.

## License

MIT License - feel free to use for educational purposes.