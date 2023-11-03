import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import React, { useRef, useState } from 'react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
function ColorPicker2() {
  const imageRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const handleImageClick = async (e) => {
    const imageUrl = 'https://i.stack.imgur.com/etJFB.jpg'; // Replace with the actual image URL

    try {
      const response = await axios.get(`https://cors-anywhere.herokuapp.com/${imageUrl}`, {
        responseType: 'blob',
      });

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const img = new Image();

      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const colorHex = `#${[pixel[0], pixel[1], pixel[2]]
          .map((color) => color.toString(16).padStart(2, '0'))
          .join('')}`;
        setSelectedColor(colorHex);
      };

      img.src = url;
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  /* const handleInputChange = (e) => {
    setImageUrl(e.target.value);
  }; */

  return (
    <div>
      {/* <input
        type="text"
        placeholder="Enter Image URL"
        value={imageUrl}
        onChange={handleInputChange}
      />
      <button onClick={handleImageClick}>Load Image</button>
      <br /> */}
      <img
        ref={imageRef}
        src="https://i.stack.imgur.com/etJFB.jpg"
        alt="Image"
        onClick={handleImageClick}
        draggable="false"
      />
      {selectedColor && (
        <div style={{ backgroundColor: selectedColor }}>
          {selectedColor}
        </div>
      )}
    </div>
  );
}

function ColorPickerOnly() {
  const imageRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const handleImageClick = (e) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imageRef.current.width;
    canvas.height = imageRef.current.height;

    ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const pixel = ctx.getImageData(x, y, 1, 1).data;

    const colorHex = `#${[pixel[0], pixel[1], pixel[2]]
      .map((color) => color.toString(16).padStart(2, '0'))
      .join('')}`;

    setSelectedColor(colorHex);
  };

  return (
    <div>
      <img
        ref={imageRef}
        src="https://cors-anywhere.herokuapp.com/https://i.stack.imgur.com/etJFB.jpg"//{logo}
        alt="Image"
        onClick={handleImageClick}
      />
      {selectedColor && (
        <div style={{ backgroundColor: selectedColor }}>
          {selectedColor}
        </div>
      )}
    </div>
  );
}

export default ColorPicker2;//App;




