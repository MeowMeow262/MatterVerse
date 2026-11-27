const hangingID = document.getElementById("hangingID");

let isDragging = false;
let startX = 0;
let startY = 0;

let rotateX = 0;
let rotateY = 0;

let velocityX = 0;
let velocityY = 0;

let lastX = 0;
let lastY = 0;

const clamp = (value, min, max) =>
    Math.max(min, Math.min(max, value));

function updateCard() {
    const flipAngle = flipped ? 180 : 0;

    idCard.style.transform = `
        rotateX(${rotateX}deg)
        rotateY(${rotateY + flipAngle}deg)
    `;
}

// DRAG CARD

idCard.addEventListener("pointerdown", (e) => {
    isDragging = true;

    idCard.setPointerCapture(e.pointerId);

    startX = e.clientX;
    startY = e.clientY;

    lastX = e.clientX;
    lastY = e.clientY;

    velocityX = 0;
    velocityY = 0;

    idCard.style.transition = "none";
});

// MOVE CARD

idCard.addEventListener("pointermove", (e) => {
    if (!isDragging) return;

    const moveX = e.clientX - startX;
    const moveY = e.clientY - startY;

    velocityY = (e.clientX - lastX) * .8;
    velocityX = (e.clientY - lastY) * -.8;

    lastX = e.clientX;
    lastY = e.clientY;

    rotateY = clamp(moveX * .6, -35, 35);
    rotateX = clamp(moveY * -.5, -25, 25);

    updateCard();
});

// RELEASE CARD

function releaseCard() {
    if (!isDragging) return;

    isDragging = false;

    idCard.style.transition = "transform .1s ease-out";
}

idCard.addEventListener("pointerup", releaseCard);
idCard.addEventListener("pointercancel", releaseCard);
idCard.addEventListener("lostpointercapture", releaseCard);

// NATURAL SWING PHYSICS


const idCard = document.getElementById("idCard");

let flipped = false;

// AUTOMATIC 3D CARD FLIP
idCard.addEventListener("dblclick", () => {
    flipped = !flipped;

    idCard.style.animation = "none";

    idCard.style.transform = flipped
        ? "rotateY(180deg)"
        : "";

    setTimeout(() => {
        idCard.style.animation = "";
    }, 100);
});