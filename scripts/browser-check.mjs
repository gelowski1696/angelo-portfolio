import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9333;
const outputDirectory = path.resolve(".browser-check");
const profileDirectory = path.join(outputDirectory, "profile");
const siteUrl = process.env.BROWSER_CHECK_URL ?? "http://localhost:3000";

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    "--no-first-run",
    "--no-default-browser-check",
    "--enable-webgl",
    "--ignore-gpu-blocklist",
    "--use-angle=swiftshader",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profileDirectory}`,
    "about:blank",
  ],
  { stdio: "ignore" },
);

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function readJson(url, attempts = 40) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch {
      // Chrome is still starting.
    }
    await delay(125);
  }
  throw new Error(`Chrome DevTools endpoint did not become ready: ${url}`);
}

function connect(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  let requestId = 0;
  const pending = new Map();
  const listeners = new Map();

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const request = pending.get(message.id);
      if (!request) return;
      pending.delete(message.id);
      if (message.error) request.reject(new Error(message.error.message));
      else request.resolve(message.result);
      return;
    }

    const eventListeners = listeners.get(message.method) ?? [];
    for (const listener of eventListeners) listener(message.params);
  });

  const ready = new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  return {
    ready,
    close: () => socket.close(),
    on(method, listener) {
      const eventListeners = listeners.get(method) ?? [];
      eventListeners.push(listener);
      listeners.set(method, eventListeners);
    },
    send(method, params = {}) {
      requestId += 1;
      const id = requestId;
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        socket.send(JSON.stringify({ id, method, params }));
      });
    },
  };
}

async function inspectViewport(cdp, name, width, height, reducedMotion = false) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 700,
  });
  await cdp.send("Emulation.setEmulatedMedia", {
    media: "screen",
    features: [
      {
        name: "prefers-reduced-motion",
        value: reducedMotion ? "reduce" : "no-preference",
      },
    ],
  });
  const checkUrl = `${siteUrl}?browser-check=${name}-${Date.now()}`;
  await cdp.send("Page.navigate", { url: checkUrl });
  await delay(750);
  await cdp.send("Runtime.evaluate", { expression: "sessionStorage.clear()" });
  await cdp.send("Page.reload", { ignoreCache: true });
  let earlyIntro = null;
  for (let attempt = 0; attempt < 30 && !earlyIntro; attempt += 1) {
    const earlyIntroState = await cdp.send("Runtime.evaluate", {
      expression: `JSON.stringify((() => {
        const dialog = document.querySelector('.intro-experience');
        if (!dialog) return null;
        return {
          hasCanvas: Boolean(dialog.querySelector('canvas')),
          animationNames: [
            '.intro-experience',
            '.intro-grid',
            '.intro-terminal',
            '.intro-copy',
          ].map((selector) => getComputedStyle(dialog.querySelector(selector) ?? dialog).animationName),
        };
      })())`,
      returnByValue: true,
    });
    earlyIntro = JSON.parse(earlyIntroState.result.value);
    if (!earlyIntro) await delay(100);
  }

  if (earlyIntro) {
    const earlyIntroScreenshot = await cdp.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
    });
    await writeFile(
      path.join(outputDirectory, `${name}-intro-early.png`),
      Buffer.from(earlyIntroScreenshot.data, "base64"),
    );
  }
  await delay(1800);

  const introState = await cdp.send("Runtime.evaluate", {
    expression: `JSON.stringify((() => {
      const dialog = document.querySelector('.intro-experience');
      const button = dialog?.querySelector('.intro-actions button');
      const bounds = button?.getBoundingClientRect();
      return {
        visible: Boolean(dialog),
        hasCanvas: Boolean(dialog?.querySelector('canvas')),
        button: bounds ? { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 } : null
      };
    })())`,
    returnByValue: true,
  });
  const intro = JSON.parse(introState.result.value);

  if (intro.visible) {
    const introScreenshot = await cdp.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
    });
    await writeFile(
      path.join(outputDirectory, `${name}-intro.png`),
      Buffer.from(introScreenshot.data, "base64"),
    );

    await cdp.send("Input.dispatchMouseEvent", {
      type: "mousePressed",
      button: "left",
      clickCount: 1,
      ...intro.button,
    });
    await cdp.send("Input.dispatchMouseEvent", {
      type: "mouseReleased",
      button: "left",
      clickCount: 1,
      ...intro.button,
    });
    await delay(1100);
  }

  const evaluation = await cdp.send("Runtime.evaluate", {
    expression: `JSON.stringify({
      title: document.title,
      h1: document.querySelector('h1')?.innerText,
      sectionCount: document.querySelectorAll('main section').length,
      projectCount: document.querySelectorAll('.project-slide').length,
      navigationCount: document.querySelectorAll('nav').length,
      canvasCount: document.querySelectorAll('canvas').length,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      carouselScrollWidth: document.querySelector('.project-carousel-track')?.scrollWidth ?? 0,
      carouselClientWidth: document.querySelector('.project-carousel-track')?.clientWidth ?? 0,
      projectSlideWidth: document.querySelector('.project-slide')?.getBoundingClientRect().width ?? 0,
      projectImageCount: document.querySelectorAll('.project-art-image').length,
      motionBackgroundLayers: document.querySelectorAll('.project-motion-background > span').length,
      autoplayControlVisible: Boolean(document.querySelector('[aria-label="Pause project autoplay"]')),
      introCssAnimationNames: ${JSON.stringify(earlyIntro?.animationNames ?? ["none", "none", "none", "none"])},
      containedProjectImages: [...document.querySelectorAll('.project-art-image')]
        .every((image) => getComputedStyle(image).objectFit === 'contain'),
      projectCounter: document.querySelector('.project-carousel-counter')?.textContent?.trim(),
      nextProjectDisabled: document.querySelector('[aria-label="Next project"]')?.disabled ?? true,
      contactSetupVisible: Boolean(document.querySelector('.contact-setup')),
      introVisible: Boolean(document.querySelector('.intro-experience'))
    })`,
    returnByValue: true,
  });
  const page = JSON.parse(evaluation.result.value);

  const accessibility = await cdp.send("Accessibility.getFullAXTree");
  const interactiveWithoutName = accessibility.nodes.filter((node) => {
    const role = node.role?.value;
    return ["button", "link"].includes(role) && !node.name?.value;
  });

  const screenshot = await cdp.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
  });
  await writeFile(
    path.join(outputDirectory, `${name}.png`),
    Buffer.from(screenshot.data, "base64"),
  );

  if (name === "mobile") {
    await cdp.send("Runtime.evaluate", {
      expression: "document.querySelector('#projects')?.scrollIntoView({ block: 'start' })",
    });
    await delay(1000);
    const mobileCarouselScreenshot = await cdp.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
    });
    await writeFile(
      path.join(outputDirectory, "mobile-carousel.png"),
      Buffer.from(mobileCarouselScreenshot.data, "base64"),
    );
  }

  if (name === "desktop") {
    await cdp.send("Runtime.evaluate", {
      expression: "document.querySelector('#projects')?.scrollIntoView({ block: 'start' })",
    });
    await delay(1200);
    const projectsScreenshot = await cdp.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
    });
    await writeFile(
      path.join(outputDirectory, "desktop-carousel.png"),
      Buffer.from(projectsScreenshot.data, "base64"),
    );

    const nextButtonState = await cdp.send("Runtime.evaluate", {
      expression: `JSON.stringify((() => {
        const button = document.querySelector('[aria-label="Next project"]');
        const bounds = button?.getBoundingClientRect();
        return bounds ? { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 } : null;
      })())`,
      returnByValue: true,
    });
    const nextButton = JSON.parse(nextButtonState.result.value);
    if (nextButton) {
      await cdp.send("Input.dispatchMouseEvent", {
        type: "mousePressed",
        button: "left",
        clickCount: 1,
        ...nextButton,
      });
      await cdp.send("Input.dispatchMouseEvent", {
        type: "mouseReleased",
        button: "left",
        clickCount: 1,
        ...nextButton,
      });
      await delay(1200);
    }

    const carouselState = await cdp.send("Runtime.evaluate", {
      expression: `JSON.stringify({
        counter: document.querySelector('.project-carousel-counter')?.textContent?.trim(),
        scrollLeft: document.querySelector('.project-carousel-track')?.scrollLeft ?? 0
      })`,
      returnByValue: true,
    });
    page.carouselAfterNext = JSON.parse(carouselState.result.value);
    const nextButtonAfterClick = await cdp.send("Runtime.evaluate", {
      expression: `JSON.stringify({
        counter: document.querySelector('.project-carousel-counter')?.textContent?.trim(),
        disabled: document.querySelector('[aria-label="Next project"]')?.disabled ?? true
      })`,
      returnByValue: true,
    });
    page.nextButtonAfterClick = JSON.parse(nextButtonAfterClick.result.value);
    const projectsNextScreenshot = await cdp.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
    });
    await writeFile(
      path.join(outputDirectory, "desktop-carousel-next.png"),
      Buffer.from(projectsNextScreenshot.data, "base64"),
    );

    const dragState = await cdp.send("Runtime.evaluate", {
      expression: `JSON.stringify((() => {
        const track = document.querySelector('.project-carousel-track');
        const bounds = track?.getBoundingClientRect();
        if (!bounds) return null;
        const startX = Math.min(innerWidth - 90, bounds.right - 90);
        return {
          start: { x: startX, y: Math.min(innerHeight - 100, bounds.top + 220) },
          endX: Math.max(100, startX - 720)
        };
      })())`,
      returnByValue: true,
    });
    const drag = JSON.parse(dragState.result.value);
    if (drag) {
      await cdp.send("Input.dispatchMouseEvent", {
        type: "mousePressed",
        button: "left",
        buttons: 1,
        clickCount: 1,
        ...drag.start,
      });
      for (let step = 1; step <= 5; step += 1) {
        await cdp.send("Input.dispatchMouseEvent", {
          type: "mouseMoved",
          button: "left",
          buttons: 1,
          x: drag.start.x + ((drag.endX - drag.start.x) * step) / 5,
          y: drag.start.y,
        });
        await delay(60);
      }
      await cdp.send("Input.dispatchMouseEvent", {
        type: "mouseReleased",
        button: "left",
        buttons: 0,
        clickCount: 1,
        x: drag.endX,
        y: drag.start.y,
      });
      await delay(1000);
    }

    const swipeState = await cdp.send("Runtime.evaluate", {
      expression: `JSON.stringify({
        counter: document.querySelector('.project-carousel-counter')?.textContent?.trim(),
        scrollLeft: document.querySelector('.project-carousel-track')?.scrollLeft ?? 0
      })`,
      returnByValue: true,
    });
    page.carouselAfterSwipe = JSON.parse(swipeState.result.value);
    const projectsSwipeScreenshot = await cdp.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
    });
    await writeFile(
      path.join(outputDirectory, "desktop-carousel-swipe.png"),
      Buffer.from(projectsSwipeScreenshot.data, "base64"),
    );

    await cdp.send("Runtime.evaluate", {
      expression: "window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' })",
    });
    await delay(600);
    const endScreenshot = await cdp.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
    });
    await writeFile(
      path.join(outputDirectory, "desktop-end.png"),
      Buffer.from(endScreenshot.data, "base64"),
    );
    const layout = await cdp.send("Page.getLayoutMetrics");
    const fullScreenshot = await cdp.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: true,
      clip: {
        x: 0,
        y: 0,
        width: layout.cssContentSize.width,
        height: layout.cssContentSize.height,
        scale: 1,
      },
    });
    await writeFile(
      path.join(outputDirectory, "desktop-full.png"),
      Buffer.from(fullScreenshot.data, "base64"),
    );
  }

  return {
    name,
    viewport: `${width}x${height}`,
    reducedMotion,
    introWasVisible: Boolean(earlyIntro),
    introHasCanvas: Boolean(earlyIntro?.hasCanvas),
    ...page,
    unnamedInteractiveElements: interactiveWithoutName.length,
  };
}

let cdp;
try {
  const targets = await readJson(`http://127.0.0.1:${port}/json/list`);
  const pageTarget = targets.find((target) => target.type === "page");
  if (!pageTarget) throw new Error("Chrome did not create a page target");

  cdp = connect(pageTarget.webSocketDebuggerUrl);
  await cdp.ready;

  const consoleProblems = [];
  cdp.on("Runtime.consoleAPICalled", (event) => {
    if (["error", "warning"].includes(event.type)) {
      consoleProblems.push(`${event.type}: ${event.args.map((item) => item.value).join(" ")}`);
    }
  });
  cdp.on("Runtime.exceptionThrown", (event) => {
    consoleProblems.push(`exception: ${event.exceptionDetails.text}`);
  });

  await Promise.all([
    cdp.send("Page.enable"),
    cdp.send("Runtime.enable"),
    cdp.send("Accessibility.enable"),
    cdp.send("Performance.enable"),
  ]);

  const results = [
    await inspectViewport(cdp, "desktop", 1440, 1000),
    await inspectViewport(cdp, "mobile", 390, 844),
    await inspectViewport(cdp, "reduced-motion", 1440, 1000, true),
  ];

  const metrics = await cdp.send("Performance.getMetrics");
  const selectedMetrics = Object.fromEntries(
    metrics.metrics
      .filter((metric) =>
        ["JSHeapUsedSize", "Nodes", "LayoutCount", "RecalcStyleCount"].includes(
          metric.name,
        ),
      )
      .map((metric) => [metric.name, Math.round(metric.value)]),
  );

  const failures = [];
  for (const result of results) {
    if (!result.h1) failures.push(`${result.name}: missing h1`);
    if (result.sectionCount !== 6) {
      failures.push(`${result.name}: expected 6 sections, found ${result.sectionCount}`);
    }
    if (result.projectCount !== 8) {
      failures.push(`${result.name}: expected 8 projects, found ${result.projectCount}`);
    }
    if (result.carouselScrollWidth <= result.carouselClientWidth) {
      failures.push(`${result.name}: project carousel is not horizontally scrollable`);
    }
    if (result.projectImageCount !== result.projectCount) {
      failures.push(`${result.name}: expected an image for every project`);
    }
    if (result.motionBackgroundLayers !== 4) {
      failures.push(`${result.name}: project motion background is incomplete`);
    }
    if (!result.autoplayControlVisible) {
      failures.push(`${result.name}: project autoplay is not enabled by default`);
    }
    if (
      result.introWasVisible &&
      result.introCssAnimationNames.filter((name) => name !== "none").length < 3
    ) {
      failures.push(`${result.name}: intro CSS animation timeline is missing`);
    }
    if (!result.containedProjectImages) {
      failures.push(`${result.name}: project images are not using uncropped contain sizing`);
    }
    if (result.scrollWidth > result.clientWidth) {
      failures.push(`${result.name}: horizontal overflow`);
    }
    if (result.unnamedInteractiveElements) {
      failures.push(`${result.name}: unnamed interactive elements`);
    }
    if (!result.introWasVisible) {
      failures.push(`${result.name}: intro was not shown on a first visit`);
    }
    if (result.introVisible) {
      failures.push(`${result.name}: intro did not dismiss after Enter`);
    }
  }
  if (!results[0].carouselAfterNext?.scrollLeft || results[0].carouselAfterNext.counter !== "02 / 08") {
    failures.push("desktop: next control did not advance the horizontal carousel");
  }
  if (results[0].projectSlideWidth > 1100) {
    failures.push(`desktop: project slide is still oversized at ${results[0].projectSlideWidth}px`);
  }
  if (results[0].carouselAfterSwipe?.scrollLeft <= results[0].carouselAfterNext?.scrollLeft) {
    failures.push("desktop: pointer swipe did not advance the horizontal carousel");
  }
  failures.push(...consoleProblems);

  const report = { results, metrics: selectedMetrics, failures };
  await writeFile(
    path.join(outputDirectory, "report.json"),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

  if (failures.length) process.exitCode = 1;
} finally {
  cdp?.close();
  chrome.kill();
}

