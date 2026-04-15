## 2026-04-10 Recovery Notes
- `.sisyphus` state disappeared mid-session and had to be restored from session history before execution could continue.
- For browser QA in this repo, preview must be launched with `npx vite preview --host 127.0.0.1 --port 4173 --base /My-Lab/` because the Vite build uses `base: '/My-Lab/'` in production mode.
- Playwright pointer-event simulation is sufficient to exercise the radio dial without relying on drag heuristics.

## 2026-04-10 Verified Behavior Notes
- A correct powered-on retune should show `.rr-lcd__text.is-scrubbing`, increment `window.__staticStarts`, then clear scrubbing and increment `window.__audioPlays` after the 400ms scrub window.
- A correct off-state retune may still scramble the station label, but must not increment `window.__staticStarts` or `window.__audioPlays`.
- A correct interrupted retune must leave the radio off with `OFFLINE` shown and must not increment `window.__audioPlays` after shutdown.

## 2026-04-10 Task 1 Restoration
- File had reverted to old `noiseSourceRef`/`noiseGainRef`/`playStatic(duration)` implementation.
- Restored exact Task 1 helper surface: constants `SCRUB_DURATION_MS=400`, `STATIC_DURATION_MS=350`, `STATIC_GAIN=0.14`, `STATIC_FADE_FLOOR=0.001`.
- Replaced old refs with `noiseBufferRef`, `staticSourceRef`, `staticGainRef`.
- Added `getStaticNoiseBuffer(ctx)` — caches mono AudioBuffer, reuses if sampleRate unchanged.
- Added `stopStaticNoise()` — safely stops source, clears onended, nulls refs.
- Added `playStaticNoise()` — async, guards `isOn` + ctx existence + `ctx.state !== 'closed'`, resumes suspended ctx, calls stopStaticNoise first, creates source+gain, sets gain envelope via setValueAtTime/linearRampToValueAtTime, routes source→gain→ctx.destination (NOT through analyserRef), assigns onended, stores refs, increments `window.__staticStarts` wrapped in typeof-window guard, starts and stops at scheduled times.
- `changeStation` updated to call `playStaticNoise()` and use `SCRUB_DURATION_MS` constant.
- Main playback graph (MediaElementSource→Analyser→destination) unchanged.

## 2026-04-10 Task 1 Repair Pass
- Fixed `getStaticNoiseBuffer`: buffer length now uses `Math.ceil((ctx.sampleRate * STATIC_DURATION_MS) / 1000)` as required by plan (was `Math.floor`).
- Fixed `stopStaticNoise`: now disconnects both `staticSourceRef.current` and `staticGainRef.current` via `try { .disconnect() } catch (_) {}` before nulling each ref; gain ref now has its own null-guarded block.
- Reverted scope creep in `changeStation`: removed accidental Task 2 wiring (`playStaticNoise()` call and its dep entry); `changeStation` deps are now `[isOn, playStation, scrambleTo]` only.
- `playStaticNoise` exists as a defined but un-called helper, ready for Task 2 wiring.

## 2026-04-10 Task 1 Final Repair (changeStation)
- Removed residual `audioRef.current?.pause()` block from `changeStation()` — that belongs to Task 2.
- Reverted timeout delay from `SCRUB_DURATION_MS` back to literal `400` — `SCRUB_DURATION_MS` remains defined as a constant but unused until Task 2 wires it in.
- `changeStation` is now helper-only: sets state, scrambles label, schedules playStation resume; no audio teardown or static wiring.

- Restored LCD text flicker styling (.rr-lcd__text.is-scrubbing / @keyframes rr-lcd-flicker) in src/app.css for scrubbing state.

## 2026-04-10 Task 2 Restoration (retune lifecycle)
- `changeStation()`: clearTimeout before scheduling new one; `audioRef.current?.pause()` + `playStaticNoise()` (fire-and-forget) called when `isOn`; timeout callback calls `stopStaticNoise()` before `setIsScrubbing(false)` and before `playStation(wrapped)`; literal `400` replaced with `SCRUB_DURATION_MS`; deps extended to include `playStaticNoise` and `stopStaticNoise`.
- `togglePower()` OFF branch: now calls `audioRef.current?.pause()`, `clearTimeout(scrubTimeoutRef.current)`, `stopStaticNoise()`, `setIsScrubbing(false)` before `scrambleTo('OFFLINE')` / `setIsOn(false)`; ON branch unchanged (no static on power-on).
- `playStation()`: increments `window.__audioPlays` immediately before `audio.play()` with `typeof window !== 'undefined'` guard.
- Mount/unmount effect: initialises `window.__audioPlays = 0` on mount; cleanup clears `scrubTimeoutRef.current`, calls `stopStaticNoise()`, pauses audio, then closes AudioContext; `stopStaticNoise` added to effect dependency array.
