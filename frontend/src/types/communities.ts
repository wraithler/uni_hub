interface CommunityDetail {
    id: number;
    name: string;
    description: string;
    emoji: string;
}

interface CommunityListItem {

}

interface CommunityList {
    communities: CommunityListItem[];
}