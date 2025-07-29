-- ProductiveMiner Testnet Database Initialization
-- This file is executed when the PostgreSQL container starts

-- Create necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set timezone
SET timezone = 'UTC';

-- Create indexes for better performance
DO $$ 
BEGIN
  -- Only create indexes if the tables exist (after Drizzle migration)
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'blocks') THEN
    CREATE INDEX IF NOT EXISTS idx_blocks_timestamp ON blocks(timestamp);
    CREATE INDEX IF NOT EXISTS idx_blocks_difficulty ON blocks(difficulty);
    CREATE INDEX IF NOT EXISTS idx_blocks_scientific_value ON blocks(scientific_value);
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'discoveries') THEN
    CREATE INDEX IF NOT EXISTS idx_discoveries_work_type ON discoveries(work_type);
    CREATE INDEX IF NOT EXISTS idx_discoveries_difficulty ON discoveries(difficulty);
    CREATE INDEX IF NOT EXISTS idx_discoveries_block_id ON discoveries(block_id);
    CREATE INDEX IF NOT EXISTS idx_discoveries_timestamp ON discoveries(timestamp);
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'mining_sessions') THEN
    CREATE INDEX IF NOT EXISTS idx_mining_sessions_status ON mining_sessions(status);
    CREATE INDEX IF NOT EXISTS idx_mining_sessions_work_type ON mining_sessions(work_type);
    CREATE INDEX IF NOT EXISTS idx_mining_sessions_started_at ON mining_sessions(started_at);
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'algorithm_optimizations') THEN
    CREATE INDEX IF NOT EXISTS idx_algorithm_optimizations_work_type ON algorithm_optimizations(work_type);
    CREATE INDEX IF NOT EXISTS idx_algorithm_optimizations_timestamp ON algorithm_optimizations(timestamp);
    CREATE INDEX IF NOT EXISTS idx_algorithm_optimizations_is_active ON algorithm_optimizations(is_active);
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'learning_cycles') THEN
    CREATE INDEX IF NOT EXISTS idx_learning_cycles_status ON learning_cycles(status);
    CREATE INDEX IF NOT EXISTS idx_learning_cycles_timestamp ON learning_cycles(timestamp);
  END IF;
END $$;

-- Log successful initialization
INSERT INTO pg_stat_statements_info (dealloc) VALUES (0) ON CONFLICT DO NOTHING;

-- Display initialization message
DO $$
BEGIN
  RAISE NOTICE 'ProductiveMiner Testnet database initialized successfully';
  RAISE NOTICE 'Database: %', current_database();
  RAISE NOTICE 'Timestamp: %', now();
END $$; 