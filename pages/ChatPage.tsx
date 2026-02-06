
import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import ChatInput from '../components/ChatInput';
import ChatMessage from '../components/ChatMessage';
import EmptyState from '../components/EmptyState';
import { Message, MessageRole, ChatState } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

const ChatPage: React.FC = () => {
    const [chatState, setChatState] = useState<ChatState>({
        messages: [],
        isLoading: false,
        error: null,
    });

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatState.messages, chatState.isLoading]);

    const handleSendMessage = async (content: string) => {
        const userMessage: Message = {
            id: Date.now().toString(),
            role: MessageRole.USER,
            content,
            timestamp: new Date(),
        };

        setChatState(prev => ({
            ...prev,
            messages: [...prev.messages, userMessage],
            isLoading: true,
            error: null,
        }));

        try {
            const response = await sendMessageToGemini(content, chatState.messages);

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: MessageRole.ASSISTANT,
                content: response.text,
                sources: response.sources,
                timestamp: new Date(),
            };

            setChatState(prev => ({
                ...prev,
                messages: [...prev.messages, assistantMessage],
                isLoading: false,
            }));
        } catch (err) {
            const errorText =
                err instanceof Error && err.message
                    ? err.message
                    : "I encountered an issue accessing the ministry archive. Please try rephrasing your question or checking your connection.";

            setChatState(prev => ({
                ...prev,
                isLoading: false,
                error: errorText,
            }));

            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: MessageRole.SYSTEM_NOTICE,
                content: errorText,
                timestamp: new Date(),
            };

            setChatState(prev => ({
                ...prev,
                messages: [...prev.messages, errorMessage],
            }));
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[var(--chat-bg)] transition-colors duration-200">
            <Header />

            <main className="flex-1 overflow-y-auto chat-scroll-container scroll-smooth bg-[var(--chat-bg)]" ref={scrollRef}>
                <div className="max-w-4xl mx-auto flex flex-col min-h-full py-10 px-6">
                    {chatState.messages.length === 0 ? (
                        <EmptyState onSuggestedClick={handleSendMessage} />
                    ) : (
                        <>
                            <div className="flex-1">
                                {chatState.messages.map((msg) => (
                                    <ChatMessage key={msg.id} message={msg} />
                                ))}
                            </div>

                            {chatState.isLoading && (
                                <div className="flex justify-start mb-8 animate-in fade-in duration-300">
                                    <div className="flex flex-row gap-4">
                                        <div className="w-9 h-9 rounded-full bg-[var(--assistant-bubble)]/50 flex items-center justify-center">
                                            <div className="w-4 h-4 border-2 border-[var(--text-primary)] border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                        <div className="px-5 py-3.5 rounded-2xl bg-[var(--assistant-bubble)] border border-[var(--divider)] rounded-tl-none flex gap-1.5 items-center shadow-sm">
                                            <div className="w-2 h-2 bg-[var(--text-primary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-[var(--text-primary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-[var(--text-primary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            <ChatInput onSendMessage={handleSendMessage} isLoading={chatState.isLoading} />
        </div>
    );
};

export default ChatPage;
