const galleryElement = document.querySelector("#gallery");
const galleryStatus = document.querySelector("#gallery-status");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox.querySelector("img");
const closeButton = lightbox.querySelector(".lightbox__close");
const previousButton = lightbox.querySelector(".lightbox__nav--previous");
const nextButton = lightbox.querySelector(".lightbox__nav--next");
let photos = [];
let activeIndex = 0;
let lastTrigger = null;

function updateLightbox(index) {
  activeIndex = (index + photos.length) % photos.length;
  const photo = photos[activeIndex];

  lightboxImage.src = photo.large;
  lightboxImage.alt = photo.alt;
}

function openLightbox(index, trigger) {
  lastTrigger = trigger;
  updateLightbox(index);
  lightbox.showModal();
}

function closeLightbox() {
  lightbox.close();
}

function buildGallery() {
  const fragment = document.createDocumentFragment();

  photos.forEach((photo, index) => {
    const figure = document.createElement("figure");
    figure.className = "gallery-item";

    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", `View ${photo.title} fullscreen`);

    const image = document.createElement("img");
    image.src = photo.src;
    image.srcset = `${photo.src} 960w, ${photo.large} 1920w`;
    image.sizes = "(max-width: 880px) 50vw, 33vw";
    image.width = photo.width;
    image.height = photo.height;
    image.alt = photo.alt;
    image.loading = index < 4 ? "eager" : "lazy";
    image.decoding = "async";
    image.addEventListener("load", () => image.classList.add("is-loaded"));

    if (image.complete) {
      image.classList.add("is-loaded");
    }

    button.append(image);
    button.addEventListener("click", () => openLightbox(index, button));
    figure.append(button);
    fragment.append(figure);
  });

  galleryElement.replaceChildren(fragment);
  galleryStatus.textContent = `${photos.length} photographs loaded`;
}

async function loadGallery() {
  try {
    const response = await fetch("gallery.json");
    if (!response.ok) {
      throw new Error(`Gallery request failed with ${response.status}`);
    }

    photos = await response.json();
    buildGallery();
  } catch (error) {
    console.error(error);
    galleryStatus.textContent = "The photographs could not be loaded";
  }
}

closeButton.addEventListener("click", closeLightbox);
previousButton.addEventListener("click", () => updateLightbox(activeIndex - 1));
nextButton.addEventListener("click", () => updateLightbox(activeIndex + 1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox || event.target.classList.contains("lightbox__stage")) {
    closeLightbox();
  }
});

lightbox.addEventListener("close", () => {
  lightboxImage.removeAttribute("src");
  lastTrigger?.focus();
});

lightbox.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    updateLightbox(activeIndex - 1);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    updateLightbox(activeIndex + 1);
  }
});

loadGallery();
