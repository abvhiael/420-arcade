# Godot migration — foundation

Original canonical Unity source: `abvhiael/420-integrated/mad-buds/`.
Canonical roadmap: `mad-buds/Docs/ROADMAP.md` in that source repository.
Approved animation assets: `abvhiael/420-integrated-v0.1/assets/arcade/mad-buds/kush-krusher/animations/`.

Current Godot foundation is a standalone, unqualified prototype. It demonstrates a launcher, a 2D rigid-body character, a timed once-per-shot Wrecking Ball modifier, a static collision target, HUD, and reset controls.

Remaining before claiming MB-2/MB-3 parity: port canonical physics parameters, launch-trajectory prediction, material/collision normalization, breakable structures, deterministic replay capture, bounds and resolution, shared lifecycle, presentation animation (15 approved sets), verified asset provenance, tests, cross-engine regression and gameplay acceptance.

IMPORTANT: Earlier Unity documentation defines engine constraints; changing engine must be an explicit migration decision, not a silent reinterpretation of accepted roadmap steps. No blockchain functionality is required for offline core gameplay. Do not mark MB-3 fully qualified on this proof of concept.
