import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export default function PoliticianProfilePage() {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['politician', id],
    queryFn: async () => {
      const response = await api.get(`/politicians/${id}/profile`);
      return response.data.data;
    },
  });

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  const { politician, promises, bills, projects, rankings } = data || {};

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex items-start space-x-6">
          <div className="w-32 h-32 bg-gray-200 rounded-full" />
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">
              {politician?.firstName} {politician?.lastName}
            </h1>
            <p className="text-xl text-gray-600 mb-4">{politician?.partyAffiliation}</p>
            <div className="flex gap-4">
              <div>
                <span className="text-sm text-gray-600">Performance Score</span>
                <p className="text-2xl font-bold text-primary-600">
                  {politician?.performanceScore.toFixed(1)}/100
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Promises ({promises?.length})</h2>
          <div className="space-y-4">
            {promises?.slice(0, 5).map((promise: any) => (
              <div key={promise.id} className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">{promise.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{promise.description}</p>
                <span className={`text-xs px-2 py-1 rounded ${
                  promise.status === 'FULFILLED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {promise.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Bills ({bills?.length})</h2>
          <div className="space-y-4">
            {bills?.slice(0, 5).map((bill: any) => (
              <div key={bill.id} className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">{bill.title}</h3>
                <p className="text-sm text-gray-600">{bill.description}</p>
                <span className="text-xs text-gray-500">
                  {new Date(bill.dateProposed).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
