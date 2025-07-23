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
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Kritik & Saran",
      url: "#",
      icon: MessageSquareWarning,
      isActive: true,
    },
    {
      title: "Kategori",
      url: "#",
      icon: Folders,
    },
    {
      title: "Berita",
      url: "#",
      icon: NewspaperIcon,
    },
    {
      title: "Hero Section / Banner",
      url: "#",
      icon: ImageIcon,
    },
    {
      title: "Indikator Mutu",
      url: "#",
      icon: ChartNoAxesCombinedIcon,
    },
    {
      title: "Manajemen Pengguna",
      url: "",
      icon: SquareUser,
      items: [
        {
          title: "User List",
          url: "#",
        },
      ],
    },
    {
      title: "Konfigurasi Website",
      url: "",
      icon: Settings2,
      items: [
        {
          title: "Website Settings",
          url: "#",
        },
        {
          title: "Tentang Kami",
          url: "#",
        },
        {
          title: "Promosi",
          url: "#",
        },
        {
          title: "Layanan",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
    {
      title: "Manajemen Dokter",
      url: "",
      icon: Hospital,
      items: [
        {
          title: "Data Dokter",
          url: "#",
        },
        {
          title: "Jadwal Dokter",
          url: "#",
        },
        {
          title: "Kategori Spesialis",
          url: "#",
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
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
