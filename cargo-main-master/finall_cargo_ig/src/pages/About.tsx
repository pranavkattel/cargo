import React from 'react';
import {
  Shield,
  Award,
  Users,
  Globe,
  CheckCircle,
  Target,
  Heart,
  Zap,
  UserSearch,
  Compass,
  Settings,
  Truck,
  MessageCircle,
  RefreshCw
} from 'lucide-react';
import mdImg from "../assets/images/md.jpg"; // If your image is in assets/images/md.jpg

const About = () => {
  const values = [
    {
      icon: Shield,
      title: 'Trust & Reliability',
      description: 'We handle your cargo with the utmost care and ensure secure delivery every time.',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connecting Nepal to over 50 countries worldwide with our extensive network.',
    },
    {
      icon: Zap,
      title: 'Efficiency',
      description: 'Streamlined processes and modern technology for faster, more efficient service.',
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We go above and beyond for every client.',
    },
  ];

  const milestones = [
    { year: '1990', event: 'Founded Capital CArgo with a vision to connect Nepal globally' },
    { year: '2005', event: 'Expanded to 25 international destinations' },
    { year: '2008', event: 'Achieved 10,000+ successful deliveries milestone' },
    { year: '2015', event: 'Launched digital tracking system and online booking' },
    { year: '2020', event: 'Reached 50+ countries and won Excellence in Logistics Award' },
    { year: '2025', event: 'Celebrating 25 years of connecting Nepal to the world' },
  ];

  const certifications = [
    'ISO 9001:2015 Quality Management',
    'IATA Cargo Agent Certification',
    'Nepal Freight Forwarders Association Member',
    'International Chamber of Commerce',
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="text-white py-20" style={{ background: 'linear-gradient(to right, #0096C7, #007bb3)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Capital Cargo
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              For over a decade, we've been Nepal's trusted partner in international logistics, 
              connecting the heart of the Himalayas to markets around the world.
            </p>
          </div>
        </div>
      </section>

      {/* From the Managing Director */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center md:justify-end">
              <img
                src={mdImg}
                alt="Managing Director"
                className="w-[320px] md:w-[400px] rounded-xl shadow-xl object-cover"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
            <div className="flex flex-col justify-center md:pl-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#0096C7', fontFamily: 'Inter, Lato, sans-serif' }}>
                From the Managing Director
              </h2>
              <div className="text-gray-700 text-lg leading-relaxed" style={{ fontFamily: 'Inter, Lato, sans-serif' }}>
                <p className="mb-4">
                  Welcome to Capital Cargo. Our journey is built on trust, reliability, and a relentless drive to deliver the best for our clients. We believe every shipment is a promise — and we keep our promises with precision, care, and a personal touch.
                </p>
                <p className="mb-4">
                  <span className="font-bold italic text-[#F9B222]">“Excellent Service to Client — We’re the right way to Reliant”</span>
                </p>
                <p className="mb-6">
                  Our team is dedicated to making your logistics experience seamless and successful, whether you’re shipping across the city or around the world. Thank you for trusting us to move what matters most to you.
                </p>
                <div className="mt-6">
                  <span className="font-bold text-xl" style={{ color: '#0096C7' }}>Mr. Bharat Dahal</span>
                  <br />
                  <span className="font-bold text-gray-600">Managing Director</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style>
          {`
            @media (max-width: 768px) {
              .md\\:grid-cols-2 {
                grid-template-columns: 1fr !important;
              }
              .md\\:pl-8 {
                padding-left: 0 !important;
              }
              .md\\:justify-end {
                justify-content: center !important;
              }
              .w-\\[400px\\] {
                width: 100% !important;
                max-width: 320px !important;
              }
            }
          `}
        </style>
      </section>

      {/* Values - Redesigned as "What We Stand For" */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0096C7', fontFamily: 'Inter, Lato, sans-serif' }}>
              What We Stand For
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, Lato, sans-serif' }}>
              The principles that guide everything we do at Capital Cargo
            </p>
          </div>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12"
            style={{ fontFamily: 'Inter, Lato, sans-serif' }}
          >
            {values.map((value, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-start px-2 py-4 fade-in-value"
                style={{ minHeight: 220 }}
              >
                <div
                  className="mb-6"
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <value.icon
                    className="h-16 w-16 transition-all duration-300 icon-glow"
                    style={{
                      color: '#F9B222',
                      filter: 'drop-shadow(0 0 18px #F9B22288)',
                      transition: 'transform 0.3s cubic-bezier(.4,0,.2,1), filter 0.3s cubic-bezier(.4,0,.2,1)',
                    }}
                  />
                </div>
                <h3
                  className="font-bold text-xl md:text-2xl mb-2 text-center"
                  style={{ color: '#0096C7', letterSpacing: '0.01em' }}
                >
                  {value.title}
                </h3>
                <p className="text-gray-600 text-base text-center" style={{ maxWidth: 260 }}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* Animations */}
        <style>
          {`
            .icon-glow:hover {
              transform: translateY(-8px) scale(1.08);
              filter: drop-shadow(0 0 28px #F9B222cc);
            }
            .icon-glow {
              will-change: transform, filter;
            }
            /* Removed fade-in-value animation */
          `}
        </style>
        {/* Removed fade-in-value script */}
      </section>

      {/* The Capital Cargo Way */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0096C7', fontFamily: 'Inter, Lato, sans-serif' }}>
              The Capital Cargo Way
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our proven process for delivering logistics excellence, every time
            </p>
          </div>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            style={{ fontFamily: 'Inter, Lato, sans-serif' }}
          >
            {/* Step 01 */}
            <div className="relative bg-white rounded-xl shadow-lg p-8 flex flex-col items-start group hover:shadow-2xl transition-all duration-300">
              <span className="absolute text-6xl font-bold text-gray-200 top-6 left-6 select-none pointer-events-none" style={{ zIndex: 0 }}>01</span>
              <div className="flex flex-col items-center mb-3 z-10 w-full">
                <UserSearch className="h-10 w-10 mb-2 text-[#F9B222] transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1" strokeWidth={2.2} />
                <span className="font-bold text-xl" style={{ color: '#0096C7' }}>Understand</span>
              </div>
              <p className="text-gray-600 z-10">
                We don’t just take orders - we listen. Every shipment starts with a deep understanding of your priorities, pain points, and expectations, so we can deliver exactly what matters most to you.
              </p>
            </div>
            {/* Step 02 */}
            <div className="relative bg-white rounded-xl shadow-lg p-8 flex flex-col items-start group hover:shadow-2xl transition-all duration-300">
              <span className="absolute text-6xl font-bold text-gray-200 top-6 left-6 select-none pointer-events-none" style={{ zIndex: 0 }}>02</span>
              <div className="flex flex-col items-center mb-3 z-10 w-full">
                <Compass className="h-10 w-10 mb-2 text-[#F9B222] transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1" strokeWidth={2.2} />
                <span className="font-bold text-xl" style={{ color: '#0096C7' }}>Strategize</span>
              </div>
              <p className="text-gray-600 z-10">
                Behind every smooth delivery is a smart game plan. We design custom logistics strategies that cut delays, dodge red tape, and move your shipments with precision.


              </p>
            </div>
            {/* Step 03 */}
            <div className="relative bg-white rounded-xl shadow-lg p-8 flex flex-col items-start group hover:shadow-2xl transition-all duration-300">
              <span className="absolute text-6xl font-bold text-gray-200 top-6 left-6 select-none pointer-events-none" style={{ zIndex: 0 }}>03</span>
              <div className="flex flex-col items-center mb-3 z-10 w-full">
                <Settings className="h-10 w-10 mb-2 text-[#F9B222] transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1" strokeWidth={2.2} />
                <span className="font-bold text-xl" style={{ color: '#0096C7' }}>Optimize</span>
              </div>
              <p className="text-gray-600 z-10">
                We turn good into exceptional. Every step from documents to delivery is streamlined for speed, accuracy, and zero waste. No delays. No guesswork. Just results.


              </p>
            </div>
            {/* Step 04 */}
            <div className="relative bg-white rounded-xl shadow-lg p-8 flex flex-col items-start group hover:shadow-2xl transition-all duration-300">
              <span className="absolute text-6xl font-bold text-gray-200 top-6 left-6 select-none pointer-events-none" style={{ zIndex: 0 }}>04</span>
              <div className="flex flex-col items-center mb-3 z-10 w-full">
                <Truck className="h-10 w-10 mb-2 text-[#F9B222] transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1" strokeWidth={2.2} />
                <span className="font-bold text-xl" style={{ color: '#0096C7' }}>Execute</span>
              </div>
              <p className="text-gray-600 z-10">
                No delays. No excuses. We get it done. With precision handling, real-time tracking, and global coordination your shipment moves exactly how and when it should.


              </p>
            </div>
            {/* Step 05 */}
            <div className="relative bg-white rounded-xl shadow-lg p-8 flex flex-col items-start group hover:shadow-2xl transition-all duration-300">
              <span className="absolute text-6xl font-bold text-gray-200 top-6 left-6 select-none pointer-events-none" style={{ zIndex: 0 }}>05</span>
              <div className="flex flex-col items-center mb-3 z-10 w-full">
                <MessageCircle className="h-10 w-10 mb-2 text-[#F9B222] transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1" strokeWidth={2.2} />
                <span className="font-bold text-xl" style={{ color: '#0096C7' }}>Communicate</span>
              </div>
              <p className="text-gray-600 z-10">
                Silence isn’t service. We keep you in the loop with real-time updates, clear answers, and zero chasing. You’ll always know where your shipment is and what’s next.
              </p>
            </div>
            {/* Step 06 */}
            <div className="relative bg-white rounded-xl shadow-lg p-8 flex flex-col items-start group hover:shadow-2xl transition-all duration-300">
              <span className="absolute text-6xl font-bold text-gray-200 top-6 left-6 select-none pointer-events-none" style={{ zIndex: 0 }}>06</span>
              <div className="flex flex-col items-center mb-3 z-10 w-full">
                <RefreshCw className="h-10 w-10 mb-2 text-[#F9B222] transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1" strokeWidth={2.2} />
                <span className="font-bold text-xl" style={{ color: '#0096C7' }}>Refine</span>
              </div>
              <p className="text-gray-600 z-10">
                Good isn’t good enough. After every delivery, we review, improve, and upgrade, so your next shipment moves even smoother than the last.


              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#0096C7' }}>
                Why Choose Capital Cargo?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 mt-1 flex-shrink-0" style={{ color: '#F9B222' }} />
                  <div>
                    <h3 className="font-semibold" style={{ color: '#0096C7' }}>Local Expertise, Global Reach</h3>
                    <p className="text-gray-600">Deep understanding of Nepali markets combined with international logistics expertise.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 mt-1 flex-shrink-0" style={{ color: '#F9B222' }} />
                  <div>
                    <h3 className="font-semibold" style={{ color: '#0096C7' }}>Specialized in Nepali Products</h3>
                    <p className="text-gray-600">Expert handling of traditional crafts, textiles, herbs, and specialty items from Nepal.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 mt-1 flex-shrink-0" style={{ color: '#F9B222' }} />
                  <div>
                    <h3 className="font-semibold" style={{ color: '#0096C7' }}>Space Promise Even In Peak Season</h3>
                    <p className="text-gray-600">Closely cooperating with airlines & Shipping lines, we make it convenient for taking our service throughout the year.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 mt-1 flex-shrink-0" style={{ color: '#F9B222' }} />
                  <div>
                    <h3 className="font-semibold" style={{ color: '#0096C7' }}>Technology-Driven Service</h3>
                    <p className="text-gray-600">Modern tracking systems and digital platforms for seamless experience.</p>
                  </div> 
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 mt-1 flex-shrink-0" style={{ color: '#F9B222' }} />
                  <div>
                    <h3 className="font-semibold" style={{ color: '#0096C7' }}>Honest, Trustworthy, Professional</h3>
                    <p className="text-gray-600">We carefully follow every quotation and keep you informed about your goods' real status. With our experience, we offer honest advice to help you save costs.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 mt-1 flex-shrink-0" style={{ color: '#F9B222' }} />
                  <div>
                    <h3 className="font-semibold" style={{ color: '#0096C7' }}>Different Schedule Choice</h3>
                    <p className="text-gray-600">We use the most suitable schedule to ensure your needs.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/586744/pexels-photo-586744.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Cargo Operations"
                className="rounded-xl shadow-xl"
              />
              <div className="absolute inset-0 opacity-10 rounded-xl" style={{ backgroundColor: '#0096C7' }}></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;