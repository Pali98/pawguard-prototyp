let currentTutorialStep = 1;
let currentScreenId = "screen-overview";
let isTransitioning = false;
let currentOnboardingStep = 1;
const totalOnboardingSteps = 4;

function updateOnboardingUI() {
    const steps = document.querySelectorAll(".onboarding-step");
    steps.forEach((step) => step.classList.remove("active"));

    const activeStep = document.getElementById(`step${currentOnboardingStep}`);
    if (activeStep) {
        activeStep.classList.add("active");
    }

    const backBtn = document.getElementById("backBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (backBtn) {
        backBtn.disabled = currentOnboardingStep === 1;
    }

    if (nextBtn) {
        nextBtn.textContent =
            currentOnboardingStep === totalOnboardingSteps ? "Los geht's" : "Weiter";
    }
}

function handleNext() {
    if (currentOnboardingStep < totalOnboardingSteps) {
        currentOnboardingStep += 1;
        updateOnboardingUI();
    } else {
        closeOnboarding();
    }
}

function handlePrev() {
    if (currentOnboardingStep > 1) {
        currentOnboardingStep -= 1;
        updateOnboardingUI();
    }
}

function closeOnboarding() {
    const onboarding = document.getElementById("onboarding");
    if (onboarding) {
        onboarding.classList.remove("active");
    }
}

const headerContent = {
    "screen-overview": {
        eyebrow: "Hallo du!",
        title: "Das war Minkas Tag 🐱",
        subtitle: "Aufenthaltsorte, Ruhephasen und auffällige Momente auf einen Blick."
    },
    "screen-activity": {
        eyebrow: "Analyse",
        title: "Einblicke in Minkas Verhalten",
        subtitle: "Lerne mehr über die Aktivität und behalte die Bewegungstrends im Blick."
    },
    "screen-settings": {
        eyebrow: "Halsband",
        title: "Alle Infos zum Halsband",
        subtitle: "Alles zu Verbindung, Akku und Einstellungen."
    },
    "screen-profile": {
        eyebrow: "Katzenprofil",
        title: "Alles zu Minka",
        subtitle: "Stammdaten, Gesundheit und wichtige Hinweise."
    }
};

function updateHeader(screenId) {
    const eyebrow = document.getElementById("header-eyebrow");
    const title = document.getElementById("header-title");
    const subtitle = document.getElementById("header-subtitle");

    const content = headerContent[screenId] || headerContent["screen-overview"];

    if (eyebrow) eyebrow.textContent = content.eyebrow;
    if (title) title.textContent = content.title;
    if (subtitle) subtitle.textContent = content.subtitle;
}

function openTutorial() {
    const overlay = document.getElementById("tutorial-overlay");
    if (overlay) {
        overlay.classList.add("active");
    }
    currentTutorialStep = 1;
    updateTutorialUI();
}

function closeTutorial() {
    const overlay = document.getElementById("tutorial-overlay");
    if (overlay) {
        overlay.classList.remove("active");
    }
}

function nextTutorial(step) {
    currentTutorialStep = step;
    updateTutorialUI();
}

function updateTutorialUI() {
    const steps = document.querySelectorAll(".tutorial-step");
    steps.forEach((step) => step.classList.remove("active"));

    const activeStep = document.getElementById(`t-step${currentTutorialStep}`);
    if (activeStep) {
        activeStep.classList.add("active");
    }
}

function getScreenIndex(screenId) {
    const screen = document.getElementById(screenId);
    if (!screen) return null;

    const index = screen.dataset.index;
    return index !== undefined ? Number(index) : null;
}

function clearScreenAnimationClasses(screen) {
    screen.classList.remove(
        "animating",
        "slide-in-right",
        "slide-out-left",
        "slide-in-left",
        "slide-out-right"
    );
}

function updateNav(navElement = null) {
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item) => item.classList.remove("active"));

    if (navElement) {
        navElement.classList.add("active");
    }
}

function showScreen(screenId, navElement = null) {
    if (isTransitioning || screenId === currentScreenId) return;

    const currentScreen = document.getElementById(currentScreenId);
    const targetScreen = document.getElementById(screenId);

    if (!currentScreen || !targetScreen) return;

    const currentIndex = getScreenIndex(currentScreenId);
    const targetIndex = getScreenIndex(screenId);

    const canAnimateByNavOrder =
        currentIndex !== null && targetIndex !== null && currentIndex !== targetIndex;

    updateNav(navElement);
    isTransitioning = true;

    clearScreenAnimationClasses(currentScreen);
    clearScreenAnimationClasses(targetScreen);

    if (canAnimateByNavOrder) {
        const movingRight = targetIndex > currentIndex;

        currentScreen.classList.add("animating");
        targetScreen.classList.add("animating");

        if (movingRight) {
            currentScreen.classList.add("slide-out-left");
            targetScreen.classList.add("slide-in-right");
        } else {
            currentScreen.classList.add("slide-out-right");
            targetScreen.classList.add("slide-in-left");
        }

        targetScreen.classList.add("active");

        const finishTransition = () => {
            currentScreen.classList.remove("active");
            clearScreenAnimationClasses(currentScreen);
            clearScreenAnimationClasses(targetScreen);

            targetScreen.classList.add("active");
            currentScreenId = screenId;
            isTransitioning = false;
            updateHeader(screenId)

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        };

        targetScreen.addEventListener("animationend", finishTransition, { once: true });
    } else {
        document.querySelectorAll(".screen").forEach((screen) => {
            screen.classList.remove("active");
            clearScreenAnimationClasses(screen);
        });

        targetScreen.classList.add("active");
        currentScreenId = screenId;
        isTransitioning = false;
        updateHeader(screenId)

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}

function openProfile() {
    const screens = document.querySelectorAll(".screen");
    screens.forEach((screen) => {
        screen.classList.remove("active");
        clearScreenAnimationClasses(screen);
    });

    const profileScreen = document.getElementById("screen-profile");
    if (profileScreen) {
        profileScreen.classList.add("active");
    }

    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item) => item.classList.remove("active"));

    currentScreenId = "screen-profile";
    updateHeader("screen-profile");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

document.addEventListener("DOMContentLoaded", () => {
    updateTutorialUI();
    updateOnboardingUI();
    updateHeader(currentScreenId);

    const routeMap = document.querySelector(".route-map");
    if (routeMap) {
        routeMap.addEventListener("keypress", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                showScreen("screen-activity", document.getElementById("nav-analysis"));
            }
        });
    }
});
