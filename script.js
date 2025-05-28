
    // Apply styles
    function applyStyles() {
      // Body styles
      document.body.style.fontFamily = 'Arial, sans-serif';
      document.body.style.padding = '20px';
      document.body.style.margin = '0';

      // Container styles
      const container = document.getElementById('container');
      container.style.maxWidth = '600px';
      container.style.margin = 'auto';

      // Form element styles
      const style = document.createElement('style');
      style.textContent = `
        label, select, input, button { 
          display: block; 
          width: 100%; 
          margin-bottom: 10px; 
        }
        @media (max-width: 600px) {
          label, select, input, button { font-size: 16px; }
        }
      `;
      document.head.appendChild(style);

      // Output styles
      const result = document.getElementById('result');
      result.style.marginTop = '20px';
    }

    function createCalculator() {
      const form = document.createElement('form');
      form.innerHTML = `
        <label>Total Area:</label>
        <input type="number" id="totalArea" placeholder="Leave blank if using dimensions">
        <select id="areaUnit">
          <option value="sqft">Square Feet (default)</option>
          <option value="sqyd">Square Yards</option>
          <option value="sqm">Square Meters</option>
          <option value="sqin">Square Inches</option>
          <option value="sqcm">Square Centimeters</option>
        </select>

        <label>OR Dimensions (Length × Width):</label>
        <input type="number" id="length" placeholder="Length">
        <input type="number" id="width" placeholder="Width">
        <select id="dimUnit">
          <option value="ft">Feet (default)</option>
          <option value="yd">Yards</option>
          <option value="m">Meters</option>
          <option value="in">Inches</option>
          <option value="cm">Centimeters</option>
        </select>

        <label>Mulch Depth:</label>
        <input type="number" id="depth" value="3">
        <select id="depthUnit">
          <option value="in">Inches (default)</option>
          <option value="ft">Feet</option>
          <option value="yd">Yards</option>
          <option value="m">Meters</option>
          <option value="cm">Centimeters</option>
        </select>

        <label>Mulch Type:</label>
        <select id="mulchType">
          <option value="wood">Wood (default)</option>
          <option value="rubber">Rubber</option>
        </select>

        <button type="button" onclick="calculateMulch()">Calculate</button>
        <button type="reset">Reset</button>
      `;
      document.getElementById('calculator').appendChild(form);
    }

    function convertToSqFt(value, unit) {
      const conversions = {
        sqft: 1, sqyd: 9, sqm: 10.764, sqin: 0.006944, sqcm: 0.001076
      };
      return value * (conversions[unit] || 1);
    }

    function convertToFt(value, unit) {
      const conversions = {
        ft: 1, yd: 3, m: 3.281, in: 1 / 12, cm: 0.03281
      };
      return value * (conversions[unit] || 1);
    }

    function convertDepthToFt(value, unit) {
      return convertToFt(value, unit);
    }

    function calculateMulch() {
      let area = parseFloat(document.getElementById('totalArea').value);
      const areaUnit = document.getElementById('areaUnit').value;
      const length = parseFloat(document.getElementById('length').value);
      const width = parseFloat(document.getElementById('width').value);
      const dimUnit = document.getElementById('dimUnit').value;
      const depth = parseFloat(document.getElementById('depth').value);
      const depthUnit = document.getElementById('depthUnit').value;
      const mulchType = document.getElementById('mulchType').value;

      if (!area && length && width) {
        const lengthFt = convertToFt(length, dimUnit);
        const widthFt = convertToFt(width, dimUnit);
        area = lengthFt * widthFt;
      } else {
        area = convertToSqFt(area, areaUnit);
      }

      const depthFt = convertDepthToFt(depth, depthUnit);
      const volumeCuFt = area * depthFt;

      const cuYd = volumeCuFt / 27;
      const cuM = volumeCuFt * 0.0283168;
      const liters = cuM * 1000;
      const bags = volumeCuFt / 2;
      const bulk = cuYd.toFixed(2) + ' cubic yards';

      const result = `
        <p><strong>Estimated mulch needed:</strong></p>
        <ul>
          <li>${volumeCuFt.toFixed(2)} cubic feet</li>
          <li>${cuYd.toFixed(2)} cubic yards</li>
          <li>${cuM.toFixed(2)} cubic meters</li>
          <li>${liters.toFixed(2)} liters</li>
          <li>${bags.toFixed(1)} bags (2 cu ft)</li>
          <li>${bulk} of ${mulchType} mulch</li>
        </ul>
        <p><strong>Calculation performed:</strong> Volume = Area × Depth = ${area.toFixed(2)} sq ft × ${depthFt.toFixed(2)} ft</p>
        <p>That would cover around ${(area / 162).toFixed(1)} parking spaces at a depth of ${depth} ${depthUnit}.</p>
      `;

      document.getElementById('result').innerHTML = result;
    }

    window.onload = function() {
      applyStyles();
      createCalculator();
    };
  