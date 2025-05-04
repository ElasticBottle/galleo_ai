import Link from "next/link"; // Use Next.js Link
import { ensureSession } from "~/lib/server/auth";
import { ChatInterface } from "../_components/chat";

// Placeholder: Assume fetchAllChats function exists
// const fetchAllChats = async () => { ... return chats ... };

export default async function ChatPage() {
  await ensureSession();
  return <ChatInterface />;
}

export async function AllChatsPage() {
  await ensureSession(); // Ensure user is logged in
  // const chats = await fetchAllChats();
  const chats = [
    { id: "1", name: "Trademark Alpha" },
    { id: "2", name: "Brand Beta Discussion" },
    { id: "3", name: "Logo Gamma Search" },
    { id: "4", name: "Patent Delta Inquiry" },
    { id: "5", name: "Copyright Epsilon Filing" },
    // ... add more placeholder chats
  ];

  return (
    <div>
      <h1 className="mb-4 font-semibold text-2xl">All Chats</h1>
      {chats.length > 0 ? (
        <ul>
          {chats.map((chat) => (
            <li key={chat.id} className="mb-2">
              <Link
                href={`/dashboard/chat/${chat.id}`}
                className="text-blue-600 hover:underline"
              >
                {chat.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No chats found.</p>
      )}
    </div>
  );
}
