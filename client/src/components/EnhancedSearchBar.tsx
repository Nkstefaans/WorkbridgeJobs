import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Briefcase, Clock, DollarSign, Filter, MapPin, Search } from "lucide-react";
import { useState } from "react";

interface EnhancedSearchBarProps {
  searchQuery?: string;
  searchLocation?: string;
  onSearchQueryChange?: (query: string) => void;
  onSearchLocationChange?: (location: string) => void;
  onSearch?: (query?: string, location?: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  locationPlaceholder?: string;
}

// Mock data for search suggestions
const jobSuggestions = [
  "Software Developer",
  "Frontend Developer", 
  "Data Scientist",
  "Product Manager",
  "UX Designer",
  "Marketing Manager",
  "Sales Representative",
  "Business Analyst"
];

const locationSuggestions = [
  "Cape Town, Western Cape",
  "Johannesburg, Gauteng", 
  "Durban, KwaZulu-Natal",
  "Pretoria, Gauteng",
  "Port Elizabeth, Eastern Cape",
  "Remote"
];

export function EnhancedSearchBar({ 
  searchQuery = "",
  searchLocation = "",
  onSearchQueryChange,
  onSearchLocationChange,
  onSearch,
  isLoading = false,
  placeholder = "Job title, keywords...",
  locationPlaceholder = "Location"
}: EnhancedSearchBarProps) {
  const [searchValue, setSearchValue] = useState(searchQuery);
  const [locationValue, setLocationValue] = useState(searchLocation);
  const [showJobSuggestions, setShowJobSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [filteredJobSuggestions, setFilteredJobSuggestions] = useState(jobSuggestions);
  const [filteredLocationSuggestions, setFilteredLocationSuggestions] = useState(locationSuggestions);

  const handleJobInputChange = (value: string) => {
    setSearchValue(value);
    onSearchQueryChange?.(value);
    if (value.length > 0) {
      const filtered = jobSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredJobSuggestions(filtered);
      setShowJobSuggestions(true);
    } else {
      setShowJobSuggestions(false);
    }
  };

  const handleLocationInputChange = (value: string) => {
    setLocationValue(value);
    onSearchLocationChange?.(value);
    if (value.length > 0) {
      const filtered = locationSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLocationSuggestions(filtered);
      setShowLocationSuggestions(true);
    } else {
      setShowLocationSuggestions(false);
    }
  };

  const handleSearch = () => {
    onSearch?.(searchValue, locationValue);
    setShowJobSuggestions(false);
    setShowLocationSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <Card className="overflow-hidden shadow-lg border-0 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-6">
          {/* Main Search Section */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Job Search Input */}
            <div className="relative flex-1">
              <label htmlFor="job-search" className="sr-only">
                Search for jobs
              </label>
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="job-search"
                placeholder={placeholder}
                className="pl-12 pr-4 h-14 text-lg border-0 focus:ring-2 focus:ring-primary/20 bg-gray-50 placeholder:text-muted-foreground"
                value={searchValue}
                onChange={(e) => handleJobInputChange(e.target.value)}
                onFocus={() => searchValue.length > 0 && setShowJobSuggestions(true)}
                onBlur={() => setTimeout(() => setShowJobSuggestions(false), 200)}
                onKeyPress={handleKeyPress}
              />
              
              {/* Job Search Suggestions */}
              {showJobSuggestions && filteredJobSuggestions.length > 0 && (
                <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-xl border border-border/50">
                  <CardContent className="p-0 max-h-64 overflow-y-auto">
                    {filteredJobSuggestions.slice(0, 6).map((suggestion, index) => (
                      <div 
                        key={index} 
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-0 transition-colors"
                        onClick={() => {
                          setSearchValue(suggestion);
                          setShowJobSuggestions(false);
                        }}
                      >
                        <div className="flex items-center">
                          <Search className="h-4 w-4 mr-3 text-muted-foreground" />
                          <span className="text-sm">{suggestion}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Location Input */}
            <div className="relative lg:w-80">
              <label htmlFor="location-search" className="sr-only">
                Search by location
              </label>
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="location-search"
                placeholder={locationPlaceholder}
                className="pl-12 pr-4 h-14 text-lg border-0 focus:ring-2 focus:ring-primary/20 bg-gray-50 placeholder:text-muted-foreground"
                value={locationValue}
                onChange={(e) => handleLocationInputChange(e.target.value)}
                onFocus={() => locationValue.length > 0 && setShowLocationSuggestions(true)}
                onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                onKeyPress={handleKeyPress}
              />
              
              {/* Location Suggestions */}
              {showLocationSuggestions && filteredLocationSuggestions.length > 0 && (
                <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-xl border border-border/50">
                  <CardContent className="p-0 max-h-64 overflow-y-auto">
                    {filteredLocationSuggestions.slice(0, 6).map((suggestion, index) => (
                      <div 
                        key={index} 
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-0 transition-colors"
                        onClick={() => {
                          setLocationValue(suggestion);
                          setShowLocationSuggestions(false);
                        }}
                      >
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-3 text-muted-foreground" />
                          <span className="text-sm">{suggestion}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Search Button */}
            <Button 
              size="lg" 
              onClick={handleSearch}
              disabled={isLoading}
              className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200 font-medium disabled:opacity-50"
            >
              <Search className="h-5 w-5 mr-2" />
              {isLoading ? "Searching..." : "Search Jobs"}
            </Button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-muted-foreground font-medium flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Popular searches:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Remote", icon: MapPin },
                { label: "Full-time", icon: Clock },
                { label: "Tech", icon: Briefcase },
                { label: "High Salary", icon: DollarSign },
              ].map(({ label, icon: Icon }) => (
                <Button
                  key={label}
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  onClick={() => {
                    if (label === "Remote") {
                      setLocationValue("Remote");
                    } else if (label === "Full-time") {
                      setSearchValue("Full-time");
                    } else {
                      setSearchValue(label);
                    }
                  }}
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Search Stats */}
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Over <span className="font-semibold text-primary">10,000+</span> active job listings from 
              <span className="font-semibold text-primary"> 500+</span> companies across South Africa
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
