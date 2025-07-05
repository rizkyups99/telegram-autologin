import { applyMigrationFile } from "../db/apply-migration";

async function main() {
  try {
    // You can change this to the migration file you want to apply
    const migrationFile = "0014_gorgeous_microchip.sql";
    
    console.log(`Starting manual migration: ${migrationFile}`);
    await applyMigrationFile(migrationFile);
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

main();
