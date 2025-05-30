
    // ===== STYLES =====
    function applyAlmanacStyles() {
      document.body.style.fontFamily = "'Helvetica Neue', Arial, sans-serif";
      document.body.style.backgroundColor = "#f9f8f6";
      document.body.style.color = "#333";
      document.body.style.margin = "0";
      document.body.style.padding = "0";
      document.body.style.lineHeight = "1.6";

      const container = document.getElementById("almanac-container");
      container.style.maxWidth = "800px";
      container.style.margin = "20px auto";
      container.style.padding = "20px";
      container.style.backgroundColor = "#fff";
      container.style.borderRadius = "40px";
      container.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";

      const header = document.getElementById("calculator-header");
      header.style.borderBottom = "2px solid rgb(45, 131, 184)";
      header.style.paddingBottom = "15px";
      header.style.marginBottom = "20px";
      header.querySelector("h1").style.color = "#2a5c82";
      header.querySelector("h1").style.fontSize = "28px";
      header.querySelector("p").style.color = "#666";

      const formStyles = document.createElement("style");
      formStyles.textContent = `
        #calculator-form label {
          display: block;
          margin: 15px 0 5px;
          color: #2a5c82;
          font-weight: bold;
        }
        #calculator-form input, 
        #calculator-form select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 7px;
          font-size: 16px;
          margin-bottom: 10px;
        }
        .button-group {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }
        #calculator-form button {
          flex: 1;
          padding: 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        #calculate-btn {
          background-color: #4a7b9d;
          color: white;
          border: none;
        }
        #calculate-btn:hover {
          background-color:rgb(9, 10, 10);
        }
        #reset-btn {
          background-color:rgb(216, 201, 201);
          border: 1px solid #ddd;
        }
        #reset-btn:hover {
          background-color:rgb(157, 139, 139);
        }
        #calculator-results {
          background-color: #f5f9fc;
          border-left: 4px solid #4a7b9d;
          padding: 20px;
          margin-top: 25px;
          border-radius: 4px;
        }
        .result-item {
          margin-bottom: 10px;
        }
        @media (max-width: 600px) {
          #almanac-container {
            padding: 15px;
          }
          .button-group {
            flex-direction: column;
          }
        }
      `;
      document.head.appendChild(formStyles);
    }

    // ===== CALCULATOR LOGIC =====
    function createCalculator() {
      const form = document.createElement("form");
      form.id = "mulch-calculator";
      form.innerHTML = `
        <label for="totalArea">Total Area:</label>
        <input type="number" id="totalArea" placeholder="e.g., 100">
        <select id="areaUnit">
          <option value="sqft">Square Feet</option>
          <option value="sqyd">Square Yards</option>
          <option value="sqm">Square Meters</option>
          <option value="sqin">Square Inches</option>
          <option value="sqcm">Square Centimeters</option>
        </select>

        <label for="length">OR Dimensions:</label>
        <div style="display: flex; gap: 10px;">
          <input type="number" id="length" placeholder="Length" style="flex: 1;">
          <span style="align-self: center;">x</span>
          <input type="number" id="width" placeholder="Width" style="flex: 1;">
        </div>
        <select id="dimUnit">
          <option value="ft">Feet</option>
          <option value="yd">Yards</option>
          <option value="m">Meters</option>
          <option value="in">Inches</option>
          <option value="cm">Centimeters</option>
        </select>

        <label for="depth">Mulch Depth:</label>
        <input type="number" id="depth" value="3" min="0.1" step="0.1">
        <select id="depthUnit">
          <option value="in">Inches</option>
          <option value="ft">Feet</option>
          <option value="yd">Yards</option>
          <option value="m">Meters</option>
          <option value="cm">Centimeters</option>
        </select>

        <label for="mulchType">Mulch Type (optional):</label>
        <select id="mulchType">
          <option value="wood">Wood Mulch</option>
          <option value="rubber">Rubber Mulch</option>
        </select>

        <div class="button-group">
          <button type="button" id="calculate-btn">Calculate</button>
          <button type="reset" id="reset-btn">Reset</button>
        </div>
      `;
      document.getElementById("calculator-form").appendChild(form);

      // Event listeners
      document.getElementById("calculate-btn").addEventListener("click", calculateMulch);
      document.getElementById("reset-btn").addEventListener("click", () => {
        document.getElementById("calculator-results").innerHTML = "";
      });
    }

    // Unit conversions
    function convertToSqFt(value, unit) {
      const conversions = {
        sqft: 1, 
        sqyd: 9, 
        sqm: 10.764, 
        sqin: 0.006944, 
        sqcm: 0.001076
      };
      return value * (conversions[unit] || 1);
    }

    function convertToFt(value, unit) {
      const conversions = {
        ft: 1, 
        yd: 3, 
        m: 3.281, 
        in: 0.0833, 
        cm: 0.0328
      };
      return value * (conversions[unit] || 1);
    }

    // Main calculation
    function calculateMulch() {
      const areaInput = document.getElementById("totalArea").value;
      const areaUnit = document.getElementById("areaUnit").value;
      const length = document.getElementById("length").value;
      const width = document.getElementById("width").value;
      const dimUnit = document.getElementById("dimUnit").value;
      const depth = document.getElementById("depth").value;
      const depthUnit = document.getElementById("depthUnit").value;
      const mulchType = document.getElementById("mulchType").value;

      // Validate input
      if ((!areaInput && (!length || !width))) {
        alert("Please enter either Total Area OR Length × Width.");
        return;
      }
      if (!depth || depth <= 0) {
        alert("Please enter a valid depth greater than 0.");
        return;
      }

      // Calculate area in square feet
      let areaSqFt;
      if (length && width) {
        const lengthFt = convertToFt(parseFloat(length), dimUnit);
        const widthFt = convertToFt(parseFloat(width), dimUnit);
        areaSqFt = lengthFt * widthFt;
      } else {
        areaSqFt = convertToSqFt(parseFloat(areaInput), areaUnit);
      }

      // Convert depth to feet
      const depthFt = convertToFt(parseFloat(depth), depthUnit);

      // Calculate volumes
      const volumeCuFt = areaSqFt * depthFt;
      const volumeCuYd = volumeCuFt / 27;
      const volumeCuM = volumeCuFt * 0.0283168;
      const volumeLiters = volumeCuM * 1000;
      const bags = Math.ceil(volumeCuFt / 2);

      // Visual comparison (parking space = 162 sq ft)
      const parkingSpaces = (areaSqFt / 162).toFixed(1);

      // Display results
      const results = document.getElementById("calculator-results");
      results.innerHTML = `
        <h3 style="color: #2a5c82; margin-top: 0;">Mulch Needed</h3>
        <div class="result-item"><strong>${volumeCuFt.toFixed(1)} cubic feet</strong></div>
        <div class="result-item"><strong>${volumeCuYd.toFixed(2)} cubic yards</strong> (bulk delivery)</div>
        <div class="result-item"><strong>${volumeCuM.toFixed(2)} cubic meters</strong></div>
        <div class="result-item"><strong>${Math.round(volumeLiters)} liters</strong></div>
        <div class="result-item"><strong>${bags} bags</strong> (2 cu ft each)</div>

        <h4 style="margin-top: 20px; color: #2a5c82;">Calculation</h4>
        <p>Volume = Area × Depth = ${areaSqFt.toFixed(2)} sq ft × ${depthFt.toFixed(3)} ft</p>

        <h4 style="margin-top: 15px; color: #2a5c82;">Coverage</h4>
        <p>That would cover around <strong>${parkingSpaces} parking spaces</strong> (162 sq ft each) at a depth of ${depth} ${depthUnit}.</p>

        <p style="color: #666; font-size: 14px;">Mulch type: ${mulchType.replace(/^\w/, c => c.toUpperCase())}</p>
      `;
    }

    // Initialize
    window.onload = function() {
      applyAlmanacStyles();
      createCalculator();
    };