"use client"
import { useScrollAreaScroll } from "@/hooks/use-scroll-direction"
import * as ScrollArea from "@radix-ui/react-scroll-area"

export function MainScrollArea({ children }: { children: React.ReactNode }) {
    const { scrollAreaRef } = useScrollAreaScroll();

    return (
        <ScrollArea.Root className="h-screen w-full overflow-hidden" style={{ scrollbarWidth: "none" }}>
            <ScrollArea.Viewport
                ref={scrollAreaRef}
                className="h-full w-full"
            >
                <div className="w-full flex-grow p-4 md:p-6 lg:p-8 no-scrollbar ">
                    {children}
                </div>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar
                orientation="vertical"
                className="w-2 bg-transparent hover:bg-secondary"
            >
                <ScrollArea.Thumb className="bg-primary rounded" />
            </ScrollArea.Scrollbar>
        </ScrollArea.Root>
    )
}