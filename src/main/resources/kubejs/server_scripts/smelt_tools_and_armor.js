// smelt_tools_and_armor.js
// Scans every crafting recipe at load and adds a Productive Metalworks melt for any
// tool or armor piece whose recipe is made of a single meltable material.
//
// Rates: 90 mB per ingot, 100 mB per gem unit. Slot costs (ingots): pickaxe 3, axe 3,
// shovel 1, hoe 2, sword 2, helmet 5, chestplate 8, leggings 7, boots 4.
//
// Runtime notes (KubeJS 2101.7.x on NeoForge 1.21.1, probe-verified):
//   - event.originalRecipes holds RAW vanilla Recipe objects. The recipe type only
//     appears in String(recipe) as "id[type]", the output is recipe.originalRecipeResult,
//     and ingredients don't resolve via getItems() - so the metal is read from the recipe
//     JSON instead ("key" for shaped, "ingredients" for shapeless, ingredient-holder keys
//     as fallback).
//   - Rhino hoists `const` inside loop bodies to function scope and re-declares it on the
//     next iteration, which throws. Loop variables are therefore declared once per
//     function and analysis lives in analyzeRecipe(), whose locals are fresh per call.
//   - Vanilla netherite gear is smithing-only (no crafting recipe to scan), so those nine
//     pieces are listed explicitly below.

const VOLUME_PER_INGOT = 90
const VOLUME_PER_GEM = 100

// metal name -> { fluid, temperature, gem? } (fluid ids follow Productive Metalworks
// / Allthemodium conventions; the ATM trio melts at 3000 K, everything else at 1000)
const METALS = {
    iron:      { fluid: 'productivemetalworks:molten_iron',      temp: 1000 },
    gold:      { fluid: 'productivemetalworks:molten_gold',      temp: 1000 },
    copper:    { fluid: 'productivemetalworks:molten_copper',    temp: 1000 },
    netherite: { fluid: 'productivemetalworks:molten_netherite', temp: 1000 },
    diamond:   { fluid: 'productivemetalworks:molten_diamond',   temp: 1000, gem: true },
    emerald:   { fluid: 'productivemetalworks:molten_emerald',   temp: 1000, gem: true },
    amethyst:  { fluid: 'productivemetalworks:molten_amethyst',  temp: 1000, gem: true },
    lapis:     { fluid: 'productivemetalworks:molten_lapis',     temp: 1000, gem: true },
    quartz:    { fluid: 'productivemetalworks:molten_quartz',    temp: 1000, gem: true },
    redstone:  { fluid: 'productivemetalworks:molten_redstone',  temp: 1000, gem: true },
    obsidian:  { fluid: 'productivemetalworks:molten_obsidian',  temp: 1000 },
    glowstone: { fluid: 'productivemetalworks:molten_glowstone', temp: 1000 },
    magma:     { fluid: 'productivemetalworks:molten_magma_cream', temp: 1000 },
    blaze:     { fluid: 'productivemetalworks:molten_blaze',     temp: 1000 },
    ender:     { fluid: 'productivemetalworks:molten_ender',     temp: 1000 },
    slime:     { fluid: 'productivemetalworks:molten_slime',     temp: 1000 },
    aluminum:  { fluid: 'productivemetalworks:molten_aluminum',  temp: 1000 },
    brass:     { fluid: 'productivemetalworks:molten_brass',     temp: 1000 },
    bronze:    { fluid: 'productivemetalworks:molten_bronze',    temp: 1000 },
    constantan: { fluid: 'productivemetalworks:molten_constantan', temp: 1000 },
    electrum:  { fluid: 'productivemetalworks:molten_electrum',  temp: 1000 },
    enderium:  { fluid: 'productivemetalworks:molten_enderium',  temp: 1000 },
    invar:     { fluid: 'productivemetalworks:molten_invar',     temp: 1000 },
    iridium:   { fluid: 'productivemetalworks:molten_iridium',   temp: 1000 },
    lead:      { fluid: 'productivemetalworks:molten_lead',      temp: 1000 },
    lumium:    { fluid: 'productivemetalworks:molten_lumium',    temp: 1000 },
    nickel:    { fluid: 'productivemetalworks:molten_nickel',    temp: 1000 },
    osmium:    { fluid: 'productivemetalworks:molten_osmium',    temp: 1000 },
    platinum:  { fluid: 'productivemetalworks:molten_platinum',  temp: 1000 },
    signalum:  { fluid: 'productivemetalworks:molten_signalum',  temp: 1000 },
    silver:    { fluid: 'productivemetalworks:molten_silver',    temp: 1000 },
    steel:     { fluid: 'productivemetalworks:molten_steel',     temp: 1000 },
    tin:       { fluid: 'productivemetalworks:molten_tin',       temp: 1000 },
    uranium:   { fluid: 'productivemetalworks:molten_uranium',   temp: 1000 },
    zinc:      { fluid: 'productivemetalworks:molten_zinc',      temp: 1000 },
    allthemodium: { fluid: 'allthemodium:molten_allthemodium', temp: 3000 },
    vibranium: { fluid: 'allthemodium:molten_vibranium', temp: 3000 },
    unobtainium: { fluid: 'allthemodium:molten_unobtainium', temp: 3000 },
}

// vanilla (and many mods) name gold items "golden_*": golden_chestplate, golden_pickaxe...
const ALIASES = { golden: 'gold' }

const COUNT_BY_SLOT = {
    pickaxe: 3, axe: 3, shovel: 1, hoe: 2, sword: 2,
    helmet: 5, chestplate: 8, leggings: 7, boots: 4,
    gloves: 2,  // Aether-style "# #" gloves: 2 ingots / 2 gems
}

// smithing-only gear has no crafting recipe, so the scan can never see it
const NETHERITE_GEAR = {
    'minecraft:netherite_pickaxe': 3, 'minecraft:netherite_axe': 3, 'minecraft:netherite_shovel': 1,
    'minecraft:netherite_hoe': 2, 'minecraft:netherite_sword': 2,
    'minecraft:netherite_helmet': 5, 'minecraft:netherite_chestplate': 8,
    'minecraft:netherite_leggings': 7, 'minecraft:netherite_boots': 4,
    'aether:netherite_gloves': 2,  // smithing of diamond_gloves + netherite ingot
}

function nameOf(id) {
    return String(id).split(':').pop()
}

// suffix-token matching only -- substring matches ('hat' in 'hatch', 'boots' in
// 'boots_tome') invent melting recipes for machine hatches and books
function getToolType(id) {
    var name = nameOf(id)
    if (name === 'pickaxe' || name.endsWith('_pickaxe')) return 'pickaxe'
    if (name === 'axe' || name.endsWith('_axe') || name.endsWith('axe') || name.endsWith('_hatchet')) return 'axe'
    if (name === 'shovel' || name.endsWith('_shovel')) return 'shovel'
    if (name === 'hoe' || name.endsWith('_hoe')) return 'hoe'
    if (name === 'sword' || name.endsWith('_sword')) return 'sword'
    return null
}

function getArmorType(id) {
    var name = nameOf(id)
    // helmet-class: _helmet/_hat/_mask/_crown/_hood (a kitchen_hood melting is
    // acceptable noise: the block is made of ingots)
    if (name === 'helmet' || name.endsWith('_helmet') || name.endsWith('_hat') || name.endsWith('_mask') || name.endsWith('_crown') || name.endsWith('_hood')) return 'helmet'
    if (name === 'chestplate' || name.endsWith('_chestplate') || name.endsWith('_body') || name.endsWith('_tunic')) return 'chestplate'
    if (name === 'leggings' || name.endsWith('_leggings') || name.endsWith('_pants')) return 'leggings'
    if (name === 'boots' || name.endsWith('_boots') || name.endsWith('_shoes')) return 'boots'
    if (name === 'gloves' || name.endsWith('_gloves')) return 'gloves'
    return null
}

// item id -> metal. Glass is never the tool's material (keeps #c:glass_blocks out).
function metalFromId(id) {
    var name = nameOf(id)
    if (!name || name.includes('glass')) return null
    for (const alias of Object.keys(ALIASES)) {
        if (name === alias || name.startsWith(alias + '_')) return ALIASES[alias]
    }
    for (const metal of Object.keys(METALS)) {
        if (name === metal) return metal               // minecraft:diamond
        if (name === metal + '_ingot') return metal    // minecraft:iron_ingot
        if (name.endsWith('_' + metal)) return metal
        if (name.startsWith(metal + '_')) return metal // netherite_chestplate, copper_sword
    }
    return null
}

// tag id -> metal (c:ingots/gold -> gold, c:gems/diamond -> diamond)
function metalFromTag(tagId) {
    var parts = String(tagId).split('/')
    var last = parts[parts.length - 1]
    return (last && last in METALS) ? last : null
}

// JsonObject ingredient ({item: ...} or {tag: ...}) -> metal
function metalFromJsonObj(obj) {
    if (!obj) return null
    try { if (obj.has('item')) return metalFromId(obj.get('item').getAsString()) } catch (e) {}
    try { if (obj.has('tag')) return metalFromTag(obj.get('tag').getAsString()) } catch (e) {}
    return null
}

// two different metals in one recipe -> MULTI (no honest single fluid, skip the item)
function mergeMetal(cur, next) {
    if (!cur) return next
    return cur === next ? cur : 'MULTI'
}

// --- scan one recipe and return an object when it should melt ---
function analyzeRecipe(recipe, errors) {
    // Rhino hoists let/const in this function to enclosing scope and throws
    // "redeclaration" when the function runs again, so use var (legal to redeclare)
    // and declare everything up front.
    var typeMatch, type, resultStack, outId, slot
    var metal = null
    var keyObj, entry, value, el, matched, arrObj, json
    var ingredients, ing, holders, holder, loc

    if (!recipe) return null

    // recipe type lives only in toString(): "id[type]"
    typeMatch = /\[([^\]]+)\]$/.exec(String(recipe))
    if (!typeMatch) return null
    type = typeMatch[1]
    if (type !== 'minecraft:crafting_shaped' && type !== 'minecraft:crafting_shapeless') return null

    resultStack = recipe.originalRecipeResult
    if (!resultStack) return null
    outId = String(resultStack.id)
    if (!outId || outId === 'minecraft:air') return null

    slot = getToolType(outId) || getArmorType(outId)
    if (!slot) return null

    // Rhino: loop-local values are declared once here, assigned inside the loops
    json = null
    try {
        json = recipe.originalJson
        if (json) {
            keyObj = json.get('key')
            if (keyObj && keyObj.isJsonObject()) {
                for (entry of keyObj.entrySet()) {
                    value = entry.getValue()
                    if (value && value.isJsonObject()) {
                        matched = metalFromJsonObj(value.getAsJsonObject())
                        if (matched) metal = mergeMetal(metal, matched)
                    }
                }
            }
            arrObj = json.get('ingredients')
            if (arrObj && arrObj.isJsonArray()) {
                for (el of arrObj) {
                    if (el && el.isJsonObject()) {
                        matched = metalFromJsonObj(el.getAsJsonObject())
                        if (matched) metal = mergeMetal(metal, matched)
                    }
                }
            }
        }
    } catch (e) {
        if (errors.length < 10) errors.push('jsonPath: ' + String(e))
    }

    if (!metal) {
        ingredients = recipe.originalRecipeIngredients
        if (ingredients) {
            for (ing of ingredients) {
                if (!ing) continue
                try {
                    holders = ing.getValues()
                    if (holders) {
                        for (holder of holders) {
                            try {
                                loc = String(holder.getKey().location())
                                matched = metalFromId(loc)
                                if (matched) metal = mergeMetal(metal, matched)
                            } catch (e) {}
                        }
                    }
                } catch (e) {}
            }
        }
    }

    if (!metal || metal === 'MULTI') return null
    return { outId: outId, slot: slot, metal: metal }
}

ServerEvents.recipes(event => {
    // NOTE: event.recipes is the recipe-BUILDER namespace. The registry itself is
    // event.originalRecipes (Map<ResourceLocation, Recipe>), value type RAW vanilla
    // Recipe -- kjs$getType()/type do not exist on them.
    const values = (event.originalRecipes && event.originalRecipes.values) ? event.originalRecipes.values() : []
    const toAdd = []
    const perMetal = {}
    const errors = []
    let count = 0
    let skipped = 0
    let goldChestplate = false
    let recipe, result, info, meta, itemId, units, slot, id, lanState, lanWaxed, lanColor, lanMeta,
        rcState, rcWaxed, rcFam, rcK, rail, results, rMeta, arsLan, chState, chWaxed, uMeta,
        sMeta, lMeta

    for (recipe of values) {
        count++
        try {
            result = analyzeRecipe(recipe, errors)
            if (!result) continue
            info = METALS[result.metal]
            if (!info) continue
            toAdd.push({
                type: 'productivemetalworks:item_melting',
                ingredient: { item: result.outId },
                minimum_temperature: info.temp,
                maximum_temperature: 0,
                result: [{ id: info.fluid, amount: COUNT_BY_SLOT[result.slot] * (info.gem ? VOLUME_PER_GEM : VOLUME_PER_INGOT) }],
                // full path: different mods share item names (three copper shovels exist)
                id: 'allthemods:productive_metalworks/melting/' + result.slot + '/' + result.metal + '/' + result.outId.replace(':', '/'),
            })
            perMetal[result.metal] = (perMetal[result.metal] || 0) + 1
            if (result.outId === 'minecraft:golden_chestplate' && result.metal === 'gold') goldChestplate = true
        } catch (e) {
            skipped++
            if (errors.length < 10) errors.push(String(e))
        }
    }

    // netherite gear has no crafting recipe to scan; same slot costs apply
    info = METALS.netherite
    for (itemId of Object.keys(NETHERITE_GEAR)) {
        units = NETHERITE_GEAR[itemId]
        slot = getToolType(itemId) || getArmorType(itemId)
        if (!slot) continue
        toAdd.push({
            type: 'productivemetalworks:item_melting',
            ingredient: { item: itemId },
            minimum_temperature: info.temp,
            maximum_temperature: 0,
            result: [{ id: info.fluid, amount: units * VOLUME_PER_INGOT }],
            id: 'allthemods:productive_metalworks/melting/' + slot + '/netherite/' + itemId.split(':').pop(),
        })
        perMetal.netherite = (perMetal.netherite || 0) + 1
    }

    // utensils and odd items the name scan can never catch (no tool/armor slot).
    // yields = crafting cost of the item; [item, metal, mB, id-suffix]
    const FOUNDRY = [
        ['minecraft:cauldron', 'iron', 630, 'cauldron/iron'],                  // 7 ingots
        ['minecraft:bucket', 'iron', 270, 'bucket/iron'],                      // 3 ingots
        ['minecraft:anvil', 'iron', 2790, 'anvil/iron'],                       // 31 ingots
        ['minecraft:chipped_anvil', 'iron', 2790, 'anvil/iron/chipped'],
        ['minecraft:damaged_anvil', 'iron', 2790, 'anvil/iron/damaged'],
        ['minecraft:shears', 'iron', 180, 'shears/iron'],                      // 2 ingots
        ['everythingcopper:copper_horse_armor', 'copper', 540, 'horse_armor/copper'], // 6 ingots; one item id covers all oxidation/waxed states (NBT)
        ['minecraft:crossbow', 'iron', 90, 'crossbow/iron'],                   // 1 iron ingot
        ['minecraft:minecart', 'iron', 450, 'minecart/iron'],                  // 5 ingots
        ['minecraft:chest_minecart', 'iron', 450, 'minecart/iron/chest'],
        ['minecraft:hopper_minecart', 'iron', 900, 'minecart/iron/hopper'],    // + hopper
        ['minecraft:furnace_minecart', 'iron', 900, 'minecart/iron/furnace'],  // + furnace
        ['minecraft:tnt_minecart', 'iron', 450, 'minecart/iron/tnt'],
        ['minecraft:command_block_minecart', 'iron', 450, 'minecart/iron/command_block'],
        ['minecraft:golden_apple', 'gold', 720, 'apple/gold'],                 // 8 ingots
        ['minecraft:enchanted_golden_apple', 'gold', 6480, 'apple/gold/enchanted'],
        ['minecraft:golden_carrot', 'gold', 80, 'carrot/gold'],                // 8 nuggets
        ['minecraft:bell', 'gold', 540, 'bell/gold'],                          // 6 gold + stick
        ['minecraft:lodestone', 'netherite', 90, 'lodestone/netherite'],       // 1.21.1 recipe: 1 netherite ingot
        ['minecraft:quartz_block', 'quartz', 400, 'quartz/block'],
        ['minecraft:chiseled_quartz_block', 'quartz', 400, 'quartz/chiseled'],
        ['minecraft:quartz_pillar', 'quartz', 400, 'quartz/pillar'],
        ['minecraft:quartz_bricks', 'quartz', 400, 'quartz/bricks'],
        ['minecraft:smooth_quartz', 'quartz', 400, 'quartz/smooth'],
        ['minecraft:quartz_stairs', 'quartz', 300, 'quartz/stairs'],           // 3 quartz
        ['minecraft:quartz_slab', 'quartz', 200, 'quartz/slab'],               // 2 quartz
        ['minecraft:smooth_quartz_stairs', 'quartz', 300, 'quartz/smooth_stairs'],
        ['minecraft:smooth_quartz_slab', 'quartz', 200, 'quartz/smooth_slab'],
        ['create:peculiar_bell', 'brass', 900, 'bell/brass/peculiar'],         // brass block + plate
        ['create:haunted_bell', 'brass', 900, 'bell/brass/haunted'],
        ['create:desk_bell', 'gold', 90, 'bell/gold/desk'],                    // andesite casing + gold plate
        ['bibliocraft:desk_bell', 'iron', 360, 'bell/iron/bibliocraft_desk'],  // 4 iron + button + redstone
        ['mcwholidays:single_bell', 'gold', 288, 'bell/gold/mcw_single'],      // 3 gold + 2 nuggets
        ['mcwholidays:couple_bells', 'gold', 576, 'bell/gold/mcw_couple'],     // 2 singles
    ]
    for (meta of FOUNDRY) {
        toAdd.push({
            type: 'productivemetalworks:item_melting',
            ingredient: { item: meta[0] },
            minimum_temperature: 1000,
            maximum_temperature: 0,
            result: [{ id: METALS[meta[1]].fluid, amount: meta[2] }],
            id: 'allthemods:productive_metalworks/foundry/' + meta[3],
        })
    }

    // --- smithing tables, flint & steel, chains (v1.6.0) ---
    // All slot-less utility items, hand-written yields from each crafting recipe's
    // metal share (ingot 90 mB, nugget 10 mB). Excluded: items whose material has no
    // PMW molten fluid (enderio soul_chain = soularium, enderio cold_fire_igniter =
    // dark_steel, forbidden_arcanus deorum_chain, eternal_starlight chain_of_souls,
    // twilightforest block_and_chain = knightmetal) -- honest melts only.
    // [item, [[metal, mB], ...], suffix]
    const UTILITY = [
        ['minecraft:smithing_table', [['iron', 180]], 'smithing_table/vanilla'],          // 2 iron ingots
        ['crafting_on_a_stick:smithing_table', [['iron', 180]], 'smithing_table/on_a_stick'], // + stick (wood, unmelted)
        ['minecraft:flint_and_steel', [['iron', 90]], 'flint_and_steel/vanilla'],         // 1 iron ingot
        ['minecraft:chain', [['iron', 110]], 'chain/vanilla'],                            // 1 ingot + 2 nuggets
        ['iceandfire:chain', [['iron', 330]], 'chain/iceandfire'],                        // 3 vanilla chains
        ['iceandfire:chain_sticky', [['iron', 110]], 'chain/iceandfire/sticky'],          // 1 chain + slime ball
        ['mcwlights:copper_chain', [['copper', 90]], 'chain/mcw/copper'],                 // 3 ingots -> 3 chains
        ['mcwlights:golden_chain', [['gold', 90]], 'chain/mcw/golden'],                   // 3 ingots -> 3 chains
        ['bibliocraft:gold_chain', [['gold', 110]], 'chain/bibliocraft/gold'],            // 1 ingot + 2 nuggets
        ['ars_additions:golden_chain', [['iron', 20], ['gold', 90]], 'chain/ars/golden'], // 2 iron nuggets + gold ingot
        ['ars_additions:archwood_chain', [['iron', 20]], 'chain/ars/archwood'],           // 2 iron nuggets
        ['ars_additions:sourcestone_chain', [['iron', 20]], 'chain/ars/sourcestone'],
        ['ars_additions:polished_sourcestone_chain', [['iron', 20]], 'chain/ars/polished_sourcestone'],
    ]
    // everythingcopper chains: 8 items (oxidation x waxed states), NBT-split like the
    // lanterns/rails above -- one copper ingot + 2 nuggets each
    for (chState of ['', 'exposed_', 'weathered_', 'oxidized_']) {
        for (chWaxed of ['', 'waxed_']) {
            UTILITY.push(['everythingcopper:' + chWaxed + chState + 'copper_chain', [['copper', 110]],
                'chain/everythingcopper/' + (chWaxed ? chWaxed : '') + chState + 'copper_chain'])
        }
    }
    let nUtility = 0
    for (uMeta of UTILITY) {
        results = []
        for (rMeta of uMeta[1]) results.push({ id: METALS[rMeta[0]].fluid, amount: rMeta[1] })
        toAdd.push({
            type: 'productivemetalworks:item_melting',
            ingredient: { item: uMeta[0] },
            minimum_temperature: 1000,
            maximum_temperature: 0,
            result: results,
            id: 'allthemods:productive_metalworks/foundry/' + uMeta[2],
        })
        nUtility++
    }
    console.log('[PMW MeltToolsArmor] utility (smithing/flint&steel/chains): ' + nUtility)

    // --- shields (v1.7.0) ---
    // Offhand items, so the name scan never sees them (no tool/armor slot). Most
    // metal shields wrap a vanilla shield core (1 iron ingot = 90 mB), which is
    // counted -- melting them returns every metal that went in. Excluded: alloys
    // with no PMW fluid (refined_glowstone/refined_obsidian, cloggrum, knightmetal,
    // glacite/flowglaze), non-metal materials (honey crystal), modular gear
    // (silentgear:shield: parts, no single material), and items with no recipe
    // (allthemodium:vibranium_shield unimplemented, everythingcopper WIP model-only,
    // cataclysm:azure_sea_shield).
    // [item, [[metal, mB], ...], suffix]
    const SHIELDS = [
        ['minecraft:shield', [['iron', 90]], 'vanilla'],                        // 1 iron ingot + 6 planks
        ['mekanismtools:bronze_shield', [['bronze', 540], ['iron', 90]], 'mekanismtools/bronze'], // 6 ingots + shield core
        ['mekanismtools:osmium_shield', [['osmium', 540], ['iron', 90]], 'mekanismtools/osmium'],
        ['mekanismtools:steel_shield', [['steel', 540], ['iron', 90]], 'mekanismtools/steel'],
        ['mekanismtools:lapis_lazuli_shield', [['lapis', 600], ['iron', 90]], 'mekanismtools/lapis_lazuli'], // 6 lapis gems at 100 mB
        ['immersiveengineering:shield', [['steel', 540], ['iron', 90]], 'immersiveengineering'], // 6 steel plates + core
        ['ars_nouveau:enchanters_shield', [['gold', 1620], ['iron', 90]], 'ars_nouveau/enchanters'], // 2 gold blocks + shield core (apparatus)
        ['endermanoverhaul:corrupted_shield', [['iron', 360]], 'endermanoverhaul'], // 4 iron ingots + teeth/planks
    ]
    let nShields = 0
    for (sMeta of SHIELDS) {
        results = []
        for (rMeta of sMeta[1]) results.push({ id: METALS[rMeta[0]].fluid, amount: rMeta[1] })
        toAdd.push({
            type: 'productivemetalworks:item_melting',
            ingredient: { item: sMeta[0] },
            minimum_temperature: 1000,
            maximum_temperature: 0,
            result: results,
            id: 'allthemods:productive_metalworks/foundry/shield/' + sMeta[2],
        })
        nShields++
    }
    console.log('[PMW MeltToolsArmor] shields: ' + nShields)

    // --- redstone lamps (v1.7.0) ---
    // Vanilla lamp = 4 redstone dust (100 mB each) + 1 glowstone block (400 mB).
    // SecurityCraft's reinforced lamp keeps the same metal content -- the
    // reinforcement is applied with the Universal Block Reinforcer tool, no metal
    // in the recipe.
    // [item, [[metal, mB], ...], suffix]
    const LAMPS = [
        ['minecraft:redstone_lamp', [['redstone', 400], ['glowstone', 400]], 'vanilla'],
        ['securitycraft:reinforced_redstone_lamp', [['redstone', 400], ['glowstone', 400]], 'securitycraft'],
    ]
    let nLamps = 0
    for (lMeta of LAMPS) {
        results = []
        for (rMeta of lMeta[1]) results.push({ id: METALS[rMeta[0]].fluid, amount: rMeta[1] })
        toAdd.push({
            type: 'productivemetalworks:item_melting',
            ingredient: { item: lMeta[0] },
            minimum_temperature: 1000,
            maximum_temperature: 0,
            result: results,
            id: 'allthemods:productive_metalworks/foundry/lamp/' + lMeta[2],
        })
        nLamps++
    }
    console.log('[PMW MeltToolsArmor] redstone lamps: ' + nLamps)

    // --- lanterns ---
    // Standard lantern = 8 nuggets around a torch = 80 mB (10 mB/nugget);
    // Bibliocraft fancy/iron lanterns = 4 ingots around a candle = 360 mB.
    // Chipped/mcw re-skins carry the iron they were cut from.
    const LANTERNS = [
        ['minecraft:lantern', 'iron', 80, 'vanilla/lantern'],
        ['minecraft:soul_lantern', 'iron', 80, 'vanilla/soul_lantern'],
        // mcw-lights: torch + 3-5 iron nuggets (wall = base + wooden fence)
        ['mcwlights:bell_lantern', 'iron', 40, 'mcw/bell'], ['mcwlights:bell_wall_lantern', 'iron', 40, 'mcw/bell_wall'],
        ['mcwlights:chain_lantern', 'iron', 40, 'mcw/chain'], ['mcwlights:chain_wall_lantern', 'iron', 40, 'mcw/chain_wall'],
        ['mcwlights:covered_lantern', 'iron', 50, 'mcw/covered'], ['mcwlights:covered_wall_lantern', 'iron', 50, 'mcw/covered_wall'],
        ['mcwlights:cross_lantern', 'iron', 40, 'mcw/cross'], ['mcwlights:cross_wall_lantern', 'iron', 40, 'mcw/cross_wall'],
        ['mcwlights:festive_lantern', 'iron', 50, 'mcw/festive'], ['mcwlights:festive_wall_lantern', 'iron', 50, 'mcw/festive_wall'],
        ['mcwlights:striped_lantern', 'iron', 30, 'mcw/striped'], ['mcwlights:striped_wall_lantern', 'iron', 30, 'mcw/striped_wall'],
        ['mcwlights:tavern_lantern', 'iron', 30, 'mcw/tavern'], ['mcwlights:tavern_wall_lantern', 'iron', 30, 'mcw/tavern_wall'],
        ['mcwlights:wall_lantern', 'iron', 80, 'mcw/wall'],
        // chipped chiseled lanterns: the iron lantern re-cut (8 nuggets each)
        ['chipped:big_lantern', 'iron', 80, 'chipped/big'], ['chipped:big_soul_lantern', 'iron', 80, 'chipped/big_soul'],
        ['chipped:blue_tube_soul_lantern', 'iron', 80, 'chipped/blue_tube_soul'],
        ['chipped:burning_coal_lantern', 'iron', 80, 'chipped/burning_coal'],
        ['chipped:checkered_iron_lantern', 'iron', 80, 'chipped/checkered'], ['chipped:checkered_iron_soul_lantern', 'iron', 80, 'chipped/checkered_soul'],
        ['chipped:donut_lantern', 'iron', 80, 'chipped/donut'], ['chipped:donut_soul_lantern', 'iron', 80, 'chipped/donut_soul'],
        ['chipped:ender_lantern', 'iron', 80, 'chipped/ender'],
        ['chipped:iron_bowl_lantern', 'iron', 80, 'chipped/iron_bowl'], ['chipped:iron_bowl_soul_lantern', 'iron', 80, 'chipped/iron_bowl_soul'],
        ['chipped:small_green_lantern', 'iron', 80, 'chipped/small_green'], ['chipped:small_red_soul_lantern', 'iron', 80, 'chipped/small_red_soul'],
        ['chipped:tall_lantern', 'iron', 80, 'chipped/tall'], ['chipped:tall_soul_lantern', 'iron', 80, 'chipped/tall_soul'],
        ['chipped:wide_lantern', 'iron', 80, 'chipped/wide'], ['chipped:wide_soul_lantern', 'iron', 80, 'chipped/wide_soul'],
        ['chipped:wooden_cage_lantern', 'iron', 80, 'chipped/wooden_cage'], ['chipped:wooden_cage_soul_lantern', 'iron', 80, 'chipped/wooden_cage_soul'],
        ['chipped:wrought_iron_lantern', 'iron', 80, 'chipped/wrought_iron'], ['chipped:yellow_tube_lantern', 'iron', 80, 'chipped/yellow_tube'],
        // bibliocraft fancy: 4 ingots of metal around a candle
        ['bibliocraft:fancy_iron_lantern', 'iron', 360, 'bibliocraft/fancy_iron'],
        ['bibliocraft:soul_fancy_iron_lantern', 'iron', 360, 'bibliocraft/soul_fancy_iron'],
        ['bibliocraft:fancy_gold_lantern', 'gold', 360, 'bibliocraft/fancy_gold'],
        ['bibliocraft:soul_fancy_gold_lantern', 'gold', 360, 'bibliocraft/soul_fancy_gold'],
    ]
    // everythingcopper: 8 copper nuggets; every oxidation/waxed state melts the same
    for (lanState of ['', 'exposed_', 'weathered_', 'oxidized_']) {
        for (lanWaxed of ['', 'waxed_']) {
            LANTERNS.push(['everythingcopper:' + lanWaxed + lanState + 'copper_lantern', 'copper', 80, 'everythingcopper/' + (lanWaxed || '') + lanState + 'copper_lantern'])
            LANTERNS.push(['everythingcopper:' + lanWaxed + lanState + 'copper_soul_lantern', 'copper', 80, 'everythingcopper/' + (lanWaxed || '') + lanState + 'soul'])
        }
    }
    // bibliocraft fancy color grid: <color>_fancy_{gold|iron}_lantern
    for (lanColor of ['black', 'blue', 'brown', 'cyan', 'gray', 'green', 'light_blue', 'light_gray', 'lime', 'magenta', 'orange', 'pink', 'purple', 'red', 'white', 'yellow']) {
        LANTERNS.push(['bibliocraft:' + lanColor + '_fancy_iron_lantern', 'iron', 360, 'bibliocraft/' + lanColor + '_fancy_iron'])
        LANTERNS.push(['bibliocraft:' + lanColor + '_fancy_gold_lantern', 'gold', 360, 'bibliocraft/' + lanColor + '_fancy_gold'])
    }
    for (lanMeta of LANTERNS) {
        toAdd.push({
            type: 'productivemetalworks:item_melting',
            ingredient: { item: lanMeta[0] },
            minimum_temperature: 1000,
            maximum_temperature: 0,
            result: [{ id: METALS[lanMeta[1]].fluid, amount: lanMeta[2] }],
            id: 'allthemods:productive_metalworks/foundry/lantern/' + lanMeta[3],
        })
    }
    console.log('[PMW MeltToolsArmor] lanterns: ' + LANTERNS.length)

    // --- minecart rails (all) ---
    // Every rail/track in the pack, vanilla + modded. Yields follow each item's crafting
    // share of its metal (ingot 90 mB, nugget 10 mB). Railcraft builds its track blocks
    // 32-at-a-time from 6 base rails + 1 railbed, so ONE track melts for 6/32 of a base
    // rail's metal -- melting a track at full rail value would mint infinite metal. This
    // pack's Railcraft Reborn also OVERRIDES the vanilla rail recipe (6 standard_rail +
    // wooden_railbed -> 32 rail), which sets minecraft:rail's share to ~13 mB iron.
    // Metal lists are [metal, mB] pairs (PMW result arrays allow multiple fluids).
    const RAILS = [
        // vanilla: railcraft blades the vanilla recipe; powered/detector/activator keep vanilla cost
        ['minecraft:rail', [['iron', 13]]],                        // 6 std.rail -> 32 rails (pack override)
        ['minecraft:powered_rail', [['gold', 90]]],                // 6 gold + 1 stick + 1 redstone -> 6
        ['minecraft:detector_rail', [['iron', 90]]],               // 6 iron + pressure plate + redstone -> 6
        ['minecraft:activator_rail', [['iron', 90]]],              // 6 iron + stick + redstone torch -> 6
        // railcraft base rails (rolling machine)
        ['railcraft:standard_rail', [['iron', 68]]],               // 6 iron -> 8 (67.5)
        ['railcraft:wooden_rail', [['iron', 15]]],                 // 1 iron + wooden tie -> 6
        ['railcraft:electric_rail', [['steel', 45], ['copper', 23]]], // 6 steel + 3 copper -> 12
        ['railcraft:high_speed_rail', [['steel', 34], ['gold', 34]]], // 3 steel + 3 gold -> 8
        ['railcraft:reinforced_rail', [['steel', 68]]],            // 6 steel + obsidian dust -> 8
        ['railcraft:advanced_rail', [['gold', 34]]],               // 3 gold + 3 redstone -> 8
        // standalone railcraft tracks
        ['railcraft:elevator_track', [['gold', 26], ['iron', 9]]], // 6 adv + 1 std -> 8
        // everythingcopper: 6 copper + 1 stick -> 16; every oxidation/waxed state melts the same
        // (all 8 states incl. base are added by the state grid loop below)
        // other mods
        ['securitycraft:track_mine', [['iron', 90]]],              // 6 iron + gunpowder + stick -> 6
        ['advancedperipherals:smart_rail', [['iron', 180], ['gold', 90]]], // detector+activator+powered + modem
        ['naturesaura:dimension_rail_overworld', [['iron', 540]]], // 6 infused_iron + stick
        ['naturesaura:dimension_rail_nether', [['gold', 540]]],    // 6 tainted_gold + stick
        ['create:controller_rail', [['gold', 90], ['iron', 15]]],  // 6 gold + electron tube -> 6
    ]
    // everythingcopper copper rail state grid (8 items: oxidation x waxed)
    for (rcState of ['', 'exposed_', 'weathered_', 'oxidized_']) {
        for (rcWaxed of ['', 'waxed_']) {
            RAILS.push(['everythingcopper:' + rcWaxed + rcState + 'copper_rail', [['copper', 34]],
                'everythingcopper/' + (rcWaxed ? rcWaxed : '') + rcState + 'copper_rail'])
        }
    }
    // create track: sequenced assembly deploys 2 iron|zinc nuggets onto sleepers
    RAILS.push(['create:track', [['iron', 20]], 'create/track'])

    // railcraft track families: 32 tracks from 6 base rails + 1 railbed
    const RC_ALL = ['', 'activator', 'booster', 'buffer_stop', 'control', 'coupler', 'detector',
        'disembarking', 'dumping', 'embarking', 'gated', 'junction', 'launcher', 'locking',
        'locomotive', 'one_way', 'routing', 'throttle', 'turnout', 'whistle', 'wye']
    const RC_HS = ['', 'activator', 'booster', 'detector', 'junction', 'locking', 'locomotive',
        'throttle', 'transition', 'turnout', 'whistle', 'wye']
    const RC_IRON = ['activator', 'booster', 'buffer_stop', 'control', 'coupler', 'detector',
        'disembarking', 'dumping', 'embarking', 'gated', 'junction', 'launcher', 'locking',
        'locomotive', 'one_way', 'routing', 'throttle', 'turnout', 'whistle', 'wye']
    const RC_FAMILIES = [
        ['abandoned_', RC_ALL, [['iron', 13]]],
        ['strap_iron_', RC_ALL, [['iron', 3]]],
        ['electric_', RC_ALL, [['steel', 8], ['copper', 4]]],
        ['high_speed_', RC_HS, [['steel', 6], ['gold', 6]]],
        ['high_speed_electric_', RC_HS, [['steel', 9], ['gold', 6], ['copper', 1]]],
        ['iron_', RC_IRON, [['iron', 13]]],
        ['reinforced_', RC_ALL, [['steel', 13]]],
    ]
    for (rcFam of RC_FAMILIES) {
        for (rcK of rcFam[1]) {
            RAILS.push(['railcraft:' + rcFam[0] + (rcK ? rcK + '_' : '') + 'track', rcFam[2], 'railcraft/' + rcFam[0] + (rcK ? rcK : 'base')])
        }
    }
    let rcRails = 0
    for (rail of RAILS) {
        results = []
        for (rMeta of rail[1]) results.push({ id: METALS[rMeta[0]].fluid, amount: rMeta[1] })
        toAdd.push({
            type: 'productivemetalworks:item_melting',
            ingredient: { item: rail[0] },
            minimum_temperature: 1000,
            maximum_temperature: 0,
            result: results,
            id: 'allthemods:productive_metalworks/foundry/rail/' + (rail[2] || rail[0].replace(':', '_')),
        })
        rcRails++
    }
    console.log('[PMW MeltToolsArmor] rails: ' + rcRails)

    // --- ars_additions lanterns (Ars Nouveau addon) ---
    // Pattern: 4 iron nuggets ring the center (10 mB each = 40 mB iron); golden pair adds
    // 4 gold nuggets; magelight variants swap the core for 4 iron ingots (360 mB).
    const ARS_LANTERNS = [
        ['ars_additions:archwood_lantern', [['iron', 40]]],
        ['ars_additions:archwood_magelight_lantern', [['iron', 40]]],
        ['ars_additions:golden_lantern', [['iron', 40], ['gold', 40]]],
        ['ars_additions:golden_magelight_lantern', [['iron', 40], ['gold', 40]]],
        ['ars_additions:magelight_lantern', [['iron', 400]]],      // 4 ingots + 4 nuggets
        ['ars_additions:sourcestone_lantern', [['iron', 40]]],
        ['ars_additions:sourcestone_magelight_lantern', [['iron', 40]]],
        ['ars_additions:polished_sourcestone_lantern', [['iron', 40]]],
        ['ars_additions:polished_sourcestone_magelight_lantern', [['iron', 40]]],
        ['ars_additions:soul_magelight_lantern', [['iron', 40]]],
    ]
    for (arsLan of ARS_LANTERNS) {
        results = []
        for (rMeta of arsLan[1]) results.push({ id: METALS[rMeta[0]].fluid, amount: rMeta[1] })
        toAdd.push({
            type: 'productivemetalworks:item_melting',
            ingredient: { item: arsLan[0] },
            minimum_temperature: 1000,
            maximum_temperature: 0,
            result: results,
            id: 'allthemods:productive_metalworks/foundry/lantern/ars/' + arsLan[0].split(':').pop(),
        })
    }
    console.log('[PMW MeltToolsArmor] ars lanterns: ' + ARS_LANTERNS.length)

    // register after the scan loop so we never mutate the collection being iterated
        for (meta of toAdd) {
            id = meta.id
            delete meta.id
            event.custom(meta).id(id)
        }

    console.log('[PMW MeltToolsArmor] scanned ' + count + ' recipes, added ' + toAdd.length + ' melting recipes (skipped ' + skipped + ')')
    console.log('[PMW MeltToolsArmor] per-metal: ' + JSON.stringify(perMetal))
    console.log('[PMW MeltToolsArmor] golden_chestplate melting: ' + goldChestplate)
    if (errors.length > 0) console.log('[PMW MeltToolsArmor] errors: ' + errors.join(' | '))
})