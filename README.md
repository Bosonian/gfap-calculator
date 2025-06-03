# iGFAP Check (Mark 6)

> A Progressive Web App (PWA) for estimating intracerebral hemorrhage (ICH) risk based on GFAP, SBP, FAST ED, and other clinical inputs.

---

## Table of Contents

1. [Features](#features)
2. [Folder Structure](#folder-structure)
3. [Prerequisites & Local Setup](#prerequisites--local-setup)
4. [Deployment (GitHub Pages)](#deployment-github-pages)
5. [How to Use](#how-to-use)
6. [Back-end API Endpoints](#back-end-api-endpoints)
7. [Local Testing: Back-end Functions](#local-testing-back-end-functions)
8. [Contributing](#contributing)
9. [License](#license)

---

## Features

* **Access-Code Protection**: Only authenticated users can proceed.
* **Coma Module**: Input GFAP to estimate ICH risk among comatose patients (GCS 3–8).
* **Stroke Module**n  - **Standard Model** (3 inputs: Age, GFAP, SBP)

  * **Advanced Model** splits into:

    * **Rapid (Schnell)** (5 inputs: Age, FAST ED, Headache, SBP, GFAP)
    * **Max** (13 inputs including FAST ED components, neuro-symptoms, anticoagulant status, etc.)
* **Internationalization**: English and Deutsch translations; easy to add more languages.
* **Dark Mode**: Toggle between light/dark theme.
* **Mobile-Friendly**: Responsive design, PWA manifest, offline caching via service worker.
* **Back-to-Top** button and keyboard support (press Enter to submit forms).

---

## Folder Structure

```
📦 iGFAP-frontend
├─ index.html           ← Main HTML (links to CSS/JS + PWA manifest)  
├─ styles.css           ← All visual styles (themes, dark mode, layout)  
├─ translations.js      ← English/German text dictionaries  
├─ main.js              ← App logic (show/hide, API calls, validation)  
├─ sw.js                ← Service Worker (caching, offline support)  
├─ manifest.json        ← PWA manifest (icons, display, theme color)  
├─ icon-192.png         ← PWA icon (192×192)  
├─ icon-512.png         ← PWA icon (512×512)  
└─ README.md            ← (this file) Project overview & instructions
```

---

## Prerequisites & Local Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/iGFAP-frontend.git
   cd iGFAP-frontend
   ```

2. **Serve the files with any static server** (no build step required)

   * If you have Node.js installed, run:

     ```bash
     npx http-server . -p 8080
     ```

     Then open `http://localhost:8080` in your browser.
   * Or simply open `index.html` directly in a modern browser. Note that the service worker and PWA features work properly only if served over `http://localhost` or `https://`.

3. **Ensure the back-end Cloud Functions are running** (or deployed) so that API calls succeed. See [Back-end API Endpoints](#back-end-api-endpoints).

---

## Deployment (GitHub Pages)

1. Make sure your `index.html`, `styles.css`, `main.js`, `sw.js`, `translations.js`, `manifest.json`, and all icons are committed to your `main` (or `gh-pages`) branch.
2. In your repository’s **Settings → Pages**:

   * Under “Source,” choose the branch (e.g. `main`) and set “/(root)” as the folder.
   * Click **Save**.
3. After a minute, your PWA will be live at

   ```
   https://<your-github-username>.github.io/<your-repo-name>/
   ```

---

## How to Use

1. **Access Code**: On first load, you’re prompted for an access code. Enter the code provided by your admin/research team.
2. **Module Selection**: After validation, choose between:

   * **Coma Module** (for comatose patients)
   * **Stroke Module** (for stroke-symptomatic patients)
3. **Stroke Module Flow**:

   * Select **Standard Model** or **Advanced Model**.
   * **Standard**: Check prerequisites (time window, no prior deficits, no trauma, FAST ED ≥ 3) → enter Age/GFAP/SBP → click “Calculate Probability.”
   * **Advanced**: Check prerequisites (time window, no prior deficits, no trauma) → choose **Rapid** or **Max**:

     * **Rapid (5 inputs)**: Age, FAST ED score, Headache (checkbox), SBP, GFAP → “Calculate Probability.”
     * **Max (13 inputs)**:

       * Age, GFAP, SBP, DBP
       * FAST ED sub-items (facial palsy, arm, speech, eye, denial/neglect) → auto-sum into “FAST ED Score”
       * Additional checkboxes (eye deviation, arm paresis, leg paresis, altered sensorium, AFib, headache, NOAK, antiplatelets)
       * Click “Calculate Probability.”
4. **Results Display**: A disclaimer modal pops up. After confirming, you see:

   ```
   Probability: XX.X%  
   Risk Level: Low/Medium/High
   ```
5. **Dark Mode & Language**:

   * Use the moon/sun icon in the header to toggle dark mode.
   * Use the flag icons in the header to switch between English (“🇬🇧”) and German (“🇩🇪”).
6. **Back-to-Top**: A floating “⬆️” button appears after you scroll 300px. Click to smoothly scroll back to top.

---

## Back-end API Endpoints

> Make sure these Cloud Functions are deployed and reachable. If you ever rename or re-deploy a function, update the matching URL in `main.js`.

| Function Name                                                  | Purpose                                        | URL (HTTPS)                                                                                          |
| -------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `validateAccessCode`                                           | Verify user’s access code                      | `https://europe-west3-igfap-452720.cloudfunctions.net/validateAccessCode`                            |
| `calculateComaRisk`                                            | Predict ICH risk in comatose patients          | `https://europe-west3-igfap-452720.cloudfunctions.net/calculateComaRisk`                             |
| `calculateStrokeRisk` (Standard 3-param)                       | Predict ICH risk (Age, GFAP, SBP)              | `https://europe-west3-igfap-452720.cloudfunctions.net/calculateStrokeRisk`                           |
| `calculate-rapid-stroke-rf` (Rapid 5-param)                    | Predict ICH with Rapid Random Forest (5-param) | `https://europe-west3-igfap-452720.cloudfunctions.net/calculate-rapid-stroke-rf`                     |
| `calculate-advanced-stroke-risk-calibrated-xgb` (Max 13-param) | Predict ICH with Calibrated XGBoost (13-param) | `https://europe-west3-igfap-452720.cloudfunctions.net/calculate-advanced-stroke-risk-calibrated-xgb` |

---

## Local Testing: Back-end Functions

If you prefer to run the Python/Node back-end locally before deploying:

1. **Clone each Cloud Function’s repo** (e.g. `calculate_rapid_rf_clean/`) and `cd` into it.
2. **Create and activate a Python virtual environment** (if it’s Python-based).

   ```bash
   python3 -m venv venv  
   source venv/bin/activate  
   pip install -r requirements.txt  
   ```
3. **Run the Functions Framework**

   ```bash
   functions-framework \
     --target calculate_rapid_stroke_risk_rf \
     --signature-type http \
     --port 8084
   ```

   If your function is named differently (e.g. `calculateRapidStrokeRisk`), adjust the `--target` accordingly.
4. **Send a test request**

   ```bash
   curl -X POST http://localhost:8084 \
     -H "Content-Type: application/json" \
     -d '{
       "age": 72,
       "fast_ed": 4,
       "headache": 1,
       "sbp": 200,
       "gfap": 150.0
     }'
   ```

   You should receive a JSON response like

   ```json
   { "success": true, "probability": 12.3 }
   ```
5. If any local test fails, you can inspect the server-side stack trace in that terminal and fix your code before redeploying to GCP.

Repeat analogous steps for each function (`calculateComaRisk`, `calculateStrokeRisk`, etc.) by changing the `--target` name and port if needed.

---

## Contributing

1. **Fork the repository** and clone your fork.
2. **Create a new branch** for your feature or fix:

   ```bash
   git checkout -b feature/my-new-widget
   ```
3. **Make changes**:

   * Add new UI elements in `index.html`.
   * Style in `styles.css`.
   * Add translation keys in `translations.js`.
   * Hook up logic in `main.js`.
   * Update service worker (`sw.js`) if you add new assets to cache.
4. **Test thoroughly** (both visually and by simulating API responses).
5. **Submit a Pull Request**. We’ll review, provide feedback, and merge once it’s polished.

---

## License

This project is released under the MIT License. See [LICENSE](LICENSE) for details.
