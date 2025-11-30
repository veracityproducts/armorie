import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ThreadList } from "@/components/assistant-ui/thread-list";

export type ThreadListSidebarProps = {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  showRail?: boolean;
} & React.ComponentProps<typeof Sidebar>;

export const ThreadListSidebar: React.FC<ThreadListSidebarProps> = ({
  header,
  footer,
  showRail = true,
  ...props
}) => {
  return (
    <Sidebar {...props}>
      {header && (
        <SidebarHeader className="aui-sidebar-header mb-2 border-b">
          <div className="aui-sidebar-header-content flex items-center justify-between">
            {header}
          </div>
        </SidebarHeader>
      )}
      <SidebarContent className="aui-sidebar-content px-2">
        <ThreadList />
      </SidebarContent>
      {showRail && <SidebarRail />}
      {footer && (
        <SidebarFooter className="aui-sidebar-footer border-t">
          {footer}
        </SidebarFooter>
      )}
    </Sidebar>
  );
};
