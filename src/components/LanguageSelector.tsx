import React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Language {
  value: string;
  label: string;
}

interface LanguageSelectorProps {
  selectedLanguages?: string[];
  onLanguageToggle?: (language: string) => void;
  onTranslate?: () => void;
}

const defaultLanguages: Language[] = [
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
];

export default function LanguageSelector({
  selectedLanguages = ["es", "fr"],
  onLanguageToggle = () => {},
  onTranslate = () => {},
}: LanguageSelectorProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-4 w-full max-w-[300px] bg-white p-4 rounded-lg shadow-sm">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span>{selectedLanguages.length} languages selected</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search languages..." />
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {defaultLanguages.map((language) => (
                <CommandItem
                  key={language.value}
                  onSelect={() => {
                    onLanguageToggle(language.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedLanguages.includes(language.value)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {language.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Button
        className="w-full"
        onClick={onTranslate}
        disabled={selectedLanguages.length === 0}
      >
        Translate Menu
      </Button>
    </div>
  );
}
