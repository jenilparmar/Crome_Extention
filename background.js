chrome.commands.onCommand.addListener((command) => {
  if (command === "paste_image") {
    navigator.clipboard.read().then((items) => {
      for (const item of items) {
        if (item.types.includes("image/png")) {
          console.log("Image detected in clipboard.");
          item.getType("image/png").then((blob) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64String = reader.result;
              console.log("Base64 Image String: ", base64String); // Log the base64 string
              
              // Send the base64 string to the API
              fetch("http://127.0.0.1:5000/get", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({ base64String })
              })
                .then((response) => response.json())
                .then((data) => {
                  chrome.runtime.sendMessage({ response: data.response });
                })
                .catch((error) => console.error("Error sending to API:", error));
            };
            reader.readAsDataURL(blob);
          });
        } else {
          console.log("No image found in clipboard.");
        }
      }
    }).catch((error) => console.error("Clipboard access error:", error));
  }
});
