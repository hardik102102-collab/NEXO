import { useState, useRef, useEffect } from 'react';
import { Send, Menu, Sparkles } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import type { Message } from './MessageBubble';
import { Sidebar } from './Sidebar';
import { sendMessageToGemini } from '../lib/gemini';

export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'model',
            content: "Hello! I'm Nexo, your premium AI support agent. How can I assist you today?",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // 1. Prepare history
            const history = messages
                .filter((_, index) => index > 0 || messages[0].role === 'user')
                .map(m => ({
                    role: m.role,
                    parts: [{ text: m.content || '' }] // Handle potential empty content if it was a ticket card
                }));

            // 2. Call Gemini
            const response = await sendMessageToGemini(history, userMessage.content || '');

            // 3. Process Function Calls
            const functionCalls = response.functionCalls();

            if (functionCalls && functionCalls.length > 0) {
                const call = functionCalls[0];

                if (call.name === 'logTicket') {
                    const { issue, priority, user_name } = call.args as any;

                    // Mimic saving to Sheets
                    const ticketId = Math.random().toString(36).substr(2, 9).toUpperCase();

                    const toolMessage: Message = {
                        id: (Date.now() + 1).toString(),
                        role: 'model',
                        timestamp: new Date(),
                        ticketData: {
                            issue,
                            priority,
                            userName: user_name || 'Unknown',
                            ticketId
                        }
                    };

                    setMessages(prev => [...prev, toolMessage]);

                    // Optional: We can send the function response back to Gemini to get a final text confirmation
                    // For now, we'll just append a simple text confirmation from Nexo manually or let the card stand.
                    // Let's add a small text follow-up.
                    const followUpMessage: Message = {
                        id: (Date.now() + 2).toString(),
                        role: 'model',
                        content: `I've logged a ticket for this issue (ID: #${ticketId}). Is there anything else?`,
                        timestamp: new Date()
                    };
                    setMessages(prev => [...prev, followUpMessage]);
                }
            } else {
                // Normal Text Response
                const text = response.text();
                const botMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'model',
                    content: text,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMessage]);
            }

        } catch (error: any) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                content: `Error: ${error.message || 'Something went wrong.'}`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-background text-primary font-sans overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <main className="flex-1 flex flex-col relative w-full h-full">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-4 border-b border-border bg-background/80 backdrop-blur-md z-10">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden text-secondary hover:text-primary p-2"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-2 mx-auto md:mx-0">
                        <span className="text-sm font-medium text-secondary flex items-center gap-2">
                            <Sparkles size={14} className="text-accent" />
                            Nexo AI Support
                        </span>
                    </div>
                    <div className="w-10 md:hidden" /> {/* Spacer */}
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))}
                    {isLoading && (
                        <div className="flex gap-4 max-w-3xl mx-auto w-full p-4 md:p-6">
                            <div className="w-8 h-8 rounded-full bg-primary text-background flex items-center justify-center">
                                <span className="font-bold text-xs">N</span>
                            </div>
                            <div className="flex items-center gap-1 h-8">
                                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-background border-t border-border">
                    <div className="max-w-3xl mx-auto relative">
                        <form onSubmit={handleSend} className="relative group">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask Nexo anything..."
                                className="w-full bg-surface border border-border rounded-xl pl-4 pr-12 py-4 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-secondary/50"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary text-background disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                        <div className="text-center mt-2">
                            <p className="text-[10px] text-secondary/40">
                                Nexo is an AI assistant. Responses may vary.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
