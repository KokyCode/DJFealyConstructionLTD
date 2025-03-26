// Admin authentication
const loginForm = document.getElementById("loginForm");
const uploadForm = document.getElementById("uploadForm");
const uploadSection = document.getElementById("uploadSection");

// Check if already logged in
if (sessionStorage.getItem("adminLoggedIn") === "true") {
  showUploadSection();
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const password = document.getElementById("password").value;

  // Create FormData object
  const formData = new FormData();
  formData.append("password", password);

  // Send login request
  fetch("upload.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: formData,
    credentials: "same-origin",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Login response:", data); // Debug log
      if (data.error) {
        showMessage(data.error, "error");
      } else if (data.success) {
        sessionStorage.setItem("adminLoggedIn", "true");
        showUploadSection();
      } else {
        showMessage("Login failed. Please try again.", "error");
      }
    })
    .catch((error) => {
      console.error("Login error:", error); // Debug log
      showMessage("Login failed. Please try again.", "error");
    });
});

// File upload handling
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const previewContainer = document.getElementById("previewContainer");
const uploadButton = document.getElementById("uploadButton");

// Drag and drop handlers
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  handleFiles(e.dataTransfer.files);
});

dropZone.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (e) => {
  handleFiles(e.target.files);
});

function handleFiles(files) {
  previewContainer.innerHTML = "";
  const formData = new FormData();
  let validFiles = 0;

  Array.from(files).forEach((file) => {
    if (file.type.startsWith("image/")) {
      formData.append("images[]", file);
      createPreview(file);
      validFiles++;
    }
  });

  if (validFiles === 0) {
    showMessage("Please select valid image files.", "error");
    return;
  }

  uploadButton.disabled = false;
  uploadButton.dataset.files = validFiles;
}

function createPreview(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const preview = document.createElement("div");
    preview.className = "preview-item";
    preview.innerHTML = `
            <img src="${e.target.result}" alt="Preview">
            <span class="preview-name">${file.name}</span>
        `;
    previewContainer.appendChild(preview);
  };
  reader.readAsDataURL(file);
}

uploadButton.addEventListener("click", () => {
  const formData = new FormData();
  const files = fileInput.files;

  for (let i = 0; i < files.length; i++) {
    formData.append("images[]", files[i]);
  }

  uploadButton.disabled = true;
  showMessage("Uploading files...", "info");

  fetch("upload.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        showMessage(
          `Successfully uploaded ${data.files.length} file(s).`,
          "success"
        );
        previewContainer.innerHTML = "";
        fileInput.value = "";
        uploadButton.disabled = true;
      } else {
        showMessage("Upload failed. Please try again.", "error");
      }
      if (data.errors && data.errors.length > 0) {
        data.errors.forEach((error) => showMessage(error, "error"));
      }
    })
    .catch((error) => {
      showMessage("Upload failed. Please try again.", "error");
    });
});

function showMessage(message, type) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;
  document.body.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}

function showUploadSection() {
  loginForm.style.display = "none";
  uploadSection.style.display = "block";
}
