"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Country {
  name: string
  code: string
  flag: string
}

const countries: Country[] = [
  { name: "Sierra Leone", code: "+232", flag: "🇸🇱" },
  { name: "United States", code: "+1", flag: "🇺🇸" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { name: "Canada", code: "+1", flag: "🇨🇦" },
  { name: "Nigeria", code: "+234", flag: "🇳🇬" },
  { name: "Ghana", code: "+233", flag: "🇬🇭" },
  { name: "South Africa", code: "+27", flag: "🇿🇦" },
  { name: "Kenya", code: "+254", flag: "🇰🇪" },
  { name: "Australia", code: "+61", flag: "🇦🇺" },
  { name: "Germany", code: "+49", flag: "🇩🇪" },
  { name: "France", code: "+33", flag: "🇫🇷" },
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "China", code: "+86", flag: "🇨🇳" },
  { name: "Japan", code: "+81", flag: "🇯🇵" },
  { name: "Brazil", code: "+55", flag: "🇧🇷" },
]

interface PhoneInputProps {
  value: string
  countryCode: string
  onPhoneChange: (value: string) => void
  onCountryCodeChange: (value: string) => void
  error?: string
}

export function PhoneInput({ value, countryCode, onPhoneChange, onCountryCodeChange, error }: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedCountry = countries.find((c) => c.code === countryCode) || countries[0]

  const filteredCountries = countries.filter(
    (country) => country.name.toLowerCase().includes(searchQuery.toLowerCase()) || country.code.includes(searchQuery),
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative mt-1">
      <div className="flex gap-2">
        {/* Country Code Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-2 px-3 py-2 border rounded-md bg-white hover:bg-gray-50 transition-colors ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          >
            <span className="text-xl">{selectedCountry.flag}</span>
            <span className="font-medium text-gray-700">{selectedCountry.code}</span>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-hidden">
              {/* Search */}
              <div className="p-2 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search countries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                  />
                </div>
              </div>

              {/* Country List */}
              <div className="overflow-y-auto max-h-64">
                {filteredCountries.map((country) => (
                  <button
                    key={country.code + country.name}
                    type="button"
                    onClick={() => {
                      onCountryCodeChange(country.code)
                      setIsOpen(false)
                      setSearchQuery("")
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="text-xl">{country.flag}</span>
                    <span className="flex-1 text-sm text-gray-700">{country.name}</span>
                    <span className="text-sm font-medium text-gray-500">{country.code}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <Input
          type="tel"
          value={value}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="123 456 7890"
          className={`flex-1 ${error ? "border-red-500" : ""}`}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
