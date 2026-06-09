const heroImage = document.getElementById("heroImage");
const heroBackground = document.querySelector(".hero-bg");
const sceneButtons = document.querySelectorAll(".scene-thumb");
const previewButton = document.querySelector(".play-button");
const previewModal = document.getElementById("previewModal");
const modalClose = document.querySelector(".modal-close");
const subscribeForms = document.querySelectorAll(".js-subscribe-form");
const communityCountElements = document.querySelectorAll("[data-community-count]");

sceneButtons.forEach(button => {
  button.addEventListener("click", () => {
    const image = button.dataset.image;
    if (!image || image === heroImage.getAttribute("src")) {
      return;
    }

    sceneButtons.forEach(item => item.classList.remove("is-active"));
    button.classList.add("is-active");
    heroBackground.classList.add("is-switching");

    window.setTimeout(() => {
      heroImage.setAttribute("src", image);
      heroBackground.classList.remove("is-switching");
    }, 140);
  });
});

previewButton?.addEventListener("click", () => {
  previewModal.hidden = false;
  modalClose.focus();
});

modalClose?.addEventListener("click", closePreview);
previewModal?.addEventListener("click", event => {
  if (event.target === previewModal) {
    closePreview();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !previewModal.hidden) {
    closePreview();
  }
});

subscribeForms.forEach(form => {
  const emailInput = form.querySelector("input[type='email']");
  const formStatus = findStatusElement(form);
  const submitButton = form.querySelector("button[type='submit']");
  const idleHtml = submitButton?.innerHTML || "Get Updates";

  form.addEventListener("submit", async event => {
    event.preventDefault();
    const email = emailInput.value.trim();

    if (!emailInput.checkValidity()) {
      setStatus(formStatus, "Please enter a valid email address.", "error");
      emailInput.focus();
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Joining...";
    setStatus(formStatus, "Adding you to the Bay Forge list.", "neutral");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          metadata: {
            source: form.dataset.source || "bayforge-site",
            page: window.location.pathname,
            referrer: document.referrer || null
          }
        })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        form.reset();
        updateCommunityCount(data.total, 1);
        setStatus(formStatus, "Thank you for signing up. We'll send the next Bay Forge drop soon.", "success");
        return;
      }

      if (response.status === 409) {
        setStatus(formStatus, "You're already signed up. We'll keep you posted.", "success");
        return;
      }

      setStatus(formStatus, data.error || "Signup failed. Please try again.", "error");
    } catch {
      setStatus(formStatus, "Network issue. Please try again in a moment.", "error");
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = idleHtml;
    }
  });
});

loadCommunityCount();

function closePreview() {
  previewModal.hidden = true;
  previewButton?.focus();
}

function setStatus(statusElement, message, tone) {
  if (!statusElement) {
    return;
  }

  statusElement.textContent = message;
  statusElement.classList.toggle("is-error", tone === "error");
}

function findStatusElement(form) {
  return form.querySelector(".form-status") || form.parentElement?.querySelector(".form-status");
}

async function loadCommunityCount() {
  try {
    const response = await fetch("/api/community-stats", {
      headers: {
        Accept: "application/json"
      }
    });
    const data = await response.json().catch(() => ({}));

    if (typeof data.total === "number") {
      updateCommunityCount(data.total, 0);
    }
  } catch {
    // Keep the design fallback when stats are unavailable.
  }
}

function updateCommunityCount(total, increment) {
  const current = getCurrentCommunityCount();
  const next = typeof total === "number" ? total : current + increment;

  if (!Number.isFinite(next) || next < 0) {
    return;
  }

  communityCountElements.forEach(element => {
    element.textContent = formatCount(next);
  });
}

function getCurrentCommunityCount() {
  const firstCounter = communityCountElements[0];
  if (!firstCounter) {
    return 0;
  }

  const parsed = Number(firstCounter.textContent.replace(/[,+]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCount(value) {
  return Math.round(value).toLocaleString("en-US");
}
