'use client'

import { useState } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { BookOpen } from "lucide-react"

export default function InstructorExpertise({ onUpdate }: { onUpdate: (expertise: string) => void }) {
  const [expertise, setExpertise] = useState('');

  const handleExpertiseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newExpertise = e.target.value;
    setExpertise(newExpertise);
    onUpdate(newExpertise);
  };

  return (
    <div className="space-y-3 p-4 bg-gradient-to-r from-red-50 to-neutral-50 rounded-xl border border-red-100">
      <div className="flex items-center space-x-2">
        <BookOpen className="h-5 w-5 text-red-600" />
        <Label htmlFor="expertise" className="text-sm font-medium text-gray-700">
          Field of Expertise
        </Label>
      </div>
      <Input
        id="expertise"
        name="expertise"
        type="text"
        required
        value={expertise}
        onChange={handleExpertiseChange}
        className="h-11 border-red-200 focus:border-red-500 focus:ring-red-500 bg-white/80"
        placeholder="e.g., Computer Science, Mathematics, Physics..."
      />
      <p className="text-xs text-gray-500">This helps students find courses in your area of expertise</p>
    </div>
  )
}
