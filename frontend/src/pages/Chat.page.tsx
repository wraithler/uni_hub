import {Layout} from "@/components/Layout";
import Chat from "@/components/Chat";
import {useUser} from "@/components/UserProvider";
import {useParams} from "react-router-dom";
import {useEffect} from "react";

export function ChatPage() {
    const { user } = useUser();
    const { chatId } = useParams<{ chatId: string }>();

    useEffect(() => {
        if (!chatId) {
            console.log("No chatId provided");
        }
    }, []);

    return (
        <Layout>
            {(chatId && user) ? <Chat chatId={chatId} user={user}/> : <div>Loading...</div>}
        </Layout>
    )
}