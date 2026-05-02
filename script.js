const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const filterButtons = document.querySelectorAll("[data-filter]");
const huntCards = document.querySelectorAll("[data-category]");
const canvas = document.querySelector("#ashCanvas");
const ctx = canvas.getContext("2d");

const ashes = [];
let width = 0;
let height = 0;
let animationFrame = 0;

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter || "all";

    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    huntCards.forEach((card) => {
      const categories = (card.dataset.category || "").split(/\s+/);
      card.classList.toggle("is-hidden", filter !== "all" && !categories.includes(filter));
    });
  });
});

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  seedAshes();
}

function seedAshes() {
  ashes.length = 0;
  const count = Math.min(48, Math.max(18, Math.floor(width / 30)));
  const colors = ["#e8d8b9", "#9f9a91", "#d1742f", "#8f2020", "#c7c2b6"];

  for (let index = 0; index < count; index += 1) {
    ashes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 3 + Math.random() * 8,
      speed: 0.1 + Math.random() * 0.32,
      drift: -0.24 + Math.random() * 0.48,
      angle: Math.random() * Math.PI,
      spin: -0.012 + Math.random() * 0.024,
      color: colors[index % colors.length],
      kind: index % 4,
    });
  }
}

function drawAsh(ash) {
  ctx.save();
  ctx.translate(ash.x, ash.y);
  ctx.rotate(ash.angle);
  ctx.globalAlpha = 0.38;
  ctx.fillStyle = ash.color;
  ctx.strokeStyle = "rgba(232, 216, 185, 0.25)";
  ctx.lineWidth = 1;

  if (ash.kind === 0) {
    ctx.beginPath();
    ctx.rect(-ash.size * 0.55, -ash.size * 0.55, ash.size * 1.1, ash.size * 1.1);
  } else if (ash.kind === 1) {
    ctx.beginPath();
    ctx.arc(0, 0, ash.size * 0.72, 0, Math.PI * 2);
  } else if (ash.kind === 2) {
    ctx.beginPath();
    ctx.moveTo(0, -ash.size);
    ctx.lineTo(ash.size * 0.86, ash.size * 0.68);
    ctx.lineTo(-ash.size * 0.86, ash.size * 0.68);
    ctx.closePath();
  } else {
    ctx.beginPath();
    ctx.moveTo(0, -ash.size);
    ctx.lineTo(ash.size * 0.28, -ash.size * 0.28);
    ctx.lineTo(ash.size, 0);
    ctx.lineTo(ash.size * 0.28, ash.size * 0.28);
    ctx.lineTo(0, ash.size);
    ctx.lineTo(-ash.size * 0.28, ash.size * 0.28);
    ctx.lineTo(-ash.size, 0);
    ctx.lineTo(-ash.size * 0.28, -ash.size * 0.28);
    ctx.closePath();
  }

  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  ashes.forEach((ash) => {
    ash.y -= ash.speed;
    ash.x += ash.drift;
    ash.angle += ash.spin;

    if (ash.y < -24) {
      ash.y = height + 24;
      ash.x = Math.random() * width;
    }

    drawAsh(ash);
  });

  animationFrame = window.requestAnimationFrame(animate);
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

if (!reducedMotion.matches) {
  animate();
}

reducedMotion.addEventListener("change", () => {
  window.cancelAnimationFrame(animationFrame);
  if (!reducedMotion.matches) {
    animate();
  } else {
    ctx.clearRect(0, 0, width, height);
  }
});
