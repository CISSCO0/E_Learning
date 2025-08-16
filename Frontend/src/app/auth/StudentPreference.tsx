'use client'
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Heart } from "lucide-react"


const coursePreferences = ['Computer Science', 'Mathematics', 'Physics', 'Biology', 'Chemistry', 'Literature', 'History', 'Art']

export default function StudentPreferences({ onUpdate }: { onUpdate: (preferences: string[]) => void }) {
    const [preferences, setPreferences] = useState<string[]>([]);
  
    const handlePreferenceChange = (preference: string) => {
      const updatedPreferences = preferences.includes(preference)
        ? preferences.filter((p) => p !== preference)
        : [...preferences, preference];
      setPreferences(updatedPreferences);
      onUpdate(updatedPreferences);
    };
  return (
    <div className="space-y-4 p-4 bg-gradient-to-r from-red-50 to-neutral-50 rounded-xl border border-red-100">
      <div className="flex items-center space-x-2">
        <Heart className="h-5 w-5 text-red-600" />
        <Label className="text-sm font-medium text-gray-700">Course Interests</Label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {coursePreferences.map((preference) => (
          <div key={preference} className="flex items-center space-x-2">
            <Checkbox
              id={preference}
              checked={preferences.includes(preference)}
              onCheckedChange={() => handlePreferenceChange(preference)}
              className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
            />
            <Label
              htmlFor={preference}
              className="text-sm text-gray-700 cursor-pointer hover:text-red-700 transition-colors duration-200"
            >
              {preference}
            </Label>
          </div>
        ))}
      </div>

      {preferences.length > 0 && (
        <div className="pt-2">
          <p className="text-xs text-gray-600 mb-2">Selected interests:</p>
          <div className="flex flex-wrap gap-1">
            {preferences.map((pref) => (
              <Badge key={pref} className="bg-red-100 text-red-700 text-xs">
                {pref}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500">Select subjects you're interested in learning about</p>
    </div>
  )
}
