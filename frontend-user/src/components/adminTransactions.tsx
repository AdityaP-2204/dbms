import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  getAllTransactions,
  getOrdersByTransactionId,
  getVariantById,
  getProductById,
  getUserById,
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
  FaTruck,
  FaHistory,
  FaUser,
} from "react-icons/fa";

interface OrderItemWithDetails extends OrderItem {
  variant?: Variant;
  product?: Product;
}

export default function AdminTransactions() {
  const navigate = useNavigate();
  const user = useAuth();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [orderItems, setOrderItems] = useState<{ [key: string]: OrderItemWithDetails[] }>({});
  const [userEmails, setUserEmails] = useState<{ [key: string]: string }>({});
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState<string | null>(null);

  // ✅ Redirect if not admin
  useEffect(() => {
    if (!user) return; // Wait until auth loads
    if (user.role !== "admin") {
      navigate("/"); // Redirect non-admin users
    }
  }, [user, navigate]);

  // ✅ Fetch all transactions
  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        setLoading(true);
        const data = await getAllTransactions();
        const sortedData = data.sort(
          (a, b) =>
            new Date(b.transaction_date).getTime() -
            new Date(a.transaction_date).getTime()
        );
        setTransactions(sortedData);

        // Preload user emails
        const userIds = [...new Set(sortedData.map((t) => t.user_id))];
        const emails: { [key: string]: string } = {};

        await Promise.all(
          userIds.map(async (id) => {
            try {
              const user = await getUserById(id);
              emails[id] = user.email;
            } catch {
              emails[id] = "Unknown User";
            }
          })
        );

        setUserEmails(emails);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "admin") fetchAllTransactions();
  }, [user]);

  // ✅ Expand transaction & fetch order details
  const handleToggleTransaction = async (transactionId: string) => {
    if (expandedTransaction === transactionId) {
      setExpandedTransaction(null);
      return;
    }

    setExpandedTransaction(transactionId);

    if (!orderItems[transactionId]) {
      try {
        setLoadingOrders(transactionId);
        const items = await getOrdersByTransactionId(transactionId);

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

  // ✅ Optional loading spinner while verifying role or fetching data
  if (!user || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // ✅ Prevent rendering for non-admins (quick flash protection)
  if (user.role !== "admin") {
    return null;
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <FaShoppingBag className="text-gray-400 mb-4" size={64} />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          No Transactions Found
        </h2>
        <p className="text-gray-500">No transactions have been made yet</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FaShoppingBag className="text-indigo-600" />
            All Transactions (Admin)
          </h1>
          <p className="text-gray-600 mt-2">
            View all users’ transactions and their order details
          </p>
        </div>

        {/* Transaction Cards */}
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.transaction_id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
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
                      <span className="flex items-center gap-1">
                        <FaUser className="text-gray-400" />
                        {userEmails[transaction.user_id] || "Loading..."}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-2 ${getStatusColor(
                        transaction.payment_status
                      )}`}
                    >
                      {getStatusIcon(transaction.payment_status)}
                      {transaction.payment_status}
                    </span>

                    {expandedTransaction === transaction.transaction_id ? (
                      <FaChevronUp className="text-gray-400" />
                    ) : (
                      <FaChevronDown className="text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {expandedTransaction === transaction.transaction_id && (
                <div className="border-t border-gray-200 bg-gray-50 p-6">
                  {loadingOrders === transaction.transaction_id ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : orderItems[transaction.transaction_id]?.length > 0 ? (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Order Items
                      </h3>
                      {orderItems[transaction.transaction_id].map((item) => (
                        <div
                          key={item.order_item_id}
                          className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-4">
                            {item.variant?.variant_image && (
                              <img
                                src={item.variant.variant_image}
                                alt={
                                  item.product?.product_title || "Variant"
                                }
                                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                              />
                            )}

                            <div className="flex-1 space-y-1">
                              {item.product && (
                                <>
                                  <h4 className="font-semibold text-gray-900 text-base">
                                    {item.product.product_title}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    Type: {item.product.product_type}
                                  </p>
                                </>
                              )}

                              {item.variant && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-sm text-gray-700">
                                  <div className="flex items-center gap-1">
                                    <FaHistory className="text-indigo-500" />
                                    Attempts:{" "}
                                    <span className="font-semibold">
                                      {item.variant.attempt}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <FaMoneyBillWave className="text-green-500" />
                                    Price:{" "}
                                    <span className="font-semibold">
                                      ₹{item.variant.price}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <FaTruck className="text-blue-500" />
                                    Delivery:{" "}
                                    <span className="font-semibold">
                                      {item.variant.delivery_mode}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <FaCalendarAlt className="text-purple-500" />
                                    Validity:{" "}
                                    <span className="font-semibold">
                                      {item.variant.validity}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="border-t border-gray-300 pt-3 mt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">
                            Total Amount:
                          </span>
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
