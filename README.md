# ProductiveMetals ATM10 Compat

Extra [Productive Metalworks](https://www.curseforge.com/minecraft/mc-mods/productive-metalworks)
melting and casting recipes for [All The Mods 10](https://www.curseforge.com/minecraft/modpacks/all-the-mods-10)
(NeoForge 1.21.1), delivered as KubeJS scripts in a small mod jar.

Everything here is standard `productivemetalworks:item_melting` / `block_casting` recipes, so
they're visible in EMI and work with PMW's normal automation.

## What it adds

Yields always match the item's crafting cost — no free material. Base rates are 90 mB per
ingot, 100 mB per gem.

| Script | What it melts |
|---|---|
| `smelt_tools_and_armor.js` | Every tool, armor & glove piece, detected by scanning all crafting recipes at load (231 recipes on a loaded ATM10 world). Smithing-only gear (vanilla netherite, Aether's netherite gloves) is listed by hand since it has no crafting recipe. |
| `smelt_tools_and_armor.js` (foundry section) | Misc items with no tool slot: cauldrons, buckets, anvils, shears, minecarts, crossbows, golden apples/carrots, bells, lodestone, copper horse armor (all oxidation/waxed states), the full quartz block family. |
| `smelt_create.js` | Create-family items: andesite alloy, diving gear, casing, coins, wires, rods, spools (49 recipes). |
| `smelt_create_plates.js` | Create-family items crafted from metal plates — girders, vaults, pipes, chutes, toolboxes, catwalks, thrusters, etc. (239 recipes). 1 plate = 1 ingot; yield = (plates x 90) ÷ recipe output count, floored to the nearest 5 mB. |
| `carbon_basin_cast.js` | 900 mB molten carbon → coal block in the casting basin (the exact inverse of PMW's own coal-block melt). |

Slot costs for armor/tools: helmet 5, chestplate 8, leggings 7, boots 4, pickaxe 3, axe 3,
sword 2, hoe 2, shovel 1, gloves 2 (the Aether-style "# #" two-piece craft) — in ingots
(or gems at 100 mB/unit).

Items made from two or more different metals are skipped — there's no honest single fluid
for them.

## Install

1. Install KubeJS and Productive Metalworks (both required).
2. Drop the jar from [Releases](../../releases) into `mods/`.
3. On the first server start the mod writes its scripts to
   `kubejs/server_scripts/productivemetals_atm10_compat/`. You can edit them there.

KubeJS 7 won't load scripts from inside a mod jar, so the mod re-extracts its bundled
scripts on every start (only rewriting files whose content changed). Removing the mod
removes the recipes.

## Missing a recipe?

Open a [recipe request issue](../../issues/new?template=recipe_request.yml) with the item
ID and the template handles the rest. Requests are usually picked up quickly — good ones
go straight into the next release.

## Building

```bash
gradle build
```

Output lands in `build/libs/productivemetals-atm10-compat-<version>.jar`.

## License

[MIT](LICENSE)