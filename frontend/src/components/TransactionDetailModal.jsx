import { getStatusColor, formatCurrency, formatDate, capitalize } from '../utils/helpers';

/**
 * Transaction detail modal component
 * AI-generated component to display full transaction details
 * @param {Object} props - Component props
 * @param {Object} props.transaction - Transaction object to display
 * @param {Function} props.onClose - Function to close the modal
 */
const TransactionDetailModal = ({ transaction, onClose }) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 z-50">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Transaction Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                <p className="mt-1 text-gray-900 font-mono text-sm">{transaction.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Source</label>
                <p className="mt-1 text-gray-900 capitalize">{transaction.source}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Amount</label>
                <p className="mt-1 text-gray-900 font-semibold text-lg">
                  {formatCurrency(transaction.amount, transaction.currency)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
                      transaction.status
                    )}`}
                  >
                    {capitalize(transaction.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="text-sm font-medium text-gray-500">Created At</label>
                <p className="mt-1 text-gray-900">{formatDate(transaction.created_at)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Updated At</label>
                <p className="mt-1 text-gray-900">{formatDate(transaction.updated_at)}</p>
              </div>
            </div>

            {/* Payload */}
            <div className="pt-4 border-t border-gray-200">
              <label className="text-sm font-medium text-gray-500 mb-2 block">
                Full Payload (JSONB)
              </label>
              <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-800 font-mono">
                  {JSON.stringify(transaction.payload, null, 2)}
                </pre>
              </div>
            </div>

            {/* Merchant ID */}
            <div className="pt-4 border-t border-gray-200">
              <label className="text-sm font-medium text-gray-500">Merchant ID</label>
              <p className="mt-1 text-gray-900 font-mono text-sm">{transaction.merchant_id}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;
