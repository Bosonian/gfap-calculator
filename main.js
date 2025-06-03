// js/main.js

// Current language setting (default English)
let currentLang = "en";
// Placeholder for pending result data (used for showing after disclaimer)
let pendingResult = null;

// API endpoints for backend calls
const ACCESS_CODE_VALIDATOR_URL =
  "https://europe-west3-igfap-452720.cloudfunctions.net/validateAccessCode";
const COMA_CALCULATOR_URL =
  "https://europe-west3-igfap-452720.cloudfunctions.net/calculateComaRisk";

// DEBUGGED: Corrected endpoints for stroke models
const STANDARD_URL =
  "https://europe-west3-igfap-452720.cloudfunctions.net/calculateStrokeRisk";
const RAPID_URL =
  "https://europe-west3-igfap-452720.cloudfunctions.net/calculate-rapid-stroke-rf";
const MAX_URL =
  "https://europe-west3-igfap-452720.cloudfunctions.net/calculate-advanced-stroke-risk-calibrated-xgb";

// List of all section IDs for show/hide functionality
const ALL_SECTIONS = [
  "codeEntrySection",
  "moduleSelectionSection",
  "comaModuleSection",
  "strokeChoiceSection",
  "standardPrerequisitesSection",
  "standardStrokeModuleSection",
  "advancedPrerequisitesSection",
  "advancedChoiceSection",
  "rapidModuleSection",
  "maxModuleSection",
];

// Show only the specified section by removing 'hidden' from that ID
// and adding 'hidden' to all others.
function showSection(sectionIdToShow) {
  ALL_SECTIONS.forEach((id) => {
    const section = document.getElementById(id);
    if (section) {
      if (id === sectionIdToShow) {
        section.classList.remove("hidden");
      } else {
        section.classList.add("hidden");
      }
    }
  });
}

// Update text content of an element (or its inner <span>) using translations.
function updateTextContent(elementId, translationKey) {
  const element = document.getElementById(elementId);
  if (
    element &&
    window.translations[currentLang] &&
    window.translations[currentLang][translationKey] !== undefined
  ) {
    const target = element.querySelector("span") || element;
    target.textContent = window.translations[currentLang][translationKey];
  }
}

// Switch UI language between English and German.
function switchLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  localStorage.setItem("language", lang);
  const texts = window.translations[lang] || window.translations.en;

  // 1) Update all elements with data-translate attribute
  document.querySelectorAll("[data-translate]").forEach((el) => {
    const key = el.dataset.translate;
    const target = el.querySelector("span") || el;
    if (texts[key] !== undefined) {
      target.textContent = texts[key];
    }
  });

  // 2) Update placeholder translations
  document.querySelectorAll("[data-translate-placeholder]").forEach((el) => {
    const key = el.dataset.translatePlaceholder;
    if (texts[key] !== undefined) {
      el.placeholder = texts[key];
    }
  });

  // 3) Update specific elements by ID that don't use data-translate
  const toUpdate = [
    ["appTitle", "appTitle"],
    ["moduleSelectionTitle", "moduleSelectionTitle"],
    ["comaModuleButton", "comaModuleButton"],
    ["strokeModuleButton", "strokeModuleButton"],
    ["comaModuleTitle", "comaModuleTitle"],
    ["gfapComaLabel", "gfapLabel"],
    ["calculateComaButton", "calculateButton"],
    ["comaBackButton", "backButton"],
    ["strokeChoiceTitle", "strokeChoiceTitle"],
    ["standardModelButton", "standardModelButton"],
    ["advancedModelButton", "advancedModelButton"],
    ["standardPrereqTitle", "standardPrereqTitle"],
    ["stdPrereq1", "prereq1"],
    ["stdPrereq2", "prereq2"],
    ["stdPrereq3", "prereq3"],
    ["stdPrereq4", "prereq4"],
    ["standardNextButton", "nextButton"],
    ["standardBackButton", "backButton"],
    ["standardStrokeTitle", "standardStrokeTitle"],
    ["stdAgeInput", "ageLabel"],
    ["stdGfapInput", "gfapLabel"],
    ["stdSbpInput", "sbpLabel"],
    ["calculateStandardButton", "calculateButton"],
    ["stdBackButton", "backButton"],
    ["advancedPrereqTitle", "advancedPrereqTitle"],
    ["advPrereq1", "prereq1"],
    ["advPrereq2", "prereq2"],
    ["advPrereq3", "prereq3"],
    ["advancedNextButton", "nextButton"],
    ["advancedBackButton", "backButton"],
    ["advancedChoiceTitle", "advancedChoiceTitle"],
    ["rapidVersionButton", "rapidVersionButton"],
    ["maxVersionButton", "maxVersionButton"],
    ["advChoiceBackButton", "backButton"],
    ["rapidTitle", "rapidTitle"],
    ["rapAgeInput", "ageLabel"],
    ["rapFastEdInput", "fastEdLabel"],
    ["rapHeadacheInput", "headacheLabel"],
    ["rapSbpInput", "sbpLabel"],
    ["rapGfapInput", "gfapLabel"],
    ["calculateRapidButton", "calculateButton"],
    ["rapidBackButton", "backButton"],
    ["maxTitle", "maxTitle"],
    ["maxAgeInput", "ageLabel"],
    ["maxGfapInput", "gfapLabel"],
    ["maxSbpInput", "sbpLabel"],
    ["maxDbpInput", "dbpLabel"],
    ["maxFastEdDisplayLabel", "advFastEdDisplayLabel"],
    ["maxToggleFastEdBtnText", "toggleFastEdBtnTextCalculate"],
    ["fastEdInfoTextMax", "fastEdInfoText"],
    ["fastEdFacialPalsyLabelMax", "fastEdFacialPalsyLabel"],
    ["fastEdArmWeaknessLabelMax", "fastEdArmWeaknessLabel"],
    ["fastEdArm0LabelMax", "fastEdArm0Label"],
    ["fastEdArm1LabelMax", "fastEdArm1Label"],
    ["fastEdArm2LabelMax", "fastEdArm2Label"],
    ["fastEdSpeechChangesLabelMax", "fastEdSpeechChangesLabel"],
    ["fastEdSpeech0LabelMax", "fastEdSpeech0Label"],
    ["fastEdSpeech1LabelMax", "fastEdSpeech1Label"],
    ["fastEdSpeech2LabelMax", "fastEdSpeech2Label"],
    ["fastEdEyeDeviationLabelMax", "fastEdEyeDeviationLabel"],
    ["fastEdEye0LabelMax", "fastEdEye0Label"],
    ["fastEdEye1LabelMax", "fastEdEye1Label"],
    ["fastEdEye2LabelMax", "fastEdEye2Label"],
    ["fastEdDenialNeglectLabelMax", "fastEdDenialNeglectLabel"],
    ["fastEdDenial0LabelMax", "fastEdDenial0Label"],
    ["fastEdDenial1LabelMax", "fastEdDenial1Label"],
    ["fastEdDenial2LabelMax", "fastEdDenial2Label"],
    ["maxAdditionalSymptomsLabel", "advAdditionalSymptomsLabel"],
    ["advEyeDeviationFlippedLabelMax", "advEyeDeviationFlippedLabel"],
    ["advArmPareseFlippedLabelMax", "advArmPareseFlippedLabel"],
    ["advBeinPareseFlippedLabelMax", "advBeinPareseFlippedLabel"],
    ["advVigilanzminderungLabelMax", "advVigilanzminderungLabel"],
    ["advAfibLabelMax", "advAfibLabel"],
    ["advHeadacheLabelMax", "advHeadacheLabel"],
    ["advNoakLabelMax", "advNoakLabel"],
    ["advAntiplateletsLabelMax", "advAntiplateletsLabel"],
    ["calculateMaxButton", "calculateAdvancedStrokeButton"],
    ["maxBackButton", "backButton"],
    ["disclaimerModalTitleText", "disclaimer"],
    ["disclaimerConfirmButton", "confirmButton"],
  ];

  toUpdate.forEach(([elId, key]) => {
    updateTextContent(elId, key);
  });

  // 4) Dark-Mode Toggle aria-label & icon
  const darkModeButton = document.getElementById("darkModeToggle");
  if (darkModeButton) {
    const iconSpan = darkModeButton.querySelector("span");
    if (document.body.classList.contains("dark-mode")) {
      darkModeButton.setAttribute("aria-label", texts.darkModeToggleLabelOn);
      if (iconSpan) iconSpan.textContent = "☀️";
    } else {
      darkModeButton.setAttribute("aria-label", texts.darkModeToggleLabelOff);
      if (iconSpan) iconSpan.textContent = "🌙";
    }
  }

  // 5) If any error messages are visible, update their text as well
  ["accessError", "standardPrereqError", "advancedPrereqError", "standardError", "rapidError", "maxError"].forEach(
    (errId) => {
      const errEl = document.getElementById(errId);
      if (errEl && !errEl.classList.contains("hidden")) {
        let key = errId;
        if (errId === "accessError" && errEl.dataset.isServerError === "true") {
          key = "serverError";
        }
        errEl.textContent = texts[key] || "An error occurred.";
      }
    }
  );
}

// Clear Coma Module inputs and hide result
function resetComaModuleInputs() {
  const gfapInput = document.getElementById("gfapComaInput");
  if (gfapInput) gfapInput.value = "";
  const comaResult = document.getElementById("comaResult");
  if (comaResult) {
    comaResult.classList.add("hidden");
    comaResult.innerHTML = "";
    comaResult.className = "result hidden";
  }
}

// Clear Standard Stroke Module inputs
function resetStandardStrokeInputs() {
  ["stdAgeInput", "stdGfapInput", "stdSbpInput"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  const result = document.getElementById("standardResult");
  if (result) {
    result.classList.add("hidden");
    result.innerHTML = "";
    result.className = "result hidden";
  }
  const error = document.getElementById("standardError");
  if (error) error.classList.add("hidden");
}

// Clear Rapid Stroke Module inputs
function resetRapidStrokeInputs() {
  ["rapAgeInput", "rapFastEdInput", "rapSbpInput", "rapGfapInput"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  const headacheInput = document.getElementById("rapHeadacheInput");
  if (headacheInput) headacheInput.checked = false;
  const result = document.getElementById("rapidResult");
  if (result) {
    result.classList.add("hidden");
    result.innerHTML = "";
    result.className = "result hidden";
  }
  const error = document.getElementById("rapidError");
  if (error) error.classList.add("hidden");
}

// Clear Max Stroke Module inputs
function resetMaxStrokeInputs() {
  // Clear basic fields
  const fieldsToClear = ["maxAgeInput", "maxGfapInput", "maxSbpInput", "maxDbpInput"];
  fieldsToClear.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  // Clear symptom checkboxes and FAST ED toggles
  const checkboxesToClear = [
    "maxEyeDeviationInput",
    "maxArmParesisInput",
    "maxLegParesisInput",
    "maxVigilanceInput",
    "maxAfibInput",
    "maxHeadacheInput",
    "maxNoakInput",
    "maxAntiplateletsInput",
    "maxFastEdFacialPalsy",
  ];
  checkboxesToClear.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.checked = false;
  });

  // Reset FAST ED select values to 0
  const selectsToReset = {
    maxFastEdArmWeakness: "0",
    maxFastEdSpeechChanges: "0",
    maxFastEdEyeDeviation: "0",
    maxFastEdDenialNeglect: "0",
  };
  Object.keys(selectsToReset).forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = selectsToReset[id];
  });

  // Update displayed FAST ED score after clearing
  updateMaxFastEdScore();

  // Hide score component container and reset toggle button for FAST ED
  const fastEdContainer = document.getElementById("fastEdComponentsContainerMax");
  if (fastEdContainer) fastEdContainer.classList.add("hidden");
  const fastEdBtn = document.getElementById("maxToggleFastEdBtn");
  if (fastEdBtn) fastEdBtn.setAttribute("aria-expanded", "false");
  const fastEdBtnTextEl = document.getElementById("maxToggleFastEdBtnText");
  if (fastEdBtnTextEl && window.translations[currentLang]) {
    fastEdBtnTextEl.textContent =
      window.translations[currentLang].toggleFastEdBtnTextCalculate || "Calculate/Edit";
  }

  // Hide result and error elements
  const resultEl = document.getElementById("maxResult");
  if (resultEl) {
    resultEl.classList.add("hidden");
    resultEl.innerHTML = "";
    resultEl.className = "result hidden";
  }
  const errorEl = document.getElementById("maxError");
  if (errorEl) errorEl.classList.add("hidden");
}

// Navigate to module selection screen if authenticated; otherwise show access code entry.
function navigateToModuleSelection() {
  if (sessionStorage.getItem("isAuthenticated") !== "true") {
    showSection("codeEntrySection");
    return;
  }
  showSection("moduleSelectionSection");
  resetComaModuleInputs();
  resetStandardStrokeInputs();
  resetRapidStrokeInputs();
  resetMaxStrokeInputs();
  ["accessCodeInput", "accessError"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      if (el.tagName === "INPUT") el.value = "";
      else el.classList.add("hidden");
    }
  });
}

// Navigate back to code entry (log out).
function navigateToCodeEntry() {
  showSection("codeEntrySection");
  resetComaModuleInputs();
  resetStandardStrokeInputs();
  resetRapidStrokeInputs();
  resetMaxStrokeInputs();
  const accessCodeInput = document.getElementById("accessCodeInput");
  if (accessCodeInput) {
    accessCodeInput.value = "";
    accessCodeInput.focus();
  }
  const accessErrorEl = document.getElementById("accessError");
  if (accessErrorEl) accessErrorEl.classList.add("hidden");
}

// Determine risk category (low/medium/high) based on probability percentage.
function updateRiskStratification(probability) {
  let riskLevel, riskClass;
  if (probability < 25) {
    riskLevel = window.translations[currentLang].lowRisk;
    riskClass = "low-risk";
  } else if (probability < 50) {
    riskLevel = window.translations[currentLang].mediumRisk;
    riskClass = "medium-risk";
  } else {
    riskLevel = window.translations[currentLang].highRisk;
    riskClass = "red-risk";
  }
  return { riskLevel, riskClass };
}

// Validate the access code by sending it to the backend.
async function validateAccessCode() {
  const accessCodeInput = document.getElementById("accessCodeInput");
  const accessErrorEl = document.getElementById("accessError");
  const accessCodeButton = document.getElementById("accessCodeButton");
  if (!accessCodeInput || !accessErrorEl || !accessCodeButton) return;

  const accessCode = accessCodeInput.value.trim();
  if (!accessCode) {
    accessErrorEl.textContent = window.translations[currentLang].invalidInput;
    accessErrorEl.classList.remove("hidden");
    accessErrorEl.dataset.isServerError = "false";
    return;
  }

  setButtonLoading(accessCodeButton, true);
  accessErrorEl.classList.add("hidden");

  try {
    const response = await fetch(ACCESS_CODE_VALIDATOR_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessCode }),
    });
    const data = await response.json();
    if (response.ok && data.success) {
      sessionStorage.setItem("isAuthenticated", "true");
      navigateToModuleSelection();
    } else {
      accessErrorEl.textContent =
        data.message || window.translations[currentLang].accessError;
      accessErrorEl.classList.remove("hidden");
      accessErrorEl.dataset.isServerError = String(response.status >= 500);
    }
  } catch (error) {
    console.error("Error validating access code:", error);
    accessErrorEl.textContent = window.translations[currentLang].serverError;
    accessErrorEl.classList.remove("hidden");
    accessErrorEl.dataset.isServerError = "true";
  } finally {
    setButtonLoading(accessCodeButton, false);
  }
}

// Show the Coma Module.
function startComaModule() {
  showSection("comaModuleSection");
  resetComaModuleInputs();
  document.getElementById("gfapComaInput")?.focus();
}

// Show the Stroke Module Choice.
function startStrokeModule() {
  showSection("strokeChoiceSection");
  resetStandardStrokeInputs();
  resetRapidStrokeInputs();
  resetMaxStrokeInputs();
}

// Validate standard stroke prerequisites.
function validateStandardPrerequisites() {
  const checksMet = ["stdPrereq1", "stdPrereq2", "stdPrereq3", "stdPrereq4"].every(
    (id) => document.getElementById(id)?.checked
  );

  const errorEl = document.getElementById("standardPrereqError");
  if (checksMet) {
    showSection("standardStrokeModuleSection");
    document.getElementById("stdAgeInput")?.focus();
    if (errorEl) errorEl.classList.add("hidden");
  } else {
    if (errorEl) {
      errorEl.textContent = window.translations[currentLang].prerequisiteError;
      errorEl.classList.remove("hidden");
    }
  }
}

// Validate advanced stroke prerequisites.
function validateAdvancedPrerequisites() {
  const checksMet = ["advPrereq1", "advPrereq2", "advPrereq3"].every(
    (id) => document.getElementById(id)?.checked
  );

  const errorEl = document.getElementById("advancedPrereqError");
  if (checksMet) {
    showSection("advancedChoiceSection");
    if (errorEl) errorEl.classList.add("hidden");
  } else {
    if (errorEl) {
      errorEl.textContent = window.translations[currentLang].prerequisiteError;
      errorEl.classList.remove("hidden");
    }
  }
}

// Show disclaimer modal.
function showDisclaimer() {
  const modal = document.getElementById("disclaimerModal");
  const confirmBtn = document.getElementById("disclaimerConfirmButton");
  if (!modal || !confirmBtn) return;
  modal.style.display = "flex";
  setTimeout(() => {
    modal.classList.add("show");
    confirmBtn.focus();
  }, 10);
}

// Close disclaimer modal and show pending result.
function closeDisclaimer() {
  const modal = document.getElementById("disclaimerModal");
  if (!modal) return;
  modal.classList.remove("show");
  modal.addEventListener(
    "transitionend",
    function handler() {
      modal.style.display = "none";
      modal.removeEventListener("transitionend", handler);
      if (pendingResult) {
        let focusButtonId = null;
        if (pendingResult.element.id === "comaResult") focusButtonId = "calculateComaButton";
        else if (pendingResult.element.id === "standardResult")
          focusButtonId = "calculateStandardButton";
        else if (pendingResult.element.id === "rapidResult")
          focusButtonId = "calculateRapidButton";
        else if (pendingResult.element.id === "maxResult") focusButtonId = "calculateMaxButton";
        document.getElementById(focusButtonId)?.focus();
        // Apply risk class to result elements
        if (pendingResult.element.id.includes("Result")) {
          pendingResult.element.classList.add(pendingResult.riskClass);
        }
      }
    },
    { once: true }
  );
}

// Setup FAST-ED score calculator for Max module.
function setupMaxFastEdScore() {
  const toggleBtn = document.getElementById("maxToggleFastEdBtn");
  const componentsDiv = document.getElementById("fastEdComponentsContainerMax");
  const scoreDisplay = document.getElementById("maxFastEdScoreDisplay");
  const hiddenInput = document.getElementById("maxFastEdInput");
  const toggleBtnTextEl = document.getElementById("maxToggleFastEdBtnText");

  if (!toggleBtn || !componentsDiv || !scoreDisplay || !hiddenInput || !toggleBtnTextEl) {
    console.warn("Missing elements for FAST ED score calculator");
    return () => {};
  }

  function calculateAndUpdate() {
    let currentScore = 0;

    // Facial Palsy (checkbox - 1 point)
    const facialPalsy = document.getElementById("maxFastEdFacialPalsy");
    if (facialPalsy && facialPalsy.checked) currentScore += 1;

    // Arm Weakness (select - 0-2 points)
    const armWeakness = document.getElementById("maxFastEdArmWeakness");
    if (armWeakness) currentScore += parseInt(armWeakness.value);

    // Speech Changes (select - 0-2 points)
    const speechChanges = document.getElementById("maxFastEdSpeechChanges");
    if (speechChanges) currentScore += parseInt(speechChanges.value);

    // Eye Deviation (select - 0-2 points)
    const eyeDeviation = document.getElementById("maxFastEdEyeDeviation");
    if (eyeDeviation) currentScore += parseInt(eyeDeviation.value);

    // Denial/Neglect (select - 0-2 points)
    const denialNeglect = document.getElementById("maxFastEdDenialNeglect");
    if (denialNeglect) currentScore += parseInt(denialNeglect.value);

    scoreDisplay.textContent = currentScore;
    hiddenInput.value = currentScore;
  }

  // Add event listeners to all score components
  document
    .querySelectorAll("#fastEdComponentsContainerMax input, #fastEdComponentsContainerMax select")
    .forEach((el) => el.addEventListener("change", calculateAndUpdate));

  toggleBtn.addEventListener("click", () => {
    const isHiddenAfterToggle = componentsDiv.classList.toggle("hidden");
    toggleBtn.setAttribute("aria-expanded", String(!isHiddenAfterToggle));
    let calculateKey = "toggleFastEdBtnTextCalculate";
    let hideKey = "toggleFastEdBtnTextHide";
    toggleBtnTextEl.textContent =
      window.translations[currentLang][isHiddenAfterToggle ? calculateKey : hideKey];
  });

  calculateAndUpdate(); // Initial calculation
  return calculateAndUpdate; // Return the function so it can be called externally if needed
}

// Calculate coma risk.
async function calculateComaRisk() {
  const gfapInput = document.getElementById("gfapComaInput");
  const resultEl = document.getElementById("comaResult");
  const calculateButton = document.getElementById("calculateComaButton");
  if (!gfapInput || !resultEl || !calculateButton) return;

  const gfap = parseFloat(gfapInput.value);
  resultEl.className = "result hidden"; // Reset classes

  if (isNaN(gfap) || gfap < 29 || gfap > 10001) {
    resultEl.textContent = window.translations[currentLang].invalidGFAP;
    resultEl.classList.add("warning");
    resultEl.classList.remove("hidden");
    gfapInput.focus();
    return;
  }

  setButtonLoading(calculateButton, true);
  try {
    const response = await fetch(COMA_CALCULATOR_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gfap }),
    });
    const data = await response.json();
    if (response.ok && data.success) {
      showDisclaimer();
      const { riskLevel, riskClass } = updateRiskStratification(data.probability);
      pendingResult = {
        element: resultEl,
        html: `<strong>${window.translations[currentLang].probability}:</strong> ${data.probability.toFixed(
          1
        )}%<br>
               <strong>${window.translations[currentLang].riskLevel}:</strong> ${riskLevel}`,
        baseClass: "result",
        riskClass: riskClass,
      };
    } else {
      resultEl.textContent = data.message || window.translations[currentLang].serverError;
      resultEl.classList.add("warning");
      resultEl.classList.remove("hidden");
    }
  } catch (error) {
    console.error("Error calculating coma risk:", error);
    resultEl.textContent = window.translations[currentLang].serverError;
    resultEl.classList.add("warning");
    resultEl.classList.remove("hidden");
  } finally {
    setButtonLoading(calculateButton, false);
  }
}

// Calculate standard stroke risk.
async function calculateStandardStrokeRisk() {
  const ageInput = document.getElementById("stdAgeInput");
  const gfapInput = document.getElementById("stdGfapInput");
  const sbpInput = document.getElementById("stdSbpInput");
  const resultEl = document.getElementById("standardResult");
  const calculateButton = document.getElementById("calculateStandardButton");
  if (!ageInput || !gfapInput || !sbpInput || !resultEl || !calculateButton) return;

  const age = parseInt(ageInput.value, 10);
  const gfap = parseFloat(gfapInput.value);
  const sbp = parseFloat(sbpInput.value);
  resultEl.className = "result hidden"; // Reset classes

  if (isNaN(age) || age < 18 || age > 120) {
    resultEl.textContent = window.translations[currentLang].invalidAge;
    resultEl.classList.add("warning");
    resultEl.classList.remove("hidden");
    ageInput.focus();
    return;
  }
  if (isNaN(gfap) || gfap < 29 || gfap > 10001) {
    resultEl.textContent = window.translations[currentLang].invalidGFAP;
    resultEl.classList.add("warning");
    resultEl.classList.remove("hidden");
    gfapInput.focus();
    return;
  }
  if (isNaN(sbp) || sbp < 50 || sbp > 250) {
    resultEl.textContent = window.translations[currentLang].sbpError;
    resultEl.classList.add("warning");
    resultEl.classList.remove("hidden");
    sbpInput.focus();
    return;
  }

  setButtonLoading(calculateButton, true);
  try {
    const response = await fetch(STANDARD_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ age, gfap, sbp }),
    });
    const data = await response.json();
    if (response.ok && data.success) {
      showDisclaimer();
      const { riskLevel, riskClass } = updateRiskStratification(data.probability);
      pendingResult = {
        element: resultEl,
        html: `<strong>${window.translations[currentLang].probability}:</strong> ${data.probability.toFixed(
          1
        )}%<br>
               <strong>${window.translations[currentLang].riskLevel}:</strong> ${riskLevel}`,
        baseClass: "result",
        riskClass: riskClass,
      };
    } else {
      resultEl.textContent = data.message || window.translations[currentLang].serverError;
      resultEl.classList.add("warning");
      resultEl.classList.remove("hidden");
    }
  } catch (error) {
    console.error("Error calculating stroke risk:", error);
    resultEl.textContent = window.translations[currentLang].serverError;
    resultEl.classList.add("warning");
    resultEl.classList.remove("hidden");
  } finally {
    setButtonLoading(calculateButton, false);
  }
}

// Calculate rapid stroke risk.
async function calculateRapidStrokeRisk() {
  const ageInput = document.getElementById("rapAgeInput");
  const fastEdInput = document.getElementById("rapFastEdInput");
  const headacheInput = document.getElementById("rapHeadacheInput");
  const sbpInput = document.getElementById("rapSbpInput");
  const gfapInput = document.getElementById("rapGfapInput");
  const resultEl = document.getElementById("rapidResult");
  const calculateButton = document.getElementById("calculateRapidButton");
  if (!ageInput || !fastEdInput || !sbpInput || !gfapInput || !resultEl || !calculateButton)
    return;

  const age = parseInt(ageInput.value, 10);
  const fastEd = parseInt(fastEdInput.value, 10);
  const headache = headacheInput.checked ? 1 : 0;
  const sbp = parseFloat(sbpInput.value);
  const gfap = parseFloat(gfapInput.value);
  resultEl.className = "result hidden"; // Reset classes

  if (isNaN(age) || age < 18 || age > 120) {
    resultEl.textContent = window.translations[currentLang].invalidAge;
    resultEl.classList.add("warning");
    resultEl.classList.remove("hidden");
    ageInput.focus();
    return;
  }
  if (isNaN(fastEd) || fastEd < 0 || fastEd > 9) {
    resultEl.textContent = window.translations[currentLang].fastEdError;
    resultEl.classList.add("warning");
    resultEl.classList.remove("hidden");
    fastEdInput.focus();
    return;
  }
  if (isNaN(sbp) || sbp < 50 || sbp > 250) {
    resultEl.textContent = window.translations[currentLang].sbpError;
    resultEl.classList.add("warning");
    resultEl.classList.remove("hidden");
    sbpInput.focus();
    return;
  }
  if (isNaN(gfap) || gfap < 29 || gfap > 10001) {
    resultEl.textContent = window.translations[currentLang].invalidGFAP;
    resultEl.classList.add("warning");
    resultEl.classList.remove("hidden");
    gfapInput.focus();
    return;
  }

  setButtonLoading(calculateButton, true);
  try {
    const response = await fetch(RAPID_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ age, fast_ed: fastEd, headache, sbp, gfap }),
    });
    const data = await response.json();
    if (response.ok && data.success) {
      showDisclaimer();
      const { riskLevel, riskClass } = updateRiskStratification(data.probability);
      pendingResult = {
        element: resultEl,
        html: `<strong>${window.translations[currentLang].probability}:</strong> ${data.probability.toFixed(
          1
        )}%<br>
               <strong>${window.translations[currentLang].riskLevel}:</strong> ${riskLevel}`,
        baseClass: "result",
        riskClass: riskClass,
      };
    } else {
      resultEl.textContent = data.message || window.translations[currentLang].serverError;
      resultEl.classList.add("warning");
      resultEl.classList.remove("hidden");
    }
  } catch (error) {
    console.error("Error calculating rapid stroke risk:", error);
    resultEl.textContent = window.translations[currentLang].serverError;
    resultEl.classList.add("warning");
    resultEl.classList.remove("hidden");
  } finally {
    setButtonLoading(calculateButton, false);
  }
}

// Calculate max stroke risk.
async function calculateMaxStrokeRisk() {
  const resultEl = document.getElementById("maxResult");
  const errorEl = document.getElementById("maxError");
  const calculateButton = document.getElementById("calculateMaxButton");
  if (!resultEl || !errorEl || !calculateButton) {
    console.error("Max stroke elements missing");
    return;
  }

  resultEl.className = "result hidden";
  errorEl.classList.add("hidden");
  document.querySelectorAll(".input-error").forEach((el) => el.classList.remove("input-error"));

  // Read fields
  const age = parseInt(document.getElementById("maxAgeInput")?.value, 10);
  const gfap = parseFloat(document.getElementById("maxGfapInput")?.value);
  const sbp = parseFloat(document.getElementById("maxSbpInput")?.value);
  const dbp = parseFloat(document.getElementById("maxDbpInput")?.value);
  const fastEd = parseInt(document.getElementById("maxFastEdInput")?.value, 10);

  // Checkboxes
  const eyeDeviation = document.getElementById("maxEyeDeviationInput")?.checked ? 1 : 0;
  const armParese = document.getElementById("maxArmParesisInput")?.checked ? 1 : 0;
  const legParese = document.getElementById("maxLegParesisInput")?.checked ? 1 : 0;
  const vigilance = document.getElementById("maxVigilanceInput")?.checked ? 1 : 0;
  const afib = document.getElementById("maxAfibInput")?.checked ? 1 : 0;
  const headache = document.getElementById("maxHeadacheInput")?.checked ? 1 : 0;
  const noak = document.getElementById("maxNoakInput")?.checked ? 1 : 0;
  const antiplatelets = document.getElementById("maxAntiplateletsInput")?.checked ? 1 : 0;

  // Validate all fields
  const fieldsToValidate = [
    {
      id: "maxAgeInput",
      condition: isNaN(age) || age < 18 || age > 120,
      error: window.translations[currentLang].invalidAge,
    },
    {
      id: "maxGfapInput",
      condition: isNaN(gfap) || gfap < 0 || gfap > 50000,
      error: window.translations[currentLang].invalidGFAP,
    },
    {
      id: "maxSbpInput",
      condition: isNaN(sbp) || sbp < 50 || sbp > 300,
      error: window.translations[currentLang].sbpError,
    },
    {
      id: "maxDbpInput",
      condition: isNaN(dbp) || dbp < 30 || dbp > 200,
      error: window.translations[currentLang].dbpError,
    },
    {
      id: "maxFastEdInput",
      condition: isNaN(fastEd) || fastEd < 0 || fastEd > 9,
      error: window.translations[currentLang].fastEdError,
    },
  ];

  let errorMessages = [];
  fieldsToValidate.forEach((field) => {
    if (field.condition) {
      errorMessages.push(field.error);
      document.getElementById(field.id)?.classList.add("input-error");
    }
  });

  if (errorMessages.length > 0) {
    errorEl.innerHTML = errorMessages.join("<br>");
    errorEl.classList.remove("hidden");
    return;
  }

  setButtonLoading(calculateButton, true);

  // Payload keys exactly as expected by your Cloud Function
  const payload = {
    "Age (years)": age,
    "FAST ED Score": fastEd,
    "Eye Deviation Flipped(1ja/0Nein)": eyeDeviation,
    "Armparese Flipped(1ja/0Nein)": armParese,
    "Beinparese Flipped(Ja1/0Nein)": legParese,
    "Vigilanzminderung (1Ja/0Nein)": vigilance,
    "Atrial Fibrillation bekannt(Ja1/Nein0)": afib,
    "Headache(Ja1/Nein0)": headache,
    "Systolic BP": sbp,
    "Diastolic BP": dbp,
    "Antcoagulated-NOAK(Ja1/Nein0)": noak,
    "Antiplatelets(ja1/Nein0)": antiplatelets,
    "GFAP value": gfap,
  };

  try {
    const response = await fetch(MAX_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (response.ok && data.success) {
      showDisclaimer();
      const { riskLevel, riskClass } = updateRiskStratification(data.probability);
      pendingResult = {
        element: resultEl,
        html: `<strong>${window.translations[currentLang].probability}:</strong> ${
          data.probability !== undefined ? data.probability.toFixed(1) : "N/A"
        }%<br>
              <strong>${window.translations[currentLang].riskLevel}:</strong> <span class="${riskClass}">${riskLevel}</span>`,
        baseClass: "result",
        riskClass: riskClass,
      };
    } else {
      errorEl.textContent = data.message || window.translations[currentLang].serverError;
      errorEl.classList.remove("hidden");
    }
  } catch (error) {
    console.error("Error calculating max stroke risk:", error);
    errorEl.textContent = window.translations[currentLang].serverError;
    errorEl.classList.remove("hidden");
  } finally {
    setButtonLoading(calculateButton, false);
  }
}

// Toggle button between loading and normal state.
function setButtonLoading(buttonElement, isLoading) {
  if (!buttonElement) return;
  if (isLoading) {
    buttonElement.classList.add("loading");
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove("loading");
    buttonElement.disabled = false;
  }
}

// Update the FAST-ED score display for Max module
function updateMaxFastEdScore() {
  const scoreDisplay = document.getElementById("maxFastEdScoreDisplay");
  const hiddenInput = document.getElementById("maxFastEdInput");
  if (!scoreDisplay || !hiddenInput) return;

  // Recalculate score
  let currentScore = 0;

  // Facial Palsy (checkbox - 1 point)
  const facialPalsy = document.getElementById("maxFastEdFacialPalsy");
  if (facialPalsy && facialPalsy.checked) currentScore += 1;

  // Arm Weakness (select - 0-2 points)
  const armWeakness = document.getElementById("maxFastEdArmWeakness");
  if (armWeakness) currentScore += parseInt(armWeakness.value);

  // Speech Changes (select - 0-2 points)
  const speechChanges = document.getElementById("maxFastEdSpeechChanges");
  if (speechChanges) currentScore += parseInt(speechChanges.value);

  // Eye Deviation (select - 0-2 points)
  const eyeDeviation = document.getElementById("maxFastEdEyeDeviation");
  if (eyeDeviation) currentScore += parseInt(eyeDeviation.value);

  // Denial/Neglect (select - 0-2 points)
  const denialNeglect = document.getElementById("maxFastEdDenialNeglect");
  if (denialNeglect) currentScore += parseInt(denialNeglect.value);

  scoreDisplay.textContent = currentScore;
  hiddenInput.value = currentScore;
}

// Back to top functionality
function setupBackToTop() {
  const backToTopButton = document.getElementById("backToTop");
  if (!backToTopButton) return;

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopButton.style.display = "block";
    } else {
      backToTopButton.style.display = "none";
    }
  });

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Debug function to show API calls in UI
function updateDebugInfo(url, payload) {
  const debugEl = document.getElementById("debugInfo");
  if (!debugEl) return;

  debugEl.innerHTML = `
    API Call: ${url}<br>
    Payload: ${JSON.stringify(payload)}
  `;
}

// DOMContentLoaded event listener: initializes the app.
document.addEventListener("DOMContentLoaded", function () {
  if (sessionStorage.getItem("isAuthenticated") === "true") {
    navigateToModuleSelection();
  } else {
    showSection("codeEntrySection");
  }

  // Set current year
  if (document.getElementById("currentYear")) {
    document.getElementById("currentYear").textContent = new Date().getFullYear();
  }

  document.getElementById("accessCodeInput")?.focus();

  // Dark-Mode from localStorage and icon
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    const darkModeSpan = document.getElementById("darkModeToggle")?.querySelector("span");
    if (darkModeSpan) darkModeSpan.textContent = "☀️";
  }

  // Preferred language
  const preferredLang = localStorage.getItem("language") || "en";
  switchLanguage(preferredLang);

  // FAST-ED Score setup for Max module
  setupMaxFastEdScore();

  // Set up back to top button
  setupBackToTop();

  // Register Service Worker if available
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./sw.js")
        .then((reg) => console.log("Service Worker registered with scope:", reg.scope))
        .catch((err) => console.error("Service Worker registration failed:", err));
    });
  }

  // Attach event listeners
  document.getElementById("accessCodeButton")?.addEventListener("click", validateAccessCode);
  document.getElementById("accessCodeInput")?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      validateAccessCode();
    }
  });

  // Coma module
  document.getElementById("comaModuleButton")?.addEventListener("click", startComaModule);
  document.getElementById("calculateComaButton")?.addEventListener("click", calculateComaRisk);
  document.getElementById("gfapComaInput")?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      calculateComaRisk();
    }
  });

  // Stroke module navigation
  document.getElementById("strokeModuleButton")?.addEventListener("click", startStrokeModule);
  document.getElementById("standardModelButton")?.addEventListener("click", () =>
    showSection("standardPrerequisitesSection")
  );
  document.getElementById("advancedModelButton")?.addEventListener("click", () =>
    showSection("advancedPrerequisitesSection")
  );
  document.getElementById("standardNextButton")?.addEventListener("click", validateStandardPrerequisites);
  document.getElementById("advancedNextButton")?.addEventListener("click", validateAdvancedPrerequisites);
  document.getElementById("rapidVersionButton")?.addEventListener("click", () =>
    showSection("rapidModuleSection")
  );
  document.getElementById("maxVersionButton")?.addEventListener("click", () =>
    showSection("maxModuleSection")
  );

  // Back buttons
  document.getElementById("strokeBackButton")?.addEventListener("click", () =>
    showSection("moduleSelectionSection")
  );
  document.getElementById("standardBackButton")?.addEventListener("click", () =>
    showSection("strokeChoiceSection")
  );
  document.getElementById("stdBackButton")?.addEventListener("click", () =>
    showSection("standardPrerequisitesSection")
  );
  document.getElementById("advancedBackButton")?.addEventListener("click", () =>
    showSection("strokeChoiceSection")
  );
  document.getElementById("advChoiceBackButton")?.addEventListener("click", () =>
    showSection("advancedPrerequisitesSection")
  );
  document.getElementById("rapidBackButton")?.addEventListener("click", () =>
    showSection("advancedChoiceSection")
  );
  document.getElementById("maxBackButton")?.addEventListener("click", () =>
    showSection("advancedChoiceSection")
  );
  document.getElementById("comaBackButton")?.addEventListener("click", navigateToModuleSelection);
  document.getElementById("homeButton")?.addEventListener("click", navigateToModuleSelection);

  // Calculation buttons
  document.getElementById("calculateStandardButton")?.addEventListener("click", calculateStandardStrokeRisk);
  document.getElementById("calculateRapidButton")?.addEventListener("click", calculateRapidStrokeRisk);
  document.getElementById("calculateMaxButton")?.addEventListener("click", calculateMaxStrokeRisk);

  // Add keyboard support for inputs
  ["stdAgeInput", "stdGfapInput", "stdSbpInput"].forEach((id) => {
    document.getElementById(id)?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        calculateStandardStrokeRisk();
      }
    });
  });

  ["rapAgeInput", "rapFastEdInput", "rapSbpInput", "rapGfapInput"].forEach((id) => {
    document.getElementById(id)?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        calculateRapidStrokeRisk();
      }
    });
  });

  ["maxAgeInput", "maxGfapInput", "maxSbpInput", "maxDbpInput"].forEach((id) => {
    document.getElementById(id)?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        calculateMaxStrokeRisk();
      }
    });
  });

  // Dark mode toggle
  const darkModeButton = document.getElementById("darkModeToggle");
  darkModeButton?.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    const iconSpan = darkModeButton.querySelector("span");
    const texts = window.translations[currentLang];
    if (document.body.classList.contains("dark-mode")) {
      if (iconSpan) iconSpan.textContent = "☀️";
      darkModeButton.setAttribute("aria-label", texts.darkModeToggleLabelOn);
      localStorage.setItem("darkMode", "enabled");
    } else {
      if (iconSpan) iconSpan.textContent = "🌙";
      darkModeButton.setAttribute("aria-label", texts.darkModeToggleLabelOff);
      localStorage.setItem("darkMode", "disabled");
    }
  });

  // Disclaimer confirmation
  document
    .getElementById("disclaimerConfirmButton")
    ?.addEventListener("click", function () {
      closeDisclaimer();
      if (pendingResult) {
        pendingResult.element.innerHTML = pendingResult.html;
        pendingResult.element.className = `${pendingResult.baseClass}`;
        pendingResult.element.classList.remove("hidden");
        if (pendingResult.riskClass) {
          pendingResult.element.classList.add(pendingResult.riskClass);
        }
        pendingResult = null;
      }
    });
});
