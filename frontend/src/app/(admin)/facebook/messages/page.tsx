'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PermissionGuard } from '@/components/auth';
import { UserRole } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import { Separator } from '@/components/ui/Separator';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { 
  MessageSquare, 
  Facebook, 
  AlertTriangle, 
  User, 
  Search, 
  Send, 
  RefreshCw, 
  Clock, 
  Check, 
  CheckCheck, 
  Filter, 
  ArrowDown, 
  Loader2, 
  Image, 
  Paperclip, 
  Smile
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  facebookAuthService,
  facebookMessagesService,
  Conversation as FBConversation,
  FacebookMessage
} from '@/services/facebook';

// Types for the component
interface ConversationDisplay {
  id: string;
  sender: {
    id: string;
    name: string;
    profilePicture?: string;
  };
  lastMessage: {
    text: string;
    timestamp: string;
    isRead: boolean;
    isFromPage: boolean;
  };
  unreadCount: number;
  pageName: string;
}

interface MessageDisplay {
  id: string;
  text: string;
  timestamp: string;
  isFromPage: boolean;
  sender: {
    id: string;
    name: string;
    profilePicture?: string;
  };
  status: 'sent' | 'delivered' | 'read';
}

export default function FacebookMessagesPage() {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationDisplay[]>([]);
  const [messages, setMessages] = useState<MessageDisplay[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedPage, setSelectedPage] = useState('all');
  const [isSending, setIsSending] = useState(false);
  const [availablePages, setAvailablePages] = useState<any[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  useEffect(() => {
    if (isConnected) {
      loadPages();
    }
  }, [isConnected]);

  useEffect(() => {
    if (isConnected && availablePages.length > 0) {
      fetchConversations();
    }
  }, [isConnected, availablePages]);

  useEffect(() => {
    if (activeConversation && activePage) {
      fetchMessages(activeConversation, activePage);
      // Mark messages as read when conversation is opened
      markMessagesAsRead(activeConversation, activePage);
    }
  }, [activeConversation, activePage]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkConnectionStatus = async () => {
    setIsLoading(true);
    try {
      const status = await facebookAuthService.getConnectionStatus();
      setIsConnected(status && status.isConnected ? true : false);
    } catch (error) {
      console.error('Failed to check Facebook connection status:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };
  const loadPages = async () => {
    setLoadingPages(true);
    try {
      // Use the updated messagesService.getMessengerPages() which now calls the Facebook Pages API
      const pagesResponse = await facebookMessagesService.getMessengerPages();
      
      // Filter pages that have messenger enabled by checking for required permissions
      // This ensures we only show pages that can actually use messenger
      const messengerEnabledPages = pagesResponse.filter(page => 
        page.isActive && page.permissions && 
        (page.permissions.includes('pages_messaging') || 
         page.permissions.includes('pages_manage_metadata'))
      );
      
      setAvailablePages(messengerEnabledPages);
      
      // Set the first page as active if available
      if (messengerEnabledPages.length > 0) {
        setSelectedPage(messengerEnabledPages[0].id);
      }
    } catch (error) {
      console.error('Failed to load Facebook pages:', error);
    } finally {
      setLoadingPages(false);
    }
  };

  const fetchConversations = async (cursor?: string) => {
    try {
      // If no pages available, return
      if (!availablePages.length) return;
      
      const pageId = selectedPage === 'all' ? undefined : selectedPage;
      
      const response = await facebookMessagesService.getConversations({
        pageId,
        limit: 20,
        after: cursor,
        unreadOnly: filter === 'unread',
        searchTerm: searchTerm || undefined
      });
      
      // Map the conversations to the format expected by the component
      const mappedConversations: ConversationDisplay[] = response.conversations.map(conv => {
        // Find the participant who is not the page
        const customer = conv.participants.find(p => !availablePages.some(page => page.facebookPageId === p.id));
        const pageName = availablePages.find(page => 
          conv.pageId === page.id || 
          page.facebookPageId === conv.pageId
        )?.name || 'Unknown Page';
        
        return {
          id: conv.id,
          sender: {
            id: customer?.id || 'unknown',
            name: customer?.name || 'Unknown User',
            profilePicture: customer?.profilePicture
          },
          lastMessage: {
            text: conv.lastMessage?.content || 'No messages yet',
            timestamp: conv.lastMessage?.createdAt || conv.updatedAt,
            isRead: conv.unreadCount === 0,
            isFromPage: conv.lastMessage?.from === 'page'
          },
          unreadCount: conv.unreadCount,
          pageName
        };
      });
      
      // If we're loading more, append to existing conversations
      if (cursor) {
        setConversations(prev => [...prev, ...mappedConversations]);
      } else {
        setConversations(mappedConversations);
      }
      
      // Save the next cursor for pagination
      setNextCursor(response.nextCursor);
      
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  };

  const loadMoreConversations = async () => {
    if (!nextCursor || isLoadingMore) return;
    
    setIsLoadingMore(true);
    await fetchConversations(nextCursor);
    setIsLoadingMore(false);
  };

  const fetchMessages = async (conversationId: string, pageId: string) => {
    setIsLoadingMessages(true);
    try {
      const response = await facebookMessagesService.getMessages(pageId, conversationId);
      
      // Map the messages to the format expected by the component
      const mappedMessages: MessageDisplay[] = response.messages.map(msg => {
        const isFromPage = msg.isFromPage;
        
        // Determine the message status
        let status: 'sent' | 'delivered' | 'read' = 'sent';
        if (msg.status === 'READ' || msg.status === 'DELIVERED') {
          status = msg.status.toLowerCase() as 'delivered' | 'read';
        }
        
        return {
          id: msg.id,
          text: msg.content,
          timestamp: msg.createdAt,
          isFromPage,
          sender: {
            id: msg.senderId,
            name: msg.sender?.name || (isFromPage ? 'Page' : 'User'),
            profilePicture: msg.sender?.profilePicture
          },
          status
        };
      });
      
      setMessages(mappedMessages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const markMessagesAsRead = async (conversationId: string, pageId: string) => {
    try {
      await facebookMessagesService.markAsRead(pageId, conversationId);
      
      // Update the unread count in the conversations list
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, unreadCount: 0 } 
            : conv
        )
      );
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeConversation || !activePage) return;
    
    setIsSending(true);
    
    try {
      const response = await facebookMessagesService.sendMessage({
        pageId: activePage,
        conversationId: activeConversation,
        message: messageText
      });
      
      // Add the new message to the messages list
      const newMessage: MessageDisplay = {
        id: response.id,
        text: response.content,
        timestamp: response.createdAt,
        isFromPage: true,
        sender: {
          id: response.senderId,
          name: response.sender?.name || 'Page',
          profilePicture: response.sender?.profilePicture
        },
        status: 'sent'
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessageText('');
      
      // Update the conversation list with the new message
      setConversations(prev => 
        prev.map(conv => 
          conv.id === activeConversation 
            ? {
                ...conv,
                lastMessage: {
                  text: response.content,
                  timestamp: response.createdAt,
                  isRead: true,
                  isFromPage: true
                }
              } 
            : conv
        )
      );
      
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatConversationTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Hôm qua';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const handleConversationClick = (conversationId: string, pageId: string) => {
    setActiveConversation(conversationId);
    setActivePage(pageId);
  };

  const handlePageChange = (pageId: string) => {
    setSelectedPage(pageId);
    setActiveConversation(null);
    setActivePage(null);
    setMessages([]);
    fetchConversations();
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    fetchConversations();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Debounce search to avoid too many requests
    const timeoutId = setTimeout(() => {
      fetchConversations();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  const filteredConversations = conversations;

  return (
    <PermissionGuard 
      permissions={['facebook.messages.read']} 
      renderWhen='any'
      debugMode={true}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <MessageSquare className="h-8 w-8 text-purple-600" />
              Facebook Messages
            </h1>
            <p className="text-gray-600 mt-2">
              Manage Facebook messages and customer conversations
            </p>
          </div>
          
          {isConnected && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => fetchConversations()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          )}
        </div>

        {!isLoading && !isConnected && (
          <Alert variant="warning" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Facebook Not Connected</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>Your Facebook account is not connected. You need to connect it to manage messages.</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-4"
                onClick={() => router.push('/facebook/setup')}
              >
                <Facebook className="h-4 w-4 mr-2" /> 
                Connect Facebook
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-24">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Loading Facebook Messages...</p>
              </div>
            </CardContent>
          </Card>
        ) : isConnected ? (
          <>
            {loadingPages ? (
              <Card>
                <CardContent className="flex items-center justify-center py-24">
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Loading Facebook Pages...</p>
                  </div>
                </CardContent>
              </Card>
            ) : availablePages.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Facebook className="h-16 w-16 text-blue-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No Messenger Pages Found</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    You don't have any Facebook Pages with Messenger enabled. Connect a Facebook Page to start managing messages.
                  </p>
                  <Button 
                    variant="default" 
                    size="lg"
                    className="mt-6"
                    onClick={() => router.push('/facebook/setup')}
                  >
                    <Facebook className="h-5 w-5 mr-2" /> 
                    Manage Facebook Pages
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-250px)] min-h-[600px]">
                {/* Conversations List */}
                <Card className="md:col-span-1 flex flex-col h-full">
                  <CardHeader className="px-4 py-3 border-b">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Conversations</CardTitle>
                      <Badge variant="outline">{filteredConversations.length}</Badge>
                    </div>
                    
                    <div className="relative mt-2">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <Input 
                        placeholder="Search conversations..." 
                        className="pl-8"
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </div>
                    
                    <div className="flex gap-2 mt-2">
                      <Select 
                        value={filter} 
                        onValueChange={handleFilterChange}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <Filter className="h-3 w-3 mr-1" />
                          <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Messages</SelectItem>
                          <SelectItem value="unread">Unread Only</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select 
                        value={selectedPage} 
                        onValueChange={handlePageChange}
                      >
                        <SelectTrigger className="h-8 text-xs flex-1">
                          <Facebook className="h-3 w-3 mr-1" />
                          <SelectValue placeholder="Page" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Pages</SelectItem>
                          {availablePages.map(page => (
                            <SelectItem key={page.id} value={page.id}>{page.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  
                  <ScrollArea className="flex-1">
                    <div className="px-2 py-2">
                      {filteredConversations.length > 0 ? (
                        <>
                          {filteredConversations.map((conversation) => (
                            <div 
                              key={conversation.id}
                              className={`
                                p-3 rounded-md cursor-pointer mb-1 transition-colors
                                ${activeConversation === conversation.id ? 'bg-primary/10' : 'hover:bg-gray-100'}
                                ${conversation.unreadCount > 0 && !conversation.lastMessage.isFromPage ? 'border-l-4 border-primary' : ''}
                              `}
                              onClick={() => {
                                // Find the page ID for this conversation
                                const pageId = availablePages.find(p => p.name === conversation.pageName)?.id;
                                if (pageId) {
                                  handleConversationClick(conversation.id, pageId);
                                }
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <Avatar className="h-10 w-10">
                                    {conversation.sender.profilePicture ? (
                                      <AvatarImage src={conversation.sender.profilePicture} alt={conversation.sender.name} />
                                    ) : (
                                      <AvatarFallback>
                                        <User className="h-6 w-6" />
                                      </AvatarFallback>
                                    )}
                                  </Avatar>
                                  {conversation.unreadCount > 0 && !conversation.lastMessage.isFromPage && (
                                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                      {conversation.unreadCount}
                                    </span>
                                  )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium truncate">{conversation.sender.name}</span>
                                    <span className="text-xs text-gray-500">
                                      {formatConversationTime(conversation.lastMessage.timestamp)}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center gap-1 mt-1">
                                    {conversation.lastMessage.isFromPage && (
                                      <Badge variant="outline" className="h-4 px-1 text-[10px] font-normal text-gray-500">You</Badge>
                                    )}
                                    <p className="text-sm text-gray-600 truncate">
                                      {conversation.lastMessage.text}
                                    </p>
                                  </div>
                                  
                                  <div className="text-xs text-gray-500 mt-1">
                                    <Badge variant="secondary" className="text-xs px-1 py-0">
                                      {conversation.pageName}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {nextCursor && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full mt-2"
                              onClick={loadMoreConversations}
                              disabled={isLoadingMore}
                            >
                              {isLoadingMore ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <ArrowDown className="h-4 w-4 mr-2" />
                              )}
                              Load More
                            </Button>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                          <p>No conversations found</p>
                          <p className="text-sm mt-1">Try adjusting your filters</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </Card>
                
                {/* Message Content */}
                <Card className="md:col-span-2 flex flex-col h-full">
                  {activeConversation ? (
                    <>
                      <CardHeader className="px-4 py-3 border-b">
                        {conversations.find(c => c.id === activeConversation) && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                {conversations.find(c => c.id === activeConversation)?.sender.profilePicture ? (
                                  <AvatarImage 
                                    src={conversations.find(c => c.id === activeConversation)?.sender.profilePicture || ''} 
                                    alt={conversations.find(c => c.id === activeConversation)?.sender.name || 'User'} 
                                  />
                                ) : (
                                  <AvatarFallback>
                                    <User className="h-6 w-6" />
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              
                              <div>
                                <CardTitle className="text-base">
                                  {conversations.find(c => c.id === activeConversation)?.sender.name}
                                </CardTitle>
                                <CardDescription className="text-xs">
                                  <span className="flex items-center gap-1">
                                    <Badge variant="secondary" className="text-xs px-1 py-0">
                                      {conversations.find(c => c.id === activeConversation)?.pageName}
                                    </Badge>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-gray-500">
                                      Last active: {formatConversationTime(
                                        conversations.find(c => c.id === activeConversation)?.lastMessage.timestamp || ''
                                      )}
                                    </span>
                                  </span>
                                </CardDescription>
                              </div>
                            </div>
                            
                            <div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => fetchMessages(activeConversation, activePage!)}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardHeader>
                      
                      <ScrollArea className="flex-1 p-4">
                        {isLoadingMessages ? (
                          <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
                          </div>
                        ) : messages.length > 0 ? (
                          <div className="space-y-4">
                            {messages.map((message) => (
                              <div 
                                key={message.id} 
                                className={`flex ${message.isFromPage ? 'justify-end' : 'justify-start'}`}
                              >
                                <div className="flex gap-2 max-w-[80%]">
                                  {!message.isFromPage && (
                                    <Avatar className="h-8 w-8 mt-1">
                                      {message.sender.profilePicture ? (
                                        <AvatarImage 
                                          src={message.sender.profilePicture} 
                                          alt={message.sender.name} 
                                        />
                                      ) : (
                                        <AvatarFallback>
                                          <User className="h-5 w-5" />
                                        </AvatarFallback>
                                      )}
                                    </Avatar>
                                  )}
                                  
                                  <div>
                                    <div 
                                      className={`
                                        px-4 py-2 rounded-2xl text-sm
                                        ${message.isFromPage 
                                          ? 'bg-primary text-white rounded-tr-none' 
                                          : 'bg-gray-100 text-gray-800 rounded-tl-none'}
                                      `}
                                    >
                                      {message.text}
                                    </div>
                                      <div className="flex items-center mt-1 text-xs text-gray-500">
                                      {formatMessageTime(message.timestamp)}
                                      {message.isFromPage && (
                                        <span className="ml-1">{getStatusIcon(message.status)}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            <div ref={messagesEndRef} />
                          </div>
                        ) : (
                          <div className="text-center py-12 text-gray-500">
                            <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                            <p>No messages yet</p>
                          </div>
                        )}
                      </ScrollArea>
                        <CardFooter className="p-3 border-t">
                        <div className="flex items-center gap-2 w-full">
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <Paperclip className="h-5 w-5 text-gray-500" />
                          </Button>
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <Image className="h-5 w-5 text-gray-500" />
                          </Button>                          <Input 
                            placeholder="Type a message..." 
                            className="flex-1"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                          />
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <Smile className="h-5 w-5 text-gray-500" />
                          </Button>
                          <Button 
                            onClick={handleSendMessage}
                            disabled={!messageText.trim() || isSending}
                            size="icon" 
                            className="rounded-full"
                          >
                            {isSending ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <Send className="h-5 w-5" />
                            )}
                          </Button>
                        </div>
                      </CardFooter>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center p-8">
                        <MessageSquare className="h-16 w-16 mx-auto text-gray-200 mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No Conversation Selected</h3>
                        <p className="text-gray-600 max-w-md">
                          Select a conversation from the list to view messages and start chatting.
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Facebook className="h-16 w-16 text-blue-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Facebook Messages</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Connect your Facebook account to start managing messages from your Facebook Pages.
              </p>
              <Button 
                variant="default" 
                size="lg"
                className="mt-6"
                onClick={() => router.push('/facebook/setup')}
              >
                <Facebook className="h-5 w-5 mr-2" /> 
                Connect Facebook
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </PermissionGuard>
  );
}
