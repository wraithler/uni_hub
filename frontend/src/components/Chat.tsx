import {Message, User} from "@/types";
import {useState} from "react";
import useWebSocket from "@/hooks/useWebSocket";
import {v4 as uuidv4} from "uuid";
import {Button, Container, Group, Input} from "@mantine/core";

interface ChatProps {
    chatId: string;
    user: User;
}

const Chat: React.FC<ChatProps> = ({chatId, user}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const [typingUser, setTypingUser] = useState<string | null>(null);

    const {sendMessage, sendTyping, isTyping} = useWebSocket(
        chatId,
        (msg) => {
            setMessages((prev) => [...prev, {
                id: uuidv4(),
                sender: {id: 0, name: "Server", username: "Server"},
                content: msg.content || "",
                created_at: new Date()
            }]);
        },
        (username) => setTypingUser(username)
    );

    const handleSend = () => {
        if (!newMessage.trim()) {
            return;
        }

        const message: Message = {
            id: uuidv4(),
            sender: user,
            content: newMessage,
            created_at: new Date()
        };

        sendMessage(message);
        setMessages((prev) => [...prev, message]);
        setNewMessage("");
    }

    return (
        <Container>
            <Group>
                {messages.map((msg) => (
                    <Container key={msg.id}>
                        <p>{msg.sender.name}: {msg.content}</p>
                    </Container>
                ))}
                {typingUser && <p className="typing-indicator">{typingUser} is typing...</p>}
            </Group>

            <Group>
                <Input
                    type="text"
                    value={newMessage}
                    onChange={(e) => {
                        setNewMessage(e.target.value);
                        sendTyping();
                    }}
                    placeholder="Type a message..."
                />
                <Button onClick={handleSend}>Send</Button>
            </Group>
        </Container>
    )
}

export default Chat;