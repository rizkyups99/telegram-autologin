import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from "./schema";
// For server-side only
let db: ReturnType<typeof drizzle>;
// Only initialize postgres on the server side
if (typeof window === 'undefined') {
	// Dynamic import to avoid client-side import
	const initDb = async () => {
		const postgres = (await import('postgres')).default;
		const sql = postgres(process.env.DATABASE_URL || '', { prepare: false });
		return drizzle({ client: sql, schema });
	};

	// Initialize db (will only run on server)
	initDb().then(drizzleInstance => {
		db = drizzleInstance;
	});
} else {
	// Provide a dummy db object for client-side
	db = {} as ReturnType<typeof drizzle>;
}
export { db };
