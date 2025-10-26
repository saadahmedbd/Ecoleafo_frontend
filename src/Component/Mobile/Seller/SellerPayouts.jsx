import { useState } from "react";
import {
  Wallet,
  DollarSign,
  Calendar,
  TrendingUp,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  CreditCard,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const earningsData = [
  { name: "Week 1", earnings: 2400 },
  { name: "Week 2", earnings: 3200 },
  { name: "Week 3", earnings: 2800 },
  { name: "Week 4", earnings: 4100 },
];

const monthlyData = [
  { name: "Jan", earnings: 12000 },
  { name: "Feb", earnings: 19000 },
  { name: "Mar", earnings: 15000 },
  { name: "Apr", earnings: 22000 },
  { name: "May", earnings: 28000 },
  { name: "Jun", earnings: 32000 },
];

const transactions = [
  {
    id: "TXN-001",
    date: "Oct 20, 2025",
    amount: 2450,
    status: "completed",
    method: "Bank Transfer",
    type: "payout",
  },
  {
    id: "TXN-002",
    date: "Oct 15, 2025",
    amount: 3200,
    status: "completed",
    method: "PayPal",
    type: "payout",
  },
  {
    id: "TXN-003",
    date: "Oct 10, 2025",
    amount: 1800,
    status: "pending",
    method: "Bank Transfer",
    type: "payout",
  },
  {
    id: "TXN-004",
    date: "Oct 5, 2025",
    amount: 4500,
    status: "completed",
    method: "Bank Transfer",
    type: "payout",
  },
  {
    id: "TXN-005",
    date: "Oct 1, 2025",
    amount: 2100,
    status: "failed",
    method: "PayPal",
    type: "payout",
  },
];

export default function SellerPayouts() {
  const [chartView, setChartView] = useState("weekly");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const stats = {
    totalEarnings: 45231,
    pendingPayouts: 1800,
    nextPayoutDate: "Oct 30, 2025",
    nextPayoutAmount: 2450,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#374151]">Payouts & Earnings</h1>
          <p className="text-gray-500 mt-1">Manage your earnings and withdrawal history</p>
        </div>
        <button
          onClick={() => setShowWithdrawModal(true)}
          className="px-4 py-2 bg-[#FF9900] text-white rounded-xl hover:bg-[#E68A00] transition-colors flex items-center gap-2 justify-center"
        >
          <Wallet className="w-4 h-4" />
          Withdraw Funds
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-gray-500 text-sm mb-1">Total Earnings</p>
          <p className="text-2xl font-semibold text-[#374151]">${stats.totalEarnings.toLocaleString()}</p>
          <p className="text-sm text-green-600 mt-2">+12.5% vs last month</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-1">Pending Payouts</p>
          <p className="text-2xl font-semibold text-yellow-600">${stats.pendingPayouts.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-2">Processing...</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-1">Next Payout Date</p>
          <p className="text-xl font-semibold text-[#374151]">{stats.nextPayoutDate}</p>
          <p className="text-sm text-gray-500 mt-2">In 5 days</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-[#FF9900] bg-opacity-20 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-[#FF9900]" />
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-1">Next Payout Amount</p>
          <p className="text-2xl font-semibold text-[#FF9900]">${stats.nextPayoutAmount.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-2">Available to withdraw</p>
        </div>
      </div>

      {/* Earnings Chart */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-[#374151]">Earnings Overview</h2>
            <p className="text-sm text-gray-500 mt-1">Track your revenue growth</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setChartView("weekly")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                chartView === "weekly"
                  ? "bg-[#FF9900] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setChartView("monthly")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                chartView === "monthly"
                  ? "bg-[#FF9900] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartView === "weekly" ? earningsData : monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#FF9900"
                strokeWidth={3}
                dot={{ fill: "#FF9900", r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#374151]">Transaction History</h2>
            <p className="text-sm text-gray-500 mt-1">View all your payout transactions</p>
          </div>
          <button className="text-[#FF9900] text-sm hover:underline flex items-center gap-1">
            Download Report
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Transaction ID</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Method</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Amount</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#374151]">{txn.id}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{txn.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{txn.method}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#374151]">${txn.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {txn.status === "completed" && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {txn.status === "pending" && <Clock className="w-4 h-4 text-yellow-500" />}
                      {txn.status === "failed" && <XCircle className="w-4 h-4 text-red-500" />}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          txn.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : txn.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {txn.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-[#FF9900] hover:text-[#E68A00] text-sm flex items-center gap-1">
                      View Details
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden p-4 space-y-3">
          {transactions.map((txn) => (
            <div key={txn.id} className="p-4 border border-gray-200 rounded-xl">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-[#374151]">{txn.id}</p>
                  <p className="text-sm text-gray-500">{txn.date}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize flex items-center gap-1 ${
                    txn.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : txn.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {txn.status === "completed" && <CheckCircle className="w-3 h-3" />}
                  {txn.status === "pending" && <Clock className="w-3 h-3" />}
                  {txn.status === "failed" && <XCircle className="w-3 h-3" />}
                  {txn.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CreditCard className="w-4 h-4" />
                  {txn.method}
                </div>
                <p className="text-xl font-semibold text-[#374151]">${txn.amount.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && <WithdrawModal onClose={() => setShowWithdrawModal(false)} availableBalance={stats.nextPayoutAmount} />}
    </div>
  );
}

function WithdrawModal({ onClose, availableBalance }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank");

  const handleWithdraw = (e) => {
    e.preventDefault();
    toast.success(`Withdrawal of $${amount} initiated successfully`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#374151]">Withdraw Funds</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleWithdraw} className="p-6 space-y-6">
          {/* Available Balance */}
          <div className="bg-[#FF9900] bg-opacity-10 border border-[#FF9900] border-opacity-20 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Available Balance</p>
            <p className="text-3xl font-semibold text-[#FF9900]">${availableBalance.toLocaleString()}</p>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">Withdrawal Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                max={availableBalance}
                className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                required
              />
            </div>
            <button
              type="button"
              onClick={() => setAmount(availableBalance.toString())}
              className="text-sm text-[#FF9900] mt-2 hover:underline"
            >
              Withdraw maximum amount
            </button>
          </div>

          {/* Method */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">Withdrawal Method</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="method"
                  value="bank"
                  checked={method === "bank"}
                  onChange={(e) => setMethod(e.target.value)}
                  className="text-[#FF9900] focus:ring-[#FF9900]"
                />
                <div className="flex-1">
                  <p className="font-medium text-[#374151]">Bank Transfer</p>
                  <p className="text-sm text-gray-500">2-3 business days</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="method"
                  value="paypal"
                  checked={method === "paypal"}
                  onChange={(e) => setMethod(e.target.value)}
                  className="text-[#FF9900] focus:ring-[#FF9900]"
                />
                <div className="flex-1">
                  <p className="font-medium text-[#374151]">PayPal</p>
                  <p className="text-sm text-gray-500">Instant</p>
                </div>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] transition-colors"
            >
              Withdraw Funds
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
