# ATM10 Smelt Tweaks

A small NeoForge 1.21.1 companion mod for **All The Mods 10** that bundles a set of custom
**Productive Metalworks melting + casting recipes** as KubeJS scripts. It requires **KubeJS**.

The mod ships its KubeJS server scripts inside the jar. KubeJS 7 (1.21.1) does not load
scripts from mod jars, so on every server start the mod extracts them to
`kubejs/server_scripts/atm10_smelt_tweaks/` (idempotent — files are rewritten only when
their contents change). Removing the mod removes the recipe source.

- **Mod id**: `atm10smelttweaks`
- **Minecraft**: 1.21.1 (NeoForge 21.1.247)
- **Requires**: KubeJS (2101.7.x), Productive Metalworks (recipes reference its fluids)
- **Verified live**: loads with 0 KubeJS errors; the molten-carbon basin cast was
  functionally tested (basin filled with 900 mB → produced a coal block).

## What it adds

### 1. Tool & armor melting (scan loop — 259 recipes)

At server-script load the mod scans **every registered crafting recipe** (≈95,000) and,
for any tool/armor item whose crafting recipe uses a supported metal/gem, adds a
Productive Metalworks `item_melting` recipe that melts the item into that material's
molten fluid at `90 mB per ingot` / `100 mB per gem`, using standard equipment slot costs:

| Equipment | Ingots/gems consumed |
|---|---|
| Helmet | 5 |
| Chestplate | 8 |
| Leggings | 7 |
| Boots | 4 |
| Pickaxe | 3 |
| Axe | 3 |
| Sword | 2 |
| Hoe | 2 |
| Shovel | 1 |

Example: an iron chestplate (8 ingots in its crafting recipe) melts into
`8 × 90 = 720 mB` molten iron. A `golden_pickaxe` (3 ingots) melts into 270 mB molten gold.

**Supported materials** (any crafting-recipe tool/armor made from them is meltable):

- Metals (90 mB/ingot): iron, gold (`golden_*` items included), copper, netherite, obsidian,
  glowstone, blaze, ender, slime, magma, aluminum, brass, bronze, constantan, electrum,
  enderium, invar, iridium, lead, lumium, nickel, osmium, platinum, signalum, silver,
  steel, tin, uranium, zinc
- Gems (100 mB/unit): diamond, emerald, amethyst, lapis, quartz, redstone
- ATM trio (3000 K): allthemodium, vibranium, unobtainium (`allthemodium:molten_*` fluids)

Vanilla netherite gear (smithing-only, no crafting recipe) is hard-coded at the same slot
costs. Live-load result on ATM10: **259 recipes added**, no failures
(per-metal: copper 88, iron 30, silver 23, bronze 17, netherite 16, steel 18, gold 13,
diamond 13, osmium 9, lapis 9, amethyst 4, aluminum 4, ender 4, lead 3, blaze 2, slime 1).

### 2. Hand-written melting recipes (25)

All `productivemetalworks:item_melting`, minimum temperature 1000 K unless noted.

**Iron items** (90 mB per ingot of iron in the item's crafting recipe):

| Item | Yield (molten iron) |
|---|---|
| Cauldron (7 ingots) | 630 mB |
| Bucket (3) | 270 mB |
| Anvil (31) | 2790 mB |
| Chipped Anvil | 2790 mB |
| Damaged Anvil | 2790 mB |
| Minecart (5) | 450 mB |
| Chest Minecart (5) | 450 mB |
| Hopper Minecart (10) | 900 mB |
| Furnace Minecart (10) | 900 mB |
| TNT Minecart (5) | 450 mB |
| Command Block Minecart (5) | 450 mB |
| Crossbow (1) | 90 mB |

**Gold items** (apple itself not metal):

| Item | Yield (molten gold) |
|---|---|
| Golden Apple (8 ingots) | 720 mB |
| Enchanted Golden Apple (72) | 6480 mB |

**Quartz blocks** (4 quartz each, 100 mB/gem):

| Item | Yield (molten quartz) |
|---|---|
| Quartz Block | 400 mB |
| Chiseled Quartz Block | 400 mB |
| Quartz Pillar | 400 mB |
| Quartz Bricks | 400 mB |
| Smooth Quartz | 400 mB |
| Quartz Stairs (3 quartz) | 300 mB |
| Quartz Slab (2 quartz) | 200 mB |
| Smooth Quartz Stairs (3) | 300 mB |
| Smooth Quartz Slab (2) | 200 mB |

The last two filled a real gap: quartz stairs/slabs previously could not be melted
while their full block could — an audit of all stair/slab variants of meltable
materials found smooth-quartz stairs/slabs were the only remaining holes.

### 3. Molten carbon → coal block basin cast

`productivemetalworks:block_casting`: **900 mB `productivemetalworks:molten_carbon`**
in a casting basin (no cast item) produces **1 `minecraft:coal_block`**.

This is the exact inverse of Productive Metalworks' own coal-block melt
(`melting/storage_blocks/coals.json`: coal block → 900 mB molten carbon), so the
round trip is lossless. Previously, pouring molten carbon into a casting basin did
nothing.

## Building

```
./gradlew build
```

Output: `build/libs/atm10-smelt-tweaks-1.0.0.jar`. Drop it in `mods/` — it needs KubeJS
and Productive Metalworks on the server. On first start it writes its scripts to
`kubejs/server_scripts/atm10_smelt_tweaks/`; you can inspect or tweak them there.

## License

MIT
