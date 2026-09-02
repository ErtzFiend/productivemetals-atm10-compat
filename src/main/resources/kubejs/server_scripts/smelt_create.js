// smelt_create.js — Create + Create-addon metal items melted via Productive Metalworks.
// Companion to smelt_tools_and_armor.js. Every melt is derived from the item's actual
// crafting cost (Create-family recipe JSONs, verified 2026-09-01): ingot 90 mB, nugget 10,
// plate 90, rod/wire 45, coin 10, storage block 810. Non-metal ingredients are ignored;
// mixed-metal items (e.g. createaddition:capacitor) are skipped — no honest single fluid.
// Items already covered by PMW's own tag melts (#c:ingots/*, #c:plates/*, #c:nuggets/*,
// #c:storage_blocks/* — zinc, steel, bronze, platinum, electrum ingots/blocks/nuggets/plates,
// raw materials, etc.) are NOT re-added here.
ServerEvents.recipes(event => {
  // andesite + 1 iron/zinc nugget
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:andesite_alloy' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 10 }]
  })
  // 9x andesite alloy
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:andesite_alloy_block' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  })
  // 9 industrial iron ingots
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:industrial_iron_block' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 810 }]
  })
  // 8 netherrack + 1 iron plate
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:empty_blaze_burner' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  })
  // polished rose quartz + 1 iron plate
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:electron_tube' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  })
  // andesite alloy + 1 brass plate
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:brass_hand' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  })
  // copper block + copper ingot + andesite alloy + shaft
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:copper_backtank' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 900 }]
  })
  // glass + copper ingot
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:copper_diving_helmet' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 90 }]
  })
  // andesite alloy + copper ingot
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:copper_diving_boots' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 90 }]
  })
  // smithing: backtank + netherite ingot (no crafting recipe)
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:netherite_backtank' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_netherite', amount: 900 }]
  })
  // smithing: diving helmet + netherite ingot
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:netherite_diving_helmet' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_netherite', amount: 90 }]
  })
  // smithing: diving boots + netherite ingot
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:netherite_diving_boots' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_netherite', amount: 90 }]
  })
  // brass casing + obsidian plate
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:railway_casing' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  })
  // brass ingot + ender pearl + precision mechanism
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:wand_of_symmetry' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  })
  // brass hand + 1 brass ingot
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:extendo_grip' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 180 }]
  })
  // 1.5 iron (rod 45 + plate 90) per spool
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createaddition:spool' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 135 }]
  })
  // iron plate -> 2 wires
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createaddition:iron_wire' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 45 }]
  })
  // gold plate -> 2 wires
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createaddition:gold_wire' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_gold', amount: 45 }]
  })
  // copper plate -> 2 wires
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createaddition:copper_wire' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 45 }]
  })
  // electrum plate -> 2 wires (electrified gold wire: same cost)
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createaddition:electrum_wire' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_electrum', amount: 45 }]
  })
  // electrum ingot -> 2 rods
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createaddition:electrum_rod' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_electrum', amount: 45 }]
  })
  // iron ingot -> 2 rods
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createaddition:iron_rod' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 45 }]
  })
  // gold ingot -> 2 rods
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createaddition:gold_rod' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_gold', amount: 45 }]
  })
  // copper ingot -> 2 rods
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createaddition:copper_rod' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 45 }]
  })
  // brass ingot -> 2 rods
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createaddition:brass_rod' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 45 }]
  })
  // spool + gold wire
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createaddition:gold_spool' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_gold', amount: 135 }]
  })
  // spool + copper wire
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createaddition:copper_spool' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 135 }]
  })
  // spool + electrum wire
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createaddition:electrum_spool' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_electrum', amount: 135 }]
  })
  // industrial iron nugget = iron content
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:industrial_iron_nugget' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 10 }]
  })
  // 9 nuggets
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:industrial_iron_ingot' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  })
  // pressed from 1 iron nugget
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:industrial_iron_coin' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 10 }]
  })
  // 4 coins
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:industrial_iron_coinstack' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 40 }]
  })
  // pressed from 1 vanilla iron nugget
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:iron_coin' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 10 }]
  })
  // 4 coins
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:iron_coinstack' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 40 }]
  })
  // pressed from 1 vanilla gold nugget
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:gold_coin' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_gold', amount: 10 }]
  })
  // 4 coins
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:gold_coinstack' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_gold', amount: 40 }]
  })
  // pressed from 1 create copper nugget
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:copper_coin' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 10 }]
  })
  // 4 coins
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:copper_coinstack' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 40 }]
  })
  // pressed from 1 create brass nugget
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:brass_coin' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 10 }]
  })
  // 4 coins
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:brass_coinstack' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 40 }]
  })
  // pressed from 1 create zinc nugget
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:zinc_coin' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_zinc', amount: 10 }]
  })
  // 4 coins
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:zinc_coinstack' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_zinc', amount: 40 }]
  })
  // pressed from 1 createdeco netherite nugget
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:netherite_coin' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_netherite', amount: 10 }]
  })
  // 4 coins
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:netherite_coinstack' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_netherite', amount: 40 }]
  })
  // 1/9 cast iron ingot (iron family)
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createbigcannons:cast_iron_nugget' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 10 }]
  })
  // 9 nuggets
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createbigcannons:cast_iron_ingot' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  })
  // prismarine + 1 copper nugget
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_aquatic_ambitions:prismarine_alloy' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 10 }]
  })
  // 9x prismarine alloy
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_aquatic_ambitions:prismarine_alloy_block' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 90 }]
  })
  // 1 prismarine alloy
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_aquatic_ambitions:prismarine_alloy_rod' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 10 }]
  })
})
