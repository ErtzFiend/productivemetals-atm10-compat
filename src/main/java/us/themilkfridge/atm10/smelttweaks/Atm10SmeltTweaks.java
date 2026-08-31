package us.themilkfridge.atm10.smelttweaks;

import net.neoforged.fml.common.Mod;
import net.neoforged.fml.ModContainer;
import net.neoforged.bus.api.IEventBus;

import java.io.InputStream;
import java.nio.file.*;

@Mod(Atm10SmeltTweaks.MODID)
public final class Atm10SmeltTweaks {
    public static final String MODID = "atm10smelttweaks";

    public Atm10SmeltTweaks(IEventBus modBus, ModContainer container) {
        // Extract during mod construction: KubeJS loads server scripts before
        // ServerAboutToStart fires, so earlier is required for them to be picked up.
        try {
            extractScripts();
        } catch (Exception e) {
            throw new RuntimeException("[atm10-smelt-tweaks] failed to extract KubeJS scripts", e);
        }
    }

    /**
     * KubeJS 7 (1.21.1) does not load scripts from mod jars, so on every server
     * start we write the bundled scripts into kubejs/server_scripts/atm10_smelt_tweaks/.
     * Files are (re)written each start so updating the mod updates the scripts.
     */
    private static void extractScripts() throws Exception {
        Path kubejsDir = Path.of("kubejs", "server_scripts", "atm10_smelt_tweaks");
        Files.createDirectories(kubejsDir);

        String[] scripts = {"smelt_tools_and_armor.js", "carbon_basin_cast.js"};
        for (String name : scripts) {
            String res = "/kubejs/server_scripts/" + name;
            try (InputStream in = Atm10SmeltTweaks.class.getResourceAsStream(res)) {
                if (in == null) {
                    throw new IllegalStateException("missing bundled script " + res);
                }
                Path target = kubejsDir.resolve(name);
                // Rewrite only when contents differ, so /reload-visible mtimes stay honest
                byte[] fresh = in.readAllBytes();
                if (Files.exists(target) && java.util.Arrays.equals(Files.readAllBytes(target), fresh)) {
                    continue;
                }
                Files.write(target, fresh,
                        StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING, StandardOpenOption.WRITE);
            }
        }
    }
}
