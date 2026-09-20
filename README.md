# QR Studio

**QR Studio** is a professional, feature-rich QR code generator and designer built with React and TypeScript. It offers an intuitive interface for generating customizable QR codes and manages a history of your past creations seamlessly.

> **Note:** This project was developed for the GDG on Campus SRM technical recruitment task.

---

## 📸 Screenshots

![Editor Interface](placeholder_editor_screenshot.png)
*Placeholder for the main editor and preview interface.*

![Customization Options](placeholder_customization_screenshot.png)
*Placeholder for customization panels showing color and style options.*

![History View](placeholder_history_screenshot.png)
*Placeholder for the history and presets view.*

---

## ✨ Features

- **Custom QR Code Generation:** Generate standard QR codes for URLs, text, and other data formats.
- **Advanced Customization:** Personalize QR codes with custom foreground and background colors, distinct eye patterns, and embedded logos using `qr-code-styling`.
- **Real-Time Preview:** View styling changes live as you edit the QR code parameters.
- **High-Quality Export:** Download generated QR codes in crisp SVG or PNG formats.
- **Local History & Storage:** Automatically saves your generated QR codes using IndexedDB (`idb`) so you can revisit and re-edit past creations.
- **Contrast Validation:** Ensures your chosen color combinations maintain sufficient contrast for optimal scannability.

---

## 🛠️ Technology Stack

- **Frontend Framework:** React 19, Vite
- **Language:** TypeScript
- **State Management:** Zustand
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **QR Engine:** qr-code-styling
- **Storage:** idb (IndexedDB wrapper)
- **Testing:** Vitest, React Testing Library

---

## 📦 Installation

To get the project up and running on your local machine, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/prasidhagarwal-hue/QR-code-generator.git
   cd QR-code-generator
   ```

2. **Install dependencies:**
   Ensure you have [Node.js](https://nodejs.org/) installed, then run:
   ```bash
   npm install
   ```

---

## 🚀 How to Run Locally

Start the development server with Vite:

```bash
npm run dev
```

Open your browser and navigate to the local URL provided in your terminal (typically `http://localhost:5173`) to view the application.

---

## 📖 Usage Instructions

1. **Enter Data:** Navigate to the main editor and enter the URL or text you want to encode in the QR code.
2. **Customize Styles:** Open the Customization Panel to adjust colors, tweak the shapes of the QR code dots and corners, and upload a central logo if desired.
3. **Validate Scannability:** Keep an eye on any validation warnings—the app checks for proper contrast to ensure your QR code can be easily scanned.
4. **Download:** Once satisfied, click the download button to save your QR code as a PNG or SVG image.
5. **Review History:** Access the History Panel to find previously generated QR codes. You can load them back into the editor with a single click.

---

## 📁 Project Structure Overview

```text
src/
├── assets/         # Static assets like images and icons
├── components/     # React UI components
│   ├── common/     # Reusable UI elements (Buttons, Inputs, Sliders, Toggles)
│   ├── customization/ # Panels for styling the QR code
│   ├── editor/     # Main data input and type selection
│   ├── history/    # History tracking UI
│   ├── layout/     # App shells and structural wrappers
│   └── preview/    # Live QR code rendering
├── constants/      # Default values and presets configurations
├── hooks/          # Custom React hooks (useQRCode, useTheme, useDebounce)
├── lib/            # Core logic and external integrations
│   ├── qr/         # Engine handling qr-code-styling and payloads
│   ├── storage/    # IndexedDB history management
│   └── validation/ # Scannability and contrast checks
├── store/          # Zustand global state management
├── types/          # TypeScript interface definitions
└── App.tsx         # Main application entry point
```

---

## 🧪 Testing and Validation

The project uses **Vitest** along with **React Testing Library** and **jsdom** to ensure reliability.

To run the test suite locally:

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

Tests cover critical features such as the QR payload generation logic (`engine.test.ts`), validation rules, and proper handling of state changes.

---

## 🔮 Future Improvements

- **More Data Types:** Add dedicated inputs for vCards, WiFi configurations, and geolocation coordinates.
- **Cloud Sync:** Allow users to optionally sign in and sync their QR code history across devices.
- **Batch Generation:** Provide tools to generate multiple QR codes from a CSV or JSON file simultaneously.
- **Analytics Tracking:** Integrate options for dynamic QR codes that track scan statistics.
- **Dark Mode Support:** Implement a comprehensive dark theme for the user interface.

---

## 🙌 Credits & Acknowledgements

- Built for the **GDG on Campus SRM** technical recruitment task.
- Powered by open-source tools including React, Vite, Tailwind CSS, and the excellent `qr-code-styling` library.
- Icons provided by [Lucide](https://lucide.dev/).
