'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/minikit';
import { StreamerProfileHeader } from '../components/StreamerProfileHeader';
import { TipButton } from '../components/TipButton';
import { SubscriptionCard } from '../components/SubscriptionCard';
import { NotificationBanner } from '../components/NotificationBanner';
import { TipJar } from '../components/TipJar';
import { Heart, Zap, Trophy, Users } from 'lucide-react';

interface Streamer {
  streamerId: string;
  farcasterUsername: string;
  baseWalletAddress: string;
  displayName: string;
  profilePictureUrl?: string;
}

interface Tip {
  tipId: string;
  streamerId: string;
  viewerId: string;
  amount: number;
  currency: string;
  timestamp: Date;
  message?: string;
}

interface Subscription {
  subscriptionId: string;
  streamerId: string;
  viewerId: string;
  tierName: string;
  amount: number;
  frequency: 'weekly' | 'monthly';
  startDate: Date;
  endDate?: Date;
}

export default function HomePage() {
  const { context } = useMiniKit();
  const [streamer, setStreamer] = useState<Streamer | null>(null);
  const [recentTips, setRecentTips] = useState<Tip[]>([]);
  const [totalTips, setTotalTips] = useState(0);
  const [activeSubscriptions, setActiveSubscriptions] = useState<Subscription[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'newTip' | 'milestoneReached'>('newTip');

  // Mock data for demonstration
  useEffect(() => {
    // Initialize with mock streamer data
    const mockStreamer: Streamer = {
      streamerId: 'streamer_1',
      farcasterUsername: context?.user?.username || 'streamergamer',
      baseWalletAddress: '0x1234567890123456789012345678901234567890',
      displayName: context?.user?.displayName || 'Epic Gamer Pro',
      profilePictureUrl: context?.user?.pfpUrl || '/default-avatar.png',
    };
    setStreamer(mockStreamer);

    // Mock recent tips
    const mockTips: Tip[] = [
      {
        tipId: 'tip_1',
        streamerId: 'streamer_1',
        viewerId: 'viewer_1',
        amount: 5,
        currency: 'ETH',
        timestamp: new Date(Date.now() - 300000),
        message: 'Great stream! 🔥',
      },
      {
        tipId: 'tip_2',
        streamerId: 'streamer_1',
        viewerId: 'viewer_2',
        amount: 10,
        currency: 'ETH',
        timestamp: new Date(Date.now() - 600000),
        message: 'Keep it up!',
      },
    ];
    setRecentTips(mockTips);
    setTotalTips(125.50);

    // Mock subscriptions
    const mockSubscriptions: Subscription[] = [
      {
        subscriptionId: 'sub_1',
        streamerId: 'streamer_1',
        viewerId: 'viewer_3',
        tierName: 'Super Fan',
        amount: 25,
        frequency: 'monthly',
        startDate: new Date(Date.now() - 86400000 * 30),
      },
    ];
    setActiveSubscriptions(mockSubscriptions);
  }, [context]);

  const handleTip = async (amount: number, message?: string) => {
    try {
      // Simulate tip processing
      const newTip: Tip = {
        tipId: `tip_${Date.now()}`,
        streamerId: streamer?.streamerId || '',
        viewerId: context?.user?.fid?.toString() || 'anonymous',
        amount,
        currency: 'ETH',
        timestamp: new Date(),
        message,
      };

      setRecentTips(prev => [newTip, ...prev.slice(0, 4)]);
      setTotalTips(prev => prev + amount);
      
      // Show notification
      setNotificationType('newTip');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);

      // Check for milestone
      if (totalTips + amount >= 150) {
        setTimeout(() => {
          setNotificationType('milestoneReached');
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 5000);
        }, 1000);
      }
    } catch (error) {
      console.error('Tip failed:', error);
    }
  };

  const handleSubscribe = async (tierName: string, amount: number, frequency: 'weekly' | 'monthly') => {
    try {
      // Simulate subscription processing
      const newSubscription: Subscription = {
        subscriptionId: `sub_${Date.now()}`,
        streamerId: streamer?.streamerId || '',
        viewerId: context?.user?.fid?.toString() || 'anonymous',
        tierName,
        amount,
        frequency,
        startDate: new Date(),
      };

      setActiveSubscriptions(prev => [...prev, newSubscription]);
    } catch (error) {
      console.error('Subscription failed:', error);
    }
  };

  if (!streamer) {
    return (
      <div className="min-h-screen streaming-bg flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p>Loading StreamSpark...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen streaming-bg">
      {/* Notification Banner */}
      {showNotification && (
        <NotificationBanner
          variant={notificationType}
          onClose={() => setShowNotification(false)}
        />
      )}

      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-8">
          <StreamerProfileHeader
            streamer={streamer}
            totalTips={totalTips}
            subscriberCount={activeSubscriptions.length}
            variant="basic"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Tip Jar Section */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <TipJar totalAmount={totalTips} recentTips={recentTips} />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">
              Support the Stream! 🎮
            </h2>
            
            {/* Quick Tip Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <TipButton
                amount={1}
                variant="default"
                onTip={handleTip}
                icon={<Heart className="w-4 h-4" />}
              />
              <TipButton
                amount={5}
                variant="default"
                onTip={handleTip}
                icon={<Zap className="w-4 h-4" />}
              />
              <TipButton
                amount={10}
                variant="default"
                onTip={handleTip}
                icon={<Trophy className="w-4 h-4" />}
              />
              <TipButton
                amount={25}
                variant="default"
                onTip={handleTip}
                icon={<Users className="w-4 h-4" />}
              />
            </div>

            {/* Custom Amount */}
            <TipButton
              amount={0}
              variant="processing"
              onTip={handleTip}
              customAmount={true}
            />
          </div>
        </div>

        {/* Subscription Tiers */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white text-center">
            Become a Regular Supporter
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <SubscriptionCard
              tierName="Fan"
              amount={10}
              frequency="monthly"
              benefits={['Supporter badge', 'Priority chat', 'Monthly shoutout']}
              variant="active"
              onSubscribe={handleSubscribe}
            />
            <SubscriptionCard
              tierName="Super Fan"
              amount={25}
              frequency="monthly"
              benefits={['All Fan benefits', 'Custom emotes', 'Discord access', 'Weekly 1-on-1']}
              variant="active"
              onSubscribe={handleSubscribe}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card max-w-2xl mx-auto">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            Recent Tips
          </h4>
          
          {recentTips.length > 0 ? (
            <div className="space-y-3">
              {recentTips.map((tip) => (
                <div key={tip.tipId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{tip.amount} ETH</p>
                      {tip.message && (
                        <p className="text-sm text-text-secondary">{tip.message}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-text-secondary">
                    {new Date(tip.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-center py-8">
              No tips yet. Be the first to support this streamer! 🚀
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary">{totalTips.toFixed(2)}</div>
            <div className="text-sm text-text-secondary">Total ETH</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary">{recentTips.length}</div>
            <div className="text-sm text-text-secondary">Recent Tips</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary">{activeSubscriptions.length}</div>
            <div className="text-sm text-text-secondary">Subscribers</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary">🔥</div>
            <div className="text-sm text-text-secondary">On Fire!</div>
          </div>
        </div>
      </div>
    </div>
  );
}
