<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1CQLfbvdGoL_Co7Ue3_xyI1IIzmVLbhrv

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Build for GitHub Pages

This project is configured to output a static build to the `docs/` folder, which can be
served directly by GitHub Pages. To refresh the published site:

1. Build the project:
   `npm run build`
2. Commit and push the updated contents of the `docs/` directory.
3. In your repository settings, set **GitHub Pages** to deploy from the `docs/` folder
   on the `main` branch (if it is not already configured).

GitHub Pages will then serve the bundled assets from `https://<username>.github.io/Bypass-Quest/`.
