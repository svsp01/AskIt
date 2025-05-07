"use client";

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuestionCard } from '@/components/cards/question-card';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuestions } from '@/queries/useQuestions';
import { Search, Filter, SortAsc, Clock, TrendingUp, X } from 'lucide-react';
import { Question } from '@/types/question';

// Popular tags (in a real app, these would come from an API)
const popularTags = [
  'javascript', 'react', 'node.js', 'python',
  'typescript', 'next.js', 'api', 'database',
  'css', 'tailwindcss', 'performance', 'security'
];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [sortOption, setSortOption] = useState<'latest' | 'popular'>(
    (searchParams.get('sort') as 'latest' | 'popular') || 'latest'
  );
  
  // Set up pagination
  const [page, setPage] = useState(1);
  const limit = 10;
  const offset = (page - 1) * limit;
  
  // Fetch questions with filters
  const { data, isLoading } = useQuestions({
    limit,
    offset,
    tag: selectedTag,
    search: searchQuery,
    sort: sortOption,
  });
  
  const questions = data?.questions || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('q', searchQuery);
    if (selectedTag) params.set('tag', selectedTag);
    if (sortOption !== 'latest') params.set('sort', sortOption);
    if (page > 1) params.set('page', page.toString());
    
    const newUrl = `/search${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl, { scroll: false });
  }, [searchQuery, selectedTag, sortOption, page, router]);
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setPage(1); // Reset to first page on new search
  };
  
  // Handle tag selection
  const handleTagSelect = (tag: string) => {
    if (tag === selectedTag) {
      setSelectedTag(''); // Deselect if already selected
    } else {
      setSelectedTag(tag);
      setPage(1); // Reset to first page on new tag
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSearchInput('');
    setSelectedTag('');
    setSortOption('latest');
    setPage(1);
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Questions</h1>
        <p className="text-muted-foreground">
          Find questions from our community or browse by tags
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar with filters */}
        <div className="md:col-span-1">
          <div className="bg-card rounded-lg border p-6 sticky top-24">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </h3>
            
            {(!!searchQuery || !!selectedTag || sortOption !== 'latest') && (
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Active filters</p>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2">
                  <X className="h-3.5 w-3.5 mr-1" />
                  Clear all
                </Button>
              </div>
            )}
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-sm mb-3">Popular Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTag === tag ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleTagSelect(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-3">Sort By</h4>
                <div className="flex flex-col gap-2">
                  <Button
                    variant={sortOption === 'latest' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortOption('latest')}
                    className="justify-start"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Latest
                  </Button>
                  <Button
                    variant={sortOption === 'popular' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortOption('popular')}
                    className="justify-start"
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Most Voted
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="md:col-span-3">
          {/* Search form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search for questions..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
            </div>
          </form>
          
          {/* Active filters */}
          {(searchQuery || selectedTag) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {searchQuery && (
                <Badge variant="secondary" className="pl-2 pr-1 py-1">
                  Search: {searchQuery}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchInput('');
                    }}
                    className="h-5 w-5 ml-1"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {selectedTag && (
                <Badge variant="secondary" className="pl-2 pr-1 py-1">
                  Tag: {selectedTag}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedTag('')}
                    className="h-5 w-5 ml-1"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          )}
          
          {/* Results */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {isLoading ? (
                  <Skeleton className="h-7 w-32" />
                ) : (
                  `${total} Questions`
                )}
              </h2>
              
              <div className="text-sm text-muted-foreground">
                {isLoading ? (
                  <Skeleton className="h-5 w-40" />
                ) : total > 0 ? (
                  `Showing ${offset + 1}-${Math.min(offset + limit, total)} of ${total}`
                ) : (
                  'No results'
                )}
              </div>
            </div>
            
            {isLoading ? (
              <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="bg-card rounded-lg border p-5">
                    <Skeleton className="h-7 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6 mb-2" />
                    <Skeleton className="h-4 w-4/6 mb-4" />
                    <div className="flex gap-2 mb-4">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                      </div>
                      <Skeleton className="h-6 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            ) : questions.length > 0 ? (
              <div className="space-y-4">
                {questions.map((question:Question) => (
                  <QuestionCard key={question._id} question={question} />
                ))}
              </div>
            ) : (
              <div className="bg-muted p-8 rounded-lg text-center">
                <p className="text-muted-foreground mb-4">
                  No questions found matching your criteria.
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
            
            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center mx-4">
                    Page {page} of {totalPages}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}