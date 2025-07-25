// components/ui/badge-status.tsx
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface BadgeStatusProps {
    status: 'success' | 'warning' | 'danger' | 'info'
    children: React.ReactNode
    className?: string
}

const statusVariants = {
    success: 'bg-green-100 text-green-800 hover:bg-green-100',
    warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    danger: 'bg-red-100 text-red-800 hover:bg-red-100',
    info: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
}

export function BadgeStatus({ status, children, className }: BadgeStatusProps) {
    return (
        <Badge
            variant="secondary"
            className={cn(statusVariants[status], className)}
        >
            {children}
        </Badge>
    )
}