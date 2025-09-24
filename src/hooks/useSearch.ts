import { useState, useEffect, useMemo } from 'react';
import { debounce } from '@/lib/utils';

export interface SearchFilters {
  subject?: string;
  grade?: string;
  university?: string;
  priceRange?: [number, number];
  rating?: number;
  sortBy?: 'price' | 'rating' | 'date' | 'downloads';
  sortOrder?: 'asc' | 'desc';
}

export function useSearch<T>(
  items: T[],
  searchFields: (keyof T)[],
  filters?: SearchFilters
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const debouncedSetSearch = useMemo(
    () => debounce((term: string) => setDebouncedSearchTerm(term), 300),
    []
  );

  useEffect(() => {
    debouncedSetSearch(searchTerm);
  }, [searchTerm, debouncedSetSearch]);

  const filteredItems = useMemo(() => {
    let result = items;

    // Filter by search term
    if (debouncedSearchTerm) {
      result = result.filter(item =>
        searchFields.some(field => {
          const value = item[field];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
          }
          return false;
        })
      );
    }

    // Apply additional filters
    if (filters) {
      result = result.filter(item => {
        if (filters.subject && (item as any).subject !== filters.subject) return false;
        if (filters.grade && (item as any).grade !== filters.grade) return false;
        if (filters.university && (item as any).university !== filters.university) return false;
        if (filters.priceRange) {
          const price = (item as any).price;
          if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;
        }
        if (filters.rating && (item as any).rating < filters.rating) return false;
        return true;
      });

      // Apply sorting
      if (filters.sortBy) {
        result.sort((a, b) => {
          const aValue = (a as any)[filters.sortBy!];
          const bValue = (b as any)[filters.sortBy!];
          
          if (filters.sortOrder === 'desc') {
            return bValue - aValue;
          }
          return aValue - bValue;
        });
      }
    }

    return result;
  }, [items, debouncedSearchTerm, searchFields, filters]);

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
    isSearching: searchTerm !== debouncedSearchTerm,
    resultsCount: filteredItems.length,
    totalCount: items.length
  };
}