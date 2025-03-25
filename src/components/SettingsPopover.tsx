"use client";

import { Settings, Moon, Mail, Info } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"; // Assuming shadcn or similar UI kit
import { Button } from "@/components/ui/button";

const SettingsPopover = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="mr-2 h-5 w-5" />
          Settings
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="flex flex-col space-y-2 text-sm">
          <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded">
            <Moon className="w-4 h-4" />
            Dark Mode (Coming Soon)
          </button>
          <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded">
            <Mail className="w-4 h-4" />
            Contact Support
          </button>
          <div className="flex items-center gap-2 text-gray-500 p-2 rounded">
            <Info className="w-4 h-4" />
            Version 1.0.0
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SettingsPopover;
