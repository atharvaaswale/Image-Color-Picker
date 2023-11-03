import React, { useRef, useState,useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

function ColorPicker2() {
  const imageRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [imageUrl, setImageUrl] = useState('https://t4.ftcdn.net/jpg/03/80/74/79/360_F_380747975_sS1hCVB0qPqFCWBMZ3qJ5xTqH6rtaDBI.jpg');//(''); // Add imageUrl state
  const [textColor, setTextColor] = useState('');

  const handleImageClick = async (e) => {
    if (!imageUrl) {
      alert('Please enter a valid image URL.');
      return;
    }

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
        //ctx.drawImage(imageRef.current, 0, 0, imageRef.current.width, imageRef.current.height);
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const colorHex = `#${[pixel[0], pixel[1], pixel[2]]
          .map((color) => color.toString(16).padStart(2, '0'))
          .join('')}`;
        const colorRGB = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        setSelectedColor({hex: colorHex, rgb: colorRGB});
      };

      img.src = url;
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  const handleInputChange = (e) => {
    setImageUrl(e.target.value);
  };

  const copyHex = () => {
    navigator.clipboard.writeText(selectedColor.hex);
  };
  const copyRGB = () => {
    navigator.clipboard.writeText(selectedColor.rgb);
  };

  useEffect(() => {
    if (selectedColor) {
      const hexColor = selectedColor.hex;
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);

      // Calculate the brightness using the relative luminance formula
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;

      // Determine text color based on brightness
      if (brightness < 128) {
        setTextColor('white'); // Use white text for dark backgrounds
      } else {
        setTextColor('black'); // Use black text for light backgrounds
      }
    }
  }, [selectedColor]);

  return (
    <div className='bodyMain'>
      <title>Image Color Picker</title>
      <div className='input-container'>
        <input
          type="text"
          placeholder="Enter Image URL"
          value={imageUrl}
          onChange={handleInputChange}
          className="image-input"
        />
        <button onClick={handleImageClick} className="load-button">Load Image</button>
        <br />
        <img
          ref={imageRef}
          src={imageUrl}
          //src="https://t4.ftcdn.net/jpg/03/80/74/79/360_F_380747975_sS1hCVB0qPqFCWBMZ3qJ5xTqH6rtaDBI.jpg"
          alt="Image"
          onClick={handleImageClick}
          draggable="false"
          className="rounded-image"
          //style={{ width: '100%', height: 'auto', maxWidth: '540px', maxHeight: '360px' }}
          style={{ maxWidth: '540px', maxHeight: '360px', width: 'auto', height: 'auto' }}
        />
        {selectedColor && (
          <div className="color-display" style={{
            backgroundColor: selectedColor.hex,
            width: '200px',
            cursor: 'pointer',
            borderRadius: '3px',
            textAlign: 'center',
            padding: '5px',
            justifyContent: 'center'
          }}>
            <span style={{ color: textColor }} onClick={copyHex}>Hex: {selectedColor.hex}</span><br/>
            <span style={{backgroundColor: 'white', height: '2px'}}></span><br/>
            <span style={{ color: textColor }} onClick={copyRGB}>RGB: {selectedColor.rgb}</span>
          </div>
        )}
      </div>
    </div>

  );
}


export default ColorPicker2;
