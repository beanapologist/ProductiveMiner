import { pgTable, text, timestamp, integer, boolean, json, uuid, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const workTypeEnum = pgEnum('work_type', [
  'Prime Pattern Discovery',
  'Riemann Zero Computation',
  'Yang-Mills Field Theory',
  'Goldbach Conjecture Verification',
  'Navier-Stokes Simulation',
  'Birch-Swinnerton-Dyer',
  'Elliptic Curve Cryptography',
  'Lattice Cryptography',
  'Poincaré Conjecture'
]);

export const sessionStatusEnum = pgEnum('session_status', [
  'active',
  'paused',
  'completed',
  'failed'
]);

export const learningStatusEnum = pgEnum('learning_status', [
  'initializing',
  'training',
  'evaluating',
  'optimizing',
  'completed',
  'failed'
]);

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  wallet: text('wallet').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Blocks table
export const blocks = pgTable('blocks', {
  id: uuid('id').primaryKey().defaultRandom(),
  hash: text('hash').notNull().unique(),
  previousHash: text('previous_hash'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  difficulty: integer('difficulty').notNull(),
  nonce: integer('nonce').notNull(),
  merkleRoot: text('merkle_root').notNull(),
  transactions: json('transactions').notNull(),
  minerId: uuid('miner_id').notNull().references(() => users.id),
  height: integer('height').notNull().unique(),
  scientificValue: integer('scientific_value').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Mining sessions table
export const miningSessions = pgTable('mining_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  status: sessionStatusEnum('status').notNull().default('active'),
  workType: workTypeEnum('work_type').notNull(),
  difficulty: integer('difficulty').notNull(),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  endedAt: timestamp('ended_at'),
  progress: integer('progress').notNull().default(0),
  result: text('result'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Discoveries table
export const discoveries = pgTable('discoveries', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').notNull().references(() => miningSessions.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  blockId: uuid('block_id').references(() => blocks.id),
  workType: workTypeEnum('work_type').notNull(),
  difficulty: integer('difficulty').notNull(),
  result: text('result').notNull(),
  proofOfWork: text('proof_of_work').notNull(),
  quantumSecurity: integer('quantum_security').notNull().default(256),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  reward: integer('reward').notNull().default(0),
  verified: boolean('verified').notNull().default(false),
  scientificImpact: integer('scientific_impact').notNull().default(0)
});

// Algorithm optimizations table
export const algorithmOptimizations = pgTable('algorithm_optimizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  workType: workTypeEnum('work_type').notNull(),
  optimizationType: text('optimization_type').notNull(),
  parameters: json('parameters').notNull(),
  performanceGain: integer('performance_gain').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  isActive: boolean('is_active').notNull().default(true),
  appliedBy: uuid('applied_by').references(() => users.id)
});

// Learning cycles table
export const learningCycles = pgTable('learning_cycles', {
  id: uuid('id').primaryKey().defaultRandom(),
  status: learningStatusEnum('status').notNull().default('initializing'),
  workType: workTypeEnum('work_type').notNull(),
  trainingData: json('training_data').notNull(),
  modelParameters: json('model_parameters').notNull(),
  accuracy: integer('accuracy'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
  createdBy: uuid('created_by').notNull().references(() => users.id)
});

// System configuration table
export const systemConfig = pgTable('system_config', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  description: text('description'),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  blocks: many(blocks),
  miningSessions: many(miningSessions),
  discoveries: many(discoveries),
  algorithmOptimizations: many(algorithmOptimizations),
  learningCycles: many(learningCycles)
}));

export const blocksRelations = relations(blocks, ({ one, many }) => ({
  miner: one(users, {
    fields: [blocks.minerId],
    references: [users.id]
  }),
  discoveries: many(discoveries)
}));

export const miningSessionsRelations = relations(miningSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [miningSessions.userId],
    references: [users.id]
  }),
  discoveries: many(discoveries)
}));

export const discoveriesRelations = relations(discoveries, ({ one }) => ({
  session: one(miningSessions, {
    fields: [discoveries.sessionId],
    references: [miningSessions.id]
  }),
  user: one(users, {
    fields: [discoveries.userId],
    references: [users.id]
  }),
  block: one(blocks, {
    fields: [discoveries.blockId],
    references: [blocks.id]
  })
}));

export const algorithmOptimizationsRelations = relations(algorithmOptimizations, ({ one }) => ({
  appliedBy: one(users, {
    fields: [algorithmOptimizations.appliedBy],
    references: [users.id]
  })
}));

export const learningCyclesRelations = relations(learningCycles, ({ one }) => ({
  createdBy: one(users, {
    fields: [learningCycles.createdBy],
    references: [users.id]
  })
})); 