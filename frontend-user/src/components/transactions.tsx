import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  getTransactionsByUserId,
  getOrdersByTransactionId,
  getVariantById,
  getProductById,
  type Transaction,
  type OrderItem,
  type Variant,
  type Product,
} from "../services/transactionService";
import {
  FaShoppingBag,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaChevronDown,
  FaChevronUp,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaBox,
} from "react-icons/fa";

interface OrderItemWithDetails extends OrderItem {
  variant?: Variant;
  product?: Product;
}

export default function Transactions() {
  const user = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [orderItems, setOrderItems] = useState<{ [key: string]: OrderItemWithDetails[] }>({});
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const data = await getTransactionsByUserId(user.id);
        // Sort by date, newest first
        const sortedData = data.sort(
          (a, b) =>
            new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime()
        );
        setTransactions(sortedData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user?.id]);

  const handleToggleTransaction = async (transactionId: string) => {
    if (expandedTransaction === transactionId) {
      setExpandedTransaction(null);
      return;
    }

    setExpandedTransaction(transactionId);

    // Fetch order items if not already loaded
    if (!orderItems[transactionId]) {
      try {
        setLoadingOrders(transactionId);
        const items = await getOrdersByTransactionId(transactionId);
        
        // Fetch variant and product details for each item
        const itemsWithDetails = await Promise.all(
          items.map(async (item) => {
            try {
              const variant = await getVariantById(item.variant_id);
              const product = await getProductById(variant.product_id);
              return { ...item, variant, product };
            } catch (error) {
              console.error("Error fetching item details:", error);
              return item;
            }
          })
        );
        
        setOrderItems((prev) => ({ ...prev, [transactionId]: itemsWithDetails }));
      } catch (error) {
        console.error("Error fetching order items:", error);
      } finally {
        setLoadingOrders(null);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SUCCESSFUL":
        return <FaCheckCircle className="text-green-500" size={20} />;
      case "FAILED":
        return <FaTimesCircle className="text-red-500" size={20} />;
      case "PENDING":
        return <FaClock className="text-yellow-500" size={20} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESSFUL":
        return "bg-green-100 text-green-800 border-green-200";
      case "FAILED":
        return "bg-red-100 text-red-800 border-red-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <FaShoppingBag className="text-gray-400 mb-4" size={64} />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Transactions Yet</h2>
        <p className="text-gray-500">Your transaction history will appear here</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pt-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FaShoppingBag className="text-indigo-600" />
            My Transactions
          </h1>
          <p className="text-gray-600 mt-2">View all your past orders and transactions</p>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.transaction_id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              {/* Transaction Header */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleToggleTransaction(transaction.transaction_id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-gray-500">Transaction ID:</span>
                      <span className="text-sm font-mono text-gray-700">
                        {transaction.transaction_id.slice(0, 8)}...
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="text-gray-400" />
                        {formatDate(transaction.transaction_date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaMoneyBillWave className="text-gray-400" />
                        ₹{transaction.total_amount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Status Badge */}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-2 ${getStatusColor(
                        transaction.payment_status
                      )}`}
                    >
                      {getStatusIcon(transaction.payment_status)}
                      {transaction.payment_status}
                    </span>

                    {/* Expand Icon */}
                    {expandedTransaction === transaction.transaction_id ? (
                      <FaChevronUp className="text-gray-400" />
                    ) : (
                      <FaChevronDown className="text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items (Expandable) */}
              {expandedTransaction === transaction.transaction_id && (
                <div className="border-t border-gray-200 bg-gray-50 p-6">
                  {loadingOrders === transaction.transaction_id ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : orderItems[transaction.transaction_id]?.length > 0 ? (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                      {orderItems[transaction.transaction_id].map((item) => (
                        <div
                          key={item.order_item_id}
                          className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-4">
                            {/* Product Image */}
                            {item.product && (
                              <img
                                src={item.product.product_image}
                                alt={item.product.product_title}
                                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                              />
                            )}
                            
                            {/* Product Name and Details */}
                            <div className="flex-1">
                              {item.product && (
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  {item.product.product_title}
                                </h4>
                              )}
                              
                              <div className="flex items-center gap-4 text-sm text-gray-700">
                                <span>
                                  Qty: <span className="font-semibold">{item.quantity}</span>
                                </span>
                                <span>
                                  Price: <span className="font-semibold">₹{item.price.toFixed(2)}</span>
                                </span>
                              </div>
                            </div>
                            
                            {/* Total */}
                            <div className="text-right">
                              <div className="text-lg font-bold text-indigo-600">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Total */}
                      <div className="border-t border-gray-300 pt-3 mt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                          <span className="text-2xl font-bold text-indigo-600">
                            ₹{transaction.total_amount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No order items found for this transaction
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
