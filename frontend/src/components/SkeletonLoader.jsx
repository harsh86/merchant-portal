/**
 * Skeleton loader for tables and content
 * AI-generated component for loading placeholders
 */
const SkeletonLoader = ({ rows = 5, type = 'table' }) => {
  if (type === 'table') {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[...Array(5)].map((_, idx) => (
                  <th key={idx} className="px-6 py-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(rows)].map((_, rowIdx) => (
                <tr key={rowIdx}>
                  {[...Array(5)].map((_, colIdx) => (
                    <td key={colIdx} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {[...Array(rows)].map((_, idx) => (
        <div key={idx} className="h-4 bg-gray-200 rounded animate-pulse"></div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
