(() => {
  const SETTINGS = {
  "charset": "standard",
  "customCharset": " .:-=+*#%@",
  "brailleVariant": "standard",
  "fontSize": 6,
  "hoverStrength": 16,
  "mouseInteractionMode": "push",
  "mouseAreaSize": 100,
  "mouseSpread": 1,
  "charSpacing": 0.78,
  "spacing": 0.82,
  "renderFont": "\"Helvetica Neue\", Helvetica, Arial, sans-serif",
  "outputAspect": "source",
  "contrast": 1.2,
  "brightness": 31,
  "opacity": 1,
  "vignette": 0,
  "borderGlow": 0,
  "bgDither": 0.65,
  "inverseDither": 0,
  "invert": false,
  "ditherType": "floyd-steinberg",
  "ditherStrength": 0.9,
  "style": "classic",
  "halftoneShape": "circle",
  "halftoneSize": 1,
  "halftoneRotation": 0,
  "colorMode": "grayscale",
  "terminalCharset": "binary",
  "retroDuotone": "amber-classic",
  "retroNoise": 0.45,
  "backgroundColor": "#050505",
  "customColor": "#00ff99",
  "ditherWaveColor": "#808080",
  "ditherAnimationEnabled": true,
  "ditherMouseInteractionEnabled": true,
  "ditherMouseRadius": 0.3,
  "ditherColorNum": 4,
  "ditherWaveAmplitude": 0.3,
  "ditherWaveFrequency": 3,
  "ditherWaveSpeed": 0.05,
  "dither2WaveColor": "#666666",
  "dither2AnimationEnabled": true,
  "dither2MouseInteractionEnabled": true,
  "dither2MouseRadius": 1,
  "dither2ColorNum": 4,
  "dither2PixelSize": 2,
  "dither2WaveAmplitude": 0.3,
  "dither2WaveFrequency": 3,
  "dither2WaveSpeed": 0.05,
  "particleDensity": 0.5,
  "particleChar": "*",
  "letterSet": "alphabet",
  "claudeDensity": 0.7,
  "lineLength": 1,
  "lineWidth": 1,
  "lineThickness": 1.6,
  "lineRotation": 0,
  "overlayPreset": "noise",
  "overlayStrength": 0.45,
  "noiseScale": 24,
  "noiseSpeed": 1,
  "noiseDirection": "right",
  "intervalSpacing": 12,
  "intervalSpeed": 1,
  "intervalWidth": 2,
  "intervalDirection": "down",
  "beamDirection": "right",
  "glitchDirection": "right",
  "crtDirection": "down",
  "matrixDirection": "down",
  "matrixScale": 18,
  "matrixSpeed": 1,
  "webglLayerEnabled": false,
  "webglOverlayType": "lightning-rails",
  "webglOverlayPosition": "behind",
  "webglOverlayAffectsAscii": false,
  "webglOverlayOpacity": 1,
  "webglOverlayIntensity": 0.45,
  "webglOverlayLineSpread": 0.25,
  "webglOverlayPulseSpeed": 1,
  "webglOverlayLightning": 1,
  "webglOverlayMouseInfluence": 1,
  "webglOverlayGrain": 0.02,
  "webglOverlayColor": "#99bbff",
  "themeOutputInvert": false
};
  const EXPORT_OPTIONS = {"enableInteractionEffects":true,"transparentBackground":true,"enableAlphaMask":true,"alphaMaskEnd":85,"enableFadeIn":true,"fadeInDurationMs":900,"pauseWhenOffscreen":true,"adaptivePerformance":true,"maxFps":30,"idleFps":12,"visibilityThreshold":0.01,"reportFps":false,"enableWatermark":false,"watermarkText":"Made in ASC11"};
  const SOURCE = {
  "type": "image",
  "url": "data:image/jpeg;base64,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"
};
  const IS_TRANSPARENT_BG = Boolean(EXPORT_OPTIONS.transparentBackground);
  const WATERMARK_LABEL = String(EXPORT_OPTIONS.watermarkText || "Made in ASC11");

  const CHARSETS = {"standard":" .:-=+*#%@","blocks":" ░▒▓█","detailed":" .'`^\",:;Il!i><~+_-?][}{1)(|\\\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$","minimal":" ·░█","binary":" 01","letters-alphabet":"ABCDEFGHIJKLMNOPQRSTUVWXYZ","letters-lowercase":"abcdefghijklmnopqrstuvwxyz","letters-mixed":"AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQpRrSsTtUuVvWwXxYyZz","letters-symbols":"@#$%&*+=-<>~","braille":" ⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⠡⠢⠣⠤⠥⠦⠧⠨⠩⠪⠫⠬⠭⠮⠯⠰⠱⠲⠳⠴⠵⠶⠷⠸⠹⠺⠻⠼⠽⠾⠿"};
  const BRAILLE_VARIANTS = {"standard":" ⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⠡⠢⠣⠤⠥⠦⠧⠨⠩⠪⠫⠬⠭⠮⠯⠰⠱⠲⠳⠴⠵⠶⠷⠸⠹⠺⠻⠼⠽⠾⠿","sparse":" ⠁⠂⠄⠈⠐⠠⡀⢀⣀⣿","dense":" ⠃⠇⠏⠟⠿"};
  const MATRIX_CHARS = " アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
  const HALFTONE_CHARS = " .,:;irsXA253hMHGS#9B&@";
  const RETRO_CHARS = "o";
  const TERMINAL_CHARSET_PRESETS = {"binary":" 010101","brackets":" []/\\<>","symbols":" $_+","mixed":" 01[]/\\<>$_+|","matrix":" 01{}[]/\\<>|_+-"};
  const RETRO_DUOTONE_PALETTES = {"amber-classic":{"low":{"r":20,"g":12,"b":6},"high":{"r":255,"g":223,"b":178}},"cyan-night":{"low":{"r":6,"g":16,"b":22},"high":{"r":166,"g":240,"b":255}},"violet-haze":{"low":{"r":17,"g":10,"b":26},"high":{"r":242,"g":198,"b":255}},"lime-pulse":{"low":{"r":10,"g":18,"b":8},"high":{"r":226,"g":255,"b":162}},"mono-ice":{"low":{"r":12,"g":12,"b":12},"high":{"r":245,"g":248,"b":255}}};
  const HOVER_ATTRACT_RADIUS = 180;
  const CLICK_BURST_RADIUS = 340;
  const CLICK_BURST_STRENGTH = 56;
  const CLICK_BURST_DURATION_MS = 640;
  const FPS_MESSAGE_TYPE = "ascii-dither-template-fps";
  const IS_TEMPLATE_PREVIEW_RUNTIME = EXPORT_OPTIONS.reportFps === true;
  const TEMPLATE_PREVIEW_RUNTIME_KEY = '__asciiTemplatePreviewRuntime__';
  const runtimeScope = typeof window !== 'undefined' ? window : globalThis;
  const previewRuntimeId = IS_TEMPLATE_PREVIEW_RUNTIME ? String(Date.now()) + '-' + Math.random().toString(36).slice(2) : '';
  const SHOULD_REPORT_FPS =
    EXPORT_OPTIONS.reportFps === true &&
    typeof window.parent !== 'undefined' &&
    window.parent !== window;

  if (IS_TEMPLATE_PREVIEW_RUNTIME) {
    const existingRuntime = runtimeScope[TEMPLATE_PREVIEW_RUNTIME_KEY];
    if (existingRuntime && typeof existingRuntime.destroy === 'function') {
      try {
        existingRuntime.destroy();
      } catch {
        // Ignore stale runtime destroy errors.
      }
    }
    runtimeScope[TEMPLATE_PREVIEW_RUNTIME_KEY] = { id: previewRuntimeId, destroy: null };
  }

  const mount = document.querySelector('[data-ascii-dither-bg]');
  if (!mount) return;

  if (typeof mount.__asciiDitherDestroy === 'function') {
    mount.__asciiDitherDestroy();
  }

  mount.style.position = 'absolute';
  mount.style.inset = '0';
  mount.style.height = '100%';
  mount.style.zIndex = '0';
  mount.style.pointerEvents = 'none';
  mount.style.overflow = 'hidden';
  mount.style.background = 'transparent';
  const fadeInDurationMs = Math.max(0, Number(EXPORT_OPTIONS.fadeInDurationMs ?? 900) || 900);
  if (EXPORT_OPTIONS.enableFadeIn === true && fadeInDurationMs > 0) {
    mount.style.opacity = '0';
    mount.style.transition = 'opacity ' + fadeInDurationMs + 'ms ease';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        mount.style.opacity = '1';
      });
    });
  } else {
    mount.style.opacity = '1';
    mount.style.removeProperty('transition');
  }

  const parent = mount.parentElement;
  if (parent && window.getComputedStyle(parent).position === 'static') {
    parent.style.position = 'relative';
  }

  const backgroundLayer = document.createElement('div');
  Object.assign(backgroundLayer.style, {
    position: 'absolute',
    inset: '0',
    pointerEvents: 'none',
    zIndex: '0',
    background: IS_TRANSPARENT_BG ? 'transparent' : getEffectiveBackgroundColor(SETTINGS)
  });

  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    maxWidth: 'none',
    maxHeight: 'none',
    transform: 'none',
    display: 'block',
    zIndex: '2'
  });

  const webglCanvas = document.createElement('canvas');
  Object.assign(webglCanvas.style, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    maxWidth: 'none',
    maxHeight: 'none',
    transform: 'none',
    display: 'none',
    opacity: '0',
    zIndex: '1',
    pointerEvents: 'none'
  });
  const webglShaderCanvas = document.createElement('canvas');
  Object.assign(webglShaderCanvas.style, {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    maxWidth: 'none',
    maxHeight: 'none',
    transform: 'none',
    display: 'none',
    opacity: '0',
    zIndex: '1',
    pointerEvents: 'none'
  });
  const legacyAlphaMaskStop = Math.max(0, Math.min(100, Number(EXPORT_OPTIONS.alphaMaskStop ?? 85) || 85));
  const alphaMaskEndRaw = Number(EXPORT_OPTIONS.alphaMaskEnd ?? legacyAlphaMaskStop);
  const alphaMaskEnd = Math.max(0, Math.min(100, Number.isFinite(alphaMaskEndRaw) ? alphaMaskEndRaw : legacyAlphaMaskStop));
  if (EXPORT_OPTIONS.enableAlphaMask !== false) {
    const alphaMaskValue =
      'linear-gradient(to bottom, black 0%, black ' + alphaMaskEnd + '%, transparent 100%)';
    mount.setAttribute('data-alpha-mask', 'bottom-' + alphaMaskEnd);
    canvas.style.setProperty('mask-image', alphaMaskValue);
    canvas.style.setProperty('-webkit-mask-image', alphaMaskValue);
    webglCanvas.style.setProperty('mask-image', alphaMaskValue);
    webglCanvas.style.setProperty('-webkit-mask-image', alphaMaskValue);
    webglShaderCanvas.style.setProperty('mask-image', alphaMaskValue);
    webglShaderCanvas.style.setProperty('-webkit-mask-image', alphaMaskValue);
  } else {
    mount.removeAttribute('data-alpha-mask');
    canvas.style.removeProperty('mask-image');
    canvas.style.removeProperty('-webkit-mask-image');
    webglCanvas.style.removeProperty('mask-image');
    webglCanvas.style.removeProperty('-webkit-mask-image');
    webglShaderCanvas.style.removeProperty('mask-image');
    webglShaderCanvas.style.removeProperty('-webkit-mask-image');
  }

  let watermarkLayer = null;
  if (EXPORT_OPTIONS.enableWatermark === true) {
    watermarkLayer = document.createElement('div');
    Object.assign(watermarkLayer.style, {
      position: 'absolute',
      right: '14px',
      bottom: '12px',
      zIndex: '4',
      pointerEvents: 'none',
      userSelect: 'none',
      font: '600 12px "Helvetica Neue", Helvetica, Arial, sans-serif',
      letterSpacing: '0.03em',
      color: 'rgba(255, 255, 255, 0.92)',
      padding: '4px 8px',
      borderRadius: '999px',
      border: '1px solid rgba(255, 255, 255, 0.24)',
      background: 'rgba(0, 0, 0, 0.5)',
      textShadow: '0 1px 1px rgba(0, 0, 0, 0.45)',
    });
    watermarkLayer.textContent = WATERMARK_LABEL;
  }

  if (watermarkLayer) {
    mount.replaceChildren(backgroundLayer, webglCanvas, webglShaderCanvas, canvas, watermarkLayer);
  } else {
    mount.replaceChildren(backgroundLayer, webglCanvas, webglShaderCanvas, canvas);
  }

  const ctx = canvas.getContext('2d');
  const webglCtx = webglCanvas.getContext('2d');
  const webglShaderGl =
    webglShaderCanvas.getContext('webgl', { alpha: true, premultipliedAlpha: false }) ||
    webglShaderCanvas.getContext('experimental-webgl', { alpha: true, premultipliedAlpha: false });
  const sampleCanvas = document.createElement('canvas');
  const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
  const webglSampleCanvas = document.createElement('canvas');
  const webglSampleCtx = webglSampleCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx || !webglCtx || !sampleCtx || !webglSampleCtx) throw new Error('Could not create canvas context');

  let source = null;
  let stream = null;
  let sourceLoopHandler = null;
  let rafId = null;
  let webglRafId = null;
  let intersectionObserver = null;
  let resizeObserver = null;
  let bounds = { left: 0, top: 0, width: 1, height: 1 };
  let viewWidth = 1;
  let viewHeight = 1;
  let renderWidth = 1;
  let renderHeight = 1;
  let pointer = { inside: false, x: 0, y: 0 };
  let clickBursts = [];
  let matrixRainState = { laneCount: 0, primaryCount: 0, speeds: [], phases: [], lengths: [] };
  let isInViewport = true;
  let isPageVisible = document.visibilityState !== 'hidden';
  let pendingForceRender = false;
  let lastRenderTime = 0;
  let fpsFrameCount = 0;
  let fpsWindowStart = 0;
  let lastReportedSignature = '';
  let lastFrameDurationMs = 0;
  let lastCharCount = 0;
  let webglScene = null;
  let webglStartTime = performance.now();
  let webglMouseState = null;
  let webglShaderResources = null;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function getEffectiveBackgroundColor(settings) {
    return settings?.backgroundColor || '#000000';
  }

  function drawError(message) {
    ctx.clearRect(0, 0, renderWidth, renderHeight);
    webglCtx.clearRect(0, 0, renderWidth, renderHeight);
    if (webglShaderGl) {
      webglShaderGl.viewport(0, 0, webglShaderCanvas.width || 1, webglShaderCanvas.height || 1);
      webglShaderGl.clearColor(0, 0, 0, 0);
      webglShaderGl.clear(webglShaderGl.COLOR_BUFFER_BIT);
    }
    ctx.fillStyle = '#fca5a5';
    ctx.font = '16px ' + (SETTINGS.renderFont || 'Helvetica, Arial, sans-serif');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(message, renderWidth / 2, renderHeight / 2);
  }

  function readBounds() {
    const rect = mount.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width || mount.clientWidth || window.innerWidth || 1));
    const height = Math.max(1, Math.round(rect.height || mount.clientHeight || window.innerHeight || 1));
    return {
      left: rect.left,
      top: rect.top,
      width,
      height,
      right: rect.left + width,
      bottom: rect.top + height
    };
  }

  function resize() {
    bounds = readBounds();
    viewWidth = bounds.width;
    viewHeight = bounds.height;
  }

  function reportFps() {}

  function handleDocumentVisibilityChange() {
    isPageVisible = document.visibilityState !== 'hidden';
  }

  function handleIntersection(entries) {
    const entry = entries && entries[0];
    if (!entry) return;
    isInViewport = entry.isIntersecting && entry.intersectionRatio > 0;
  }

  function handleWindowResize() {
    resize();
    scheduleRender(true);
  }

  function handleWindowPointerMove(event) {
    const rect = mount.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!inside) {
      if (pointer.inside) {
        pointer = { inside: false, x: 0, y: 0 };
        scheduleRender(true);
      }
      return;
    }

    pointer = {
      inside: true,
      x: clamp(event.clientX - rect.left, 0, Math.max(1, rect.width)),
      y: clamp(event.clientY - rect.top, 0, Math.max(1, rect.height)),
    };
    scheduleRender(true);
  }

  function handleWindowBlur() {
    pointer = { inside: false, x: 0, y: 0 };
    scheduleRender(true);
  }

  function scheduleRender(force = false) {
    if (force) pendingForceRender = true;
    if (!rafId) rafId = requestAnimationFrame(renderFrame);
  }

  function renderFrame(now) {
    rafId = null;
    if (!source) return;
    const width = Math.max(1, viewWidth);
    const height = Math.max(1, viewHeight);
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      renderWidth = width;
      renderHeight = height;
    }

    const fontSize = clamp(SETTINGS.fontSize || 10, 6, 24);
    const charSpacing = clamp(Number(SETTINGS.charSpacing ?? 1) || 1, 0.6, 2);
    const spacing = clamp(Number(SETTINGS.spacing ?? 1) || 1, 0.6, 3);
    ctx.font = fontSize + 'px ' + (SETTINGS.renderFont || 'Helvetica, Arial, sans-serif');
    ctx.textBaseline = 'top';

    sampleCanvas.width = width;
    sampleCanvas.height = height;
    sampleCtx.setTransform(1, 0, 0, 1, 0, 0);
    sampleCtx.clearRect(0, 0, width, height);
    sampleCtx.fillStyle = getEffectiveBackgroundColor(SETTINGS);
    sampleCtx.fillRect(0, 0, width, height);

    const sourceWidth = Math.max(1, source.naturalWidth || source.videoWidth || width);
    const sourceHeight = Math.max(1, source.naturalHeight || source.videoHeight || height);
    const scale = Math.min(width / sourceWidth, height / sourceHeight) * 1.2;
    const drawWidth = Math.max(1, sourceWidth * scale);
    const drawHeight = Math.max(1, sourceHeight * scale);
    const drawX = (width - drawWidth) * 0.5;
    const drawY = (height - drawHeight) * 0.5;
    sampleCtx.drawImage(source, drawX, drawY, drawWidth, drawHeight);

    const imageData = sampleCtx.getImageData(0, 0, width, height);
    const data = imageData.data;
    ctx.clearRect(0, 0, width, height);

    const cellWidth = Math.max(4, fontSize * 0.72 * charSpacing * spacing);
    const cellHeight = Math.max(6, fontSize * 1.18 * charSpacing * spacing);
    const cols = Math.max(1, Math.floor(width / cellWidth));
    const rows = Math.max(1, Math.floor(height / cellHeight));
    const charset = CHARSETS[SETTINGS.charset] || CHARSETS.standard;
    const hoverStrength = clamp(Number(SETTINGS.hoverStrength ?? 24) || 24, 2, 80);
    const hoverAreaSize = clamp(Number(SETTINGS.mouseAreaSize ?? 180) || 180, 40, 480);
    const hoverSpread = clamp(Number(SETTINGS.mouseSpread ?? 1) || 1, 0.25, 3);
    const interactionDirection = SETTINGS.mouseInteractionMode === 'push' ? -1 : 1;

    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        const sampleX = Math.min(width - 1, Math.floor((x / Math.max(cols, 1)) * width));
        const sampleY = Math.min(height - 1, Math.floor((y / Math.max(rows, 1)) * height));
        const offset = (sampleY * width + sampleX) * 4;
        const r = data[offset];
        const g = data[offset + 1];
        const b = data[offset + 2];
        let gray = 0.299 * r + 0.587 * g + 0.114 * b;
        gray = clamp((gray - 128) * SETTINGS.contrast + 128 + SETTINGS.brightness * 2, 0, 255);
        const index = Math.floor((gray / 255) * (charset.length - 1));
        const char = charset[index] || ' ';

        let drawX = x * cellWidth;
        let drawY = y * cellHeight;
        if (pointer.inside) {
          const centerX = drawX + cellWidth * 0.5;
          const centerY = drawY + cellHeight * 0.5;
          const dx = pointer.x - centerX;
          const dy = pointer.y - centerY;
          const distance = Math.hypot(dx, dy);
          if (distance > 0.0001 && distance < hoverAreaSize) {
            const falloff = 1 - distance / hoverAreaSize;
            const spreadFactor = Math.pow(falloff, 1 / hoverSpread);
            const rawForce = spreadFactor * spreadFactor * hoverStrength * interactionDirection;
            const maxOffset = Math.max(1.4, Math.min(cellWidth, cellHeight) * 0.42);
            const force = clamp(rawForce, -maxOffset, maxOffset);
            drawX += (dx / distance) * force;
            drawY += (dy / distance) * force;
          }
        }

        ctx.fillStyle = 'rgba(148,148,148,' + clamp(SETTINGS.opacity * 0.88, 0, 1) + ')';
        ctx.fillText(char, drawX, drawY);
      }
    }

    if (pendingForceRender || (isPageVisible && isInViewport)) {
      pendingForceRender = false;
      scheduleRender();
    }
  }

  async function loadSource() {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = SOURCE.url;
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });
    return image;
  }

  async function start() {
    resize();
    document.addEventListener('visibilitychange', handleDocumentVisibilityChange);
    window.addEventListener('resize', handleWindowResize);
    if (EXPORT_OPTIONS.enableInteractionEffects) {
      window.addEventListener('pointermove', handleWindowPointerMove, { passive: true });
      window.addEventListener('blur', handleWindowBlur);
    }
    if (typeof IntersectionObserver === 'function') {
      const visibilityThreshold = clamp(Number(EXPORT_OPTIONS.visibilityThreshold ?? 0.01) || 0.01, 0, 1);
      intersectionObserver = new IntersectionObserver(handleIntersection, {
        threshold: [0, visibilityThreshold, 0.25],
      });
      intersectionObserver.observe(mount);
    }
    if (typeof ResizeObserver === 'function') {
      resizeObserver = new ResizeObserver(() => {
        resize();
        scheduleRender(true);
      });
      resizeObserver.observe(mount);
    }
    source = await loadSource();
    scheduleRender(true);
  }

  start().catch((error) => {
    reportFps(0);
    drawError('Export source failed: ' + (error && error.message ? error.message : 'Unknown error'));
  });

  window.__asciiDitherExportDestroy = function() {
    reportFps(0);
    if (rafId) cancelAnimationFrame(rafId);
    if (webglRafId) cancelAnimationFrame(webglRafId);
    if (stream) stream.getTracks().forEach((track) => track.stop());
    document.removeEventListener('visibilitychange', handleDocumentVisibilityChange);
    window.removeEventListener('resize', handleWindowResize);
    window.removeEventListener('pointermove', handleWindowPointerMove);
    window.removeEventListener('blur', handleWindowBlur);
    if (intersectionObserver) intersectionObserver.disconnect();
    if (resizeObserver) resizeObserver.disconnect();
    if (sourceLoopHandler && source && typeof source.removeEventListener === 'function') {
      source.removeEventListener('ended', sourceLoopHandler);
      sourceLoopHandler = null;
    }
    mount.replaceChildren();
    delete mount.__asciiDitherDestroy;
    if (IS_TEMPLATE_PREVIEW_RUNTIME) {
      const runtimeEntry = runtimeScope[TEMPLATE_PREVIEW_RUNTIME_KEY];
      if (runtimeEntry && runtimeEntry.id === previewRuntimeId) {
        delete runtimeScope[TEMPLATE_PREVIEW_RUNTIME_KEY];
      }
    }
  };
  mount.__asciiDitherDestroy = window.__asciiDitherExportDestroy;
  if (IS_TEMPLATE_PREVIEW_RUNTIME) {
    const runtimeEntry = runtimeScope[TEMPLATE_PREVIEW_RUNTIME_KEY];
    if (runtimeEntry && runtimeEntry.id === previewRuntimeId) {
      runtimeEntry.destroy = window.__asciiDitherExportDestroy;
    }
  }
})();
