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
    let recipe, result, info, meta, itemId, units, slot, id

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