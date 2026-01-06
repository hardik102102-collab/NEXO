import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import clsx from 'clsx';
import { TicketCard } from './TicketCard';

export interface Message {
    id: string;
    role: 'user' | 'model';
    content?: string;
    timestamp: Date;
    ticketData?: {
        issue: string;
        priority: string;
        userName: string;
        ticketId: string;
    };
}

interface MessageBubbleProps {
    message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={clsx(
                "flex gap-4 max-w-3xl mx-auto w-full p-4 md:p-6",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
        >
            <div className={clsx(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                isUser ? "bg-accent/20 text-accent" : "bg-primary text-background"
            )}>
                {isUser ? <User size={18} /> : <span className="font-bold text-xs">N</span>}
            </div>

            <div className={clsx(
                "flex-1 space-y-2 min-w-0"
            )}>
                <div className={clsx(
                    "flex items-center gap-2 text-xs text-secondary",
                    isUser && "flex-row-reverse"
                )}>
                    <span className="font-medium">{isUser ? 'You' : 'Nexo'}</span>
                    <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {message.ticketData && (
                    <TicketCard {...message.ticketData} />
                )}

                {message.content && (
                    <div className={clsx(
                        "rounded-2xl p-4 text-sm leading-relaxed shadow-sm",
                        isUser
                            ? "bg-surfaceHighlight text-primary rounded-tr-sm"
                            : "bg-surface border border-border text-primary/90 rounded-tl-sm"
                    )}>
                        <div className="prose prose-invert prose-sm max-w-none">
                            {message.content.split('\n').map((line, i) => (
                                <p key={i} className="mb-2 last:mb-0">{line}</p>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
