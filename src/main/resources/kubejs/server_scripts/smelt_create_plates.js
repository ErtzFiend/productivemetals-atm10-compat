// smelt_create_plates.js — v1.3.0: plate-based Create-family items melted via Productive Metalworks.
// Rule (user-set): 1 metal plate = 1 ingot = 90 mB. Every yield = (plates x 90) / recipe output count,
// rounded to the nearest 5 mB, floor 5. Derived from the Create-family recipe JSONs on the live
// ATM10 modlist (verified 2026-09-01). Mixed-metal items (2+ different plates) are deliberately
// skipped — no honest single fluid. PMW's own tag melts already cover bare plates; this file
// covers the ITEMS crafted from them: girders, vaults, pipes, chutes, toolboxes, catwalks, etc.
ServerEvents.recipes(event => {

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'aeronautics_utility_objects:damping_stress_bearing' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/aeronautics_utility_objects_damping_stress_bearing')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'aeronautics_utility_objects:hydraulic_connection_head' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/aeronautics_utility_objects_hydraulic_connection_head')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'aeronautics_utility_objects:hydraulic_hinge_head' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/aeronautics_utility_objects_hydraulic_hinge_head')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'aeronautics_utility_objects:hydraulic_rod' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/aeronautics_utility_objects_hydraulic_rod')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'aeronautics_utility_objects:universal_joint_rod' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/aeronautics_utility_objects_universal_joint_rod')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:brown_toolbox' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_gold', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_brown_toolbox')

  // 1 plate(s) over 4 output = 22.5 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:chute' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 20 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_chute')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:copper_valve_handle' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_copper_valve_handle')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:desk_bell' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_gold', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_desk_bell')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:elevator_pulley' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_elevator_pulley')

  // 1 plate(s) over 4 output = 22.5 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:fluid_pipe' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 20 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_fluid_pipe')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:fluid_tank' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_fluid_tank')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:fluid_valve' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_fluid_valve')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:goggles' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_gold', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_goggles')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:hose_pulley' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_hose_pulley')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:item_vault' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_item_vault')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:mechanical_arm' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_mechanical_arm')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:mechanical_harvester' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_mechanical_harvester')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:mechanical_plough' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_mechanical_plough')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:mechanical_saw' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_mechanical_saw')

  // 1 plate(s) over 8 output = 11.25 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:metal_girder' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 10 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_metal_girder')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:minecart_coupling' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_minecart_coupling')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:peculiar_bell' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_peculiar_bell')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:placard' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_placard')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:precision_mechanism' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_gold', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_precision_mechanism')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:propeller' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_propeller')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:pulse_extender' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_pulse_extender')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:pulse_repeater' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_pulse_repeater')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:pulse_timer' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_pulse_timer')

  // 1 plate(s) over 2 output = 45.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:redstone_contact' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 45 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_redstone_contact')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:rope_pulley' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_rope_pulley')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:smart_chute' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_smart_chute')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:smart_fluid_pipe' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_smart_fluid_pipe')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:steam_engine' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_gold', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_steam_engine')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:steam_whistle' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_gold', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_steam_whistle')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:super_glue' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_super_glue')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:transmitter' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_transmitter')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:weighted_ejector' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_gold', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_weighted_ejector')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:whisk' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_whisk')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:wrench' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_gold', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_wrench')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_aeronautics_toolgun:magnetic_gun' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_aeronautics_toolgun_magnetic_gun')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_aeronautics_toolgun:survival_structure_tool' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_aeronautics_toolgun_survival_structure_tool')

  // 1 plate(s) over 4 output = 22.5 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_connected:brass_chute' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 20 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_connected_brass_chute')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_connected:centrifugal_clutch' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_connected_centrifugal_clutch')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_connected:control_chip' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_gold', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_connected_control_chip')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_connected:fluid_vessel' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_connected_fluid_vessel')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_connected:freewheel_clutch' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_connected_freewheel_clutch')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_connected:item_silo' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_connected_item_silo')

  // 1 plate(s) over 8 output = 11.25 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_connected:kinetic_battery' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 10 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_connected_kinetic_battery')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_connected:overstress_clutch' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_connected_overstress_clutch')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_connected:sequenced_pulse_generator' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_connected_sequenced_pulse_generator')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_dragons_plus:fragile_fluid_tank' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_dragons_plus_fragile_fluid_tank')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_enchantment_industry:affix_augmentor' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_enchantment_industry_affix_augmentor')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_enchantment_industry:infuser' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_enchantment_industry_infuser')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_enchantment_industry:printer' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_enchantment_industry_printer')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_factory:black_jar' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_factory_black_jar')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_factory:blue_jar' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_factory_blue_jar')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_factory:brown_jar' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_factory_brown_jar')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_factory:cyan_jar' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_factory_cyan_jar')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_factory:gray_jar' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_factory_gray_jar')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_factory:green_jar' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_factory_green_jar')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_factory:light_blue_jar' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_factory_light_blue_jar')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_factory:light_gray_jar' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_factory_light_gray_jar')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_factory:lime_jar' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_factory_lime_jar')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_factory:magenta_jar' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_factory_magenta_jar')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_factory:orange_jar' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_factory_orange_jar')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_factory:pink_jar' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_factory_pink_jar')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_factory:purple_jar' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_factory_purple_jar')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_factory:red_jar' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_factory_red_jar')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_factory:white_jar' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_factory_white_jar')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_factory:yellow_jar' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_factory_yellow_jar')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_factory_logistics:fluid_mechanism' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_factory_logistics_fluid_mechanism')

  // 1 plate(s) over 16 output = 5.625 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_hypertube:hypertube' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 5 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_hypertube_hypertube')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_hypertube:hypertube_funnel' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_hypertube_hypertube_funnel')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_hypertube:hypertube_junction' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_hypertube_hypertube_junction')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_pattern_schematics:empty_pattern_schematic' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_pattern_schematics_empty_pattern_schematic')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_submarine:ballast_tank' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_submarine_ballast_tank')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_submarine:pulley' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_submarine_pulley')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_submarine:steel_cable' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_submarine_steel_cable')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_the_air_wars:rocket_engine' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_the_air_wars_rocket_engine')

  // 4 plate(s) over 1 output = 360.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_things_and_misc:card_press' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 360 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_things_and_misc_card_press')

  // 5 plate(s) over 1 output = 450.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_things_and_misc:card_reader' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 450 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_things_and_misc_card_reader')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_things_and_misc:empty_card' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_things_and_misc_empty_card')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_things_and_misc:glue_packaging' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_things_and_misc_glue_packaging')

  // 2 plate(s) over 1 output = 180.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_things_and_misc:portable_whistle' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_gold', amount: 180 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_things_and_misc_portable_whistle')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create_things_and_misc:spout_gun' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_things_and_misc_spout_gun')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createaddition:alternator' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createaddition_alternator')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createaddition:digital_adapter' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createaddition_digital_adapter')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createaddition:electric_motor' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createaddition_electric_motor')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createaddition:electrum_amulet' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_zinc', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createaddition_electrum_amulet')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createaddition:rolling_mill' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createaddition_rolling_mill')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createaddition:tesla_coil' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createaddition_tesla_coil')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createbigcannons:autocannon_ammo_container' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createbigcannons_autocannon_ammo_container')

  // 1 plate(s) over 4 output = 22.5 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createbigcannons:big_cartridge_sheet' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 20 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createbigcannons_big_cartridge_sheet')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createbigcannons:cannon_builder' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createbigcannons_cannon_builder')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createbigcannons:cannon_mount' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createbigcannons_cannon_mount')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createbigcannons:drop_mortar_shell' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createbigcannons_drop_mortar_shell')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createbigcannons:fixed_cannon_mount' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createbigcannons_fixed_cannon_mount')

  // 1 plate(s) over 2 output = 45.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createbigcannons:flak_autocannon_round' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 45 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createbigcannons_flak_autocannon_round')

  // 1 plate(s) over 2 output = 45.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createbigcannons:pair_of_cannon_wheels' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 45 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createbigcannons_pair_of_cannon_wheels')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createbigcannons:smoke_shell' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createbigcannons_smoke_shell')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createbigcannons:wrought_iron_cannon_chamber' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createbigcannons_wrought_iron_cannon_chamber')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createbigcannons:wrought_iron_cannon_end' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createbigcannons_wrought_iron_cannon_end')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createbionics:anole_tail_item' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createbionics_anole_tail_item')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createbionics:oxhauler_head_item' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createbionics_oxhauler_head_item')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createbionics:replete_leg_item' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createbionics_replete_leg_item')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createbionics:simple_engine' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createbionics_simple_engine')

  // 1 plate(s) over 16 output = 5.625 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:andesite_bars_overlay' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 5 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_andesite_bars_overlay')

  // 1 plate(s) over 4 output = 22.5 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:andesite_catwalk' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 20 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_andesite_catwalk')

  // 1 plate(s) over 8 output = 11.25 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:andesite_catwalk_railing' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 10 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_andesite_catwalk_railing')

  // 1 plate(s) over 2 output = 45.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:andesite_hull' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 45 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_andesite_hull')

  // 1 plate(s) over 16 output = 5.625 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:andesite_mesh_fence' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 5 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_andesite_mesh_fence')

  // 1 plate(s) over 4 output = 22.5 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:andesite_sheet_metal' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 20 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_andesite_sheet_metal')

  // 1 plate(s) over 3 output = 30.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:andesite_support_wedge' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 30 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_andesite_support_wedge')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:black_placard' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_black_placard')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:black_shipping_container' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_black_shipping_container')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:blue_andesite_lamp' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_blue_andesite_lamp')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:blue_brass_lamp' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_blue_brass_lamp')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:blue_copper_lamp' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_blue_copper_lamp')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:blue_industrial_iron_lamp' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_blue_industrial_iron_lamp')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:blue_iron_lamp' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_blue_iron_lamp')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:blue_placard' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_blue_placard')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:blue_shipping_container' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_blue_shipping_container')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:blue_zinc_lamp' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_zinc', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_blue_zinc_lamp')

  // 1 plate(s) over 16 output = 5.625 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:brass_bars_overlay' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 5 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_brass_bars_overlay')

  // 1 plate(s) over 4 output = 22.5 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:brass_catwalk' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 20 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_brass_catwalk')

  // 1 plate(s) over 8 output = 11.25 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:brass_catwalk_railing' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 10 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_brass_catwalk_railing')

  // 1 plate(s) over 2 output = 45.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:brass_hull' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 45 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_brass_hull')

  // 1 plate(s) over 16 output = 5.625 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:brass_mesh_fence' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 5 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_brass_mesh_fence')

  // 1 plate(s) over 4 output = 22.5 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:brass_sheet_metal' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 20 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_brass_sheet_metal')

  // 1 plate(s) over 3 output = 30.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:brass_support_wedge' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 30 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_brass_support_wedge')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:brown_placard' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_brown_placard')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:brown_shipping_container' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_brown_shipping_container')

  // 1 plate(s) over 16 output = 5.625 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:copper_bars_overlay' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 5 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_copper_bars_overlay')

  // 1 plate(s) over 4 output = 22.5 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:copper_catwalk' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 20 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_copper_catwalk')

  // 1 plate(s) over 8 output = 11.25 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:copper_catwalk_railing' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 10 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_copper_catwalk_railing')

  // 1 plate(s) over 2 output = 45.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:copper_hull' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 45 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_copper_hull')

  // 1 plate(s) over 16 output = 5.625 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:copper_mesh_fence' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 5 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_copper_mesh_fence')

  // 1 plate(s) over 4 output = 22.5 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:copper_sheet_metal' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 20 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_copper_sheet_metal')

  // 1 plate(s) over 3 output = 30.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:copper_support_wedge' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 30 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_copper_support_wedge')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:cyan_placard' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_cyan_placard')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:cyan_shipping_container' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_cyan_shipping_container')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:gray_placard' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_gray_placard')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:gray_shipping_container' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_gray_shipping_container')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:green_andesite_lamp' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_green_andesite_lamp')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:green_brass_lamp' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_green_brass_lamp')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:green_copper_lamp' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_green_copper_lamp')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:green_industrial_iron_lamp' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_green_industrial_iron_lamp')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:green_iron_lamp' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_green_iron_lamp')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:green_placard' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_green_placard')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:green_shipping_container' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_green_shipping_container')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:green_zinc_lamp' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_zinc', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_green_zinc_lamp')

  // 1 plate(s) over 16 output = 5.625 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:industrial_iron_bars_overlay' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 5 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_industrial_iron_bars_overlay')

  // 1 plate(s) over 4 output = 22.5 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:industrial_iron_catwalk' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 20 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_industrial_iron_catwalk')

  // 1 plate(s) over 8 output = 11.25 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:industrial_iron_catwalk_railing' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 10 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_industrial_iron_catwalk_railing')

  // 1 plate(s) over 2 output = 45.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:industrial_iron_hull' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 45 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_industrial_iron_hull')

  // 1 plate(s) over 16 output = 5.625 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:industrial_iron_mesh_fence' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 5 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_industrial_iron_mesh_fence')

  // 1 plate(s) over 4 output = 22.5 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:industrial_iron_sheet_metal' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 20 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_industrial_iron_sheet_metal')

  // 1 plate(s) over 3 output = 30.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:industrial_iron_support_wedge' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 30 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_industrial_iron_support_wedge')

  // 1 plate(s) over 16 output = 5.625 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:iron_bars_overlay' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 5 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_iron_bars_overlay')

  // 1 plate(s) over 4 output = 22.5 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:iron_catwalk' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 20 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_iron_catwalk')

  // 1 plate(s) over 8 output = 11.25 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:iron_catwalk_railing' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 10 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_iron_catwalk_railing')

  // 1 plate(s) over 2 output = 45.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:iron_hull' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 45 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_iron_hull')

  // 1 plate(s) over 16 output = 5.625 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:iron_mesh_fence' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 5 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_iron_mesh_fence')

  // 1 plate(s) over 4 output = 22.5 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:iron_sheet_metal' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 20 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_iron_sheet_metal')

  // 1 plate(s) over 3 output = 30.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:iron_support_wedge' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 30 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_iron_support_wedge')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:light_blue_placard' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_light_blue_placard')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:light_blue_shipping_container' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_light_blue_shipping_container')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:light_gray_placard' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_light_gray_placard')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:light_gray_shipping_container' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_light_gray_shipping_container')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:lime_placard' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_lime_placard')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:lime_shipping_container' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_lime_shipping_container')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:magenta_placard' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_magenta_placard')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:magenta_shipping_container' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_magenta_shipping_container')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:orange_placard' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_orange_placard')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:orange_shipping_container' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_orange_shipping_container')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:pink_placard' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_pink_placard')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:pink_shipping_container' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_pink_shipping_container')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:purple_placard' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_purple_placard')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:purple_shipping_container' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_purple_shipping_container')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:red_andesite_lamp' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_red_andesite_lamp')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:red_brass_lamp' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_red_brass_lamp')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:red_copper_lamp' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_red_copper_lamp')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:red_industrial_iron_lamp' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_red_industrial_iron_lamp')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:red_iron_lamp' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_red_iron_lamp')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:red_placard' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_red_placard')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:red_shipping_container' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_red_shipping_container')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:red_zinc_lamp' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_zinc', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_red_zinc_lamp')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:white_shipping_container' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_white_shipping_container')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:yellow_andesite_lamp' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_yellow_andesite_lamp')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:yellow_brass_lamp' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_yellow_brass_lamp')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:yellow_copper_lamp' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_yellow_copper_lamp')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:yellow_industrial_iron_lamp' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_yellow_industrial_iron_lamp')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:yellow_iron_lamp' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_yellow_iron_lamp')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:yellow_placard' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_yellow_placard')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:yellow_shipping_container' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_yellow_shipping_container')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:yellow_zinc_lamp' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_zinc', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_yellow_zinc_lamp')

  // 1 plate(s) over 16 output = 5.625 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:zinc_bars_overlay' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_zinc', amount: 5 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_zinc_bars_overlay')

  // 1 plate(s) over 4 output = 22.5 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:zinc_catwalk' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_zinc', amount: 20 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_zinc_catwalk')

  // 1 plate(s) over 8 output = 11.25 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:zinc_catwalk_railing' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_zinc', amount: 10 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_zinc_catwalk_railing')

  // 1 plate(s) over 2 output = 45.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:zinc_hull' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_zinc', amount: 45 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_zinc_hull')

  // 1 plate(s) over 16 output = 5.625 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:zinc_mesh_fence' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_zinc', amount: 5 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_zinc_mesh_fence')

  // 1 plate(s) over 4 output = 22.5 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:zinc_sheet_metal' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_zinc', amount: 20 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_zinc_sheet_metal')

  // 1 plate(s) over 3 output = 30.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createdeco:zinc_support_wedge' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_zinc', amount: 30 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createdeco_zinc_support_wedge')

  // 1 plate(s) over 4 output = 22.5 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createpropulsion:cable' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_platinum', amount: 20 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createpropulsion_cable')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createpropulsion:liquid_burner' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createpropulsion_liquid_burner')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createpropulsion:liquid_vector_thruster' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createpropulsion_liquid_vector_thruster')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createpropulsion:platinum_fluid_tank' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_platinum', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createpropulsion_platinum_fluid_tank')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createpropulsion:platinum_fluid_vessel' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_platinum', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createpropulsion_platinum_fluid_vessel')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createpropulsion:redstone_converter' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_platinum', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createpropulsion_redstone_converter')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createpropulsion:stirling_engine' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_copper', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createpropulsion_stirling_engine')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createpropulsion:tilt_adapter' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createpropulsion_tilt_adapter')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createpropulsion:vector_thruster' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_platinum', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createpropulsion_vector_thruster')

  // 1 plate(s) over 4 output = 22.5 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createpropulsion:wing' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 20 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createpropulsion_wing')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createrailwaysnavigator:train_station_clock' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createrailwaysnavigator_train_station_clock')

  // 1 plate(s) over 6 output = 15.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createthrusters:andesite_cable' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 15 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createthrusters_andesite_cable')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createthrusters:configuration_clipboard' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createthrusters_configuration_clipboard')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createthrusters:fuel_oxidizer' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createthrusters_fuel_oxidizer')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createthrusters:powered_zipline' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createthrusters_powered_zipline')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createthrusters:processing_upgrade_haunting_t1' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createthrusters_processing_upgrade_haunting_t1')

  // 2 plate(s) over 1 output = 180.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createthrusters:processing_upgrade_haunting_t2' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 180 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createthrusters_processing_upgrade_haunting_t2')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createthrusters:processing_upgrade_haunting_t3' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createthrusters_processing_upgrade_haunting_t3')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createthrusters:processing_upgrade_haunting_t4' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createthrusters_processing_upgrade_haunting_t4')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createthrusters:processing_upgrade_smelting_t1' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createthrusters_processing_upgrade_smelting_t1')

  // 2 plate(s) over 1 output = 180.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createthrusters:processing_upgrade_smelting_t2' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 180 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createthrusters_processing_upgrade_smelting_t2')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createthrusters:processing_upgrade_smelting_t3' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createthrusters_processing_upgrade_smelting_t3')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createthrusters:processing_upgrade_smelting_t4' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createthrusters_processing_upgrade_smelting_t4')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createthrusters:processing_upgrade_smoking_t1' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createthrusters_processing_upgrade_smoking_t1')

  // 2 plate(s) over 1 output = 180.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createthrusters:processing_upgrade_smoking_t2' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 180 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createthrusters_processing_upgrade_smoking_t2')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createthrusters:processing_upgrade_smoking_t3' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createthrusters_processing_upgrade_smoking_t3')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createthrusters:processing_upgrade_smoking_t4' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createthrusters_processing_upgrade_smoking_t4')

  // 1 plate(s) over 1 output = 90.0 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'immersiveengineering:blastbrick_reinforced' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_steel', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/immersiveengineering_blastbrick_reinforced')

  // 1 plate(s) over 4 output = 22.5 mB
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'sable_kardanwelle:cardan_connector' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 20 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/sable_kardanwelle_cardan_connector')

  // sequenced assembly applies 2x iron/zinc nugget per track (iron basis)
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:track' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_iron', amount: 10 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_track')

  // railway_casing (90 brass) / 4 output
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:track_signal' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 20 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_track_signal')

  // railway_casing (90 brass) / 2 output
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:track_station' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 45 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_track_station')

  // railway_casing (90 brass) / 2 output
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:track_observer' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_brass', amount: 45 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_track_observer')

  // sequenced assembly from 1 obsidian dust (PMW dust melt = 250)
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:sturdy_sheet' },
    minimum_temperature: 1400,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_obsidian', amount: 250 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_sturdy_sheet')

  // 1x lead plate via item_application
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'immersiveengineering:concrete_leaded' },
    minimum_temperature: 1000,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_lead', amount: 90 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/immersiveengineering_concrete_leaded')

  // sturdy_sheet (250 obsidian) / 4 output
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'create:schedule' },
    minimum_temperature: 1400,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_obsidian', amount: 65 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/create_schedule')

  // sturdy_sheet (250 obsidian) / 6 output
  event.custom({
    type: 'productivemetalworks:item_melting',
    ingredient: { item: 'createrailwaysnavigator:advanced_display' },
    minimum_temperature: 1400,
    maximum_temperature: 0,
    result: [{ id: 'productivemetalworks:molten_obsidian', amount: 40 }]
  }).id('allthemods:productive_metalworks/foundry/create_plates/createrailwaysnavigator_advanced_display')

})
