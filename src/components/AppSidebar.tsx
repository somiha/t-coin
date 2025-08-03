"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  // Bell,
  CreditCard,
  TrendingUp,
  // List,
  Handshake,
  // PiggyBank,
  Trophy,
  Film,
  // MessageSquare,
  MoreHorizontal,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "./ui/sidebar";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useUser } from "@/hooks/use-user";

interface MenuItem {
  name: string;
  icon: React.ComponentType;
  href?: string;
  subItems?: {
    name: string;
    href: string;
  }[];
}

const baseMenuItems: MenuItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "All Users", icon: Users, href: "/users" },
  { name: "Banners", icon: Film, href: "/banners" },
  {
    name: "Transactions",
    icon: CreditCard,
    subItems: [
      { name: "All", href: "/transactions" },
      { name: "Remittance", href: "/transactions/remittance" },
      { name: "Send Money", href: "/transactions/send-money" },
      { name: "Cash Out", href: "/transactions/cash-out" },
      { name: "T-coin Received", href: "/transactions/tcoin-receieved" },
    ],
  },
  { name: "Currency Rate", icon: TrendingUp, href: "/currency-rate" },
  { name: "Investment", icon: TrendingUp, href: "/investment" },
  { name: "Millionaire Campaign", icon: Trophy, href: "/millionaire-campaign" },
  { name: "Video Tutorials", icon: Film, href: "/video-tutorial" },
  { name: "Countries", icon: MoreHorizontal, href: "/country" },
  { name: "Categories", icon: MoreHorizontal, href: "/category" },
  { name: "Objects", icon: MoreHorizontal, href: "/object" },
  { name: "Banks", icon: MoreHorizontal, href: "/banks" },
  { name: "Breaking News", icon: MoreHorizontal, href: "/breaking-news" },
  {
    name: "Terms & Conditions",
    icon: MoreHorizontal,
    href: "/terms-conditions",
  },
  {
    name: "Privacy & Policy",
    icon: MoreHorizontal,
    href: "/privacy-policy",
  },
  {
    name: "Additional Charges",
    icon: MoreHorizontal,
    href: "/additional-charges",
  },
  {
    name: "Add TCoin",
    icon: MoreHorizontal,
    href: "/add-tcoin",
  },
  // { name: "Notifications", icon: Bell, href: "/notifications" },
  // { name: "Investor List", icon: List, href: "/investors" },
  // { name: "Savings", icon: PiggyBank, href: "/savings" },
  // { name: "Messages", icon: MessageSquare, href: "/messages" },
];

const adminItems: MenuItem[] = [
  { name: "Agent List", icon: Handshake, href: "/agents" },
  { name: "T-Coin Cash Out", icon: Users, href: "/tcoin-cash-out" },
  // { name: "Agent Money to Tcoin", icon: Users, href: "/agent-money-to-tcoin" },
  // { name: "Admin Tcoin to money", icon: Users, href: "/admin-tcoin-to-money" },
];

const superAdminItems: MenuItem[] = [
  { name: "Admin & Agent List", icon: Users, href: "/admins" },

  // { name: "Admin Money to Tcoin", icon: Users, href: "/admin-money-to-tcoin" },
];

const AppSidebar = () => {
  const { isSuperAdmin } = useUser();

  // Combine menu items, removing duplicates
  // const menuItems = [
  //   ...baseMenuItems.filter((item) => item.name !== "Add Admin"), // Remove Add Admin from base if present
  //   ...(isSuperAdmin ? superAdminItems : []),

  const menuItems = [
    ...baseMenuItems,
    ...(!isSuperAdmin ? adminItems : []),
    ...(isSuperAdmin ? superAdminItems : []),
  ];

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/"
              className="h-auto flex justify-center items-center py-4"
            >
              <Image
                src="/t-coin.png"
                alt="Logo"
                width={150}
                height={150}
                className="h-12 w-auto"
                style={{ width: "80px", height: "80px" }}
                priority
              />
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <Accordion type="multiple" className="w-full">
                {menuItems.map((item) =>
                  item.subItems ? (
                    <AccordionItem
                      value={item.name}
                      key={item.name}
                      className="border-none ml-2"
                    >
                      <AccordionTrigger className="flex items-center px-5 py-2 text-lg rounded cursor-pointer transition-colors hover:bg-white group/trigger hover:no-underline">
                        <span className="relative inline-block">
                          <span className="text-lg text-white transition-opacity duration-200 group-hover/trigger:opacity-0 group-data-[state=open]:opacity-0">
                            {item.name}
                          </span>
                          <span className="absolute inset-0 text-lg text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] opacity-0 transition-opacity duration-200 group-hover/trigger:opacity-100 group-data-[state=open]:opacity-100 pointer-events-none">
                            {item.name}
                          </span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="bg-white px-3 py-2 rounded-md mt-1">
                        {item.subItems.map((sub) => (
                          <Link
                            key={`${item.name}-${sub.name}`}
                            href={sub.href}
                            className="block py-2 px-3 rounded text-gray-600 hover:bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] hover:text-white transition-all"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ) : (
                    <SidebarMenuItem
                      key={item.name}
                      className="cursor-pointer rounded pl-4 py-2 flex items-center text-lg hover:bg-white [&:hover .icon-gradient]:opacity-100 [&:hover_.text-gradient]:opacity-100"
                    >
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.href || "#"}
                          className="flex items-center gap-2 px-3 rounded"
                        >
                          <span className="relative">
                            <span className="text-white text-lg">
                              {item.name}
                            </span>
                            <span className="absolute text-lg inset-0 text-gradient text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--gradient-via))] to-[rgb(var(--gradient-to))] opacity-0 transition-opacity">
                              {item.name}
                            </span>
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                )}
              </Accordion>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
