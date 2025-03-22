import { Layout } from '@/components/Layout';
import CommunityList from "@/components/CommunityList";
import { Text } from "@mantine/core";

export function CommunitiesPage() {
  return (
    <Layout>
      <div>
        <Text size="xl" w={700}>
          Communities
        </Text>
        <Text size="sm" opacity={0.6}>
          Join communities to find people with similar interests
        </Text>
      </div>

      <CommunityList/>
    </Layout>
  );
}
