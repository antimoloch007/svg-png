document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');
    const convertBtn = document.getElementById('convert-btn');
    const resultsDiv = document.getElementById('results');
    const previewDiv = document.getElementById('preview');
    const widthInput = document.getElementById('width-input');
    const heightInput = document.getElementById('height-input');
    const scaleInput = document.getElementById('scale-input');
    const bgColorInput = document.getElementById('bg-color-input');
    const transparentBgCheckbox = document.getElementById('transparent-bg');
    
    // Variables to store selected files
    let svgFiles = [];
    
    // Event Listeners
    dropArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelection);
    convertBtn.addEventListener('click', convertSvgToPng);
    
    // Drag and drop events
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('highlight');
    });
    
    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('highlight');
    });
    
    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove('highlight');
        
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });
    
    // Background color toggle
    transparentBgCheckbox.addEventListener('change', () => {
        bgColorInput.disabled = transparentBgCheckbox.checked;
    });
    
    // Handle file selection
    function handleFileSelection(e) {
        const files = e.target.files;
        handleFiles(files);
    }
    
    function handleFiles(files) {
        svgFiles = Array.from(files).filter(file => 
            file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')
        );
        
        if (svgFiles.length > 0) {
            dropArea.innerHTML = `<p>${svgFiles.length} SVG file(s) selected</p>`;
            convertBtn.disabled = false;
        } else {
            alert('Please select valid SVG files.');
            dropArea.innerHTML = `<p>Drag & drop SVG files here or click to select</p>`;
            convertBtn.disabled = true;
        }
    }
    
    // Convert SVG to PNG
    function convertSvgToPng() {
        if (svgFiles.length === 0) return;
        
        // Clear previous results
        previewDiv.innerHTML = '';
        resultsDiv.classList.remove('hidden');
        
        // Get conversion settings
        const width = widthInput.value ? parseInt(widthInput.value) : null;
        const height = heightInput.value ? parseInt(heightInput.value) : null;
        const scale = parseFloat(scaleInput.value) || 1;
        const backgroundColor = transparentBgCheckbox.checked ? null : bgColorInput.value;
        
        // Process each SVG file
        svgFiles.forEach((file, index) => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const svgString = e.target.result;
                const fileName = file.name.replace(/\.svg$/i, '.png');
                
                // Create container for this file's result
                const resultContainer = document.createElement('div');
                resultContainer.style.marginBottom = '30px';
                
                // Add file name
                const fileNameEl = document.createElement('div');
                fileNameEl.className = 'file-name';
                fileNameEl.textContent = fileName;
                resultContainer.appendChild(fileNameEl);
                
                // Add progress
                const progress = document.createElement('progress');
                progress.value = 0;
                progress.max = 100;
                resultContainer.appendChild(progress);
                
                previewDiv.appendChild(resultContainer);
                
                // Render SVG to PNG
                renderSvgToPng(svgString, fileName, resultContainer, {
                    width,
                    height,
                    scale,
                    backgroundColor
                }, progress);
            };
            
            reader.readAsText(file);
        });
    }
    
    function renderSvgToPng(svgString, fileName, container, options, progressEl) {
        // Create SVG blob
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
        const svgUrl = URL.createObjectURL(svgBlob);
        
        // Create an image to load the SVG
        const img = new Image();
        progressEl.value = 10;
        
        img.onload = function() {
            progressEl.value = 40;
            
            // Calculate dimensions
            let finalWidth = img.width;
            let finalHeight = img.height;
            
            if (options.width && options.height) {
                finalWidth = options.width;
                finalHeight = options.height;
            } else if (options.width) {
                finalHeight = (options.width / img.width) * img.height;
                finalWidth = options.width;
            } else if (options.height) {
                finalWidth = (options.height / img.height) * img.width;
                finalHeight = options.height;
            }
            
            // Apply scale
            finalWidth *= options.scale;
            finalHeight *= options.scale;
            
            // Create canvas
            const canvas = document.createElement('canvas');
            canvas.width = finalWidth;
            canvas.height = finalHeight;
            
            const ctx = canvas.getContext('2d');
            
            // Fill background if specified
            if (options.backgroundColor) {
                ctx.fillStyle = options.backgroundColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            
            // Draw the image
            ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
            progressEl.value = 70;
            
            // Convert canvas to PNG
            canvas.toBlob(function(blob) {
                progressEl.value = 90;
                
                // Create preview
                const pngUrl = URL.createObjectURL(blob);
                const preview = document.createElement('img');
                preview.src = pngUrl;
                preview.alt = fileName;
                
                // Create download button
                const downloadBtn = document.createElement('div');
                downloadBtn.className = 'download-btn';
                
                const a = document.createElement('a');
                a.href = pngUrl;
                a.download = fileName;
                a.textContent = 'Download PNG';
                a.className = 'download-link';
                
                const btn = document.createElement('button');
                btn.appendChild(a);
                downloadBtn.appendChild(btn);
                
                // Replace progress with preview and download button
                container.removeChild(progressEl);
                container.appendChild(preview);
                container.appendChild(downloadBtn);
                
                // Clean up
                URL.revokeObjectURL(svgUrl);
            }, 'image/png');
        };
        
        img.onerror = function() {
            container.innerHTML = `
                <p style="color: red;">Error converting ${fileName}</p>
                <p>The SVG file might be invalid or contain external references that can't be loaded.</p>
            `;
        };
        
        img.src = svgUrl;
    }
});