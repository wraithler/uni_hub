import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function PostCarousel({
  imageUrls,
  className,
}: {
  imageUrls: string[];
  className?: string;
}) {
  if (imageUrls.length === 0) return null;

  return (
    <div className={cn("w-full", className)}>
      <Carousel className="w-full p-5">
        <CarouselContent className="-ml-2 md:-ml-4">
          {imageUrls.map((url, i) => (
            <CarouselItem
              key={i}
              className={cn(
                "pl-2 md:pl-4",
                imageUrls.length === 1 ? "basis-full" : "md:basis-1/2",
              )}
            >
              <Card className="overflow-hidden border-none shadow-sm rounded-xl">
                <CardContent className="p-0">
                  <div className="relative aspect-square sm:aspect-video w-full overflow-hidden rounded-xl">
                    <img
                      src={url || "/placeholder.svg"}
                      alt={`Uploaded image ${i + 1}`}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {imageUrls.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <CarouselPrevious className="relative inset-0 translate-y-0 bg-white/80 hover:bg-white" />
            <div className="text-xs text-muted-foreground">
              {imageUrls.length} images
            </div>
            <CarouselNext className="relative inset-0 translate-y-0 bg-white/80 hover:bg-white" />
          </div>
        )}
      </Carousel>
    </div>
  );
}
