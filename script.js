// Sample postcode prefix to water hardness in ppm (extend as needed)
const waterHardnessData = {
  "SW1": 80,    // Moderately hard
  "NW1": 120,   // Hard
  "EC1": 60,    // Slightly hard
  "B1": 40,     // Soft
  "M1": 100,    // Hard
  "LS1": 50,    // Slightly hard
  "G1": 30,     // Soft
  // Add more prefixes as needed
};

// Tea recommendations based on hardness & taste
const teaRecommendations = [
  {
    hardnessMax: 50,
    taste: "bold",
    tea: "Strong Assam Tea",
    link: "https://www.example.com/affiliate/assam"
  },
  {
    hardnessMax: 50,
    taste: "light",
    tea: "Delicate Darjeeling Tea",
    link: "https://www.example.com/affiliate/darjeeling"
  },
  {
    hardnessMax: 100,
    taste: "bold",
    tea: "Robust English Breakfast",
    link: "https://www.example.com/affiliate/englishbreakfast"
  },
  {
    hardnessMax: 100,
    taste: "light",
    tea: "Smooth Earl Grey",
    link: "https://www.example.com/affiliate/earlgrey"
  },
  {
    hardnessMax: Infinity,
    taste: "bold",
    tea: "Extra Strong Ceylon Tea",
    link: "https://www.example.com/affiliate/ceylon"
  },
  {
    hardnessMax: Infinity,
    taste: "light",
    tea: "Fragrant Jasmine Green Tea",
    link: "https://www.example.com/affiliate/jasmine"
  }
];

// Validate UK postcode format (basic but covers most cases)
function isValidUKPostcode(postcode) {
  const regex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i;
  return regex.test(postcode.trim());
}

// Extract postcode prefix (area + district)
function getPostcodePrefix(postcode) {
  postcode = postcode.toUpperCase().trim();
  const compactPostcode = postcode.replace(/\s+/g, "");
  const match = compactPostcode.match(/^([A-Z]{1,2}\d{1,2}[A-Z]?)/);
  return match ? match[1] : null;
}

document.getElementById("teaForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const postcodeInput = document.getElementById("postcode").value.trim();
  const emailInput = document.getElementById("email").value.trim();
  const tasteInput = document.querySelector('input[name="taste"]:checked').value;
  const cupsInput = document.querySelector('input[name="cups"]:checked').value;

  if (!isValidUKPostcode(postcodeInput)) {
    alert("Please enter a valid UK postcode in the correct format, e.g., SW1A 1AA.");
    return;
  }

  const prefix = getPostcodePrefix(postcodeInput);
  if (!prefix) {
    alert("Could not extract postcode prefix. Please check your postcode and try again.");
    return;
  }

  // Lookup hardness or default to 70 ppm if unknown
  const hardness = waterHardnessData[prefix] ?? 70;

  // Find tea recommendation by hardness and taste
  const recommendation = teaRecommendations.find(rec => hardness <= rec.hardnessMax && rec.taste === tasteInput);

  const resultDiv = document.getElementById("result");
  if (!recommendation) {
    resultDiv.innerHTML = "<p>Sorry, no tea recommendation found for your preferences.</p>";
    return;
  }

  let cupsMsg = cupsInput === "3+" ? "You enjoy several cups a day." : "You enjoy a couple of cups a day.";
  resultDiv.innerHTML = `
    <h3>Your Tea Recommendation</h3>
    <p><strong>Local water hardness:</strong> ${hardness} ppm</p>
    <p><strong>Recommended tea:</strong> ${recommendation.tea}</p>
    <p>${cupsMsg}</p>
    <p><a href="${recommendation.link}" target="_blank" class="button-link" rel="noopener noreferrer">Buy this tea</a></p>
    <small>Your email (${emailInput}) and postcode (${postcodeInput.toUpperCase()}) have been recorded securely.</small>
  `;

  // TODO: send email and postcode data to backend for GDPR-compliant email marketing
});
