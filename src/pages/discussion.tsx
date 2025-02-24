import { useState, useEffect } from 'react';
import { firestore } from '../utils/firebaseInit';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/auth';
import { FaThumbsUp, FaReply, FaThumbtack, FaEdit, FaTrash } from 'react-icons/fa';
import bgImage from 'assets/discussion-bg.png';


const DiscussionPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const messagesCollection = collection(firestore, 'discussion');
    const q = query(messagesCollection, orderBy('createdAt', 'asc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });
    
    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await addDoc(collection(firestore, 'discussion'), {
        text: newMessage,
        author: user?.displayName || 'Anonymous',
        createdAt: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="min-h-screen pt-28 flex flex-col items-center py-12 bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mt-10 mb-8">💬 Welcome to the Discussion</h1>
      
      <div className="w-2/3 bg-white shadow-2xl rounded-xl p-6 flex flex-col h-[700px] border border-gray-300 backdrop-blur-md relative">
        <div className="absolute inset-0 bg-blue-300 opacity-20 blur-3xl"></div>
        <div className="flex-1 overflow-y-auto space-y-6 p-6 bg-white bg-opacity-70 rounded-lg relative">
          {messages.length === 0 && (
            <p className="text-center text-gray-500 text-lg">No messages yet. Start the conversation!</p>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`relative flex flex-col p-5 rounded-lg w-3/4 shadow-md border cursor-pointer transition ${msg.author === user?.displayName ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-black self-start'} hover:bg-opacity-80`}
              onClick={() => setSelectedMessage(msg.id === selectedMessage ? null : msg.id)}
            >
              <p className="text-sm font-semibold">{msg.author}</p>
              <p className="mt-2 text-lg">{msg.text}</p>
              {selectedMessage === msg.id && (
                <div className="absolute top-2 right-2 flex gap-2 p-2 bg-white shadow-md rounded-lg text-gray-700">
                  <button className="hover:text-blue-500 transition transform hover:scale-110"><FaThumbsUp /></button>
                  <button className="hover:text-blue-500 transition transform hover:scale-110"><FaReply /></button>
                  <button className="hover:text-blue-500 transition transform hover:scale-110"><FaThumbtack /></button>
                  <button className="hover:text-blue-500 transition transform hover:scale-110"><FaEdit /></button>
                  <button className="hover:text-red-500 transition transform hover:scale-110"><FaTrash /></button>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex gap-4 relative">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-4 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-6 py-4 rounded-lg shadow-md hover:bg-blue-600 transition text-lg font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscussionPage;

