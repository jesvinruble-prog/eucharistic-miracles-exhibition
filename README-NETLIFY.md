# Netlify Deployment Guide

This application is ready to be hosted on Netlify as a completely static website! 

While the source code uses React and Vite, the final compiled output is pure, vanilla HTML, JavaScript, and CSS. 

**You do NOT need to install npm, Node.js, or run any build commands to host this.**

### How to Drag-and-Drop to Netlify:

1. Look inside this ZIP folder you just downloaded.
2. Find the folder named **`dist`** (this stands for "distribution").
3. The `dist` folder contains the final, static website. It has a single `index.html` file inside it, along with your compiled scripts, styles, images, and the Netlify `_redirects` file.
4. Go to [Netlify Drop](https://app.netlify.com/drop).
5. **Drag and drop the entire `dist` folder** into the upload area on Netlify.

That's it! Netlify will instantly host your site, serve your images, and use the `_redirects` file to automatically fix the PDF CORS errors.
