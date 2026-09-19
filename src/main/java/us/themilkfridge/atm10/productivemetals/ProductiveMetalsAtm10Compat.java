package us.themilkfridge.atm10.productivemetals;

import net.neoforged.bus.api.IEventBus;
import net.neoforged.fml.ModContainer;
import net.neoforged.fml.common.Mod;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.Arrays;
import java.util.List;

@Mod(ProductiveMetalsAtm10Compat.MODID)
public final class ProductiveMetalsAtm10Compat {
    public static final String MODID = "productivemetalsatm10compat";

    // KubeJS scripts bundled with the mod, extracted to kubejs/server_scripts on every start
    private static final List<String> SCRIPTS = List.of(
            "smelt_tools_and_armor.js",
            "smelt_create.js",
            "smelt_create_plates.js",
            "carbon_basin_cast.js"
    );

    public ProductiveMetalsAtm10Compat(IEventBus modBus, ModContainer container) {
        // Extraction must happen during mod construction: KubeJS loads server scripts
        // before ServerAboutToStart fires, so waiting for a mod-lifecycle event is too late.
        try {
            extractScripts();
        } catch (Exception e) {
            throw new RuntimeException("[productivemetals-atm10-compat] failed to extract KubeJS scripts", e);
        }
    }

    /**
     * KubeJS 7 (1.21.1) does not load scripts from mod jars, so on every server start the
     * bundled scripts are written to kubejs/server_scripts/productivemetals_atm10_compat/.
     * Files are only rewritten when their contents changed, so /reload-visible mtimes stay
     * honest; updating the mod updates the scripts.
     */
    private static void extractScripts() throws Exception {
        Path outDir = Path.of("kubejs", "server_scripts", "productivemetals_atm10_compat");
        Files.createDirectories(outDir);

        for (String name : SCRIPTS) {
            String res = "/kubejs/server_scripts/" + name;
            try (InputStream in = ProductiveMetalsAtm10Compat.class.getResourceAsStream(res)) {
                if (in == null) {
                    throw new IllegalStateException("missing bundled script " + res);
                }
                Path target = outDir.resolve(name);
                byte[] fresh = in.readAllBytes();
                if (Files.exists(target) && Arrays.equals(Files.readAllBytes(target), fresh)) {
                    continue; // unchanged - leave the file (and its mtime) alone
                }
                Files.write(target, fresh,
                        StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING, StandardOpenOption.WRITE);
            }
        }
    }
}