import { ensureSession } from "~/lib/server/auth";
// import { ChatInterface } from "./client"; // Assuming a client component handles the UI

// Placeholder: Fetch chat data based on ID
// const fetchChatData = async (chatId: string) => {
//   await ensureSession();
//   console.log(`Fetching data for chat: ${chatId}`);
//   // Fetch messages, etc.
//   return { id: chatId, name: `Chat ${chatId}`, messages: [...] };
// };

interface ChatPageProps {
  params: { id: string };
}

export default async function IndividualChatPage({ params }: ChatPageProps) {
  await ensureSession();
  const chatId = params.id;
  // const chatData = await fetchChatData(chatId);

  console.log(`Displaying chat page for ID: ${chatId}`);

  // Replace with actual Chat Interface component passing chatData
  return (
    <div>
      <h1 className="mb-4 font-semibold text-xl">Chat: {chatId}</h1>
      {/* <ChatInterface initialMessages={chatData.messages} chatId={chatId} /> */}
      <p>Chat interface for {chatId} goes here.</p>
      <p>Placeholder messages would be loaded here.</p>
    </div>
  );
}
