"use client";

import { Assistant } from "@/app/assistant";
import { DawnAwakening } from "@/components/dawn-awakening";

export default function Home() {
  return (
    <DawnAwakening>
      <div className="h-full">
        <Assistant />
      </div>
    </DawnAwakening>
  );
}