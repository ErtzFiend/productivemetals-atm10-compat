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

### 2 · Misc metal items — *32 hand-written recipes*

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

<details open>
<summary><b>Misc vanilla items</b> — <i>new in 1.3.1</i></summary>

| Item | Recipe cost | Fluid | Yield |
|---|---|---|---:|
| Golden Carrot ✨ | 8 gold nuggets | molten gold | 80 mB |
| Lodestone ✨ | 8 chiseled stone bricks + 1 **netherite** ingot (1.21.1 recipe) | molten netherite | 90 mB |

> Lodestone note: the recipe only changed to an iron ingot in MC **1.21.5** — ATM10 runs **1.21.1**, so the melt yields netherite, not iron.

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
<summary><b>Plate-crafted items</b> — <i>new in 1.3.0 · 241 hand-written recipes</i></summary>

Rule: **1 metal plate = 1 ingot = 90 mB**. Yield = (plates × 90) ÷ recipe output count, rounded to 5 mB.
Covers every Create-family item crafted from metal plates: girders, item vaults, pipes, chutes,
toolboxes, catwalks, sheet metal, diving gear parts, thrusters, displays, and more.

| Item | Fluid | Yield |
|---|---|---:|
| `aeronautics_utility_objects:damping_stress_bearing` | copper | 90 mB |
| `aeronautics_utility_objects:hydraulic_connection_head` | iron | 90 mB |
| `aeronautics_utility_objects:hydraulic_hinge_head` | iron | 90 mB |
| `aeronautics_utility_objects:hydraulic_rod` | brass | 90 mB |
| `aeronautics_utility_objects:universal_joint_rod` | brass | 90 mB |
| `create:brown_toolbox` | gold | 90 mB |
| `create:chute` | iron | 20 mB |
| `create:copper_valve_handle` | copper | 90 mB |
| `create:desk_bell` | gold | 90 mB |
| `create:elevator_pulley` | iron | 90 mB |
| `create:fluid_pipe` | copper | 20 mB |
| `create:fluid_tank` | copper | 90 mB |
| `create:fluid_valve` | iron | 90 mB |
| `create:goggles` | gold | 90 mB |
| `create:hose_pulley` | copper | 90 mB |
| `create:item_vault` | iron | 90 mB |
| `create:mechanical_arm` | brass | 90 mB |
| `create:mechanical_harvester` | iron | 90 mB |
| `create:mechanical_plough` | iron | 90 mB |
| `create:mechanical_saw` | iron | 90 mB |
| `create:metal_girder` | iron | 10 mB |
| `create:minecart_coupling` | iron | 90 mB |
| `create:peculiar_bell` | brass | 90 mB |
| `create:placard` | brass | 90 mB |
| `create:precision_mechanism` | gold | 90 mB |
| `create:propeller` | iron | 90 mB |
| `create:pulse_extender` | brass | 90 mB |
| `create:pulse_repeater` | brass | 90 mB |
| `create:pulse_timer` | brass | 90 mB |
| `create:redstone_contact` | iron | 45 mB |
| `create:rope_pulley` | iron | 90 mB |
| `create:smart_chute` | brass | 90 mB |
| `create:smart_fluid_pipe` | brass | 90 mB |
| `create:steam_engine` | gold | 90 mB |
| `create:steam_whistle` | gold | 90 mB |
| `create:super_glue` | iron | 90 mB |
| `create:transmitter` | copper | 90 mB |
| `create:weighted_ejector` | gold | 90 mB |
| `create:whisk` | iron | 90 mB |
| `create:wrench` | gold | 90 mB |
| `create_aeronautics_toolgun:magnetic_gun` | copper | 90 mB |
| `create_aeronautics_toolgun:survival_structure_tool` | brass | 90 mB |
| `create_connected:brass_chute` | brass | 20 mB |
| `create_connected:centrifugal_clutch` | iron | 90 mB |
| `create_connected:control_chip` | gold | 90 mB |
| `create_connected:fluid_vessel` | copper | 90 mB |
| `create_connected:freewheel_clutch` | iron | 90 mB |
| `create_connected:item_silo` | iron | 90 mB |
| `create_connected:kinetic_battery` | iron | 10 mB |
| `create_connected:overstress_clutch` | iron | 90 mB |
| `create_connected:sequenced_pulse_generator` | brass | 90 mB |
| `create_dragons_plus:fragile_fluid_tank` | copper | 90 mB |
| `create_enchantment_industry:affix_augmentor` | brass | 90 mB |
| `create_enchantment_industry:infuser` | brass | 90 mB |
| `create_enchantment_industry:printer` | brass | 90 mB |
| `create_factory:black_jar` | iron | 90 mB |
| `create_factory:blue_jar` | iron | 90 mB |
| `create_factory:brown_jar` | iron | 90 mB |
| `create_factory:cyan_jar` | iron | 90 mB |
| `create_factory:gray_jar` | iron | 90 mB |
| `create_factory:green_jar` | iron | 90 mB |
| `create_factory:light_blue_jar` | iron | 90 mB |
| `create_factory:light_gray_jar` | iron | 90 mB |
| `create_factory:lime_jar` | iron | 90 mB |
| `create_factory:magenta_jar` | iron | 90 mB |
| `create_factory:orange_jar` | iron | 90 mB |
| `create_factory:pink_jar` | iron | 90 mB |
| `create_factory:purple_jar` | iron | 90 mB |
| `create_factory:red_jar` | iron | 90 mB |
| `create_factory:white_jar` | iron | 90 mB |
| `create_factory:yellow_jar` | iron | 90 mB |
| `create_factory_logistics:fluid_mechanism` | copper | 90 mB |
| `create_hypertube:hypertube` | brass | 5 mB |
| `create_hypertube:hypertube_funnel` | brass | 90 mB |
| `create_hypertube:hypertube_junction` | brass | 90 mB |
| `create_pattern_schematics:empty_pattern_schematic` | iron | 90 mB |
| `create_submarine:ballast_tank` | iron | 90 mB |
| `create_submarine:pulley` | iron | 90 mB |
| `create_submarine:steel_cable` | iron | 90 mB |
| `create_the_air_wars:rocket_engine` | copper | 90 mB |
| `create_things_and_misc:card_press` | brass | 360 mB |
| `create_things_and_misc:card_reader` | brass | 450 mB |
| `create_things_and_misc:empty_card` | copper | 90 mB |
| `create_things_and_misc:glue_packaging` | iron | 90 mB |
| `create_things_and_misc:portable_whistle` | gold | 180 mB |
| `create_things_and_misc:spout_gun` | copper | 90 mB |
| `createaddition:alternator` | iron | 90 mB |
| `createaddition:digital_adapter` | brass | 90 mB |
| `createaddition:electric_motor` | brass | 90 mB |
| `createaddition:electrum_amulet` | zinc | 90 mB |
| `createaddition:rolling_mill` | iron | 90 mB |
| `createaddition:tesla_coil` | brass | 90 mB |
| `createbigcannons:autocannon_ammo_container` | iron | 90 mB |
| `createbigcannons:big_cartridge_sheet` | brass | 20 mB |
| `createbigcannons:cannon_builder` | iron | 90 mB |
| `createbigcannons:cannon_mount` | iron | 90 mB |
| `createbigcannons:drop_mortar_shell` | iron | 90 mB |
| `createbigcannons:fixed_cannon_mount` | iron | 90 mB |
| `createbigcannons:flak_autocannon_round` | iron | 45 mB |
| `createbigcannons:pair_of_cannon_wheels` | iron | 45 mB |
| `createbigcannons:smoke_shell` | iron | 90 mB |
| `createbigcannons:wrought_iron_cannon_chamber` | iron | 90 mB |
| `createbigcannons:wrought_iron_cannon_end` | iron | 90 mB |
| `createbionics:anole_tail_item` | iron | 90 mB |
| `createbionics:oxhauler_head_item` | brass | 90 mB |
| `createbionics:replete_leg_item` | copper | 90 mB |
| `createbionics:simple_engine` | iron | 90 mB |
| `createdeco:andesite_bars_overlay` | iron | 5 mB |
| `createdeco:andesite_catwalk` | iron | 20 mB |
| `createdeco:andesite_catwalk_railing` | iron | 10 mB |
| `createdeco:andesite_hull` | iron | 45 mB |
| `createdeco:andesite_mesh_fence` | iron | 5 mB |
| `createdeco:andesite_sheet_metal` | iron | 20 mB |
| `createdeco:andesite_support_wedge` | iron | 30 mB |
| `createdeco:black_placard` | brass | 90 mB |
| `createdeco:black_shipping_container` | iron | 90 mB |
| `createdeco:blue_andesite_lamp` | iron | 90 mB |
| `createdeco:blue_brass_lamp` | brass | 90 mB |
| `createdeco:blue_copper_lamp` | copper | 90 mB |
| `createdeco:blue_industrial_iron_lamp` | iron | 90 mB |
| `createdeco:blue_iron_lamp` | iron | 90 mB |
| `createdeco:blue_placard` | brass | 90 mB |
| `createdeco:blue_shipping_container` | iron | 90 mB |
| `createdeco:blue_zinc_lamp` | zinc | 90 mB |
| `createdeco:brass_bars_overlay` | brass | 5 mB |
| `createdeco:brass_catwalk` | brass | 20 mB |
| `createdeco:brass_catwalk_railing` | brass | 10 mB |
| `createdeco:brass_hull` | brass | 45 mB |
| `createdeco:brass_mesh_fence` | brass | 5 mB |
| `createdeco:brass_sheet_metal` | brass | 20 mB |
| `createdeco:brass_support_wedge` | brass | 30 mB |
| `createdeco:brown_placard` | brass | 90 mB |
| `createdeco:brown_shipping_container` | iron | 90 mB |
| `createdeco:copper_bars_overlay` | copper | 5 mB |
| `createdeco:copper_catwalk` | copper | 20 mB |
| `createdeco:copper_catwalk_railing` | copper | 10 mB |
| `createdeco:copper_hull` | copper | 45 mB |
| `createdeco:copper_mesh_fence` | copper | 5 mB |
| `createdeco:copper_sheet_metal` | copper | 20 mB |
| `createdeco:copper_support_wedge` | copper | 30 mB |
| `createdeco:cyan_placard` | brass | 90 mB |
| `createdeco:cyan_shipping_container` | iron | 90 mB |
| `createdeco:gray_placard` | brass | 90 mB |
| `createdeco:gray_shipping_container` | iron | 90 mB |
| `createdeco:green_andesite_lamp` | iron | 90 mB |
| `createdeco:green_brass_lamp` | brass | 90 mB |
| `createdeco:green_copper_lamp` | copper | 90 mB |
| `createdeco:green_industrial_iron_lamp` | iron | 90 mB |
| `createdeco:green_iron_lamp` | iron | 90 mB |
| `createdeco:green_placard` | brass | 90 mB |
| `createdeco:green_shipping_container` | iron | 90 mB |
| `createdeco:green_zinc_lamp` | zinc | 90 mB |
| `createdeco:industrial_iron_bars_overlay` | iron | 5 mB |
| `createdeco:industrial_iron_catwalk` | iron | 20 mB |
| `createdeco:industrial_iron_catwalk_railing` | iron | 10 mB |
| `createdeco:industrial_iron_hull` | iron | 45 mB |
| `createdeco:industrial_iron_mesh_fence` | iron | 5 mB |
| `createdeco:industrial_iron_sheet_metal` | iron | 20 mB |
| `createdeco:industrial_iron_support_wedge` | iron | 30 mB |
| `createdeco:iron_bars_overlay` | iron | 5 mB |
| `createdeco:iron_catwalk` | iron | 20 mB |
| `createdeco:iron_catwalk_railing` | iron | 10 mB |
| `createdeco:iron_hull` | iron | 45 mB |
| `createdeco:iron_mesh_fence` | iron | 5 mB |
| `createdeco:iron_sheet_metal` | iron | 20 mB |
| `createdeco:iron_support_wedge` | iron | 30 mB |
| `createdeco:light_blue_placard` | brass | 90 mB |
| `createdeco:light_blue_shipping_container` | iron | 90 mB |
| `createdeco:light_gray_placard` | brass | 90 mB |
| `createdeco:light_gray_shipping_container` | iron | 90 mB |
| `createdeco:lime_placard` | brass | 90 mB |
| `createdeco:lime_shipping_container` | iron | 90 mB |
| `createdeco:magenta_placard` | brass | 90 mB |
| `createdeco:magenta_shipping_container` | iron | 90 mB |
| `createdeco:orange_placard` | brass | 90 mB |
| `createdeco:orange_shipping_container` | iron | 90 mB |
| `createdeco:pink_placard` | brass | 90 mB |
| `createdeco:pink_shipping_container` | iron | 90 mB |
| `createdeco:purple_placard` | brass | 90 mB |
| `createdeco:purple_shipping_container` | iron | 90 mB |
| `createdeco:red_andesite_lamp` | iron | 90 mB |
| `createdeco:red_brass_lamp` | brass | 90 mB |
| `createdeco:red_copper_lamp` | copper | 90 mB |
| `createdeco:red_industrial_iron_lamp` | iron | 90 mB |
| `createdeco:red_iron_lamp` | iron | 90 mB |
| `createdeco:red_placard` | brass | 90 mB |
| `createdeco:red_shipping_container` | iron | 90 mB |
| `createdeco:red_zinc_lamp` | zinc | 90 mB |
| `createdeco:white_shipping_container` | iron | 90 mB |
| `createdeco:yellow_andesite_lamp` | iron | 90 mB |
| `createdeco:yellow_brass_lamp` | brass | 90 mB |
| `createdeco:yellow_copper_lamp` | copper | 90 mB |
| `createdeco:yellow_industrial_iron_lamp` | iron | 90 mB |
| `createdeco:yellow_iron_lamp` | iron | 90 mB |
| `createdeco:yellow_placard` | brass | 90 mB |
| `createdeco:yellow_shipping_container` | iron | 90 mB |
| `createdeco:yellow_zinc_lamp` | zinc | 90 mB |
| `createdeco:zinc_bars_overlay` | zinc | 5 mB |
| `createdeco:zinc_catwalk` | zinc | 20 mB |
| `createdeco:zinc_catwalk_railing` | zinc | 10 mB |
| `createdeco:zinc_hull` | zinc | 45 mB |
| `createdeco:zinc_mesh_fence` | zinc | 5 mB |
| `createdeco:zinc_sheet_metal` | zinc | 20 mB |
| `createdeco:zinc_support_wedge` | zinc | 30 mB |
| `createpropulsion:cable` | platinum | 20 mB |
| `createpropulsion:liquid_burner` | copper | 90 mB |
| `createpropulsion:liquid_vector_thruster` | copper | 90 mB |
| `createpropulsion:platinum_fluid_tank` | platinum | 90 mB |
| `createpropulsion:platinum_fluid_vessel` | platinum | 90 mB |
| `createpropulsion:redstone_converter` | platinum | 90 mB |
| `createpropulsion:stirling_engine` | copper | 90 mB |
| `createpropulsion:tilt_adapter` | iron | 90 mB |
| `createpropulsion:vector_thruster` | platinum | 90 mB |
| `createpropulsion:wing` | iron | 20 mB |
| `createrailwaysnavigator:train_station_clock` | iron | 90 mB |
| `createthrusters:andesite_cable` | iron | 15 mB |
| `createthrusters:configuration_clipboard` | brass | 90 mB |
| `createthrusters:fuel_oxidizer` | brass | 90 mB |
| `createthrusters:powered_zipline` | brass | 90 mB |
| `createthrusters:processing_upgrade_haunting_t1` | brass | 90 mB |
| `createthrusters:processing_upgrade_haunting_t2` | brass | 180 mB |
| `createthrusters:processing_upgrade_haunting_t3` | brass | 90 mB |
| `createthrusters:processing_upgrade_haunting_t4` | brass | 90 mB |
| `createthrusters:processing_upgrade_smelting_t1` | brass | 90 mB |
| `createthrusters:processing_upgrade_smelting_t2` | brass | 180 mB |
| `createthrusters:processing_upgrade_smelting_t3` | brass | 90 mB |
| `createthrusters:processing_upgrade_smelting_t4` | brass | 90 mB |
| `createthrusters:processing_upgrade_smoking_t1` | brass | 90 mB |
| `createthrusters:processing_upgrade_smoking_t2` | brass | 180 mB |
| `createthrusters:processing_upgrade_smoking_t3` | brass | 90 mB |
| `createthrusters:processing_upgrade_smoking_t4` | brass | 90 mB |
| `immersiveengineering:blastbrick_reinforced` | steel | 90 mB |
| `sable_kardanwelle:cardan_connector` | iron | 20 mB |
| `create:track` | iron | 10 mB |
| `create:track_signal` | brass | 20 mB |
| `create:track_station` | brass | 45 mB |
| `create:track_observer` | brass | 45 mB |
| `create:sturdy_sheet` | obsidian | 250 mB |
| `immersiveengineering:concrete_leaded` | lead | 90 mB |
| `create:schedule` | obsidian | 65 mB |
| `createrailwaysnavigator:advanced_display` | obsidian | 40 mB |

Mixed-metal items (2+ different plates, e.g. capacitor, thrusters) are skipped — no honest single fluid.
`create:track` melts for 10 mB (its sequenced-assembly applies 2 nuggets per track).

</details>

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
