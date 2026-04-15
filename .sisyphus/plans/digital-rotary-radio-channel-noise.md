# Digital Rotary Radio Channel-Switch Static

## TL;DR
> **Summary**: Add a short, synthesized radio-static burst plus subtle LCD flicker when the Digital Rotary Radio changes stations, using the existing 400ms scrub window in `src/components/RotaryRadio.jsx`.
> **Deliverables**:
> - Web Audio static helpers, retune lifecycle wiring, and cleanup safety in `src/components/RotaryRadio.jsx`
> - LCD flicker animation scoped to `.rr-lcd__text.is-scrubbing` in `src/app.css`
> - Build, preview, Playwright, and code-review evidence in `.sisyphus/evidence/`

## Context
- Desired effect is **audio static + subtle visual flicker** during channel changes only.
- Static must be synthesized with Web Audio inside the existing `AudioContext`; no asset files.
- No power-on static.
- Verification is `npm run build` plus agent-executed QA.

## Work Objectives
- Add a brief, radio-like static burst plus subtle LCD flicker during powered-on station changes in `src/components/RotaryRadio.jsx`, while preserving the existing 400ms delay before the newly selected station starts.

## Must Have
- Add these exact constants near the top-level constants in `src/components/RotaryRadio.jsx`:
  - `SCRUB_DURATION_MS = 400`
  - `STATIC_DURATION_MS = 350`
  - `STATIC_GAIN = 0.14`
  - `STATIC_FADE_FLOOR = 0.001`
- Add these exact refs in `RotaryRadio.jsx`:
  - `noiseBufferRef`
  - `staticSourceRef`
  - `staticGainRef`
- Implement these exact helpers in `RotaryRadio.jsx`:
  - `getStaticNoiseBuffer(ctx)`
  - `stopStaticNoise()`
  - `playStaticNoise()`
- `getStaticNoiseBuffer(ctx)` must create a mono `AudioBuffer`, fill with random `[-1, 1]` samples, cache it in `noiseBufferRef`, and reuse until sample rate changes.
- `playStaticNoise()` must create a fresh `AudioBufferSourceNode` and `GainNode` for every powered-on retune, connect `source -> gain -> ctx.destination`, ramp gain down with `linearRampToValueAtTime`, and stop the source at `STATIC_DURATION_MS`.
- `changeStation()` must pause `audioRef.current` immediately when `isOn` is true, then trigger `playStaticNoise()`, then wait `SCRUB_DURATION_MS` before starting the new station.
- `togglePower()` OFF flow and unmount cleanup must clear `scrubTimeoutRef`, stop static, and remove lingering scrubbing state.
- Keep main playback graph unchanged: `MediaElementSource -> Analyser -> destination`.
- Keep all implementation inside `src/components/RotaryRadio.jsx` and `src/app.css` only.

## Must NOT Have
- No new files in `public/` and no bundled static-audio asset.
- No new dependencies, no Vitest, no Playwright config files, and no CI changes.
- No `OscillatorNode`; use a noise-filled `AudioBuffer`.
- No static routed through the analyser node.
- No static on the `togglePower()` ON branch.
- No edits to `src/siteData.js`, `src/App.jsx`, or unrelated cards.
- No layout changes to the radio shell, dial, or surrounding card.
- No always-on LCD animation; flicker only on `.rr-lcd__text.is-scrubbing`.

## TODOs

- [x] 1. Build synthesized static helpers in `src/components/RotaryRadio.jsx`

  **What to do**:
  - Add constants `SCRUB_DURATION_MS`, `STATIC_DURATION_MS`, `STATIC_GAIN`, and `STATIC_FADE_FLOOR`.
  - Add refs `noiseBufferRef`, `staticSourceRef`, and `staticGainRef`.
  - Implement `getStaticNoiseBuffer(ctx)` with cached mono `AudioBuffer` sized from `ctx.sampleRate` and `STATIC_DURATION_MS`.
  - Implement `stopStaticNoise()` that stops/disconnects current static nodes safely and nulls refs.
  - Implement `playStaticNoise()` as async callback that guards powered-off/closed contexts, resumes suspended context, stops prior static, creates fresh source and gain nodes, ramps gain down, stores refs, starts immediately, and stops at `STATIC_DURATION_MS`.
  - Increment `window.__staticStarts` with a `typeof window !== 'undefined'` guard.

  **Acceptance Criteria**:
  - Named constants and refs exist.
  - `getStaticNoiseBuffer`, `stopStaticNoise`, and `playStaticNoise` exist with the required responsibilities.
  - `playStaticNoise` uses `ctx.createBufferSource()`, `ctx.createGain()`, `linearRampToValueAtTime`, and scheduled stop.
  - `source.onended = () => stopStaticNoise()` is present.

- [x] 2. Wire retune, timeout, and teardown behavior in `src/components/RotaryRadio.jsx`

  **What to do**:
  - Update `changeStation()` to use `SCRUB_DURATION_MS` instead of hardcoded `400`.
  - Clear `scrubTimeoutRef.current` before scheduling a new timeout.
  - After `setIsScrubbing(true)`, if `isOn`, call `audioRef.current?.pause()` first, then `playStaticNoise()` without awaiting it, then continue with `scrambleTo(...)`.
  - In the timeout callback, call `stopStaticNoise()` before `setIsScrubbing(false)` and before `playStation(wrapped)`.
  - Extend dependencies for `changeStation()` to include `playStaticNoise` and `stopStaticNoise`.
  - In `togglePower()` OFF branch, pause audio, clear timeout, call `stopStaticNoise()`, set `isScrubbing(false)`, then preserve existing OFFLINE scramble and `setIsOn(false)` behavior.
  - Keep ON branch behavior unchanged; no static on power-on.
  - In mount/unmount effect, initialize `window.__audioPlays = 0` when `typeof window !== 'undefined'`, increment `window.__audioPlays` immediately before `audio.play()`, clear timeout on cleanup, call `stopStaticNoise()`, then close the context.

  **Acceptance Criteria**:
  - Powered-on retunes pause live stream before static.
  - Timeout callback stops static before clearing scrubbing and before new playback.
  - OFF branch prevents delayed playback after shutdown.
  - `playStation()` increments `window.__audioPlays` before `audio.play()`.
  - Unmount cleanup clears timeout and stops static before closing context.

- [x] 3. Add subtle LCD flicker styling in `src/app.css`

  **What to do**:
  - Add `@keyframes rr-lcd-flicker` close to `.rr-lcd__text` rules.
  - Use short irregular opacity pattern over roughly 120ms-160ms.
  - Update `.rr-lcd__text.is-scrubbing` to keep dimmed text color and apply flicker animation with abrupt timing such as `steps(1, end)`.
  - Keep effect text-only.

  **Acceptance Criteria**:
  - `src/app.css` contains `@keyframes rr-lcd-flicker`.
  - `.rr-lcd__text.is-scrubbing` applies flicker animation and preserves dimmer text color.
  - `.rr-lcd__clock` styling remains untouched.

- [ ] 4. Run diagnostics, build, preview, and browser QA for the retune experience

  **What to do**:
  - Run diagnostics on `src/components/RotaryRadio.jsx` if available.
  - Run `npm run build`.
  - Start preview with `npx vite preview --host 127.0.0.1 --port 4173 --base /My-Lab/`.
  - Use Playwright to verify:
    1. Page loads with no uncaught page errors.
    2. `button.rr-toggle` gains `.is-on` after powering on.
    3. Powered-on dial drag causes `.rr-lcd__text.is-scrubbing` to appear, then disappear within ~450ms.
    4. Powered-on retunes increment `window.__staticStarts` and `window.__audioPlays`.
    5. Off-state retunes do not increment `window.__staticStarts`.
    6. Powering off during an active retune does not increment `window.__audioPlays` after shutdown.
  - Capture screenshots/evidence and stop preview when done.

## Final Verification Wave
- [ ] F1. Plan Compliance Audit — oracle
- [ ] F2. Code Quality Review — unspecified-high
- [ ] F3. Real Manual QA — unspecified-high (+ playwright if UI)
- [ ] F4. Scope Fidelity Check — deep

## Commit Strategy
- Do not create any git commit unless the user explicitly asks.

## Success Criteria
- Powered-on retunes produce a short synthesized static burst and subtle LCD flicker without adding assets or dependencies.
- Off-state retunes remain silent.
- Powering off mid-retune does not restart audio after shutdown.
- The radio still builds successfully and the existing UI structure remains intact.
