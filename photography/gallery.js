const galleryElement = document.querySelector("#gallery");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox.querySelector("img");
const closeButton = lightbox.querySelector(".lightbox__close");
const previousButton = lightbox.querySelector(".lightbox__nav--previous");
const nextButton = lightbox.querySelector(".lightbox__nav--next");
const yearElement = document.querySelector("#year");
let photos = [];
let activeIndex = 0;
let lastTrigger = null;

yearElement.textContent = new Date().getFullYear();

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
    button.setAttribute("aria-label", "View photograph fullscreen");

    const image = document.createElement("img");
    image.src = photo.src;
    image.srcset = `${photo.src} 960w, ${photo.large} 1920w`;
    image.sizes = "(max-width: 600px) 100vw, (max-width: 940px) 50vw, 33vw";
    image.width = photo.width;
    image.height = photo.height;
    image.alt = photo.alt;
    image.loading = "lazy";
    image.decoding = "async";

    button.append(image);
    button.addEventListener("click", () => openLightbox(index, button));
    figure.append(button);
    fragment.append(figure);
  });

  galleryElement.replaceChildren(fragment);

  const items = galleryElement.querySelectorAll(".gallery-item");
  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "80px 0px", threshold: 0.08 },
  );

  items.forEach((item) => observer.observe(item));
}

async function loadGallery() {
  try {
    const response = await fetch("gallery.json?v=20260727-1");
    if (!response.ok) {
      throw new Error(`Gallery request failed with ${response.status}`);
    }

    photos = await response.json();
    buildGallery();
  } catch (error) {
    console.error(error);
    galleryElement.innerHTML =
      '<p class="gallery__loading">The photographs could not be loaded. Please try refreshing the page.</p>';
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
