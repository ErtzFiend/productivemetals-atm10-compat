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

### 2 · Misc metal items — *30 hand-written recipes*

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
<summary><b>Bells 🔔</b> — <i>new in 1.1.0</i></summary>

| Item | Recipe cost | Fluid | Yield |
|---|---|---|---:|
| **Bell** ✨ | 6 gold + stick | molten gold | 540 mB |
| Create Peculiar Bell ✨ | brass block + brass plate (10 ingots) | molten brass | 900 mB |
| Create Haunted Bell ✨ | haunting of a Peculiar Bell | molten brass | 900 mB |
| Create Desk Bell ✨ | andesite casing + 1 gold plate | molten gold | 90 mB |
| BiblioCraft Desk Bell ✨ | 4 iron + button + redstone | molten iron | 360 mB |
| MCW Holidays Single Bell ✨ | 3 gold + 2 nuggets (3.2) | molten gold | 288 mB |
| MCW Holidays Couple Bells ✨ | 2 singles (6.4 gold) | molten gold | 576 mB |

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

<details open>
<summary><b>Create + Create addons</b> — <i>new in 1.2.0 · 49 hand-written recipes</i></summary>

| Item | Fluid | Yield |
|---|---|---:|
| `create:andesite_alloy` | iron | 10 mB |
| `create:andesite_alloy_block` | iron | 90 mB |
| `create:industrial_iron_block` | iron | 810 mB |
| `create:empty_blaze_burner` | iron | 90 mB |
| `create:electron_tube` | iron | 90 mB |
| `create:brass_hand` | brass | 90 mB |
| `create:copper_backtank` | copper | 900 mB |
| `create:copper_diving_helmet` | copper | 90 mB |
| `create:copper_diving_boots` | copper | 90 mB |
| `create:netherite_backtank` | netherite | 900 mB |
| `create:netherite_diving_helmet` | netherite | 90 mB |
| `create:netherite_diving_boots` | netherite | 90 mB |
| `create:railway_casing` | brass | 90 mB |
| `create:wand_of_symmetry` | brass | 90 mB |
| `create:extendo_grip` | brass | 180 mB |
| `createaddition:spool` | iron | 135 mB |
| `createaddition:iron_wire` | iron | 45 mB |
| `createaddition:gold_wire` | gold | 45 mB |
| `createaddition:copper_wire` | copper | 45 mB |
| `createaddition:electrum_wire` | electrum | 45 mB |
| `createaddition:electrum_rod` | electrum | 45 mB |
| `createaddition:iron_rod` | iron | 45 mB |
| `createaddition:gold_rod` | gold | 45 mB |
| `createaddition:copper_rod` | copper | 45 mB |
| `createaddition:brass_rod` | brass | 45 mB |
| `createaddition:gold_spool` | gold | 135 mB |
| `createaddition:copper_spool` | copper | 135 mB |
| `createaddition:electrum_spool` | electrum | 135 mB |
| `createdeco:industrial_iron_nugget` | iron | 10 mB |
| `createdeco:industrial_iron_ingot` | iron | 90 mB |
| `createdeco:industrial_iron_coin` | iron | 10 mB |
| `createdeco:industrial_iron_coinstack` | iron | 40 mB |
| `createdeco:iron_coin` | iron | 10 mB |
| `createdeco:iron_coinstack` | iron | 40 mB |
| `createdeco:gold_coin` | gold | 10 mB |
| `createdeco:gold_coinstack` | gold | 40 mB |
| `createdeco:copper_coin` | copper | 10 mB |
| `createdeco:copper_coinstack` | copper | 40 mB |
| `createdeco:brass_coin` | brass | 10 mB |
| `createdeco:brass_coinstack` | brass | 40 mB |
| `createdeco:zinc_coin` | zinc | 10 mB |
| `createdeco:zinc_coinstack` | zinc | 40 mB |
| `createdeco:netherite_coin` | netherite | 10 mB |
| `createdeco:netherite_coinstack` | netherite | 40 mB |
| `createbigcannons:cast_iron_nugget` | iron | 10 mB |
| `createbigcannons:cast_iron_ingot` | iron | 90 mB |
| `create_aquatic_ambitions:prismarine_alloy` | copper | 10 mB |
| `create_aquatic_ambitions:prismarine_alloy_block` | copper | 90 mB |
| `create_aquatic_ambitions:prismarine_alloy_rod` | copper | 10 mB |

Every yield is derived from the item's actual crafting cost (Create-family recipe JSONs, verified 2026-09-01):
ingot 90 mB · nugget/coin 10 · plate 90 · rod/wire 45 · storage block 810. Items PMW already covers via its own
tag melts (`#c:ingots/zinc`, `#c:ingots/steel`, `#c:ingots/bronze`, `#c:ingots/platinum`, plates, blocks, raw
materials — Create Zinc, Big Cannons steel/bronze, Create Propulsion platinum, Create Addition electrum) are
deliberately **not** re-added.

</details>

## 🙋 Missing a recipe?

**Open a [Recipe Request issue](https://github.com/ErtzFiend/productivemetals-atm10-compat/issues/new?template=recipe_request.yml)!**

Requests for new melting or casting recipes are very welcome — a mod item that won't
melt, a block missing from a family, a fluid that should cast into something. Fill in
the item ID(s) and the template handles the rest; yields are derived from crafting
costs so everything stays balanced. Good requests go straight into the next release.

## 🔧 Building

```bash
gradle build
```

Output: `build/libs/productivemetals-atm10-compat-1.0.0.jar`

## 📄 License

[MIT](LICENSE)
