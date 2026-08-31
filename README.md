<div align="center">

# ProductiveMetals ATM10 Compat

**A NeoForge 1.21.1 companion mod for [All The Mods 10](https://www.curseforge.com/minecraft/modpacks/all-the-mods-10)**

Custom [Productive Metalworks](https://www.curseforge.com/minecraft/mc-mods/productive-metalworks) melting & casting recipes, bundled as KubeJS scripts.

*Requires* ![KubeJS](https://img.shields.io/badge/requires-KubeJS-blue) ![PMW](https://img.shields.io/badge/requires-Productive%20Metalworks-blue) ![MC](https://img.shields.io/badge/Minecraft-1.21.1-green) ![NeoForge](https://img.shields.io/badge/NeoForge-21.1.x-orange)

</div>

---

## ✨ What it does

> [!TIP]
> Everything here is standard **Productive Metalworks** `item_melting` / `block_casting` recipes — they show up in EMI/JEI automatically and work with PMW's own automation (spouts, item silos, etc.).

- 🔨 **Melts every tool & armor piece** into its crafting material's molten fluid — dynamically scanned from the recipe book
- 🪣 **Melts misc metal items** PMW forgot: cauldrons, buckets, anvils, minecarts, crossbows, golden apples
- 🟪 **Completes the quartz family** — stairs & slabs were missing melt values (now all 9 quartz blocks melt)
- ⚫ **Molten carbon → coal block** in the casting basin (previously did nothing)

## 📦 Installation

1. Install **KubeJS** and **Productive Metalworks** (both required)
2. Drop the jar from [Releases](../../releases) into your `mods/` folder
3. On first server start the mod extracts its scripts to `kubejs/server_scripts/productivemetals_atm10_compat/` — inspect or tweak them there

> [!NOTE]
> KubeJS 7 does not load scripts from mod jars, so the mod re-extracts its bundled scripts on every start (only rewriting files whose contents changed). Removing the mod removes the recipes.

---

## 🍳 Recipes

### 1 · Tool & armor melting — *259 recipes, auto-scanned*

At load time the mod scans **every registered crafting recipe** (~95,000 on ATM10). Any tool or armor piece whose crafting recipe uses a supported material gets a melt recipe at PMW's standard rates:

| Fluid yield | Rate |
|---|---:|
| Metals | **90 mB / ingot** |
| Gems | **100 mB / gem** |
| ATM trio | 3000 K, `allthemodium:molten_*` fluids |

| Equipment | Material cost | | Equipment | Material cost |
|---|---:|---|---|---:|
| ⛑️ Helmet | 5 | | ⛏️ Pickaxe | 3 |
| 👕 Chestplate | 8 | | 🪓 Axe | 3 |
| 👖 Leggings | 7 | | ⚔️ Sword | 2 |
| 🥾 Boots | 4 | | 🚗 Hoe | 2 |
| | | | 🥄 Shovel | 1 |

**Examples:** iron chestplate → `8 × 90 = 720 mB` molten iron · golden pickaxe → `270 mB` molten gold

<details>
<summary><b>Supported materials (38)</b></summary>

| Type | Materials |
|---|---|
| **Metals** (90 mB/ingot) | iron, gold (`golden_*` items), copper, netherite, obsidian, glowstone, blaze, ender, slime, magma, aluminum, brass, bronze, constantan, electrum, enderium, invar, iridium, lead, lumium, nickel, osmium, platinum, signalum, silver, steel, tin, uranium, zinc |
| **Gems** (100 mB/unit) | diamond, emerald, amethyst, lapis, quartz, redstone |
| **ATM trio** (3000 K) | allthemodium, vibranium, unobtainium |

</details>

> [!NOTE]
> Vanilla netherite gear has no crafting recipe (smithing-only), so those 9 pieces are hard-coded at the same slot costs.

**Live result on ATM10:** 259 recipes added, 0 failures —
copper 88 · iron 30 · silver 23 · steel 18 · bronze 17 · netherite 16 · gold 13 · diamond 13 · osmium 9 · lapis 9 · amethyst 4 · aluminum 4 · ender 4 · lead 3 · blaze 2 · slime 1

### 2 · Misc metal items — *25 hand-written recipes*

All `productivemetalworks:item_melting`, minimum temperature 1000 K.

<details open>
<summary><b>Iron items</b> — molten iron, 90 mB per ingot of the crafting recipe</summary>

| Item | Recipe cost | Yield |
|---|---:|---:|
| Cauldron | 7 ingots | 630 mB |
| Bucket | 3 | 270 mB |
| Anvil (also Chipped / Damaged) | 31 | 2790 mB |
| Minecart | 5 | 450 mB |
| Chest Minecart | 5 | 450 mB |
| Hopper Minecart | 10 | 900 mB |
| Furnace Minecart | 10 | 900 mB |
| TNT Minecart | 5 | 450 mB |
| Command Block Minecart | 5 | 450 mB |
| Crossbow | 1 | 90 mB |

</details>

<details>
<summary><b>Gold items</b> — molten gold (the apple itself isn't metal)</summary>

| Item | Recipe cost | Yield |
|---|---:|---:|
| Golden Apple | 8 ingots | 720 mB |
| Enchanted Golden Apple | 72 | 6480 mB |

</details>

<details open>
<summary><b>Quartz family</b> — molten quartz, 4 quartz per block</summary>

| Item | Quartz | Yield |
|---|---:|---:|
| Quartz Block | 4 | 400 mB |
| Chiseled Quartz Block | 4 | 400 mB |
| Quartz Pillar | 4 | 400 mB |
| Quartz Bricks | 4 | 400 mB |
| Smooth Quartz | 4 | 400 mB |
| Quartz Stairs | 3 | 300 mB |
| Quartz Slab | 2 | 200 mB |
| **Smooth Quartz Stairs** ✨ | 3 | 300 mB |
| **Smooth Quartz Slab** ✨ | 2 | 200 mB |

</details>

> ✨ **Filled a real gap** — an audit of every stair/slab variant of every meltable material found smooth-quartz stairs/slabs were the only blocks that could be crafted but never melted back.

### 3 · Molten carbon → coal block — *basin casting*

```
productivemetalworks:block_casting

  Casting Basin + 900 mB molten carbon  ──▶  1 × Coal Block
```

> [!IMPORTANT]
> This is the **exact inverse** of PMW's own coal-block melt (coal block → 900 mB molten carbon), so the round trip is **lossless** — no duplication, no loss. Before this recipe, pouring molten carbon into a basin did nothing.

---

## 🔧 Building

```bash
gradle build
```

Output: `build/libs/productivemetals-atm10-compat-1.0.0.jar`

## 📄 License

[MIT](LICENSE)
