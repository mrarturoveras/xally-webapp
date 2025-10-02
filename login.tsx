import { NextPage } from 'next';
import { supabase } from '../supabaseClient';

const LoginPage: NextPage = () => {
  const handleGoogleLogin = async () => {
    const redirectToBase = process.env.NEXT_PUBLIC_APP_BASE_URL;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: redirectToBase
        ? {
            redirectTo: `${redirectToBase}/auth/callback`,
          }
        : undefined,
    });

    if (error) {
      console.error('Error during Google login:', error);
    }
  };

  return (
    <main>
      <button type="button" onClick={handleGoogleLogin}>
        Login con Google
      </button>
    </main>
  );
};

export default LoginPage;
