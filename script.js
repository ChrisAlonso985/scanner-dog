const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const captureButton = document.getElementById("captureButton");
const startCameraButton = document.getElementById("startCamera");
const fileInput = document.getElementById("fileInput");
const uploadButton = document.getElementById("uploadButton");
const resultDiv = document.getElementById("result");
const previewImage = document.getElementById("previewImage");

// Abrir cámara solo cuando el usuario lo solicita
startCameraButton.addEventListener("click", function() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
            video.style.display = "block";
            captureButton.style.display = "block";
        })
        .catch(error => console.error("Error accediendo a la cámara:", error));
});

// Tomar foto y apagar la cámara
captureButton.addEventListener("click", function() {
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
        const file = new File([blob], "photo.png", { type: "image/png" });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        previewImage.src = URL.createObjectURL(file);
        previewImage.style.display = "block";
        
        // Apagar la cámara después de tomar la foto
        let stream = video.srcObject;
        let tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        video.style.display = "none";
        captureButton.style.display = "none";
    }, "image/png");
});

// Subir imagen desde la galería
uploadButton.addEventListener("click", function() {
    fileInput.click();
});

fileInput.addEventListener("change", function() {
    if (fileInput.files.length > 0) {
        previewImage.src = URL.createObjectURL(fileInput.files[0]);
        previewImage.style.display = "block";
    }
});

// Identificar la raza del perro
document.getElementById("identifyButton").addEventListener("click", function() {
    if (!fileInput.files.length) {
        alert("Por favor, selecciona una imagen o toma una foto.");
        return;
    }

    const breedsInfo = {
        "Labrador": {"Temperamento": "Amistoso, Inteligente, Energético", "Esperanza de Vida": "10-12 años"},
        "Bulldog": {"Temperamento": "Cariñoso, Protector, Perezoso", "Esperanza de Vida": "8-10 años"},
        "Poodle": {"Temperamento": "Inteligente, Activo, Amigable", "Esperanza de Vida": "12-15 años"},
        "Golden Retriever": {"Temperamento": "Amigable, Inteligente, Devoto", "Esperanza de Vida": "10-12 años"},
        "Beagle": {"Temperamento": "Curioso, Alegre, Amistoso", "Esperanza de Vida": "12-15 años"},
        "Pincher": {"Temperamento": "Enérgico, Leal, Alerta", "Esperanza de Vida": "12-16 años"},
        "Caniche": {"Temperamento": "Cariñoso, Inteligente, Juguetón", "Esperanza de Vida": "10-18 años"}
    };

    const breeds = Object.keys(breedsInfo);
    const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];
    const breedData = breedsInfo[randomBreed];

    resultDiv.innerHTML = `
        <h2>Raza Detectada: ${randomBreed}</h2>
        <p><strong>Temperamento:</strong> ${breedData.Temperamento}</p>
        <p><strong>Esperanza de Vida:</strong> ${breedData["Esperanza de Vida"]}</p>
    `;
});
