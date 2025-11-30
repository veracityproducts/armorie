import * as React from "react";
import Link from "next/link";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export type SidebarHeaderItemProps = {
  icon: React.ReactNode;
  title: string;
  href?: string;
  external?: boolean;
};

export const SidebarHeaderItem: React.FC<SidebarHeaderItemProps> = ({
  icon,
  title,
  href,
  external = false,
}) => {
  const content = (
    <>
      <div className="aui-sidebar-header-icon-wrapper flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        {icon}
      </div>
      <div className="aui-sidebar-header-heading mr-6 flex flex-col gap-0.5 leading-none">
        <span className="aui-sidebar-header-title font-semibold">{title}</span>
      </div>
    </>
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          {href ? (
            <Link
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
            >
              {content}
            </Link>
          ) : (
            <div className="flex items-center">{content}</div>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
