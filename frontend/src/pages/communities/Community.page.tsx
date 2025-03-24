import { useParams } from 'react-router-dom';
import { Text } from '@mantine/core';
import { Layout } from '@/components/Layout';
import { useCommunityDetail } from '@/hooks/useCommunityDetail';

export function CommunityPage() {
  const { communityId } = useParams();
  // const community = useCommunityDetail(communityId);

  return (
    <Layout>
      <div>
        <Text size="xl" w={700}>
          {community.name}
        </Text>
        <Text size="sm" opacity={0.6}>
          {community.description}
        </Text>
      </div>
    </Layout>
  );
}
