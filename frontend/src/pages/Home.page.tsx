import {Layout} from "@/components/Layout";
import {HomeGrid} from "@/components/HomeGrid/HomeGrid";
import {CommunitySearchBar} from "@/components/CustomSearchBar";

export function HomePage() {
    return (
        <Layout>
            <CommunitySearchBar/>
        </Layout>
    );
}
