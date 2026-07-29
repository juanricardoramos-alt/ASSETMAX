# Hero background clips

The homepage hero plays the clips below (desktop only, lazy-loaded, slow
crossfade when more than one exists). Slots are wired in code — a missing
file simply drops out of the rotation, so adding a clip is pure drag & drop:

| Slot | File | Status |
| --- | --- | --- |
| 1 | `hero-embers.mp4` (+ `.webm` fallback) | ✔ active |
| 2 | `hero-sweep.mp4` | empty — drop a file to activate |
| 3 | `hero-flow.mp4` | empty — drop a file to activate |
| 4 | `hero-extra.mp4` | empty — drop a file to activate |

To add or replace a clip: compress to ≤5 MB (1080p max, H.264 MP4, no
audio — HandBrake "Web" preset works), name it exactly as above and upload
it to this folder. `hero-poster.jpg` is the static frame used while
loading and on mobile.
