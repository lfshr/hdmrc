// Mobile menu
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");

toggle?.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") !== "true";
  toggle.setAttribute("aria-expanded", open);
  nav.classList.toggle("is-open", open);
});

// Photo lightbox. Without JS the photo links simply open the full-size image.
const galleries = document.querySelectorAll("[data-gallery]");

if (galleries.length && window.HTMLDialogElement) {
  const box = document.createElement("dialog");
  box.className = "lightbox";
  box.innerHTML = `
    <figure><img alt=""><figcaption></figcaption></figure>
    <button class="lb-btn lb-close" type="button" aria-label="Close">&times;</button>
    <button class="lb-btn lb-prev" type="button" aria-label="Previous photo">&lsaquo;</button>
    <button class="lb-btn lb-next" type="button" aria-label="Next photo">&rsaquo;</button>`;
  document.body.append(box);

  const img = box.querySelector("img");
  const caption = box.querySelector("figcaption");
  let links = [];
  let index = 0;

  const show = (n) => {
    index = (n + links.length) % links.length;
    img.src = links[index].href;
    caption.textContent = `${links[index].querySelector("img").alt} (${index + 1} of ${links.length})`;
  };

  galleries.forEach((gallery) => {
    const group = [...gallery.querySelectorAll("a")];
    group.forEach((link, n) =>
      link.addEventListener("click", (event) => {
        event.preventDefault();
        links = group;
        box.classList.toggle("single", group.length < 2);
        show(n);
        box.showModal();
      })
    );
  });

  box.querySelector(".lb-close").addEventListener("click", () => box.close());
  box.querySelector(".lb-prev").addEventListener("click", () => show(index - 1));
  box.querySelector(".lb-next").addEventListener("click", () => show(index + 1));
  box.addEventListener("click", (event) => {
    if (event.target === box || event.target.tagName === "FIGURE") box.close();
  });
  box.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(index - 1);
    if (event.key === "ArrowRight") show(index + 1);
  });
}
