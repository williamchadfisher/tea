
async function getHardnessFromPostcode(postcode) {
  const cleanPostcode = postcode.trim().toUpperCase();
  const apiUrl = `https://api.postcodes.io/postcodes/${cleanPostcode}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Invalid postcode");

    const data = await response.json();
    const outcode = data.result.outcode;

    const hardnessResponse = await fetch("waterHardnessData.json");
    const hardnessData = await hardnessResponse.json();

    return hardnessData[outcode] ?? null;
  } catch (error) {
    console.error("Postcode error:", error);
    return null;
  }
}

document.getElementById("teaForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const postcode = document.getElementById("postcode").value;
  const email = document.getElementById("email").value;
  const taste = document.querySelector('input[name="taste"]:checked').value;
  const cups = document.querySelector('input[name="cups"]:checked').value;

  const hardness = await getHardnessFromPostcode(postcode);
  const resultDiv = document.getElementById("result");

  if (hardness === null) {
    resultDiv.innerHTML = `<p>Sorry, we couldn't determine the water hardness for your postcode.</p>`;
    return;
  }

  const tea = recommendTea(hardness, taste);
  resultDiv.innerHTML = `
    <h3>Your Tea Recommendation</h3>
    <p><strong>Hardness:</strong> ${hardness} ppm</p>
    <p><strong>Suggested Tea:</strong> ${tea.name}</p>
    <p><a href="${tea.link}" target="_blank">Buy this tea</a></p>
  `;
});

function recommendTea(hardness, taste) {
  if (hardness < 60 && taste === "light") {
    return { name: "Darjeeling", link: "https://example.com/darjeeling" };
  } else if (hardness < 60) {
    return { name: "Assam", link: "https://example.com/assam" };
  } else if (hardness < 100 && taste === "light") {
    return { name: "Earl Grey", link: "https://example.com/earlgrey" };
  } else {
    return { name: "Ceylon", link: "https://example.com/ceylon" };
  }
}
