import { 
  pgTable, 
  serial, 
  text, 
  timestamp, 
  integer, 
  boolean,
  primaryKey,
  uniqueIndex
} from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel, relations } from "drizzle-orm";

// Admins table
export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  accessCode: text('access_code').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull(),
  password: text('password').notNull(),
  accessCode: text('access_code').notNull(),
  name: text('name'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Categories table
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// PDFs table
export const pdfs = pgTable('pdfs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  coverUrl: text('cover_url').notNull(),
  fileUrl: text('file_url').notNull(),
  categoryId: integer('category_id').notNull().references(() => categories.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Audio table
export const audios = pgTable('audios', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  fileUrl: text('file_url').notNull(),
  categoryId: integer('category_id').notNull().references(() => categories.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Videos table
export const videos = pgTable('videos', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  videoUrl: text('video_url').notNull(),
  categoryId: integer('category_id').notNull().references(() => categories.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Telegram messages table
export const telegramMessages = pgTable('telegram_messages', {
  id: serial('id').primaryKey(),
  messageId: text('message_id').notNull().unique(),
  content: text('content').notNull(),
  phoneNumber: text('phone_number'),
  customerName: text('customer_name'),
  processed: boolean('processed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Telegram logs table
export const telegramLogs = pgTable('telegram_logs', {
  id: serial('id').primaryKey(),
  messageId: text('message_id').notNull(),
  content: text('content').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  forwarded: boolean('forwarded').default(false).notNull(),
  keyword: text('keyword'),
  error: text('error'),
});

// Telegram settings table
export const telegramSettings = pgTable('telegram_settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  pdfs: many(pdfs),
  audios: many(audios),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  pdfs: many(pdfs),
  audios: many(audios),
}));

export const pdfsRelations = relations(pdfs, ({ one }) => ({
  category: one(categories, {
    fields: [pdfs.categoryId],
    references: [categories.id],
  }),
}));

export const audiosRelations = relations(audios, ({ one }) => ({
  category: one(categories, {
    fields: [audios.categoryId],
    references: [categories.id],
  }),
}));

// Define types for database operations
export type Admin = InferSelectModel<typeof admins>;
export type NewAdmin = InferInsertModel<typeof admins>;

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

export type PDF = InferSelectModel<typeof pdfs>;
export type NewPDF = InferInsertModel<typeof pdfs>;

export type Audio = InferSelectModel<typeof audios>;
export type NewAudio = InferInsertModel<typeof audios>;

export type TelegramMessage = InferSelectModel<typeof telegramMessages>;
export type NewTelegramMessage = InferInsertModel<typeof telegramMessages>;

export type TelegramLog = InferSelectModel<typeof telegramLogs>;
export type NewTelegramLog = InferInsertModel<typeof telegramLogs>;

export type TelegramSetting = InferSelectModel<typeof telegramSettings>;
export type NewTelegramSetting = InferInsertModel<typeof telegramSettings>;

// User access tables for category filtering
// User access tables for category filtering - use 'if not exists' approach via direct SQL for these
export const userAudioAccess = pgTable('user_audio_access', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  categoryId: integer('category_id').notNull().references(() => categories.id),
}, (table) => {
  return {
    userCatIdx: uniqueIndex('user_audio_cat_idx').on(table.userId, table.categoryId)
  };
});

export const userPdfAccess = pgTable('user_pdf_access', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  categoryId: integer('category_id').notNull().references(() => categories.id),
}, (table) => {
  return {
    userCatIdx: uniqueIndex('user_pdf_cat_idx').on(table.userId, table.categoryId) 
  };
});

export const userVideoAccess = pgTable('user_video_access', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  categoryId: integer('category_id').notNull().references(() => categories.id),
}, (table) => {
  return {
    userCatIdx: uniqueIndex('user_video_cat_idx').on(table.userId, table.categoryId)
  };
});

// Define types for user access
export type UserAudioAccess = InferSelectModel<typeof userAudioAccess>;
export type NewUserAudioAccess = InferInsertModel<typeof userAudioAccess>;
export type UserPdfAccess = InferSelectModel<typeof userPdfAccess>;
export type NewUserPdfAccess = InferInsertModel<typeof userPdfAccess>;
export type UserVideoAccess = InferSelectModel<typeof userVideoAccess>;
export type NewUserVideoAccess = InferInsertModel<typeof userVideoAccess>;

export type Video = InferSelectModel<typeof videos>;
export type NewVideo = InferInsertModel<typeof videos>;
