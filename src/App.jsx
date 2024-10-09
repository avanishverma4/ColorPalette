import { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import domtoimage from "dom-to-image";

// ColorPlate Component
const ColorPlate = ({ color }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(color);
    toast("Copied to clipboard!");
  };

  // Function to determine contrast color (white or black)
  const getContrastColor = (hexColor) => {
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);

    // Calculate the luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return black for light backgrounds and white for dark backgrounds
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  };

  const textColor = getContrastColor(color);

  return (
    <div
      style={{ backgroundColor: color }}
      className="flex items-center justify-center text-xl font-medium h-full"
    >
      <p
        onClick={handleCopy}
        className="hover:cursor-pointer p-2"
        style={{ color: textColor }}
      >
        {color}
      </p>
    </div>
  );
};

// Function to Generate Random Hex Colors
const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

function App() {
  const [colors, setColors] = useState(
    Array.from({ length: 5 }, generateRandomColor)
  );
  const colorPaletteRef = useRef(null);

  // Function to Regenerate Random Colors
  const regenerateColors = () => {
    setColors(Array.from({ length: 5 }, generateRandomColor));
  };

  // Function to Download Color Palette
  const downloadPalette = () => {
    if (colorPaletteRef.current) {
      domtoimage
        .toPng(colorPaletteRef.current)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "color_palette.png";
          link.click();
        })
        .catch((error) => {
          console.error("Error generating image:", error);
        });
    }
  };

  // Add event listener to detect spacebar press
  document.body.onkeyup = function (e) {
    if (e.key === " " || e.code === "Space") {
      regenerateColors();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <ToastContainer
        position="bottom-center"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={true}
        theme="light"
        transition="Bounce"
      />

      {/* Header Section */}
      <div className="h-24 flex items-center justify-between lg:px-12 md:px-8 px-6">
        <h1 className="text-3xl font-bold text-blue-600 h-10">Color Palette</h1>
        <div>
          <button
            onClick={regenerateColors}
            className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
          >
            Generate New Colors
          </button>
          <button
            onClick={downloadPalette}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Download Palette
          </button>
        </div>
      </div>

      {/* Color Palette Grid that fills the remaining screen */}
      <div
        ref={colorPaletteRef}
        className="flex-1 grid grid-cols-1 md:grid-cols-5 h-full"
      >
        {colors.map((color, index) => (
          <ColorPlate key={index} color={color} />
        ))}
      </div>
    </div>
  );
}

export default App;
