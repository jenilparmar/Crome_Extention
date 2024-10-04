document.addEventListener('paste', (event) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      // Check if the item is an image
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        const reader = new FileReader();
        
        // Convert the image to a base64 string
        reader.onload = function (event) {
          const base64String = event.target.result;
  
          // Send the image as base64 to the background script
          chrome.runtime.sendMessage({
            action: 'imagePasted',
            base64String: base64String
          });
        };
  
        reader.readAsDataURL(file);  // Read the image file as DataURL
      }
    }
  });
  