import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { supabase } from '../../supabaseClient';

const CallbackPage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      const session = data?.session;

      if (!isMounted) {
        return;
      }

      if (error || !session) {
        console.error('No active session after OAuth callback.', error);
        router.replace('/login');
        return;
      }

      const email = session.user.email ?? '';
      const role = email.toLowerCase().includes('teacher') ? 'teacher' : 'student';

      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            role,
            email,
            supabase_uid: session.user.id,
          }),
        });

        if (!response.ok) {
          console.error('Failed to register user after OAuth callback.', await response.text());
        }
      } catch (registerError) {
        console.error('Error while registering user.', registerError);
      }

      router.replace(role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
    };

    handleCallback();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return <main>Procesando login...</main>;
};

export default CallbackPage;
