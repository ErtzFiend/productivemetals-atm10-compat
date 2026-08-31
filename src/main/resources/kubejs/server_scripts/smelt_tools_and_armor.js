// This File has been authored by AllTheMods Staff, or a Community contributor for use in AllTheMods - AllTheMods 10.
// As all AllTheMods packs are licensed under All Rights Reserved, this file is not allowed to be used in any public packs not released by the AllTheMods Team, without explicit permission.
//
// Melts ingot-based tools and armor into their component molten fluids via Productive Metalworks.
// FINAL 2026-08-27 (verified live on LLMServer): every accessor below was probe-verified against
// KubeJS 2101.7.2-build.368 at runtime:
//   - values are RAW vanilla Recipe objects (NOT KubeRecipes): kjs$getType()/type/kjs$getTypeKey() DO NOT exist.
//   - recipe type comes from String(recipe) -> "id[type]"
//   - output item id: recipe.originalRecipeResult.id
//   - ingredients: recipe.originalRecipeIngredients (Java List<Ingredient>) -> ing.getItems() -> st.id
//   - Rhino (KubeJS) quirk: `const` inside a loop body is hoisted to function scope and RE-declared
//     on the 2nd iteration ("redeclaration of var x") -> every loop-local is declared ONCE at the top.
//   - undeclared loop variables (for (x of ...) without let/const) throw ReferenceError in strict mode.
//
// Recipe JSON mirrors PMW's own files exactly: result is an ARRAY of {id, amount}, temperature keys
// are minimum_temperature/maximum_temperature (1000 standard, 3000 for the ATM trio).
// Yields: 90 mB/ingot, 100 mB/gem. Slots: helmet=5, chestplate=8, leggings=7, boots=4,
// pickaxe=3, axe=3, shovel=1, hoe=2, sword=2.

const VOLUME_PER_INGOT = 90 // PMW default: 90 mB per ingot (NOT 144)
const VOLUME_PER_GEM = 100  // PMW gem melts (diamond/emerald/lapis/quartz/amethyst): 100 mB per unit

// metal_name -> { fluid, temp, gem? } (fluid ids follow Productive Metalworks / Allthemodium conventions)
const METALS = {
    iron:         { fluid: 'productivemetalworks:molten_iron',        temp: 1000 },
    gold:         { fluid: 'productivemetalworks:molten_gold',        temp: 1000 },
    copper:       { fluid: 'productivemetalworks:molten_copper',      temp: 1000 },
    netherite:    { fluid: 'productivemetalworks:molten_netherite',   temp: 1000 },
    diamond:      { fluid: 'productivemetalworks:molten_diamond',     temp: 1000, gem: true },
    emerald:      { fluid: 'productivemetalworks:molten_emerald',     temp: 1000, gem: true },
    amethyst:     { fluid: 'productivemetalworks:molten_amethyst',    temp: 1000, gem: true },
    lapis:        { fluid: 'productivemetalworks:molten_lapis',       temp: 1000, gem: true },
    quartz:       { fluid: 'productivemetalworks:molten_quartz',      temp: 1000, gem: true },
    redstone:     { fluid: 'productivemetalworks:molten_redstone',    temp: 1000, gem: true },
    obsidian:     { fluid: 'productivemetalworks:molten_obsidian',    temp: 1000 },
    glowstone:    { fluid: 'productivemetalworks:molten_glowstone',   temp: 1000 },
    magma:        { fluid: 'productivemetalworks:molten_magma_cream', temp: 1000 },
    blaze:        { fluid: 'productivemetalworks:molten_blaze',       temp: 1000 },
    ender:        { fluid: 'productivemetalworks:molten_ender',       temp: 1000 },
    slime:        { fluid: 'productivemetalworks:molten_slime',       temp: 1000 },
    aluminum:     { fluid: 'productivemetalworks:molten_aluminum',    temp: 1000 },
    brass:        { fluid: 'productivemetalworks:molten_brass',       temp: 1000 },
    bronze:       { fluid: 'productivemetalworks:molten_bronze',      temp: 1000 },
    constantan:   { fluid: 'productivemetalworks:molten_constantan',  temp: 1000 },
    electrum:     { fluid: 'productivemetalworks:molten_electrum',    temp: 1000 },
    enderium:     { fluid: 'productivemetalworks:molten_enderium',    temp: 1000 },
    invar:        { fluid: 'productivemetalworks:molten_invar',       temp: 1000 },
    iridium:      { fluid: 'productivemetalworks:molten_iridium',     temp: 1000 },
    lead:         { fluid: 'productivemetalworks:molten_lead',        temp: 1000 },
    lumium:       { fluid: 'productivemetalworks:molten_lumium',      temp: 1000 },
    nickel:       { fluid: 'productivemetalworks:molten_nickel',      temp: 1000 },
    osmium:       { fluid: 'productivemetalworks:molten_osmium',      temp: 1000 },
    platinum:     { fluid: 'productivemetalworks:molten_platinum',    temp: 1000 },
    signalum:     { fluid: 'productivemetalworks:molten_signalum',    temp: 1000 },
    silver:       { fluid: 'productivemetalworks:molten_silver',      temp: 1000 },
    steel:        { fluid: 'productivemetalworks:molten_steel',       temp: 1000 },
    tin:          { fluid: 'productivemetalworks:molten_tin',         temp: 1000 },
    uranium:      { fluid: 'productivemetalworks:molten_uranium',     temp: 1000 },
    zinc:         { fluid: 'productivemetalworks:molten_zinc',        temp: 1000 },
    allthemodium: { fluid: 'allthemodium:molten_allthemodium', temp: 3000 },
    vibranium:    { fluid: 'allthemodium:molten_vibranium',    temp: 3000 },
    unobtainium:  { fluid: 'allthemodium:molten_unobtainium',  temp: 3000 },
}

// vanilla (and many mods) use "golden_*" for gold items: golden_chestplate, golden_pickaxe, ...
const ALIASES = { golden: 'gold' }

const COUNT_BY_SLOT = {
    pickaxe: 3, axe: 3, shovel: 1, hoe: 2, sword: 2,
    helmet: 5, chestplate: 8, leggings: 7, boots: 4,
}

// Vanilla netherite gear has NO crafting recipe (smithing-only) so the recipe scan can't see it.
const NETHERITE_GEAR = {
    'minecraft:netherite_pickaxe': 3, 'minecraft:netherite_axe': 3, 'minecraft:netherite_shovel': 1,
    'minecraft:netherite_hoe': 2, 'minecraft:netherite_sword': 2,
    'minecraft:netherite_helmet': 5, 'minecraft:netherite_chestplate': 8,
    'minecraft:netherite_leggings': 7, 'minecraft:netherite_boots': 4,
}

function nameOf(id) {
    return String(id).split(':').pop()
}

function getToolType(id) {
    const name = nameOf(id)
    // suffix-token matching ONLY — substring ('hat' in 'hatch', 'boots' in 'boots_tome') creates
    // bogus melting recipes for machine hatches / books / blocks. pickaxe must precede axe.
    if (name === 'pickaxe' || name.endsWith('_pickaxe')) return 'pickaxe'
    if (name === 'axe' || name.endsWith('_axe') || name.endsWith('axe') || name.endsWith('_hatchet')) return 'axe'
    if (name === 'shovel' || name.endsWith('_shovel')) return 'shovel'
    if (name === 'hoe' || name.endsWith('_hoe')) return 'hoe'
    if (name === 'sword' || name.endsWith('_sword')) return 'sword'
    return null
}

function getArmorType(id) {
    const name = nameOf(id)
    // helmet-class: _helmet/_hat/_mask/_crown/_hood (suffix tokens only — 'kitchen_hood' is a block
    // but still ends '_hood'; acceptable noise, it is made of ingots)
    if (name === 'helmet' || name.endsWith('_helmet') || name.endsWith('_hat') || name.endsWith('_mask') || name.endsWith('_crown') || name.endsWith('_hood')) return 'helmet'
    if (name === 'chestplate' || name.endsWith('_chestplate') || name.endsWith('_body') || name.endsWith('_tunic')) return 'chestplate'
    if (name === 'leggings' || name.endsWith('_leggings') || name.endsWith('_pants')) return 'leggings'
    if (name === 'boots' || name.endsWith('_boots') || name.endsWith('_shoes')) return 'boots'
    return null
}

function metalFromId(id) {
    const name = nameOf(id)
    if (!name) return null
    // glass is never the tool's metal — prevents #c:glass_blocks pollution (ae2:quartz_glass etc.)
    if (name.includes('glass')) return null
    // aliases first so golden_* resolves to gold before prefix checks
    for (const a of Object.keys(ALIASES)) {
        if (name === a || name.startsWith(a + '_')) return ALIASES[a]
    }
    for (const metal of Object.keys(METALS)) {
        if (name === metal) return metal                  // minecraft:diamond
        if (name === metal + '_ingot') return metal       // minecraft:iron_ingot
        if (name.endsWith('_' + metal)) return metal      // suffix variant
        if (name.startsWith(metal + '_')) return metal    // netherite_chestplate, copper_sword
    }
    return null
}

// Tag ingredient -> metal (c:ingots/gold -> gold, c:gems/diamond -> diamond, ...)
function metalFromTag(tagId) {
    const parts = String(tagId).split('/')
    const last = parts[parts.length - 1]
    if (!last) return null
    return (last in METALS) ? last : null
}

// JsonObject ingredient ({item: ...} or {tag: ...}) -> metal
function metalFromJsonObj(obj) {
    if (!obj) return null
    try { if (obj.has('item')) return metalFromId(obj.get('item').getAsString()) } catch (e) {}
    try { if (obj.has('tag')) return metalFromTag(obj.get('tag').getAsString()) } catch (e) {}
    return null
}

function mergeMetal(cur, next) {
    if (!cur) return next
    if (cur === next) return cur
    return 'MULTI'
}

ServerEvents.recipes(event => {
    // NOTE: event.recipes is the recipe-BUILDER namespace (event.recipes.minecraft.crafting_shaped),
    // NOT the recipe list. The full recipe map is event.originalRecipes (Map<RL, Recipe>).
    // Its values are RAW vanilla Recipe objects — kjs$getType()/type DO NOT exist on them.
    const values = (event.originalRecipes && event.originalRecipes.values) ? event.originalRecipes.values() : []
    const toAdd = []
    let count = 0
    let skipped = 0
    const perMetal = {}
    let goldChestplate = false
    const errors = []
    // Rhino quirk: `const` inside a loop body is hoisted + RE-declared each iteration, and undeclared
    // for-of vars throw in strict mode — so every loop-local is declared ONCE up here.
    let recipe, typeStr, typeMatch, resultStack, outId, slot, expected, matchedMetal
    let ingredients, ing, stacks, st, stId, metal, info, amount, outName, recipeId
    let itemId, units, nslot, ni
    let rec, rid
    let j, keyObj, arrObj, e2, v2, m2, el2, vs, h, loc

    for (recipe of values) {
        count++
        try {
            if (!recipe) continue
            // recipe type is embedded in toString(): "id[type]"
            typeStr = String(recipe)
            typeMatch = /\[([^\]]+)\]$/.exec(typeStr)
            if (!typeMatch) continue
            typeStr = typeMatch[1]
            if (typeStr !== 'minecraft:crafting_shaped' && typeStr !== 'minecraft:crafting_shapeless') continue

            resultStack = recipe.originalRecipeResult
            if (!resultStack) continue
            outId = String(resultStack.id)
            if (!outId || outId === 'minecraft:air') continue

            slot = getToolType(outId) || getArmorType(outId)
            if (!slot) continue
            expected = COUNT_BY_SLOT[slot]

            // detect the single metal among the recipe's ingredients.
            // getItems() returns EMPTY for these recipe objects (unresolved), so read the
            // raw JSON ingredient definitions (recipe.originalJson) — item or tag form —
            // and fall back to the ingredient holder set (getValues() -> holder keys).
            matchedMetal = null
            try {
                j = recipe.originalJson
                if (j) {
                    keyObj = j.get('key')
                    if (keyObj && keyObj.isJsonObject()) {
                        for (e2 of keyObj.entrySet()) {
                            v2 = e2.getValue()
                            if (v2 && v2.isJsonObject()) {
                                m2 = metalFromJsonObj(v2.getAsJsonObject())
                                if (m2) matchedMetal = mergeMetal(matchedMetal, m2)
                            }
                        }
                    }
                    arrObj = j.get('ingredients')
                    if (arrObj && arrObj.isJsonArray()) {
                        for (el2 of arrObj) {
                            if (el2 && el2.isJsonObject()) {
                                m2 = metalFromJsonObj(el2.getAsJsonObject())
                                if (m2) matchedMetal = mergeMetal(matchedMetal, m2)
                            }
                        }
                    }
                }
            } catch (e) { if (errors.length < 10) errors.push('jsonPath: ' + String(e)) }

            if (!matchedMetal) {
                ingredients = recipe.originalRecipeIngredients
                if (ingredients) {
                    for (ing of ingredients) {
                        if (!ing) continue
                        try {
                            vs = ing.getValues()
                            if (vs) {
                                for (h of vs) {
                                    try {
                                        loc = String(h.getKey().location())
                                        m2 = metalFromId(loc)
                                        if (m2) matchedMetal = mergeMetal(matchedMetal, m2)
                                    } catch (e) {}
                                }
                            }
                        } catch (e) {}
                    }
                }
            }
            if (!matchedMetal || matchedMetal === 'MULTI') continue

            info = METALS[matchedMetal]
            if (!info) continue

            amount = expected * (info.gem ? VOLUME_PER_GEM : VOLUME_PER_INGOT)
            outName = outId.replace(':', '/')  // full path: mods share item names (3x copper_shovel)
            recipeId = 'allthemods:productive_metalworks/melting/' + slot + '/' + matchedMetal + '/' + outName

            toAdd.push({
                type: 'productivemetalworks:item_melting',
                ingredient: { item: outId },
                minimum_temperature: info.temp,
                maximum_temperature: 0,
                result: [{ id: info.fluid, amount: amount }],
                id: recipeId,
            })

            perMetal[matchedMetal] = (perMetal[matchedMetal] || 0) + 1
            if (outId === 'minecraft:golden_chestplate' && matchedMetal === 'gold') goldChestplate = true
        } catch (e) {
            skipped++
            if (errors.length < 10) errors.push(String(e))
        }
    }

    // vanilla netherite gear (smithing-only, no crafting recipe to scan)
    ni = METALS.netherite
    for (itemId of Object.keys(NETHERITE_GEAR)) {
        units = NETHERITE_GEAR[itemId]
        nslot = getToolType(itemId) || getArmorType(itemId)
        if (!nslot) continue
        toAdd.push({
            type: 'productivemetalworks:item_melting',
            ingredient: { item: itemId },
            minimum_temperature: ni.temp,
            maximum_temperature: 0,
            result: [{ id: ni.fluid, amount: units * VOLUME_PER_INGOT }],
            id: 'allthemods:productive_metalworks/melting/' + nslot + '/netherite/' + itemId.split(':').pop(),
        })
        perMetal.netherite = (perMetal.netherite || 0) + 1
    }

    // add AFTER the scan loop to avoid mutating the collection being iterated

    // ==========================================
    // PRODUCTIVE METALWORKS FOUNDRY: ADDITIONAL MELTING RECIPES (fixed 2026-08-29)
    // Yields = crafting cost of the item, in the metal it is actually made of.
    // 90 mB/ingot, 100 mB/quartz. Pattern matches the scan loop: id is set via .id(),
    // never inside the JSON body (PMW's serializer rejects unknown keys).
    // ==========================================

    // CAULDRON — 7 iron ingots
    event.custom({ type: 'productivemetalworks:item_melting', ingredient: { item: 'minecraft:cauldron' }, minimum_temperature: 1000, maximum_temperature: 0, result: [{ id: 'productivemetalworks:molten_iron', amount: 630 }] }).id('allthemods:productive_metalworks/foundry/cauldron/iron')

    // BUCKET — 3 iron ingots
    event.custom({ type: 'productivemetalworks:item_melting', ingredient: { item: 'minecraft:bucket' }, minimum_temperature: 1000, maximum_temperature: 0, result: [{ id: 'productivemetalworks:molten_iron', amount: 270 }] }).id('allthemods:productive_metalworks/foundry/bucket/iron')

    // ANVILS — full 31 iron ingots (damage states melt the same)
    event.custom({ type: 'productivemetalworks:item_melting', ingredient: { item: 'minecraft:anvil' }, minimum_temperature: 1000, maximum_temperature: 0, result: [{ id: 'productivemetalworks:molten_iron', amount: 2790 }] }).id('allthemods:productive_metalworks/foundry/anvil/iron')
    event.custom({ type: 'productivemetalworks:item_melting', ingredient: { item: 'minecraft:chipped_anvil' }, minimum_temperature: 1000, maximum_temperature: 0, result: [{ id: 'productivemetalworks:molten_iron', amount: 2790 }] }).id('allthemods:productive_metalworks/foundry/anvil/iron/chipped')
    event.custom({ type: 'productivemetalworks:item_melting', ingredient: { item: 'minecraft:damaged_anvil' }, minimum_temperature: 1000, maximum_temperature: 0, result: [{ id: 'productivemetalworks:molten_iron', amount: 2790 }] }).id('allthemods:productive_metalworks/foundry/anvil/iron/damaged')

    // GOLDEN APPLES — 8 gold ingots; enchanted — 72 gold ingots (the apple itself is not metal)
    event.custom({ type: 'productivemetalworks:item_melting', ingredient: { item: 'minecraft:golden_apple' }, minimum_temperature: 1000, maximum_temperature: 0, result: [{ id: 'productivemetalworks:molten_gold', amount: 720 }] }).id('allthemods:productive_metalworks/foundry/apple/gold')
    event.custom({ type: 'productivemetalworks:item_melting', ingredient: { item: 'minecraft:enchanted_golden_apple' }, minimum_temperature: 1000, maximum_temperature: 0, result: [{ id: 'productivemetalworks:molten_gold', amount: 6480 }] }).id('allthemods:productive_metalworks/foundry/apple/gold/enchanted')

    // MINECARTS — 5 iron base; cart+carrier variants count the carrier's iron too
    event.custom({ type: 'productivemetalworks:item_melting', ingredient: { item: 'minecraft:minecart' }, minimum_temperature: 1000, maximum_temperature: 0, result: [{ id: 'productivemetalworks:molten_iron', amount: 450 }] }).id('allthemods:productive_metalworks/foundry/minecart/iron')
    event.custom({ type: 'productivemetalworks:item_melting', ingredient: { item: 'minecraft:chest_minecart' }, minimum_temperature: 1000, maximum_temperature: 0, result: [{ id: 'productivemetalworks:molten_iron', amount: 450 }] }).id('allthemods:productive_metalworks/foundry/minecart/iron/chest')
    event.custom({ type: 'productivemetalworks:item_melting', ingredient: { item: 'minecraft:hopper_minecart' }, minimum_temperature: 1000, maximum_temperature: 0, result: [{ id: 'productivemetalworks:molten_iron', amount: 900 }] }).id('allthemods:productive_metalworks/foundry/minecart/iron/hopper')
    event.custom({ type: 'productivemetalworks:item_melting', ingredient: { item: 'minecraft:furnace_minecart' }, minimum_temperature: 1000, maximum_temperature: 0, result: [{ id: 'productivemetalworks:molten_iron', amount: 900 }] }).id('allthemods:productive_metalworks/foundry/minecart/iron/furnace')
    event.custom({ type: 'productivemetalworks:item_melting', ingredient: { item: 'minecraft:tnt_minecart' }, minimum_temperature: 1000, maximum_temperature: 0, result: [{ id: 'productivemetalworks:molten_iron', amount: 450 }] }).id('allthemods:productive_metalworks/foundry/minecart/iron/tnt')
    event.custom({ type: 'productivemetalworks:item_melting', ingredient: { item: 'minecraft:command_block_minecart' }, minimum_temperature: 1000, maximum_temperature: 0, result: [{ id: 'productivemetalworks:molten_iron', amount: 450 }] }).id('allthemods:productive_metalworks/foundry/minecart/iron/command_block')

    // CROSSBOW — 1 iron ingot in the recipe
    event.custom({ type: 'productivemetalworks:item_melting', ingredient: { item: 'minecraft:crossbow' }, minimum_temperature: 1000, maximum_temperature: 0, result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }] }).id('allthemods:productive_metalworks/foundry/crossbow/iron')

    // QUARTZ BLOCKS — 4 quartz each (gem: 100 mB/unit)
    event.custom({ type: 'productivemetalworks:item_melting', ingredient: { item: 'minecraft:quartz_block' }, minimum_temperature: 1000, maximum_temperature: 0, result: [{ id: 'productivemetalworks:molten_quartz', amount: 400 }] }).id('allthemods:productive_metalworks/foundry/quartz/block')
    event.custom({ type: 'productivemetalworks:item_melting', ingredient: { item: 'minecraft:chiseled_quartz_block' }, minimum_temperature: 1000, maximum_temperature: 0, result: [{ id: 'productivemetalworks:molten_quartz', amount: 400 }] }).id('allthemods:productive_metalworks/foundry/quartz/chiseled')
    event.custom({ type: 'productivemetalworks:item_melting', ingredient: { item: 'minecraft:quartz_pillar' }, minimum_temperature: 1000, maximum_temperature: 0, result: [{ id: 'productivemetalworks:molten_quartz', amount: 400 }] }).id('allthemods:productive_metalworks/foundry/quartz/pillar')
    event.custom({ type: 'productivemetalworks:item_melting', ingredient: { item: 'minecraft:quartz_bricks' }, minimum_temperature: 1000, maximum_temperature: 0, result: [{ id: 'productivemetalworks:molten_quartz', amount: 400 }] }).id('allthemods:productive_metalworks/foundry/quartz/bricks')
    event.custom({ type: 'productivemetalworks:item_melting', ingredient: { item: 'minecraft:smooth_quartz' }, minimum_temperature: 1000, maximum_temperature: 0, result: [{ id: 'productivemetalworks:molten_quartz', amount: 400 }] }).id('allthemods:productive_metalworks/foundry/quartz/smooth')
    event.custom({ type: 'productivemetalworks:item_melting', ingredient: { item: 'minecraft:quartz_stairs' }, minimum_temperature: 1000, maximum_temperature: 0, result: [{ id: 'productivemetalworks:molten_quartz', amount: 300 }] }).id('allthemods:productive_metalworks/foundry/quartz/stairs')
    event.custom({ type: 'productivemetalworks:item_melting', ingredient: { item: 'minecraft:quartz_slab' }, minimum_temperature: 1000, maximum_temperature: 0, result: [{ id: 'productivemetalworks:molten_quartz', amount: 200 }] }).id('allthemods:productive_metalworks/foundry/quartz/slab')
    event.custom({ type: 'productivemetalworks:item_melting', ingredient: { item: 'minecraft:smooth_quartz_stairs' }, minimum_temperature: 1000, maximum_temperature: 0, result: [{ id: 'productivemetalworks:molten_quartz', amount: 300 }] }).id('allthemods:productive_metalworks/foundry/quartz/smooth_stairs')
    event.custom({ type: 'productivemetalworks:item_melting', ingredient: { item: 'minecraft:smooth_quartz_slab' }, minimum_temperature: 1000, maximum_temperature: 0, result: [{ id: 'productivemetalworks:molten_quartz', amount: 200 }] }).id('allthemods:productive_metalworks/foundry/quartz/smooth_slab')

    for (rec of toAdd) {
        rid = rec.id
        delete rec.id
        event.custom(rec).id(rid)
    }

    console.log('[PMW MeltToolsArmor] scanned ' + count + ' recipes, added ' + toAdd.length + ' melting recipes (skipped ' + skipped + ')')
    console.log('[PMW MeltToolsArmor] per-metal: ' + JSON.stringify(perMetal))
    console.log('[PMW MeltToolsArmor] golden_chestplate melting: ' + goldChestplate)
    if (errors.length > 0) console.log('[PMW MeltToolsArmor] errors: ' + errors.join(' | '))
})
