'use client'

import { useState } from 'react'

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
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Course Preferences
      </label>
      <div className="space-y-2">
        {coursePreferences.map(preference => (
          <div key={preference} className="flex items-center">
            <input
              id={preference}
              name="course_preferences"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={preferences.includes(preference)}
              onChange={() => handlePreferenceChange(preference)}
            />
            <label htmlFor={preference} className="ml-2 block text-sm text-gray-900">
              {preference}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

