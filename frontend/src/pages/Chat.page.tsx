import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Chat from '@/components/Chat';
import { Layout } from '@/components/Layout';
import { useUser } from '@/components/Authentication/UserProvider';

export function ChatPage() {
  const { user } = useUser();
  const { chatId } = useParams<{ chatId: string }>();

  useEffect(() => {
    if (!chatId) {
      console.log('No chatId provided');
    }
  }, []);

  return (
    <Layout>{chatId && user ? <Chat chatId={chatId} user={user} /> : <div>Loading...</div>}</Layout>
  );
}
