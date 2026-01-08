/**
 * Re-export supabase client
 * This provides backward compatibility for imports from config/supabase
 */
export * from '../services/supabase';
export { supabase as default } from '../services/supabase';
