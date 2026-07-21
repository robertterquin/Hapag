# Password registration

Hapag’s account screen now supports email/password sign-in and password registration.

Registration collects full name, email, password, and confirmation password. The full name is sent as Supabase user metadata under `full_name`; the existing `handle_new_user` database trigger uses that metadata when creating the private `profiles` row and also creates default `user_preferences`.

The client requires a non-empty name, valid email, password length of at least eight characters, and matching passwords. Sign-in uses Supabase email/password authentication. If Supabase returns a session after registration, the user is immediately signed in. If the project requires email confirmation, the screen explains that the user must verify their email first.
