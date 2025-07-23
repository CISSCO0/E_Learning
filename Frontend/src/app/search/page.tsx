import SearchComponent from '@/app/search/search-component'
import './search.css'
import { Suspense } from 'react'
export default function SearchPage() {
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<p>Loading search results...</p>}>
      <SearchComponent />
      </Suspense>
    </div>
  )
}

