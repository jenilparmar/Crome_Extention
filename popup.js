document.addEventListener("DOMContentLoaded", () => {
  const pasteButton = document.getElementById("pasteImage");
  if (pasteButton) {
    pasteButton.addEventListener("click", () => {
      document.getElementById("response").innerText = "Processing request...";
    
      navigator.clipboard
        .read()
        .then((items) => {
          for (const item of items) {
            if (item.types.includes("image/png")) {
              item.getType("image/png").then((blob) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  const base64String = reader.result;

                  fetch("http://127.0.0.1:5000/get", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ base64String }),
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      document.getElementById("response").textContent =
                        data.response;
                    })
                    .catch((error) =>
                      console.error("Error sending to API:", error)
                    );
                };
                reader.readAsDataURL(blob);
              });
            }
          }
        })
        .catch((error) => console.error("Clipboard access error:", error));
    });
  }
});
