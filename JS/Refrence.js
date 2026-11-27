
/* =====================================
   MATTERVERSE - INFINITE SCROLL ENGINE
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const marquees = document.querySelectorAll(".marquee");

    marquees.forEach((marquee) => {

        const track = marquee.querySelector(".marquee-track");
        const originalGroup = track.querySelector(".marquee-group");

        if (!track || !originalGroup) return;

        // Save original cards
        const originalCards = Array.from(originalGroup.children);

        // Repeat cards until the group fills the screen
        function fillGroup() {

            const requiredWidth = marquee.clientWidth + 100;

            let safety = 0;

            while (
                originalGroup.scrollWidth < requiredWidth &&
                safety < 30
            ) {

                originalCards.forEach((card) => {

                    const clone = card.cloneNode(true);

                    // Hide repeated cards from accessibility tools
                    clone.setAttribute("aria-hidden", "true");
                    clone.inert = true;

                    originalGroup.appendChild(clone);

                });

                safety++;

            }

        }

        fillGroup();

        // Duplicate the complete group
        const secondGroup = originalGroup.cloneNode(true);

        secondGroup.setAttribute("aria-hidden", "true");
        secondGroup.inert = true;

        track.appendChild(secondGroup);

        // Set individual scrolling speed
        const speed = track.dataset.speed || 35;

        track.style.animationDuration = `${speed}s`;

    });

    // Pause animation when the browser tab is hidden
    document.addEventListener("visibilitychange", () => {

        document.querySelectorAll(".marquee-track").forEach(track => {

            track.style.animationPlayState =
                document.hidden ? "paused" : "";

        });

    });

    // Respect reduced motion settings
    const motionPreference = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    function updateMotion() {

        document.querySelectorAll(".marquee-track").forEach(track => {

            track.style.animationPlayState =
                motionPreference.matches ? "paused" : "";

        });

    }

    updateMotion();

    motionPreference.addEventListener("change", updateMotion);

});