import * as React from "react";
import Link from "next/link";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export type SidebarFooterItemProps = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  href?: string;
  external?: boolean;
};

export const SidebarFooterItem: React.FC<SidebarFooterItemProps> = ({
  icon,
  title,
  subtitle,
  href,
  external = true,
}) => {
  const content = (
    <>
      <div className="aui-sidebar-footer-icon-wrapper flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        {icon}
      </div>
      <div className="aui-sidebar-footer-heading flex flex-col gap-0.5 leading-none">
        <span className="aui-sidebar-footer-title font-semibold">{title}</span>
        {subtitle && <span>{subtitle}</span>}
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
