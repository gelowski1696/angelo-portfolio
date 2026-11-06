import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9333;
const outputDirectory = path.resolve(".browser-check");
const profileDirectory = path.join(outputDirectory, "profile");
const siteUrl = "http://localhost:3000";

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
  await cdp.send("Page.navigate", { url: siteUrl });
  await delay(2500);

  const evaluation = await cdp.send("Runtime.evaluate", {
    expression: `JSON.stringify({
      title: document.title,
      h1: document.querySelector('h1')?.innerText,
      sectionCount: document.querySelectorAll('main section').length,
      navigationCount: document.querySelectorAll('nav').length,
      canvasCount: document.querySelectorAll('canvas').length,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      contactSetupVisible: Boolean(document.querySelector('.contact-setup'))
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

  if (name === "desktop") {
    for (let index = 0; index < 10; index += 1) {
      await cdp.send("Input.dispatchMouseEvent", {
        type: "mouseWheel",
        x: width / 2,
        y: height / 2,
        deltaX: 0,
        deltaY: 900,
      });
      await delay(180);
    }
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
    if (result.scrollWidth > result.clientWidth) {
      failures.push(`${result.name}: horizontal overflow`);
    }
    if (result.unnamedInteractiveElements) {
      failures.push(`${result.name}: unnamed interactive elements`);
    }
  }
  if (results[2].canvasCount !== 0) {
    failures.push("reduced-motion: WebGL canvas should be disabled");
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

