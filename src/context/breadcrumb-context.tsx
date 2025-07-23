"use client"

import React from 'react'

const BreadcrumbContext = React.createContext({
    breadcrumbs: [] as Array<{ name: string; href: string }>,
    setBreadcrumbs: (breadcrumbs: Array<{ name: string; href: string }>) => { }
})

export function useBreadcrumb() {
    return React.useContext(BreadcrumbContext)
}

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
    const [breadcrumbs, setBreadcrumbs] = React.useState<Array<{ name: string; href: string }>>([])

    return (
        <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
            {children}
        </BreadcrumbContext.Provider>
    )
}