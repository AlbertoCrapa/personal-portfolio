# ai-demo → WebAssembly

Builds the [Enemy AI Prototype](https://github.com/AlbertoCrapa/ai-demo) (a
desktop SDL2 + Dear ImGui C++ app) into a WebAssembly build playable directly
in the portfolio at `/playground/ai_demo/play`.

## How it works

1. `build-ai-demo.sh` clones the upstream repo fresh into `.cache/ai-demo-src`
   (gitignored — nothing here is committed except this pipeline).
2. `ai-demo-emscripten.patch` is applied. It touches only `src/Game.h` /
   `src/Game.cpp`, swapping the desktop `while (isRunning)` loop for
   Emscripten's browser-driven `emscripten_set_main_loop_arg`. Every other
   file compiles completely unmodified — the game has no file/asset I/O and
   only draws with portable `SDL_Render*` primitives, so it needed no other
   changes to run on the web.
3. `em++` compiles it with Emscripten's built-in SDL2 port
   (`-sUSE_SDL=2 -sUSE_SDL_TTF=2`, so `<SDL_ttf.h>` resolves even though the
   game never actually calls into it) and `--closure 1`, which runs Google
   Closure Compiler over the generated glue: dead code is stripped and every
   identifier is mangled to one/two-letter names. `emscripten_cancel_main_loop`
   is explicitly exported so `AiDemoExperience.jsx` can stop the simulation
   cleanly via `instance.ccall(...)` when the user leaves the experience,
   instead of leaving a detached canvas rendering forever in the background.
4. `javascript-obfuscator` runs a second, conservative pass on top: string
   literals get moved into a shuffled, base64-encoded array. Control-flow
   flattening, dead-code injection and self-defending code are deliberately
   left **off** — they're the presets most likely to break Emscripten's
   generated runtime (it has tight WebGL/`requestAnimationFrame` timing
   code), and add little once Closure has already stripped names and the
   actual game logic ships as wasm bytecode rather than JS.
5. The result is copied to `public/experiences/ai-demo/{ai-demo.js,ai-demo.wasm}`,
   which `src/experiences/AiDemoExperience.jsx` loads on demand.

## Rebuilding

```bash
brew install emscripten   # one-time; provides em++
./scripts/wasm/build-ai-demo.sh
```

Re-run it any time upstream `ai-demo` changes. If a future upstream change
touches `Game.h`/`Game.cpp` in a way that conflicts with the patch, `git apply`
will fail loudly — update `ai-demo-emscripten.patch` to match (regenerate with
`git diff -- src/Game.h src/Game.cpp` from a patched checkout).
