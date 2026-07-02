'use strict';

'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';

interface CustomWindow extends Window {
  particlesJS?: (id: string, config: object) => void;
}

export default function WaitlistPage() {
  // Form values
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');

  // Form validation/ui states
  const [emailError, setEmailError] = useState('');
  const [topicError, setTopicError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [shakeEmail, setShakeEmail] = useState(false);
  const [shakeTopic, setShakeTopic] = useState(false);

  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formStarted, setFormStarted] = useState(false);

  // Spotlight cursor position
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Initialize particles.js library config (Vincent Garreau github layout)
  const initParticles = () => {
    if (typeof window !== 'undefined') {
      const customWindow = window as unknown as CustomWindow;
      if (customWindow.particlesJS) {
        customWindow.particlesJS('particles-js', {
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: '#ffffff'
          },
          shape: {
            type: 'circle',
            stroke: {
              width: 0,
              color: '#000000'
            }
          },
          opacity: {
            value: 0.55,
            random: false,
            anim: {
              enable: false,
              speed: 1,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 2.5,
            random: true,
            anim: {
              enable: false,
              speed: 40,
              size_min: 0.1,
              sync: false
            }
          },
          line_linked: {
            enable: true,
            distance: 140,
            color: '#ffffff',
            opacity: 0.25,
            width: 0.8
          },
          move: {
            enable: true,
            speed: 1.5,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200
            }
          }
        },
        interactivity: {
          detect_on: 'window', // Enables tracking mouse movement across the whole window
          events: {
            onhover: {
              enable: true,
              mode: 'grab' // Draws constellation line connecting particles to cursor
            },
            onclick: {
              enable: true,
              mode: 'push' // Adds more particles on click
            },
            resize: true
          },
          modes: {
            grab: {
              distance: 140,
              line_linked: {
                opacity: 0.5
              }
            },
            push: {
              particles_nb: 3
            }
          }
        },
        retina_detect: true
      });
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const customWindow = window as unknown as CustomWindow;
      if (customWindow.particlesJS) {
        initParticles();
      }
    }
  }, []);

  // Log "waitlist_page_viewed" when page mounts
  useEffect(() => {
    console.log('Analytics Event: waitlist_page_viewed');
  }, []);

  // Track form starting on first focus
  const handleFocus = () => {
    if (!formStarted) {
      setFormStarted(true);
      console.log('Analytics Event: waitlist_form_started');
    }
  };

  // Basic email validator
  const validateEmail = (val: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setTopicError('');
    setGeneralError('');

    console.log('Analytics Event: waitlist_form_submitted');

    let isValid = true;

    // Validate email
    if (!email || !validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      setShakeEmail(true);
      setTimeout(() => setShakeEmail(false), 400);
      isValid = false;
    }

    // Validate topic
    if (!topic || topic === 'Pick a topic...') {
      setTopicError('Please select a topic you would like us to explain.');
      setShakeTopic(true);
      setTimeout(() => setShakeTopic(false), 400);
      isValid = false;
    }

    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          topic,
          source: 'waitlist_page',
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSuccess(true);
        console.log('Analytics Event: waitlist_signup_success');
      } else {
        setGeneralError(data.message || 'Something went wrong. Try again.');
      }
    } catch (err) {
      setGeneralError('Something went wrong. Try again.');
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInstagramClick = () => {
    console.log('Analytics Event: waitlist_instagram_clicked');
  };

  const coveredTopics = [
    'Linked List',
    'Recursion',
    'Binary Tree',
    'OS Scheduling',
    'TCP Handshake',
    'Deadlock',
    'Dynamic Programming',
    'Graph BFS/DFS',
    'Binary Search',
    'HashMap',
    'Stack',
    'Virtual Memory',
    'CPU Cache',
    'Sorting',
    '+ many more',
  ];

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"
        onLoad={initParticles}
        strategy="afterInteractive"
      />

      {/* Dynamic Cursor Spotlight Effect */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(123, 111, 212, 0.22), transparent 80%)`
        }}
      />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 py-10 flex flex-col justify-between overflow-x-hidden relative z-10 text-white">
      
      {/* HEADER */}
      <header className="w-full flex items-center justify-between border-b border-[#222222] py-4 px-5">
        <span className="text-[20px] font-bold text-[#7B6FD4] tracking-tight">ExplifyAI</span>
        <a 
          href="https://instagram.com/explifyai" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[14px] text-[#888888] hover:text-[#7B6FD4] transition-colors"
        >
          @explifyai
        </a>
      </header>

      {/* HERO SECTION */}
      <section className="relative flex-1 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-center text-center md:text-left mt-12 md:mt-20 py-8 overflow-hidden">
        {/* Dynamic Background Particles (particles.js layout) */}
        <div 
          id="particles-js" 
          className="pointer-events-none absolute inset-0 z-0 w-full h-full opacity-80"
        />
        
        {/* LEFT COLUMN: Text Info */}
        <div className="md:col-span-7 flex flex-col items-center md:items-start">
          
          {/* Pill Badge */}
          <div className="bg-[#7B6FD4]/15 border border-[#7B6FD4] text-[#7B6FD4] text-[13px] font-bold py-1.5 px-4 rounded-full inline-block mb-6 cursor-default">
            🎓 Coming Soon
          </div>

          {/* H1 Title */}
          <h1 className="text-[42px] md:text-[56px] font-bold leading-[1.1] text-white max-w-xl">
            Understand any CS topic <br className="hidden md:block" />
            <span className="text-[#7B6FD4]">in 60 seconds.</span>
          </h1>

          {/* Hero Subtext */}
          <p className="text-[18px] text-[#888888] leading-[1.6] max-w-[500px] mt-4">
            Tanglish videos that explain DSA and CS concepts from zero — like your senior explaining it to you.
          </p>

          {/* Social Proof Strip */}
          <p className="text-[13px] text-[#666666] mt-5 md:mt-8">
            Seen by students from Anna University &middot; VIT &middot; SRM &middot; PSG
          </p>

        </div>

        {/* RIGHT COLUMN: CTA Form Card */}
        <div className="md:col-span-5 w-full flex justify-center md:justify-end mt-8 md:mt-0">
          
          {/* Card Surface */}
          <div className="w-full max-w-[480px] bg-[#111111] border border-[#222222] rounded-[16px] py-7 px-6 text-left relative overflow-hidden transition-all duration-300 min-h-[360px] flex flex-col justify-between">
            
            {!isSuccess ? (
              /* WAITLIST FORM */
              <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between">
                <div>
                  <h2 className="text-[22px] font-bold text-white mb-1.5">Join the waitlist</h2>
                  <p className="text-[15px] text-[#888888] mb-6">Be the first to know when we launch.</p>

                  {/* Waitlist Perks Badge */}
                  <div className="bg-[#7B6FD4]/10 border border-[#7B6FD4]/20 rounded-[10px] px-3.5 py-2.5 text-[13px] text-[#7B6FD4] mb-6 flex items-center gap-2 font-medium cursor-default">
                    <span className="text-[16px]">⚡</span>
                    <span><strong>Waitlist Perks:</strong> Get 50 free credits on launch!</span>
                  </div>
                  
                  {/* INPUT 1: Email */}
                  <div className={`mb-4 ${shakeEmail ? 'animate-shake' : ''}`}>
                    <label htmlFor="email" className="text-[13px] text-[#888888] block mb-1.5 font-medium">
                      Your email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={handleFocus}
                      placeholder="you@college.edu"
                      className="w-full bg-[#0a0a0a] border border-[#333333] rounded-[10px] py-3.5 px-4 text-white text-[16px] placeholder-[#555555] focus:border-[#7B6FD4] focus:outline-none transition-colors"
                    />
                    {emailError && (
                      <span className="text-[13px] text-[#DC2626] block mt-1">{emailError}</span>
                    )}
                  </div>

                  {/* INPUT 2: Dropdown */}
                  <div className={`mb-5 ${shakeTopic ? 'animate-shake' : ''}`}>
                    <label htmlFor="topic" className="text-[13px] text-[#888888] block mb-1.5 font-medium">
                      Which topic confuses you most?
                    </label>
                    <div className="relative">
                      <select
                        id="topic"
                        required
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onFocus={handleFocus}
                        className="w-full bg-[#0a0a0a] border border-[#333333] rounded-[10px] py-3.5 px-4 text-white text-[16px] focus:border-[#7B6FD4] focus:outline-none appearance-none cursor-pointer transition-colors"
                      >
                        <option value="" disabled>Pick a topic...</option>
                        
                        <option value="" disabled className="text-[#666666] font-semibold py-1 bg-[#111111]">── DSA ──</option>
                        <option value="Linked List">&nbsp;&nbsp;Linked List</option>
                        <option value="Recursion">&nbsp;&nbsp;Recursion</option>
                        <option value="Binary Tree">&nbsp;&nbsp;Binary Tree</option>
                        <option value="Dynamic Programming">&nbsp;&nbsp;Dynamic Programming</option>
                        <option value="Graph BFS / DFS">&nbsp;&nbsp;Graph BFS / DFS</option>
                        <option value="Stack & Queue">&nbsp;&nbsp;Stack & Queue</option>
                        <option value="Binary Search">&nbsp;&nbsp;Binary Search</option>
                        <option value="HashMap">&nbsp;&nbsp;HashMap</option>
                        <option value="Sorting Algorithms">&nbsp;&nbsp;Sorting Algorithms</option>

                        <option value="" disabled className="text-[#666666] font-semibold py-1 bg-[#111111]">── CS Concepts ──</option>
                        <option value="OS Scheduling">&nbsp;&nbsp;OS Scheduling</option>
                        <option value="Deadlock">&nbsp;&nbsp;Deadlock</option>
                        <option value="Virtual Memory">&nbsp;&nbsp;Virtual Memory</option>
                        <option value="TCP / IP">&nbsp;&nbsp;TCP / IP</option>
                        <option value="Database Indexing">&nbsp;&nbsp;Database Indexing</option>
                        <option value="CPU Cache">&nbsp;&nbsp;CPU Cache</option>
                        <option value="Process vs Thread">&nbsp;&nbsp;Process vs Thread</option>

                        <option value="" disabled className="text-[#666666] font-semibold py-1 bg-[#111111]">── Other ──</option>
                        <option value="Something else">&nbsp;&nbsp;Something else</option>
                      </select>
                    </div>
                    {topicError && (
                      <span className="text-[13px] text-[#DC2626] block mt-1">{topicError}</span>
                    )}
                  </div>
                </div>

                <div>
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#7B6FD4] hover:bg-[#6B5FC4] active:scale-[0.98] disabled:opacity-50 text-white text-[16px] font-bold py-4 rounded-[10px] border-none cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Adding you...</span>
                      </>
                    ) : (
                      'Notify me when live →'
                    )}
                  </button>

                  {/* Backend/Submit errors */}
                  {generalError && (
                    <span className="text-[14px] text-[#DC2626] text-center block mt-3 font-medium">
                      {generalError}
                    </span>
                  )}
                </div>
              </form>
            ) : (
              /* SUCCESS STATE */
              <div className="flex flex-col items-center justify-center text-center py-4 h-full">
                
                {/* Green Checkmark Circle */}
                <div className="w-16 h-16 border-2 border-[#16A34A] rounded-full flex items-center justify-center animate-spring-scale mb-4">
                  <svg className="w-8 h-8 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h2 className="text-[24px] font-bold text-white mb-2">{"You're on the list! 🎉"}</h2>
                
                <p className="text-[15px] text-[#888888] leading-relaxed max-w-[340px] mb-6">
                  {"We'll notify you the moment ExplifyAI launches. Meanwhile, follow us for daily CS concepts."}
                </p>

                {/* Instagram button */}
                <a
                  href="https://instagram.com/explifyai"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleInstagramClick}
                  className="w-full bg-transparent border border-[#333333] hover:border-[#7B6FD4] text-white text-[15px] font-bold py-3.5 px-6 rounded-[10px] block transition-colors text-center"
                >
                  Follow @explifyai on Instagram &rarr;
                </a>
              </div>
            )}
            
          </div>
        </div>

      </section>

      {/* WHAT IS IT SECTION */}
      <section className="mt-20 md:mt-28">
        <h2 className="text-[28px] font-bold text-white text-center mb-8 md:mb-12">
          What is ExplifyAI?
        </h2>

        {/* 3 cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          
          {/* CARD 1 */}
          <div className="bg-[#111111] border border-[#222222] rounded-[12px] p-6 text-center hover:border-[#333333] transition-colors">
            <span className="text-[40px] block mb-3 cursor-default" role="img" aria-label="reel icon">🎬</span>
            <h3 className="text-[18px] font-bold text-white mb-2">60-second reels</h3>
            <p className="text-[15px] text-[#888888] leading-relaxed">
              One concept. One minute. Explained from zero, no background needed.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="bg-[#111111] border border-[#222222] rounded-[12px] p-6 text-center hover:border-[#333333] transition-colors">
            <span className="text-[40px] block mb-3 cursor-default" role="img" aria-label="chat icon">🗣️</span>
            <h3 className="text-[18px] font-bold text-white mb-2">Tanglish explanations</h3>
            <p className="text-[15px] text-[#888888] leading-relaxed">
              Tamil + English — the way your senior actually explains it. Not a textbook. Not a lecture.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="bg-[#111111] border border-[#222222] rounded-[12px] p-6 text-center hover:border-[#333333] transition-colors">
            <span className="text-[40px] block mb-3 cursor-default" role="img" aria-label="target icon">🎯</span>
            <h3 className="text-[18px] font-bold text-white mb-2">Placement-ready</h3>
            <p className="text-[15px] text-[#888888] leading-relaxed">
              DSA, CS concepts, interview questions — everything you need before placement season.
            </p>
          </div>

        </div>
      </section>

      {/* SAMPLE TOPICS SECTION */}
      <section className="mt-20 md:mt-24 text-center">
        <h2 className="text-[24px] font-bold text-white mb-6">
          {"Topics we'll cover"}
        </h2>

        {/* Pill flex wrap layout */}
        <div className="flex flex-wrap gap-2.5 justify-center max-w-2xl mx-auto">
          {coveredTopics.map((topicItem, index) => (
            <div
              key={index}
              className="bg-[#111111] border border-[#333333] hover:border-[#7B6FD4] hover:text-white transition-all text-[#888888] text-[14px] py-2 px-4 rounded-full cursor-default select-none"
            >
              {topicItem}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-24 py-8 px-5 border-t border-[#1a1a1a] text-center">
        <span className="text-[16px] font-bold text-[#7B6FD4]">ExplifyAI</span>
        <p className="text-[13px] text-[#666666] mt-1">Built in Chennai, India 🇮🇳</p>
        <p className="text-[13px] text-[#444444] mt-1">&copy; 2026 ExplifyAI</p>
      </footer>

    </main>
    </>
  );
}
