// smelt_create_plates.js
// Melts Create-family items that are crafted from metal plates. Rule: 1 plate = 1 ingot
// = 90 mB, so an item melts for (plates in recipe x 90) / recipe output count, floored
// to a multiple of 5 mB (minimum 5). Items made from 2+ different plates are skipped -
// there is no honest single fluid for them.
//
// FLUIDS is scoped INSIDE the event callback on purpose: top-level const names are
// shared across every script in KubeJS's Rhino scope, and two files both declaring
// `const FLUIDS` silently kill the alphabetically-later one with a redeclaration error.

function meltAmount(plates, outputs) {
    return Math.max(5, Math.floor(plates * 90 / outputs / 5) * 5)
}

ServerEvents.recipes(event => {
    const FLUIDS = {
        brass: 'productivemetalworks:molten_brass',
        copper: 'productivemetalworks:molten_copper',
        gold: 'productivemetalworks:molten_gold',
        iron: 'productivemetalworks:molten_iron',
        lead: 'productivemetalworks:molten_lead',
        obsidian: 'productivemetalworks:molten_obsidian',
        platinum: 'productivemetalworks:molten_platinum',
        steel: 'productivemetalworks:molten_steel',
        zinc: 'productivemetalworks:molten_zinc',
    }
    // plate-crafted items: [item, plates in recipe, recipe output count, metal]
    const PLATE_CRAFTED = [
        ['aeronautics_utility_objects:damping_stress_bearing', 1, 1, 'copper'],
        ['aeronautics_utility_objects:hydraulic_connection_head', 1, 1, 'iron'],
        ['aeronautics_utility_objects:hydraulic_hinge_head', 1, 1, 'iron'],
        ['aeronautics_utility_objects:hydraulic_rod', 1, 1, 'brass'],
        ['aeronautics_utility_objects:universal_joint_rod', 1, 1, 'brass'],
        ['create:brown_toolbox', 1, 1, 'gold'],
        ['create:chute', 1, 4, 'iron'],
        ['create:copper_valve_handle', 1, 1, 'copper'],
        ['create:elevator_pulley', 1, 1, 'iron'],
        ['create:fluid_pipe', 1, 4, 'copper'],
        ['create:fluid_tank', 1, 1, 'copper'],
        ['create:fluid_valve', 1, 1, 'iron'],
        ['create:goggles', 1, 1, 'gold'],
        ['create:hose_pulley', 1, 1, 'copper'],
        ['create:item_vault', 1, 1, 'iron'],
        ['create:mechanical_arm', 1, 1, 'brass'],
        ['create:mechanical_harvester', 1, 1, 'iron'],
        ['create:mechanical_plough', 1, 1, 'iron'],
        ['create:mechanical_saw', 1, 1, 'iron'],
        ['create:metal_girder', 1, 8, 'iron'],
        ['create:minecart_coupling', 1, 1, 'iron'],
        ['create:placard', 1, 1, 'brass'],
        ['create:precision_mechanism', 1, 1, 'gold'],
        ['create:propeller', 1, 1, 'iron'],
        ['create:pulse_extender', 1, 1, 'brass'],
        ['create:pulse_repeater', 1, 1, 'brass'],
        ['create:pulse_timer', 1, 1, 'brass'],
        ['create:redstone_contact', 1, 2, 'iron'],
        ['create:rope_pulley', 1, 1, 'iron'],
        ['create:smart_chute', 1, 1, 'brass'],
        ['create:smart_fluid_pipe', 1, 1, 'brass'],
        ['create:steam_engine', 1, 1, 'gold'],
        ['create:steam_whistle', 1, 1, 'gold'],
        ['create:super_glue', 1, 1, 'iron'],
        ['create:transmitter', 1, 1, 'copper'],
        ['create:weighted_ejector', 1, 1, 'gold'],
        ['create:whisk', 1, 1, 'iron'],
        ['create:wrench', 1, 1, 'gold'],
        ['create_aeronautics_toolgun:magnetic_gun', 1, 1, 'copper'],
        ['create_aeronautics_toolgun:survival_structure_tool', 1, 1, 'brass'],
        ['create_connected:brass_chute', 1, 4, 'brass'],
        ['create_connected:centrifugal_clutch', 1, 1, 'iron'],
        ['create_connected:control_chip', 1, 1, 'gold'],
        ['create_connected:fluid_vessel', 1, 1, 'copper'],
        ['create_connected:freewheel_clutch', 1, 1, 'iron'],
        ['create_connected:item_silo', 1, 1, 'iron'],
        ['create_connected:kinetic_battery', 1, 8, 'iron'],
        ['create_connected:overstress_clutch', 1, 1, 'iron'],
        ['create_connected:sequenced_pulse_generator', 1, 1, 'brass'],
        ['create_dragons_plus:fragile_fluid_tank', 1, 1, 'copper'],
        ['create_enchantment_industry:affix_augmentor', 1, 1, 'brass'],
        ['create_enchantment_industry:infuser', 1, 1, 'brass'],
        ['create_enchantment_industry:printer', 1, 1, 'brass'],
        ['create_factory_logistics:fluid_mechanism', 1, 1, 'copper'],
        ['create_hypertube:hypertube', 1, 16, 'brass'],
        ['create_hypertube:hypertube_funnel', 1, 1, 'brass'],
        ['create_hypertube:hypertube_junction', 1, 1, 'brass'],
        ['create_pattern_schematics:empty_pattern_schematic', 1, 1, 'iron'],
        ['create_submarine:ballast_tank', 1, 1, 'iron'],
        ['create_submarine:pulley', 1, 1, 'iron'],
        ['create_submarine:steel_cable', 1, 1, 'iron'],
        ['create_the_air_wars:rocket_engine', 1, 1, 'copper'],
        ['create_things_and_misc:card_press', 4, 1, 'brass'],
        ['create_things_and_misc:card_reader', 5, 1, 'brass'],
        ['create_things_and_misc:empty_card', 1, 1, 'copper'],
        ['create_things_and_misc:glue_packaging', 1, 1, 'iron'],
        ['create_things_and_misc:portable_whistle', 2, 1, 'gold'],
        ['create_things_and_misc:spout_gun', 1, 1, 'copper'],
        ['createaddition:alternator', 1, 1, 'iron'],
        ['createaddition:digital_adapter', 1, 1, 'brass'],
        ['createaddition:electric_motor', 1, 1, 'brass'],
        ['createaddition:electrum_amulet', 1, 1, 'zinc'],
        ['createaddition:rolling_mill', 1, 1, 'iron'],
        ['createaddition:tesla_coil', 1, 1, 'brass'],
        ['createbigcannons:autocannon_ammo_container', 1, 1, 'iron'],
        ['createbigcannons:big_cartridge_sheet', 1, 4, 'brass'],
        ['createbigcannons:cannon_builder', 1, 1, 'iron'],
        ['createbigcannons:cannon_mount', 1, 1, 'iron'],
        ['createbigcannons:drop_mortar_shell', 1, 1, 'iron'],
        ['createbigcannons:fixed_cannon_mount', 1, 1, 'iron'],
        ['createbigcannons:flak_autocannon_round', 1, 2, 'iron'],
        ['createbigcannons:pair_of_cannon_wheels', 1, 2, 'iron'],
        ['createbigcannons:smoke_shell', 1, 1, 'iron'],
        ['createbigcannons:wrought_iron_cannon_chamber', 1, 1, 'iron'],
        ['createbigcannons:wrought_iron_cannon_end', 1, 1, 'iron'],
        ['createbionics:anole_tail_item', 1, 1, 'iron'],
        ['createbionics:oxhauler_head_item', 1, 1, 'brass'],
        ['createbionics:replete_leg_item', 1, 1, 'copper'],
        ['createbionics:simple_engine', 1, 1, 'iron'],
        ['createpropulsion:cable', 1, 4, 'platinum'],
        ['createpropulsion:liquid_burner', 1, 1, 'copper'],
        ['createpropulsion:liquid_vector_thruster', 1, 1, 'copper'],
        ['createpropulsion:platinum_fluid_tank', 1, 1, 'platinum'],
        ['createpropulsion:platinum_fluid_vessel', 1, 1, 'platinum'],
        ['createpropulsion:redstone_converter', 1, 1, 'platinum'],
        ['createpropulsion:stirling_engine', 1, 1, 'copper'],
        ['createpropulsion:tilt_adapter', 1, 1, 'iron'],
        ['createpropulsion:vector_thruster', 1, 1, 'platinum'],
        ['createpropulsion:wing', 1, 4, 'iron'],
        ['createrailwaysnavigator:train_station_clock', 1, 1, 'iron'],
        ['createthrusters:andesite_cable', 1, 6, 'iron'],
        ['createthrusters:configuration_clipboard', 1, 1, 'brass'],
        ['createthrusters:fuel_oxidizer', 1, 1, 'brass'],
        ['createthrusters:powered_zipline', 1, 1, 'brass'],
        ['immersiveengineering:blastbrick_reinforced', 1, 1, 'steel'],
        ['sable_kardanwelle:cardan_connector', 1, 4, 'iron'],
    ]

    // createdeco / create_factory families: whole color × variant grids follow one
    // cost, so generate them instead of listing each item
    const COLORS = ['black','blue','brown','cyan','gray','green','light_blue','light_gray','lime','magenta','orange','pink','purple','red','white','yellow']
    const LAMP_COLORS = ['blue','green','red','yellow']
    const LAMP_VARIANTS = [
        ['andesite_lamp', 'iron'], ['brass_lamp', 'brass'], ['copper_lamp', 'copper'],
        ['industrial_iron_lamp', 'iron'], ['iron_lamp', 'iron'], ['zinc_lamp', 'zinc'],
    ]
    const DECO_METALS = [
        ['andesite', 'iron'], ['brass', 'brass'], ['copper', 'copper'],
        ['industrial_iron', 'iron'], ['iron', 'iron'], ['zinc', 'zinc'],
    ]
    const DECO_SHAPES = [
        ['catwalk', 4], ['catwalk_railing', 8], ['hull', 2], ['mesh_fence', 16], ['sheet_metal', 4], ['support_wedge', 3],
    ]
    // createdeco makes placards in every color except white
    const PLACARD_COLORS = ['black','blue','brown','cyan','gray','green','light_blue','light_gray','lime','magenta','orange','pink','purple','red','yellow']
    const THRUSTER_TIERS = [['t1', 1], ['t2', 2], ['t3', 1], ['t4', 1]]

    // items whose recipe cost is not plates (tracks, sturdy sheet, ...): [item, metal, mB, temp]
    const BY_HAND = [
        ['create:schedule', 'obsidian', 65, 1400],
        ['create:sturdy_sheet', 'obsidian', 250, 1400],
        ['create:track', 'iron', 10, 1000],
        ['create:track_observer', 'brass', 45, 1000],
        ['create:track_signal', 'brass', 20, 1000],
        ['create:track_station', 'brass', 45, 1000],
        ['createrailwaysnavigator:advanced_display', 'obsidian', 40, 1400],
        ['immersiveengineering:concrete_leaded', 'lead', 90, 1000],
    ]

    // Rhino: declare every loop variable up here - const in loop bodies is hoisted to
    // function scope and re-declared on the 2nd iteration, which throws.
    let color, row, shape, base, tier, entry, item, plates, outputs, metal, amount, temp
    const PLATE_CRAFTED_GENERATED = []
    // jars and shipping containers: one iron plate each
    for (color of COLORS) PLATE_CRAFTED_GENERATED.push(['create_factory:' + color + '_jar', 1, 1, 'iron'])
    for (color of COLORS) PLATE_CRAFTED_GENERATED.push(['createdeco:' + color + '_shipping_container', 1, 1, 'iron'])
    for (color of PLACARD_COLORS) PLATE_CRAFTED_GENERATED.push(['createdeco:' + color + '_placard', 1, 1, 'brass'])
    for (color of LAMP_COLORS) {
        for (row of LAMP_VARIANTS) PLATE_CRAFTED_GENERATED.push(['createdeco:' + color + '_' + row[0], 1, 1, row[1]])
    }
    for (row of DECO_METALS) {
        for (shape of DECO_SHAPES) PLATE_CRAFTED_GENERATED.push(['createdeco:' + row[0] + '_' + shape[0], 1, shape[1], row[1]])
        PLATE_CRAFTED_GENERATED.push(['createdeco:' + row[0] + '_bars_overlay', 1, 16, row[1]])
    }
    for (base of ['haunting', 'smelting', 'smoking']) {
        for (tier of THRUSTER_TIERS) PLATE_CRAFTED_GENERATED.push(['createthrusters:processing_upgrade_' + base + '_' + tier[0], tier[1], 1, 'brass'])
    }

    for (entry of PLATE_CRAFTED.concat(PLATE_CRAFTED_GENERATED)) {
        item = entry[0]
        plates = entry[1]
        outputs = entry[2]
        metal = entry[3]
        event.custom({
            type: 'productivemetalworks:item_melting',
            ingredient: { item: item },
            minimum_temperature: 1000,
            maximum_temperature: 0,
            result: [{ id: FLUIDS[metal], amount: meltAmount(plates, outputs) }]
        }).id('allthemods:productive_metalworks/foundry/create_plates/' + item.replace(':', '_'))
    }

    for (entry of BY_HAND) {
        item = entry[0]
        metal = entry[1]
        amount = entry[2]
        temp = entry[3]
        event.custom({
            type: 'productivemetalworks:item_melting',
            ingredient: { item: item },
            minimum_temperature: temp,
            maximum_temperature: 0,
            result: [{ id: FLUIDS[metal], amount: amount }]
        }).id('allthemods:productive_metalworks/foundry/create_plates/' + item.replace(':', '_'))
    }

    console.log('[PMW CreatePlates] added ' + (PLATE_CRAFTED.length + PLATE_CRAFTED_GENERATED.length + BY_HAND.length) + ' melting recipes')
})
