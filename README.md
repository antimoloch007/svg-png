# SVG to PNG Converter

A simple, browser-based tool for converting SVG files to PNG format without requiring any server-side processing.

## Features

- **Easy to Use**: Drag and drop SVGs or click to select files
- **Batch Processing**: Convert multiple SVG files at once
- **Customizable Output**: Adjust width, height, scale, and background color
- **Instant Preview**: See your converted PNGs before downloading
- **Privacy-Focused**: All processing happens in your browser - no files are uploaded to any server
- **No Installation Required**: Works on any modern web browser
- **Fully Responsive**: Works on desktop and mobile devices

## How to Use

1. Open the HTML file in any modern web browser
2. Drag and drop SVG files onto the drop area, or click to select files
3. Adjust conversion settings if needed:
   - Width/Height: Set specific dimensions (optional)
   - Scale: Increase or decrease the size by a factor
   - Background Color: Choose a fill color or use transparency
4. Click "Convert to PNG"
5. Preview the results and download each converted PNG

## Technical Details

This tool uses the following browser technologies:
- HTML5 File API for local file handling
- Canvas API for image rendering
- Blob API for file generation
- Modern JavaScript (ES6+)

## Limitations

- Very large or complex SVGs may be slow to process
- SVGs with external resources (images, CSS) may not convert properly
- Custom fonts in SVGs may not render correctly unless they're installed

## Deployment

Simply download the HTML file and open it in a browser, or host it on any static web hosting service like:
- GitHub Pages
- Netlify
- Vercel
- Amazon S3

No server-side code or backend is required.

## Browser Compatibility

Works in all modern browsers:
- Chrome 49+
- Firefox 45+
- Safari 10+
- Edge 14+

## License

MIT License - See the LICENSE file for details.

---

Created by Austin Harshberger