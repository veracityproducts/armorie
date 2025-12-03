"use client";

import type { FC } from "react";
import { motion } from "motion/react";
import { BookOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/animate-ui/components/radix/dropdown-menu";
import { BIBLE_TRANSLATIONS } from "@/lib/bible-data";

export type TranslationDropdownProps = {
  value: string;
  onChange: (value: string) => void;
};

export const TranslationDropdown: FC<TranslationDropdownProps> = ({
  value,
  onChange,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-1.5 text-primary-700 bg-primary-100/70 border border-primary-200/80 rounded-lg px-2.5 py-1.5 hover:bg-primary-100 hover:border-primary-300 transition-all outline-none focus:ring-2 focus:ring-secondary-300"
        >
          <BookOpen className="size-3.5" />
          <span className="text-xs font-medium">{value}</span>
          <motion.svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            className="text-current"
          >
            <motion.path
              d="M3 4.5L6 7.5L9 4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="top"
        sideOffset={8}
        className="w-64 max-h-72 overflow-y-auto rounded-xl border-border/60 bg-card/95 backdrop-blur-xl shadow-xl"
      >
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {BIBLE_TRANSLATIONS.map((t) => (
            <DropdownMenuRadioItem
              key={t.id}
              value={t.id}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer rounded-lg"
            >
              <span className="font-medium text-sm">{t.id}</span>
              <span className="text-muted-foreground text-xs truncate">
                {t.name}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
