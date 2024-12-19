'use client'

import { useState } from 'react'

export default function InstructorExpertise({ onUpdate }: { onUpdate: (expertise: string) => void }) {
  const [expertise, setExpertise] = useState('');

  const handleExpertiseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newExpertise = e.target.value;
    setExpertise(newExpertise);
    onUpdate(newExpertise);
  };

  return (
    <div>
      <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">
        Field of Expertise
      </label>
      <div className="mt-1">
        <input
          id="expertise"
          name="expertise"
          type="text"
          required
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={expertise}
          onChange={handleExpertiseChange} // Using the defined function here
        />
      </div>
    </div>
  );
}
