const captures = document.querySelectorAll(".glow-capture");

captures.forEach((capture) => {
  const clonedChild = capture.children[0].cloneNode(true);
  const overlay = capture.querySelector(".glow-overlay");

  overlay.appendChild(clonedChild);

  capture.addEventListener("mousemove", (event) => {
    const x = event.pageX - capture.offsetLeft;
    const y = event.pageY - capture.offsetTop;

    overlay.style.setProperty("--glow-x", `${x}px`);
    overlay.style.setProperty("--glow-y", `${y}px`);
    overlay.style.setProperty("--glow-opacity", "1");
  });

  capture.addEventListener("mouseleave", () => {
    overlay.style.setProperty("--glow-opacity", "0");
  });
});
