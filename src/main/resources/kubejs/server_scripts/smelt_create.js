// smelt_create.js
// Melts Create + Create-addon items into their metal content via Productive Metalworks.
// Yields follow the item's actual crafting cost: ingot 90 mB, nugget/coin 10, plate 90,
// rod/wire 45, storage block 810, spool 135. Items PMW already melts through its own
// tags (ingots/plates/nuggets/storage blocks of zinc, steel, bronze, ...) are not re-added.

// FLUIDS is scoped INSIDE the event callback on purpose: top-level const names are
// shared across every script in KubeJS's Rhino scope, and two files both declaring
// `const FLUIDS` silently kill the alphabetically-later one with a redeclaration error.
ServerEvents.recipes(event => {
    const FLUIDS = {
        brass: 'productivemetalworks:molten_brass',
        copper: 'productivemetalworks:molten_copper',
        electrum: 'productivemetalworks:molten_electrum',
        gold: 'productivemetalworks:molten_gold',
        iron: 'productivemetalworks:molten_iron',
        netherite: 'productivemetalworks:molten_netherite',
        zinc: 'productivemetalworks:molten_zinc',
    }
    // hand-verified metal content: [item, metal, mB]
    const BESPOKE = [
        ['create:andesite_alloy', 'iron', 10],
        ['create:andesite_alloy_block', 'iron', 90],
        ['create:industrial_iron_block', 'iron', 810],
        ['create:empty_blaze_burner', 'iron', 90],
        ['create:electron_tube', 'iron', 90],
        ['create:brass_hand', 'brass', 90],
        ['create:copper_backtank', 'copper', 900],
        ['create:copper_diving_helmet', 'copper', 90],
        ['create:copper_diving_boots', 'copper', 90],
        ['create:netherite_backtank', 'netherite', 900],
        ['create:netherite_diving_helmet', 'netherite', 90],
        ['create:netherite_diving_boots', 'netherite', 90],
        ['create:railway_casing', 'brass', 90],
        ['create:wand_of_symmetry', 'brass', 90],
        ['create:extendo_grip', 'brass', 180],
        ['createaddition:spool', 'iron', 135],
        ['createdeco:industrial_iron_nugget', 'iron', 10],
        ['createdeco:industrial_iron_ingot', 'iron', 90],
        ['createbigcannons:cast_iron_nugget', 'iron', 10],
        ['createbigcannons:cast_iron_ingot', 'iron', 90],
        ['create_aquatic_ambitions:prismarine_alloy', 'copper', 10],
        ['create_aquatic_ambitions:prismarine_alloy_block', 'copper', 90],
        ['create_aquatic_ambitions:prismarine_alloy_rod', 'copper', 10],
    ]

    // families: whole families share a cost per item, so generate, don't list
    const WIRE_METALS = [['iron', 'iron'], ['gold', 'gold'], ['copper', 'copper'], ['electrum', 'electrum']]
    const ROD_METALS = [['electrum', 'electrum'], ['iron', 'iron'], ['gold', 'gold'], ['copper', 'copper'], ['brass', 'brass']]
    const SPOOL_METALS = [['gold', 'gold'], ['copper', 'copper'], ['electrum', 'electrum']]
    // coins are pressed from a single nugget (10 mB); a coinstack is 4x that
    const COIN_METALS = [['iron', 'iron'], ['gold', 'gold'], ['copper', 'copper'], ['brass', 'brass'], ['zinc', 'zinc'], ['netherite', 'netherite'], ['industrial_iron', 'iron']]

    let i, row, meta

    for (i = 0; i < BESPOKE.length; i++) {
        row = BESPOKE[i]
        event.custom({
            type: 'productivemetalworks:item_melting',
            ingredient: { item: row[0] },
            minimum_temperature: 1000,
            maximum_temperature: 0,
            result: [{ id: FLUIDS[row[1]], amount: row[2] }]
        }).id('allthemods:productive_metalworks/foundry/create/' + row[0].replace(':', '_'))
    }

    // wires and rods: half a plate each
    for (i = 0; i < WIRE_METALS.length; i++) {
        meta = WIRE_METALS[i]
        event.custom({
            type: 'productivemetalworks:item_melting',
            ingredient: { item: 'createaddition:' + meta[0] + '_wire' },
            minimum_temperature: 1000,
            maximum_temperature: 0,
            result: [{ id: FLUIDS[meta[1]], amount: 45 }]
        }).id('allthemods:productive_metalworks/foundry/create/createaddition_' + meta[0] + '_wire')
    }
    for (i = 0; i < ROD_METALS.length; i++) {
        meta = ROD_METALS[i]
        event.custom({
            type: 'productivemetalworks:item_melting',
            ingredient: { item: 'createaddition:' + meta[0] + '_rod' },
            minimum_temperature: 1000,
            maximum_temperature: 0,
            result: [{ id: FLUIDS[meta[1]], amount: 45 }]
        }).id('allthemods:productive_metalworks/foundry/create/createaddition_' + meta[0] + '_rod')
    }
    for (i = 0; i < SPOOL_METALS.length; i++) {
        meta = SPOOL_METALS[i]
        event.custom({
            type: 'productivemetalworks:item_melting',
            ingredient: { item: 'createaddition:' + meta[0] + '_spool' },
            minimum_temperature: 1000,
            maximum_temperature: 0,
            result: [{ id: FLUIDS[meta[1]], amount: 135 }]
        }).id('allthemods:productive_metalworks/foundry/create/createaddition_' + meta[0] + '_spool')
    }
    for (i = 0; i < COIN_METALS.length; i++) {
        meta = COIN_METALS[i]
        event.custom({
            type: 'productivemetalworks:item_melting',
            ingredient: { item: 'createdeco:' + meta[0] + '_coin' },
            minimum_temperature: 1000,
            maximum_temperature: 0,
            result: [{ id: FLUIDS[meta[1]], amount: 10 }]
        }).id('allthemods:productive_metalworks/foundry/create/createdeco_' + meta[0] + '_coin')
        event.custom({
            type: 'productivemetalworks:item_melting',
            ingredient: { item: 'createdeco:' + meta[0] + '_coinstack' },
            minimum_temperature: 1000,
            maximum_temperature: 0,
            result: [{ id: FLUIDS[meta[1]], amount: 40 }]
        }).id('allthemods:productive_metalworks/foundry/create/createdeco_' + meta[0] + '_coinstack')
    }

    console.log('[PMW Create] added ' + (BESPOKE.length + WIRE_METALS.length + ROD_METALS.length + SPOOL_METALS.length + COIN_METALS.length * 2) + ' melting recipes')
})
