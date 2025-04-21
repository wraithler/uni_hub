import {FeedItem} from "@/hooks/useFeed.ts";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card.tsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Heart, MessageSquare, MoreHorizontal} from "lucide-react";
import {useAuth} from "@/components/auth/AuthProvider.tsx";

export default function PostCard({
                                     id,
                                     created_by,
                                     community,
                                     timestamp,
                                     content,
                                     likes,
                                     comments,
                                 }: FeedItem) {
    const {user} = useAuth();

    return (
        <Card key={id}>
            <CardHeader className="p-4 pb-0">
                <div className="flex justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                            <AvatarFallback>
                                {`${created_by.first_name} ${created_by.last_name}`.substring(
                                    0,
                                    2,
                                )}
                            </AvatarFallback>
                        </Avatar>

                        <div>
                            <div className="flex items-center gap-2">
                <span className="font-medium">
                  {created_by.first_name} {created_by.last_name}
                </span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-sm text-muted-foreground">
                  {timestamp}
                </span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                                <span className="text-muted-foreground">In</span>
                                <span className="font-medium">{community.name}</span>
                            </div>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Report</DropdownMenuItem>
                            {created_by.id === user?.id && (
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <p className="mb-3">{content /* add images */}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`flex items-center gap-1 h-8 px-2}`}
                    >
                        <Heart className={`w-4 h-4`}/>
                        <span>{likes}</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 h-8 px-2"
                    >
                        <MessageSquare className="w-4 h-4"/>
                        <span>{comments}</span>
                    </Button>
                </div>
                <Button variant="ghost" size="sm">
                    Comment
                </Button>
            </CardFooter>
        </Card>
    );
}
