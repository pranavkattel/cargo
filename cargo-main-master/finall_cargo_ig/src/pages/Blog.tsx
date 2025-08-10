import React from 'react';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Nepal's Handicraft Export Boom: A Guide for Artisans",
      excerpt: "Discover how Nepali artisans are reaching global markets and the logistics behind successful handicraft exports.",
      content: "The global demand for authentic, handcrafted items has never been higher, and Nepal's rich tradition of handicrafts is perfectly positioned to meet this demand...",
      author: "Rajesh Shrestha",
      date: "2024-01-15",
      readTime: "5 min read",
      category: "Export Guide",
      image: "https://images.pexels.com/photos/6283968/pexels-photo-6283968.jpeg?auto=compress&cs=tinysrgb&w=800",
      featured: true
    },
    {
      id: 2,
      title: "Understanding International Customs: A Complete Guide",
      excerpt: "Navigate the complex world of international customs with our comprehensive guide to documentation and procedures.",
      content: "International shipping involves navigating complex customs regulations that vary by country. Understanding these requirements is crucial for successful exports...",
      author: "Priya Maharjan",
      date: "2024-01-12",
      readTime: "8 min read",
      category: "Customs",
      image: "https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=800",
      featured: false
    },
    {
      id: 3,
      title: "Packaging Tips for Fragile Nepali Artifacts",
      excerpt: "Learn professional packaging techniques to ensure your precious artifacts arrive safely at their destination.",
      content: "Proper packaging is essential for protecting fragile items during international shipping. Here are expert tips for packaging Nepali artifacts...",
      author: "Amit Tamang",
      date: "2024-01-10",
      readTime: "6 min read",
      category: "Packaging",
      image: "https://images.pexels.com/photos/4481327/pexels-photo-4481327.jpeg?auto=compress&cs=tinysrgb&w=800",
      featured: false
    },
    {
      id: 4,
      title: "The Rise of Himalayan Tea in Global Markets",
      excerpt: "Explore how premium Himalayan teas are conquering international markets and the logistics behind tea exports.",
      content: "Himalayan tea has gained recognition worldwide for its unique flavor profile and health benefits. This article explores the export journey...",
      author: "Sita Gurung",
      date: "2024-01-08",
      readTime: "7 min read",
      category: "Market Trends",
      image: "https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=800",
      featured: false
    },
    {
      id: 5,
      title: "Air vs Sea Freight: Choosing the Right Option",
      excerpt: "Compare air and sea freight options to make informed decisions about your cargo shipping needs.",
      content: "Choosing between air and sea freight depends on various factors including cost, time, and cargo type. Here's a detailed comparison...",
      author: "Bikash Rai",
      date: "2024-01-05",
      readTime: "4 min read",
      category: "Shipping Guide",
      image: "https://images.pexels.com/photos/62623/wing-plane-flying-airplane-62623.jpeg?auto=compress&cs=tinysrgb&w=800",
      featured: false
    },
    {
      id: 6,
      title: "Digital Transformation in Nepal's Export Industry",
      excerpt: "How technology is revolutionizing Nepal's export sector and making international trade more accessible.",
      content: "The digital revolution is transforming how Nepali businesses approach international trade. From online marketplaces to digital documentation...",
      author: "Nisha Thapa",
      date: "2024-01-03",
      readTime: "6 min read",
      category: "Technology",
      image: "https://images.pexels.com/photos/4481532/pexels-photo-4481532.jpeg?auto=compress&cs=tinysrgb&w=800",
      featured: false
    }
  ];

  const categories = ['All', ...Array.from(new Set(blogPosts.map(post => post.category)))];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="text-white py-20" style={{ background: 'linear-gradient(to right, #1a1a1a, #2d2d2d)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Cargo & Trade Insights
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Stay informed with the latest news, tips, and insights about international 
              shipping, trade regulations, and Nepal's export industry.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#1a1a1a' }}>Featured Article</h2>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative h-64 lg:h-auto">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-white px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: '#f9b222' }}>
                      Featured
                    </span>
                  </div>
                </div>
                
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span className="px-3 py-1 rounded-full font-medium" style={{ backgroundColor: '#f6f6f6', color: '#1a1a1a' }}>
                      {featuredPost.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{featuredPost.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4" style={{ color: '#1a1a1a' }}>
                    {featuredPost.title}
                  </h3>
                  
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f6f6f6' }}>
                        <User className="h-5 w-5" style={{ color: '#f9b222' }} />
                      </div>
                      <span className="text-gray-700 font-medium">{featuredPost.author}</span>
                    </div>
                    
                    <button className="text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2" style={{ backgroundColor: '#f9b222' }}>
                      <span>Read More</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="py-8 border-b" style={{ backgroundColor: '#f6f6f6' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
                style={{
                  backgroundColor: selectedCategory === category ? '#f9b222' : undefined
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16" style={{ backgroundColor: '#f6f6f6' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.filter(post => !post.featured).map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium" style={{ color: '#1a1a1a' }}>
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 transition-colors duration-200" style={{ color: '#1a1a1a' }}>
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f6f6f6' }}>
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-700">{post.author}</span>
                    </div>
                    
                    <button className="font-medium text-sm flex items-center space-x-1 transition-colors duration-200" style={{ color: '#f9b222' }}>
                      <span>Read More</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-2xl p-8 lg:p-12 text-white" style={{ background: 'linear-gradient(to right, #1a1a1a, #2d2d2d)' }}>
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest insights on international shipping, 
              trade regulations, and export opportunities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg focus:ring-2 focus:outline-none" style={{ color: '#1a1a1a', focusRingColor: '#f9b222' }}
              />
              <button className="text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200" style={{ backgroundColor: '#f9b222' }}>
                Subscribe
              </button>
            </div>
            
            <p className="text-sm text-gray-300 mt-4">
              No spam, unsubscribe at any time. We respect your privacy.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-16" style={{ backgroundColor: '#f6f6f6' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#1a1a1a' }}>Popular Topics</h2>
            <p className="text-lg text-gray-600">
              Explore our most read articles and guides
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Export Documentation', icon: '📋', count: '12 articles' },
              { title: 'Shipping Methods', icon: '🚢', count: '8 articles' },
              { title: 'Customs Guide', icon: '🛃', count: '15 articles' },
              { title: 'Market Insights', icon: '📊', count: '10 articles' },
              { title: 'Packaging Tips', icon: '📦', count: '6 articles' },
              { title: 'Trade Regulations', icon: '⚖️', count: '9 articles' },
              { title: 'Success Stories', icon: '🏆', count: '7 articles' },
              { title: 'Industry News', icon: '📰', count: '20 articles' }
            ].map((topic, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer text-center">
                <div className="text-3xl mb-3">{topic.icon}</div>
                <h3 className="font-semibold mb-2" style={{ color: '#1a1a1a' }}>{topic.title}</h3>
                <p className="text-sm text-gray-600">{topic.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;