import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '@/lib/api';

export default function PoliticiansPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    state: '',
    party: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['politicians', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters as any);
      const response = await api.get(`/politicians?${params}`);
      return response.data.data;
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Politicians</h1>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="px-4 py-2 border rounded-lg"
        />
        <select
          className="px-4 py-2 border rounded-lg"
          value={filters.state}
          onChange={(e) => setFilters({ ...filters, state: e.target.value })}
        >
          <option value="">All States</option>
          <option value="lagos">Lagos</option>
          <option value="abuja">FCT Abuja</option>
        </select>
        <select
          className="px-4 py-2 border rounded-lg"
          value={filters.party}
          onChange={(e) => setFilters({ ...filters, party: e.target.value })}
        >
          <option value="">All Parties</option>
          <option value="APC">APC</option>
          <option value="PDP">PDP</option>
          <option value="LP">LP</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.politicians?.map((politician: any) => (
            <Link
              key={politician.id}
              to={`/politicians/${politician.id}`}
              className="bg-white border rounded-lg p-6 hover:shadow-lg transition"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full" />
                <div>
                  <h3 className="font-semibold text-lg">
                    {politician.firstName} {politician.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{politician.partyAffiliation}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{politician.state?.name}</span>
                <span className="font-semibold text-primary-600">
                  {politician.performanceScore.toFixed(1)}/100
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
