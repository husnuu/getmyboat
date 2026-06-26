-- Captain auth: profiles are standalone rows (no longer mirrored from auth.users).
ALTER TABLE "profiles" DROP CONSTRAINT IF EXISTS "profiles_auth_users_fk";

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
