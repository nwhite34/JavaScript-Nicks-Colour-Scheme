// Variable Declarations
var modeSelect = document.getElementById("mode-select"); // Select element for choosing color mode
var hexInput = document.getElementById("hex-input"); // Input element for entering hexadecimal color code
var seedColorInput = document.getElementById("seed-color"); // Input element for seed color
var modes = [
  { mode: "triad", name: "Triad" },
  { mode: "quad", name: "Quad" },
  { mode: "analogic", name: "Analogic" },
  { mode: "complement", name: "Complement" },
  { mode: "analogic-complement", name: "Analogic Complement" },
  { mode: "monochrome", name: "Monochrome" },
  { mode: "monochrome-dark", name: "Monochrome Dark" },
  { mode: "monochrome-light", name: "Monochrome Light" },
];
var modal = document.getElementById("modal"); // Modal element for displaying messages
var span = document.getElementById("modal-close"); // Close button for the modal
var modalText = document.getElementById("modal-text"); // Text element inside the modal
var generateBtn = document.getElementById("generate-btn"); // Button for generating color scheme
var colorSchemeContainer = document.getElementById("color-scheme"); // Container for displaying color scheme

// Helper Functions

// Function to add an option to a select element
function addOptionToSelect(element, value, text) {
  var option = document.createElement("option");
  option.value = value;
  option.text = text;
  element.appendChild(option);
}

// Function to close the modal
function closeModal() {
  modal.style.display = "none";
}

// Function to display the color scheme
function displayColorScheme(colors) {
  colorSchemeContainer.innerHTML = "";

  colors.forEach(function (color) {
    var colorContainer = document.createElement("div");
    colorContainer.className = "color-container";

    var colorDiv = document.createElement("div");
    colorDiv.className = "color";
    colorDiv.style.backgroundColor = color.hex.value;
    colorContainer.appendChild(colorDiv);

    var hexValue = document.createElement("p");
    hexValue.textContent = color.hex.value;
    hexValue.style.overflowWrap = "break-word";
    hexValue.style.textAlign = "center";
    hexValue.style.marginTop = "5px";
    colorContainer.appendChild(hexValue);

    // Add event listener to copy color on click
    colorContainer.addEventListener("click", function () {
      navigator.clipboard
        .writeText(color.hex.value)
        .then(function () {
          modalText.innerHTML = "Copied " + color.hex.value + " to clipboard.";
          modal.style.display = "block";
        })
        .catch(function (error) {
          console.error("Could not copy text: ", error);
        });
    });

    colorSchemeContainer.appendChild(colorContainer);
  });
}

// Event Listeners
span.onclick = closeModal; // Close the modal when the close button is clicked

window.onclick = function (event) {
  if (event.target === modal) {
    closeModal(); // Close the modal when the user clicks outside of it
  }
};

generateBtn.addEventListener("click", function () {
  var seedColor = hexInput.value ? hexInput.value : seedColorInput.value; // Get the seed color from either hexInput or seedColorInput
  var mode = modeSelect.value; // Get the selected color mode
  var apiUrl =
    "https://www.thecolorapi.com/scheme?hex=" +
    seedColor.substr(1) +
    "&mode=" +
    mode +
    "&count=5";

  // Fetch color scheme from the API
  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayColorScheme(data.colors); // Display the color scheme
    })
    .catch(function (error) {
      console.log(error);
    });
});

hexInput.addEventListener("input", function () {
  var hexColor = this.value;
  // Check if it is a valid hex color
  if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(hexColor)) {
    // Update the seed-color input value
    seedColorInput.value = hexColor;
  }
});

// Initialization
modes.forEach(function (mode) {
  addOptionToSelect(modeSelect, mode.mode, mode.name); // Populate the color mode select element
});
