"use client";

import type { FC } from "react";
import { motion } from "motion/react";
import { Compass } from "lucide-react";
import { Switch } from "@/components/animate-ui/components/radix/switch";

export type GuidedToggleProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export const GuidedToggle: FC<GuidedToggleProps> = ({
  checked,
  onCheckedChange,
}) => {
  return (
    <motion.label
      whileHover={{ scale: 1.02 }}
      className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 cursor-pointer border bg-primary-100/70 text-primary-700 border-primary-200/80 hover:bg-primary-100 hover:border-primary-300 transition-all duration-200"
    >
      <Compass className="size-3.5" />
      <span className="text-xs font-medium select-none">Guided</span>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        pressedWidth={14}
        className="h-4 w-7 data-[state=checked]:bg-secondary-500 data-[state=unchecked]:bg-primary-300 border-0 [&_[data-slot=switch-thumb]]:size-3"
      />
    </motion.label>
  );
};
