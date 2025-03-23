import { useState } from 'react';
import { CommunityDetail, joinCommunity } from '@/types/communities';

export function useCommunityJoin() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const handleJoinCommunity = async (community: Partial<CommunityDetail>) => {
    setLoading(true);
    try {
      await joinCommunity(community);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, handleJoinCommunity };
}
