#!/usr/bin/env bash
#
# Rebuilds "Enemy AI Prototype" (https://github.com/AlbertoCrapa/ai-demo) as a
# WebAssembly build playable at /playground/ai_demo/play, and drops the
# optimized + obfuscated output into public/experiences/ai-demo/.
#
# The upstream repo is a desktop SDL2 + Dear ImGui app; ai-demo-emscripten.patch
# adapts its blocking `while` main loop to Emscripten's browser-driven loop
# (emscripten_set_main_loop_arg) without touching any other file — everything
# else (rendering, pathfinding, steering behaviors) compiles unmodified because
# it only uses portable SDL2 primitives and has no file/asset I/O.
#
# Requires: emscripten on PATH (brew install emscripten), git, and this repo's
# own node_modules (for the javascript-obfuscator devDependency).
set -euo pipefail

REPO_URL="https://github.com/AlbertoCrapa/ai-demo.git"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CACHE_DIR="$ROOT_DIR/.cache/ai-demo-src"
OUT_DIR="$ROOT_DIR/public/experiences/ai-demo"
PATCH_FILE="$ROOT_DIR/scripts/wasm/ai-demo-emscripten.patch"

if ! command -v em++ >/dev/null 2>&1; then
  echo "error: em++ not found on PATH. Install with: brew install emscripten" >&2
  exit 1
fi

echo "==> Fetching ai-demo source"
rm -rf "$CACHE_DIR"
mkdir -p "$(dirname "$CACHE_DIR")"
git clone --depth 1 "$REPO_URL" "$CACHE_DIR"

cd "$CACHE_DIR"
echo "==> Applying Emscripten main-loop patch"
git apply "$PATCH_FILE"

echo "==> Compiling to WebAssembly (em++, closure-minified glue)"
mkdir -p build-web
em++ -std=c++17 -O3 \
  -sUSE_SDL=2 -sUSE_SDL_TTF=2 \
  -Isrc -Ilibs/imgui -Ilibs/imgui/backends \
  src/main.cpp src/Game.cpp src/Agent.cpp src/DebugUI.cpp src/Utils.cpp src/AStar.cpp \
  libs/imgui/imgui.cpp libs/imgui/imgui_demo.cpp libs/imgui/imgui_draw.cpp libs/imgui/imgui_tables.cpp libs/imgui/imgui_widgets.cpp \
  libs/imgui/backends/imgui_impl_sdl2.cpp libs/imgui/backends/imgui_impl_sdlrenderer2.cpp \
  -sALLOW_MEMORY_GROWTH=1 \
  -sMODULARIZE=1 -sEXPORT_NAME=createAiDemoModule \
  -sENVIRONMENT=web \
  -sEXPORTED_FUNCTIONS="['_main','_emscripten_cancel_main_loop']" \
  -sEXPORTED_RUNTIME_METHODS="['ccall']" \
  --closure 1 \
  -o build-web/ai-demo.js

echo "==> Obfuscating glue JS (string-array + identifier mangling on top of Closure)"
# Control-flow flattening / dead-code injection / self-defending are left off
# on purpose: they're the presets most likely to corrupt Emscripten's
# generated runtime (tight WebGL/RAF timing code), for little extra benefit
# once Closure has already stripped names and the logic itself ships as wasm
# bytecode, not JS.
npx --prefix "$ROOT_DIR" javascript-obfuscator build-web/ai-demo.js \
  --output build-web/ai-demo.obf.js \
  --compact true \
  --simplify true \
  --string-array true \
  --string-array-threshold 0.75 \
  --string-array-encoding base64 \
  --string-array-rotate true \
  --string-array-shuffle true \
  --identifier-names-generator mangled \
  --rename-globals false \
  --self-defending false \
  --control-flow-flattening false \
  --dead-code-injection false \
  --debug-protection false \
  --disable-console-output false

echo "==> Installing build output"
mkdir -p "$OUT_DIR"
mv build-web/ai-demo.obf.js "$OUT_DIR/ai-demo.js"
cp build-web/ai-demo.wasm "$OUT_DIR/ai-demo.wasm"

echo "Done: $OUT_DIR/ai-demo.js + ai-demo.wasm"
