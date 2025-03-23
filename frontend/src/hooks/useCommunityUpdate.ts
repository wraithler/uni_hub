import { useState } from 'react';
import { CommunityDetail, updateCommunity } from '@/types/communities';

export function useCommunityUpdate() {
  const [data, setData] = useState<CommunityDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const handleUpdateCommunity = async (community: Partial<CommunityDetail>) => {
    setLoading(true);
    try {
      const res = await updateCommunity(community);
      setData(res);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, handleUpdateCommunity };
}
