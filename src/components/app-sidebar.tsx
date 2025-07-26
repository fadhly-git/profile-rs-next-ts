"use client"

import * as React from "react"
import {
  ChartNoAxesCombinedIcon,
  Folders,
  Hospital,
  ImageIcon,
  LayoutDashboard,
  MessageSquareWarning,
  NewspaperIcon,
  Send,
  Settings2,
  SquareUser,
} from "lucide-react"
import { useRBAC } from '@/hooks/use-rbac'
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Kritik & Saran",
      url: "/admin/kritik-saran",
      icon: MessageSquareWarning,
    },
    {
      title: "Kategori",
      url: "/admin/kategori",
      icon: Folders,
    },
    {
      title: "Berita",
      url: "/admin/berita",
      icon: NewspaperIcon,
    },
    {
      title: "Hero Section / Banner",
      url: "/admin/hero-section-or-banner",
      icon: ImageIcon,
    },
    {
      title: "Indikator Mutu",
      url: "/admin/indikator-mutu",
      icon: ChartNoAxesCombinedIcon,
    },
    {
      title: "Manajemen Pengguna",
      url: "#",
      icon: SquareUser,
      items: [
        {
          title: "User",
          url: "/admin/user-management",
        },
      ],
    },
    {
      title: "Konfigurasi Website",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Website Settings",
          url: "/admin/website-settings",
        },
        {
          title: "Tentang Kami",
          url: "/admin/about-us",
        },
        {
          title: "Promosi",
          url: "/admin/promotions",
        },
        {
          title: "Layanan",
          url: "/admin/menu",
        },
        {
          title: "Halaman Depan",
          url: "/admin/halaman",
        },
      ],
    },
    {
      title: "Manajemen Dokter",
      url: "#",
      icon: Hospital,
      items: [
        {
          title: "Data Dokter",
          url: "/admin/dokter",
        },
        {
          title: "Jadwal Dokter",
          url: "/admin/jadwal-dokter",
        },
        {
          title: "Kategori Spesialis",
          url: "/admin/kategori", // Menggunakan resource kategori yang sama
        },
      ]
    },
  ],
  navSecondary: [
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & { appName?: string }

export function AppSidebar(props: AppSidebarProps) {
  const { appName, ...rest } = props
  const { getFilteredNavigation, loading, authenticated } = useRBAC()

  // Filter navigation menggunakan hook yang sudah ada
  const filteredNavMain = React.useMemo(() => {
    if (!authenticated || loading) return []
    return getFilteredNavigation(data.navMain)
  }, [getFilteredNavigation, authenticated, loading])

  const filteredNavSecondary = React.useMemo(() => {
    if (!authenticated || loading) return []
    return getFilteredNavigation(data.navSecondary)
  }, [getFilteredNavigation, authenticated, loading])

  // Show loading state
  if (loading) {
    return (
      <Sidebar
        className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
        {...rest}
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/admin/dashboard">
                  <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Image
                      src={'/logo.png'}
                      alt="logo"
                      width={16}
                      height={16}
                      style={{ width: "auto", height: "auto" }}
                      className="w-6 h-6"
                    />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight whitespace-normal break-words">
                    <span className="font-medium text-foreground">{appName}</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <div className="p-4 text-sm text-muted-foreground">
            Loading...
          </div>
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>
    )
  }

  // Show login required state
  if (!authenticated) {
    return (
      <Sidebar
        className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
        {...rest}
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/admin/login">
                  <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Image
                      src={'/logo.png'}
                      alt="logo"
                      width={16}
                      height={16}
                      style={{ width: "auto", height: "auto" }}
                      className="w-6 h-6"
                    />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight whitespace-normal break-words">
                    <span className="font-medium text-foreground">{appName}</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <div className="p-4 text-sm text-muted-foreground">
            Please login to access admin panel
          </div>
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>
    )
  }

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...rest}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin/dashboard">
                <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image
                    src={'/logo.png'}
                    alt="logo"
                    width={16}
                    height={16}
                    style={{ width: "auto", height: "auto" }}
                    className="w-6 h-6"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight whitespace-normal break-words">
                  <span className="font-medium text-foreground">{appName}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        {filteredNavSecondary.length > 0 && (
          <NavSecondary items={filteredNavSecondary} className="mt-auto" />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}