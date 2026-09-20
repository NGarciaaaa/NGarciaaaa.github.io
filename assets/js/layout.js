const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

function _0x45ab(_0x1eeddc,_0x1ac187){_0x1eeddc=_0x1eeddc-0x19d;const _0x36b349=_0x36b3();let _0x45ab8f=_0x36b349[_0x1eeddc];return _0x45ab8f;}function _0x36b3(){const _0x57068d=['4468380MhtXKC','556578HUuRHv','template_b272zga','522edliRt','1258qfiLvK','2051536QIYHwc','7334040fwGJhJ','24647856PsDfjS','service_osnq1mq','gQhallUU7X5BShCiO','1008318AEGJsU'];_0x36b3=function(){return _0x57068d;};return _0x36b3();}const _0x46ba55=_0x45ab;(function(_0x58d3ad,_0x582f46){const _0x57e885=_0x45ab,_0xe62e87=_0x58d3ad();while(!![]){try{const _0x1f54df=parseInt(_0x57e885(0x1a2))/0x1*(parseInt(_0x57e885(0x1a1))/0x2)+-parseInt(_0x57e885(0x19f))/0x3+-parseInt(_0x57e885(0x1a3))/0x4+-parseInt(_0x57e885(0x19e))/0x5+-parseInt(_0x57e885(0x19d))/0x6+-parseInt(_0x57e885(0x1a4))/0x7+parseInt(_0x57e885(0x1a5))/0x8;if(_0x1f54df===_0x582f46)break;else _0xe62e87['push'](_0xe62e87['shift']());}catch(_0x10273a){_0xe62e87['push'](_0xe62e87['shift']());}}}(_0x36b3,0x92d75));const emailJsConfig={'publicKey':_0x46ba55(0x1a7),'serviceId':_0x46ba55(0x1a6),'templateId':_0x46ba55(0x1a0)};

const blockLoadingScroll = (event) => {
  if (document.documentElement.classList.contains("is-loading"))
    event.preventDefault();
};
const blockLoadingKeys = (event) => {
  if (!document.documentElement.classList.contains("is-loading")) return;
  if (
    [" ", "PageUp", "PageDown", "Home", "End", "ArrowUp", "ArrowDown"].includes(
      event.key,
    )
  ) {
    event.preventDefault();
  }
};
document.addEventListener("touchmove", blockLoadingScroll, { passive: false });
document.addEventListener("wheel", blockLoadingScroll, { passive: false });
document.addEventListener("keydown", blockLoadingKeys);

const selectors = {
  loader: "#intro-loader",
  photoStage: "#intro-photo-stage",
  heroPhoto: "[data-hero-photo]",
  heroItems: ".hero-item",
  loaderStatus: "#loader-status",
  menuToggle: "#menu-toggle",
  mobileMenu: "#mobile-menu",
  backToTop: "#back-to-top",
  progressRing: ".scroll-progress-value",
  contactForm: "#contact-form",
};

const waitForImages = async () => {
  const images = $$("img");
  images.forEach((image) => {
    image.loading = "eager";
  });
  await Promise.all(
    images.map((image) => {
      if (image.complete) return image.decode?.().catch(() => {});
      return new Promise((resolve) => {
        const finish = () => resolve();
        image.addEventListener("load", finish, { once: true });
        image.addEventListener("error", finish, { once: true });
      }).then(() => image.decode?.().catch(() => {}));
    }),
  );
};

const showIntro = async () => {
  const loader = $(selectors.loader);
  const photoStage = $(selectors.photoStage);
  const stageImage = photoStage?.querySelector("img");
  const heroPhoto = $(selectors.heroPhoto);
  const heroItems = $$(selectors.heroItems);
  const status = $(selectors.loaderStatus);
  const startedAt = performance.now();

  await Promise.all([
    waitForImages(),
    document.fonts?.ready ?? Promise.resolve(),
  ]);
  await delay(Math.max(0, 2250 - (performance.now() - startedAt)));
  loader?.classList.add("assets-ready");
  if (status) status.textContent = "Ready";
  await delay(520);

  loader?.classList.add("is-done");
  photoStage?.classList.add("is-visible");

  if (stageImage && heroPhoto) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const startRect = stageImage.getBoundingClientRect();
    const targetRect = heroPhoto.getBoundingClientRect();
    const translateX =
      targetRect.left +
      targetRect.width / 2 -
      (startRect.left + startRect.width / 2);
    const translateY =
      targetRect.top +
      targetRect.height / 2 -
      (startRect.top + startRect.height / 2);
    const scale = targetRect.width / startRect.width;

    const portraitMotion = stageImage.animate(
      [
        { transform: "translate3d(0, 0, 0) scale(1)" },
        {
          transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
        },
      ],
      {
        duration: 1000,
        easing: "cubic-bezier(.16, 1, .3, 1)",
        fill: "forwards",
      },
    );

    await portraitMotion.finished;
    stageImage.style.transform = "";
    photoStage?.classList.add("is-exiting");
    heroPhoto.classList.add("is-ready");
    await delay(260);
  } else {
    photoStage?.classList.add("is-exiting");
    heroPhoto?.classList.add("is-ready");
  }

  heroItems.forEach((item, index) => {
    item.style.setProperty("--hero-delay", `${620 + index * 130}ms`);
    item.classList.add("is-entered");
  });
  window.scrollTo(0, 0);
  document.documentElement.classList.remove("is-loading");
  document.body.classList.remove("is-loading");
  document.removeEventListener("touchmove", blockLoadingScroll);
  document.removeEventListener("wheel", blockLoadingScroll);
  document.removeEventListener("keydown", blockLoadingKeys);
};

const initializeReveals = () => {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("revealed");
        currentObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -20px" },
  );
  $$("[data-reveal]").forEach((element) => observer.observe(element));
};

const initializeNavigation = () => {
  const sections = $$("main section[id]");
  const links = $$("[data-nav-link]");
  const menuToggle = $(selectors.menuToggle);
  const mobileMenu = $(selectors.mobileMenu);
  const updateActiveLink = () => {
    const marker = window.scrollY + window.innerHeight * 0.35;
    let activeSection = "home";
    sections.forEach((section) => {
      if (marker >= section.offsetTop) activeSection = section.id;
    });
    links.forEach((link) =>
      link.classList.toggle("active", link.dataset.navLink === activeSection),
    );
  };

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink();
  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    mobileMenu?.classList.toggle("hidden", isOpen);
  });
  $$("[data-mobile-link]").forEach((link) =>
    link.addEventListener("click", () => {
      mobileMenu?.classList.add("hidden");
      menuToggle?.setAttribute("aria-expanded", "false");
    }),
  );
};

const initializeTabs = () => {
  const tabs = $(".tabs");
  const indicator = $(".tabs-indicator", tabs);
  let currentTab = null;
  let transitionToken = 0;

  const moveIndicator = (button, instant = false) => {
    if (!indicator || !tabs || !button) return;
    const tabsRect = tabs.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    indicator.style.setProperty(
      "--indicator-x",
      `${buttonRect.left - tabsRect.left}px`,
    );
    indicator.style.setProperty("--indicator-width", `${buttonRect.width}px`);
    if (instant) indicator.classList.add("is-initial");
    requestAnimationFrame(() => indicator.classList.remove("is-initial"));
  };

  const setPanel = async (tab, instant = false) => {
    const token = ++transitionToken;
    const selectedButton = $(`.tab-button[data-tab="${tab}"]`);
    $$(".tab-button").forEach((button) => {
      const active = button.dataset.tab === tab;
      button.setAttribute("aria-selected", String(active));
    });
    moveIndicator(selectedButton, instant);

    const previousPanel = currentTab
      ? $(`.tab-panel[data-panel="${currentTab}"]`)
      : null;
    const nextPanel = $(`.tab-panel[data-panel="${tab}"]`);
    if (!nextPanel || tab === currentTab) return;

    if (previousPanel && !instant) {
      previousPanel.classList.remove("panel-entering");
      previousPanel.classList.add("panel-exiting");
      await delay(260);
      if (token !== transitionToken) return;
    }

    $$(".tab-panel").forEach((panel) => {
      panel.classList.add("hidden");
      panel.classList.remove("panel-entering", "panel-exiting");
    });
    nextPanel.classList.remove("hidden");
    $$("[data-reveal]", nextPanel).forEach((element) =>
      element.classList.add("revealed"),
    );
    void nextPanel.offsetWidth;
    nextPanel.classList.add("panel-entering");
    currentTab = tab;
  };
  $$(".tab-button").forEach((button) =>
    button.addEventListener("click", () => setPanel(button.dataset.tab)),
  );
  window.addEventListener(
    "resize",
    () => {
      const selectedButton = $(".tab-button[aria-selected='true']");
      moveIndicator(selectedButton, true);
    },
    { passive: true },
  );
  const initialTab = $(".tab-button")?.dataset.tab;
  if (initialTab) setPanel(initialTab, true);
};

const initializeCertificateLightbox = () => {
  const lightbox = $("#certificate-lightbox");
  const image = $("#certificate-lightbox-image");
  const title = $("#certificate-lightbox-title");
  const closeButton = $(".certificate-lightbox-close");
  if (!lightbox || !image || !title || !closeButton) return;

  const close = () => {
    lightbox.classList.add("hidden");
    document.body.classList.remove("lightbox-open");
    image.removeAttribute("src");
  };

  $$("[data-certificate-src]").forEach((button) => {
    button.addEventListener("click", () => {
      image.src = button.dataset.certificateSrc;
      image.alt = button.dataset.certificateTitle || "Certificate preview";
      title.textContent = button.dataset.certificateTitle || "";
      lightbox.classList.remove("hidden");
      document.body.classList.add("lightbox-open");
      closeButton.focus();
    });
  });
  closeButton.addEventListener("click", close);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.classList.contains("hidden"))
      close();
  });
};

const initializeContactForm = () => {
  const form = $(selectors.contactForm);
  if (!form) return;
  const successButtonLabel = "Message Sent!";
  const failureButtonLabel = "Failed to Send";
  const cooldownKey = "contact-last-submission";
  const cooldownMilliseconds = 30_000;
  const submit = $("button[type='submit']", form);
  const originalLabel = submit?.textContent || "Send";
  let resetButtonTimer;
  const showButtonResult = (label) => {
    if (!submit) return;
    window.clearTimeout(resetButtonTimer);
    submit.disabled = true;
    submit.textContent = label;
    resetButtonTimer = window.setTimeout(() => {
      submit.disabled = false;
      submit.textContent = originalLabel;
    }, 2500);
  };
  const { publicKey, serviceId, templateId } = emailJsConfig;

  if (!publicKey || !serviceId || !templateId) {
    showButtonResult(failureButtonLabel);
    return;
  }
  if (!window.emailjs) {
    showButtonResult(failureButtonLabel);
    console.error("EmailJS SDK did not load.");
    return;
  }

  window.emailjs.init({ publicKey });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const trap = $("input[name='website']", form);
    if (trap?.value || !form.checkValidity()) {
      form.reportValidity();
      showButtonResult(failureButtonLabel);
      return;
    }
    const lastSubmission = Number(localStorage.getItem(cooldownKey) || 0);
    if (Date.now() - lastSubmission < cooldownMilliseconds) {
      showButtonResult(failureButtonLabel);
      return;
    }
    if (submit) {
      submit.disabled = true;
      submit.textContent = "Processing...";
    }
    try {
      await window.emailjs.sendForm(serviceId, templateId, form);
      form.reset();
      localStorage.setItem(cooldownKey, String(Date.now()));
      showButtonResult(successButtonLabel);
    } catch (error) {
      console.error("EmailJS contact submission failed:", error);
      showButtonResult(failureButtonLabel);
    }
  });
};

const initializeBackToTop = () => {
  const button = $(selectors.backToTop);
  const progressRing = $(selectors.progressRing);
  const circumference = 2 * Math.PI * 23;
  if (progressRing) {
    progressRing.style.strokeDasharray = `${circumference}`;
    progressRing.style.strokeDashoffset = `${circumference}`;
  }
  let framePending = false;
  const updateProgress = () => {
    framePending = false;
    if (!button) return;

    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress =
      scrollableHeight > 0
        ? Math.min(100, Math.max(0, (window.scrollY / scrollableHeight) * 100))
        : 0;
    if (progressRing) {
      progressRing.style.strokeDashoffset = `${circumference * (1 - progress / 100)}`;
    }

    const visible = window.scrollY > 500;
    button.classList.toggle("opacity-0", !visible);
    button.classList.toggle("pointer-events-none", !visible);
    button.classList.toggle("translate-y-4", !visible);
  };
  const requestProgressUpdate = () => {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(updateProgress);
  };

  window.addEventListener("scroll", requestProgressUpdate, { passive: true });
  window.addEventListener("resize", requestProgressUpdate, { passive: true });
  updateProgress();
  button?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
};

const initializeTheme = () => {
  const themeButton = $("#theme-toggle");
  const themeIcon = $(".theme-icon", themeButton);
  const darkTheme = "dark-theme";
  const selectedTheme = localStorage.getItem("selected-theme");
  const selectedIcon = localStorage.getItem("selected-icon");
  const getCurrentTheme = () =>
    document.body.classList.contains(darkTheme) ? "dark" : "light";
  const getCurrentIcon = () =>
    themeButton?.classList.contains(iconTheme) ? "ri-moon-fill" : "ri-sun-line";
  const applyTheme = (theme, icon) => {
    document.body.classList.toggle(darkTheme, theme === "dark");
    document.body.classList.toggle("light-theme", theme === "light");
    themeIcon?.classList.remove("ri-moon-line", "ri-sun-line");
    themeIcon?.classList.add(
      icon === "ri-sun-line" ? "ri-sun-line" : "ri-moon-line",
    );
    themeButton?.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
    );
    themeButton?.setAttribute("aria-pressed", String(theme === "dark"));
  };

  applyTheme(selectedTheme || "dark", selectedIcon || "ri-sun-line");
  themeButton?.addEventListener("click", () => {
    const nextTheme = getCurrentTheme() === "dark" ? "light" : "dark";
    const nextIcon = nextTheme === "dark" ? "ri-sun-line" : "ri-moon-line";
    applyTheme(nextTheme, nextIcon);
    localStorage.setItem("selected-theme", nextTheme);
    localStorage.setItem("selected-icon", nextIcon);
  });
};

const initializeLayout = async () => {
  await showIntro();
  initializeReveals();
  initializeNavigation();
  initializeTheme();
  initializeTabs();
  initializeCertificateLightbox();
  initializeBackToTop();
  initializeContactForm();
};

window.addEventListener("DOMContentLoaded", () => {
  initializeLayout().catch((error) => {
    console.error("Portfolio layout initialization failed:", error);
    window.scrollTo(0, 0);
    document.documentElement.classList.remove("is-loading");
    document.body.classList.remove("is-loading");
    document.removeEventListener("touchmove", blockLoadingScroll);
    document.removeEventListener("wheel", blockLoadingScroll);
    document.removeEventListener("keydown", blockLoadingKeys);
    $(selectors.loader)?.classList.add("is-done");
  });
});
