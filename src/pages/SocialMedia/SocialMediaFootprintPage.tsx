import React, { useState } from "react";
import { Share2, Users, Eye, Heart, MessageCircle, TrendingUp, ChevronDown } from "lucide-react";

const SocialMediaFootprintPage: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("Last 30 Days");

  const socialMediaData = {
    // Top metrics
    topMetrics: {
      totalFollowers: "42.4K",
      totalReach: "315.0K",
      avgEngagement: "4.25%",
      totalPosts: 172
    },

    // Business Generated Content
    businessContent: {
      instagram: {
        followers: "12,500",
        engagement: "4.2%",
        posts: 45,
        reach: "89.0K",
        growth: "+8.5%"
      },
      facebook: {
        followers: "8,900",
        engagement: "3.1%",
        posts: 32,
        reach: "67.0K",
        growth: "+6.5%"
      },
      tiktok: {
        followers: "15,600",
        engagement: "6.8%",
        posts: 28,
        reach: "125.0K",
        growth: "+15.8%"
      },
      twitter: {
        followers: "5,400",
        engagement: "2.9%",
        posts: 67,
        reach: "34.0K",
        growth: "+3.9%"
      }
    },

    // Top Performing Business Posts
    topBusinessPosts: [
      {
        id: 1,
        author: "Your Restaurant",
        platform: "Instagram",
        content: "Behind the scenes: Our chef preparing the signature pasta dish",
        likes: "1.2K",
        comments: "89",
        shares: "45",
        views: "15.6K",
        date: "14/01/2025"
      },
      {
        id: 2,
        author: "Your Restaurant",
        platform: "TikTok",
        content: "Quick recipe: 30-second pasta hack that will blow your mind!",
        likes: "3.4K",
        comments: "234",
        shares: "567",
        views: "45.0K",
        date: "13/01/2025"
      },
      {
        id: 3,
        author: "Your Restaurant",
        platform: "Facebook",
        content: "New winter menu launch - featuring seasonal ingredients from local farms",
        likes: "890",
        comments: "67",
        shares: "123",
        views: "12.0K",
        date: "12/01/2025"
      }
    ],

    // Customer Generated Content
    customerContent: {
      instagram: {
        taggedPosts: 89,
        checkIns: 67,
        influencerMentions: 12,
        userContent: 156,
        growth: "+13.2%"
      },
      facebook: {
        taggedPosts: 67,
        checkIns: 78,
        influencerMentions: 8,
        userContent: 134,
        growth: "+8.5%"
      },
      tiktok: {
        taggedPosts: 45,
        checkIns: 23,
        influencerMentions: 18,
        userContent: 89,
        growth: "+23.1%"
      },
      twitter: {
        taggedPosts: 33,
        checkIns: 21,
        influencerMentions: 5,
        userContent: 67,
        growth: "+5.7%"
      }
    },

    // Top Performing Customer-Generated Posts
    topCustomerPosts: [
      {
        id: 1,
        author: "@foodie_sara",
        platform: "TikTok",
        category: "Influencer",
        content: "OMG this place is INSANE! The truffle pasta is life-changing 🤤",
        likes: "2.4K",
        comments: "312",
        shares: "789",
        views: "45.2K",
        date: "16/01/2025"
      },
      {
        id: 2,
        author: "@gourmet_adventures",
        platform: "Instagram",
        category: "Blogger",
        content: "Best night ever! Thank you for the amazing service ❤️",
        likes: "1.8K",
        comments: "156",
        shares: "234",
        views: "23.1K",
        date: "14/01/2025"
      },
      {
        id: 3,
        author: "@family_foodie",
        platform: "Facebook",
        category: "Check-In",
        content: "Family dinner at our favorite spot! Kids loved the pizza, adults loved the wine 🍷",
        likes: "967",
        comments: "78",
        shares: "145",
        views: "12.3K",
        date: "13/01/2025"
      },
      {
        id: 4,
        author: "@weekend_lover",
        platform: "Stories",
        category: "Mention",
        content: "Just had the best brunch ever! The avocado toast was perfection 🥑 #weekendvibes",
        likes: "654",
        comments: "34",
        shares: "89",
        views: "8.9K",
        date: "12/01/2025"
      }
    ],

    // Recommended Hashtags
    recommendedHashtags: [
      { rank: 1, hashtag: "#foodie", category: "General", engagementScore: 95, posts: "2.4K" },
      { rank: 2, hashtag: "#restaurant", category: "Business", engagementScore: 92, posts: "1.8K" },
      { rank: 3, hashtag: "#delicious", category: "Taste", engagementScore: 89, posts: "1.5K" },
      { rank: 4, hashtag: "#freshingredients", category: "Quality", engagementScore: 87, posts: "1.2K" },
      { rank: 5, hashtag: "#localfood", category: "Community", engagementScore: 85, posts: "980" },
      { rank: 6, hashtag: "#foodporn", category: "Visual", engagementScore: 83, posts: "856" },
      { rank: 7, hashtag: "#yummy", category: "Taste", engagementScore: 81, posts: "743" },
      { rank: 8, hashtag: "#chefspecial", category: "Exclusive", engagementScore: 79, posts: "621" },
      { rank: 9, hashtag: "#foodlover", category: "Community", engagementScore: 77, posts: "534" },
      { rank: 10, hashtag: "#tasty", category: "Taste", engagementScore: 75, posts: "467" }
    ]
  };

  const getPlatformColor = (platform: string) => {
    const colors = {
      "Instagram": "bg-pink-100 text-pink-800",
      "TikTok": "bg-gray-100 text-gray-800",
      "Facebook": "bg-blue-100 text-blue-800",
      "Stories": "bg-purple-100 text-purple-800",
      "Twitter": "bg-sky-100 text-sky-800"
    };
    return colors[platform as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getHashtagColor = (category: string) => {
    const colors = {
      "General": "bg-blue-100 text-blue-800",
      "Business": "bg-green-100 text-green-800",
      "Taste": "bg-orange-100 text-orange-800",
      "Quality": "bg-purple-100 text-purple-800",
      "Community": "bg-indigo-100 text-indigo-800",
      "Visual": "bg-pink-100 text-pink-800",
      "Exclusive": "bg-yellow-100 text-yellow-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="p-3 bg-caribbean_current-100 rounded-lg mr-3">
                <Share2 className="w-8 h-8 text-caribbean_current-700" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Social Media Footprint</h1>
            </div>
            <p className="text-gray-600">Track your presence and engagement across all social platforms</p>
          </div>
          <div className="flex items-center">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caribbean_current-500 focus:border-caribbean_current-500 transition-colors bg-white"
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 90 Days">Last 90 Days</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
          </div>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-gray-600">
                <div className="p-3 bg-blue-100 rounded-lg mr-3">
                  <Users className="w-5 h-5 text-blue-700" />
                </div>
                <span className="text-sm font-medium">Total Followers</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{socialMediaData.topMetrics.totalFollowers}</div>
            <div className="flex items-center text-sm text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full w-fit">
              <TrendingUp className="w-4 h-4 mr-1" />+12.5% from last period
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-gray-600">
                <div className="p-3 bg-purple-100 rounded-lg mr-3">
                  <Eye className="w-5 h-5 text-purple-700" />
                </div>
                <span className="text-sm font-medium">Total Reach</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{socialMediaData.topMetrics.totalReach}</div>
            <div className="flex items-center text-sm text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full w-fit">
              <TrendingUp className="w-4 h-4 mr-1" />+8.3% from last period
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-gray-600">
                <div className="p-3 bg-green-100 rounded-lg mr-3">
                  <Heart className="w-5 h-5 text-green-700" />
                </div>
                <span className="text-sm font-medium">Avg Engagement</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{socialMediaData.topMetrics.avgEngagement}</div>
            <div className="flex items-center text-sm text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full w-fit">
              <TrendingUp className="w-4 h-4 mr-1" />+0.7% from last period
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-gray-600">
                <div className="p-3 bg-orange-100 rounded-lg mr-3">
                  <MessageCircle className="w-5 h-5 text-orange-700" />
                </div>
                <span className="text-sm font-medium">Total Posts</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{socialMediaData.topMetrics.totalPosts}</div>
            <div className="flex items-center text-sm text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full w-fit">
              <TrendingUp className="w-4 h-4 mr-1" />+15 from last period
            </div>
          </div>
        </div>

        {/* Business Generated Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-caribbean_current-100 rounded-lg mr-3">
              <Share2 className="w-5 h-5 text-caribbean_current-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Business Generated Content</h2>
              <p className="text-sm text-gray-600">Your restaurant's official posts and content</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Instagram */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-pink-500 mr-3"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Instagram</h3>
                </div>
                <div className="flex items-center text-sm text-emerald-800 bg-emerald-100 px-2 py-1 rounded-full">
                  <TrendingUp className="w-4 h-4 mr-1" />+{socialMediaData.businessContent.instagram.growth}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Followers</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.businessContent.instagram.followers}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Engagement</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.businessContent.instagram.engagement}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Posts</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.businessContent.instagram.posts}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reach</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.businessContent.instagram.reach}</p>
                </div>
              </div>
            </div>

            {/* Facebook */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-600 mr-3"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Facebook</h3>
                </div>
                <div className="flex items-center text-sm text-emerald-800 bg-emerald-100 px-2 py-1 rounded-full">
                  <TrendingUp className="w-4 h-4 mr-1" />+{socialMediaData.businessContent.facebook.growth}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Followers</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.businessContent.facebook.followers}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Engagement</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.businessContent.facebook.engagement}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Posts</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.businessContent.facebook.posts}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reach</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.businessContent.facebook.reach}</p>
                </div>
              </div>
            </div>

            {/* TikTok */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-black mr-3"></div>
                  <h3 className="text-lg font-semibold text-gray-900">TikTok</h3>
                </div>
                <div className="flex items-center text-sm text-emerald-800 bg-emerald-100 px-2 py-1 rounded-full">
                  <TrendingUp className="w-4 h-4 mr-1" />+{socialMediaData.businessContent.tiktok.growth}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Followers</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.businessContent.tiktok.followers}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Engagement</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.businessContent.tiktok.engagement}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Posts</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.businessContent.tiktok.posts}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reach</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.businessContent.tiktok.reach}</p>
                </div>
              </div>
            </div>

            {/* Twitter */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-400 mr-3"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Twitter</h3>
                </div>
                <div className="flex items-center text-sm text-emerald-800 bg-emerald-100 px-2 py-1 rounded-full">
                  <TrendingUp className="w-4 h-4 mr-1" />+{socialMediaData.businessContent.twitter.growth}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Followers</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.businessContent.twitter.followers}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Engagement</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.businessContent.twitter.engagement}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Posts</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.businessContent.twitter.posts}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reach</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.businessContent.twitter.reach}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Business Posts */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-blue-100 rounded-lg mr-3">
              <TrendingUp className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Top Performing Business Posts</h2>
              <p className="text-sm text-gray-600">Your restaurant's best performing official content - click to view original posts</p>
            </div>
          </div>

          <div className="space-y-4">
            {socialMediaData.topBusinessPosts.map((post) => (
              <div key={post.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">YR</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="font-medium text-gray-900 mr-2">{post.author}</span>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPlatformColor(post.platform)}`}>
                      {post.platform}
                    </span>
                    <span className="text-xs text-gray-500 ml-auto">{post.date}</span>
                  </div>
                  <p className="text-gray-700 mb-3">{post.content}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 text-red-500 mr-1" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 text-blue-500 mr-1" />
                      <span>{post.comments}</span>
                    </div>
                    <div className="flex items-center">
                      <Share2 className="w-4 h-4 text-green-500 mr-1" />
                      <span>{post.shares}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 text-purple-500 mr-1" />
                      <span>{post.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Generated Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-purple-100 rounded-lg mr-3">
              <Users className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Customer Generated Content</h2>
              <p className="text-sm text-gray-600">Content created by your customers and influencers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Instagram */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-pink-500 mr-3"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Instagram</h3>
                </div>
                <div className="flex items-center text-sm text-emerald-800 bg-emerald-100 px-2 py-1 rounded-full">
                  <TrendingUp className="w-4 h-4 mr-1" />+{socialMediaData.customerContent.instagram.growth}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tagged Posts</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.customerContent.instagram.taggedPosts}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Check-ins</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.customerContent.instagram.checkIns}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Influencer Mentions</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.customerContent.instagram.influencerMentions}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">User Content</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.customerContent.instagram.userContent}</p>
                </div>
              </div>
            </div>

            {/* Facebook */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-600 mr-3"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Facebook</h3>
                </div>
                <div className="flex items-center text-sm text-emerald-800 bg-emerald-100 px-2 py-1 rounded-full">
                  <TrendingUp className="w-4 h-4 mr-1" />+{socialMediaData.customerContent.facebook.growth}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tagged Posts</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.customerContent.facebook.taggedPosts}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Check-ins</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.customerContent.facebook.checkIns}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Influencer Mentions</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.customerContent.facebook.influencerMentions}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">User Content</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.customerContent.facebook.userContent}</p>
                </div>
              </div>
            </div>

            {/* TikTok */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-black mr-3"></div>
                  <h3 className="text-lg font-semibold text-gray-900">TikTok</h3>
                </div>
                <div className="flex items-center text-sm text-emerald-800 bg-emerald-100 px-2 py-1 rounded-full">
                  <TrendingUp className="w-4 h-4 mr-1" />+{socialMediaData.customerContent.tiktok.growth}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tagged Posts</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.customerContent.tiktok.taggedPosts}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Check-ins</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.customerContent.tiktok.checkIns}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Influencer Mentions</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.customerContent.tiktok.influencerMentions}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">User Content</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.customerContent.tiktok.userContent}</p>
                </div>
              </div>
            </div>

            {/* Twitter */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-400 mr-3"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Twitter</h3>
                </div>
                <div className="flex items-center text-sm text-emerald-800 bg-emerald-100 px-2 py-1 rounded-full">
                  <TrendingUp className="w-4 h-4 mr-1" />+{socialMediaData.customerContent.twitter.growth}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tagged Posts</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.customerContent.twitter.taggedPosts}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Check-ins</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.customerContent.twitter.checkIns}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Influencer Mentions</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.customerContent.twitter.influencerMentions}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">User Content</p>
                  <p className="text-xl font-bold text-gray-900">{socialMediaData.customerContent.twitter.userContent}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Customer-Generated Posts */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-green-100 rounded-lg mr-3">
              <Users className="w-5 h-5 text-green-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Top Performing Customer-Generated Posts</h2>
              <p className="text-sm text-gray-600">Customer content that's driving the most engagement for your restaurant - click to view original posts</p>
            </div>
          </div>

          <div className="space-y-4">
            {socialMediaData.topCustomerPosts.map((post) => (
              <div key={post.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">{post.author.slice(1, 3).toUpperCase()}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="font-medium text-gray-900 mr-2">{post.author}</span>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPlatformColor(post.platform)}`}>
                      {post.platform}
                    </span>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ml-2 ${getHashtagColor(post.category)}`}>
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500 ml-auto">{post.date}</span>
                  </div>
                  <p className="text-gray-700 mb-3">{post.content}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 text-red-500 mr-1" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 text-blue-500 mr-1" />
                      <span>{post.comments}</span>
                    </div>
                    <div className="flex items-center">
                      <Share2 className="w-4 h-4 text-green-500 mr-1" />
                      <span>{post.shares}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 text-purple-500 mr-1" />
                      <span>{post.views}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <button className="text-xs text-caribbean_current-600 hover:text-caribbean_current-700 font-medium">
                    View Post
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Hashtags for F&B Business */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-yellow-100 rounded-lg mr-3">
              <TrendingUp className="w-5 h-5 text-yellow-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recommended Hashtags for F&B Business</h2>
              <p className="text-sm text-gray-600">Top performing hashtags to boost your restaurant's social media reach</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {socialMediaData.recommendedHashtags.map((hashtag) => (
              <div key={hashtag.rank} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-caribbean_current-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-bold text-caribbean_current-700">{hashtag.rank}</span>
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      <span className="font-semibold text-gray-900 mr-2">{hashtag.hashtag}</span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getHashtagColor(hashtag.category)}`}>
                        {hashtag.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{hashtag.posts} posts</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{hashtag.engagementScore}</div>
                  <p className="text-xs text-gray-600">Engagement Score</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pro Tip */}
          <div className="mt-6 p-4 bg-caribbean_current-50 border border-caribbean_current-200 rounded-lg">
            <div className="flex items-start">
              <div className="p-2 bg-caribbean_current-100 rounded-lg mr-3">
                <TrendingUp className="w-4 h-4 text-caribbean_current-700" />
              </div>
              <div>
                <h4 className="font-semibold text-caribbean_current-900 mb-1">Pro Tip</h4>
                <p className="text-sm text-caribbean_current-800">
                  Use 5-10 hashtags per post for optimal reach. Mix general food hashtags with location-specific ones like #YourCityEats for better local discovery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaFootprintPage;