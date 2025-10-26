import { useState } from "react";
import {
  Search,
  Send,
  Paperclip,
  Image as ImageIcon,
  Smile,
  MoreVertical,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

const mockConversations = [
  {
    id: 1,
    buyerName: "John Smith",
    buyerAvatar: "JS",
    productName: "Oak Tree Sapling",
    productImage: "https://images.unsplash.com/photo-1542486823-63b97bbff8a9?w=100",
    lastMessage: "When will this be delivered?",
    time: "2m ago",
    unread: 2,
    messages: [
      { id: 1, sender: "buyer", text: "Hi, I'm interested in this tree. Is it still available?", time: "10:30 AM" },
      { id: 2, sender: "seller", text: "Yes! It's available. Would you like to place an order?", time: "10:32 AM" },
      { id: 3, sender: "buyer", text: "Great! I just ordered it. When will this be delivered?", time: "10:35 AM" },
    ],
  },
  {
    id: 2,
    buyerName: "Sarah Johnson",
    buyerAvatar: "SJ",
    productName: "Cherry Blossom Tree",
    productImage: "https://images.unsplash.com/photo-1526344966-89049886b28d?w=100",
    lastMessage: "Thank you for the quick response!",
    time: "1h ago",
    unread: 0,
    messages: [
      { id: 1, sender: "buyer", text: "Does this tree require full sunlight?", time: "Yesterday" },
      { id: 2, sender: "seller", text: "Yes, cherry blossoms thrive in full sun! At least 6 hours daily.", time: "Yesterday" },
      { id: 3, sender: "buyer", text: "Thank you for the quick response!", time: "Yesterday" },
    ],
  },
  {
    id: 3,
    buyerName: "Mike Wilson",
    buyerAvatar: "MW",
    productName: "Maple Tree",
    productImage: "https://images.unsplash.com/photo-1622901641231-a570d784e5e3?w=100",
    lastMessage: "Can I get a discount for bulk order?",
    time: "3h ago",
    unread: 1,
    messages: [
      { id: 1, sender: "buyer", text: "I need 10 maple trees. Can I get a discount for bulk order?", time: "3h ago" },
    ],
  },
  {
    id: 4,
    buyerName: "Emily Brown",
    buyerAvatar: "EB",
    productName: "Bonsai Tree Collection",
    productImage: "https://images.unsplash.com/photo-1677897466760-ba23e614aa7f?w=100",
    lastMessage: "Perfect, I'll take it!",
    time: "Yesterday",
    unread: 0,
    messages: [
      { id: 1, sender: "buyer", text: "Is this suitable for indoor growing?", time: "Yesterday" },
      { id: 2, sender: "seller", text: "Absolutely! This bonsai is perfect for indoor environments.", time: "Yesterday" },
      { id: 3, sender: "buyer", text: "Perfect, I'll take it!", time: "Yesterday" },
    ],
  },
];

export default function SellerMessages() {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  const filteredConvos = conversations.filter(
    (convo) =>
      convo.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      convo.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConvo) return;

    const newMessage = {
      id: selectedConvo.messages.length + 1,
      sender: "seller",
      text: messageText,
      time: "Just now",
    };

    setConversations(
      conversations.map((convo) =>
        convo.id === selectedConvo.id
          ? {
              ...convo,
              messages: [...convo.messages, newMessage],
              lastMessage: messageText,
              time: "Just now",
            }
          : convo
      )
    );

    setSelectedConvo({
      ...selectedConvo,
      messages: [...selectedConvo.messages, newMessage],
    });

    setMessageText("");
    toast.success("Message sent!");
  };

  const showConversationList = !selectedConvo || !isMobileView;
  const showChat = selectedConvo;

  return (
    <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-100px)]">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-full flex flex-col md:flex-row">
        {/* Conversations List */}
        {showConversationList && (
          <div className={`${isMobileView && selectedConvo ? 'hidden' : ''} md:w-1/3 border-r border-gray-200 flex flex-col`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-[#374151] mb-3">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#F9FAFB] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConvos.map((convo) => (
                <button
                  key={convo.id}
                  onClick={() => {
                    setSelectedConvo(convo);
                    setConversations(
                      conversations.map((c) =>
                        c.id === convo.id ? { ...c, unread: 0 } : c
                      )
                    );
                  }}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                    selectedConvo?.id === convo.id ? "bg-[#FF9900] bg-opacity-5" : ""
                  }`}
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-[#FF9900] rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                    {convo.buyerAvatar}
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-[#374151] truncate">{convo.buyerName}</p>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{convo.time}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <img
                        src={convo.productImage}
                        alt={convo.productName}
                        className="w-6 h-6 rounded object-cover"
                      />
                      <p className="text-xs text-gray-500 truncate">{convo.productName}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">{convo.lastMessage}</p>
                      {convo.unread > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-[#FF9900] text-white text-xs rounded-full flex-shrink-0">
                          {convo.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Area */}
        {showChat && selectedConvo ? (
          <div className={`${isMobileView && !showConversationList ? 'w-full' : ''} md:flex-1 flex flex-col`}>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isMobileView && (
                  <button
                    onClick={() => setSelectedConvo(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors -ml-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div className="w-10 h-10 bg-[#FF9900] rounded-full flex items-center justify-center text-white font-medium">
                  {selectedConvo.buyerAvatar}
                </div>
                <div>
                  <p className="font-medium text-[#374151]">{selectedConvo.buyerName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <img
                      src={selectedConvo.productImage}
                      alt={selectedConvo.productName}
                      className="w-4 h-4 rounded object-cover"
                    />
                    <p className="text-xs text-gray-500">{selectedConvo.productName}</p>
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F9FAFB]">
              {selectedConvo.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "seller" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      msg.sender === "seller"
                        ? "bg-[#FF9900] text-white rounded-br-sm"
                        : "bg-white text-[#374151] rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === "seller" ? "text-white text-opacity-80" : "text-gray-500"
                      }`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}

              {/* Product Preview in Chat */}
              <div className="flex justify-center">
                <div className="bg-white rounded-xl p-3 border border-gray-200 max-w-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedConvo.productImage}
                      alt={selectedConvo.productName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-[#374151]">{selectedConvo.productName}</p>
                      <p className="text-xs text-gray-500 mt-1">View Product</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  type="button"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ImageIcon className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1 relative">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full px-4 py-2 pr-10 bg-[#F9FAFB] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9900] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-2 bottom-2 p-1 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Smile className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="p-3 bg-[#FF9900] text-white rounded-xl hover:bg-[#E68A00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          !isMobileView && (
            <div className="flex-1 flex items-center justify-center bg-[#F9FAFB]">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-[#374151] mb-2">No conversation selected</h3>
                <p className="text-gray-500">Select a conversation to start messaging</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
