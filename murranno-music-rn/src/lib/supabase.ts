/**
 * Re-export supabase client from services
 * This provides backward compatibility for imports from lib/supabase
 */
export * from '../services/supabase';
export { supabase as default } from '../services/supabase';
