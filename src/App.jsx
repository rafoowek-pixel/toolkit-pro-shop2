import React, { useState, useEffect } from 'react';

export default function FlexiBitBundleLandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);

    const handleScroll = () => {
      setScrollY(window.scrollY);
      const sections = ['bundle', 'features', 'reviews'];
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.8) {
            setVisibleSections(prev => ({ ...prev, [id]: true }));
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const features = [
    { icon: "🔧", title: "2 w 1", desc: "Kompletny zestaw" },
    { icon: "⚡", title: "Uniwersalne", desc: "Do każdej wiertarki" },
    { icon: "🏗️", title: "Stal chromowana", desc: "Max wytrzymałość" },
    { icon: "🔄", title: "360° Flex", desc: "Pełna elastyczność" }
  ];

  const reviews = [
    { text: "Świetny zestaw! Adaptery + flexi to strzał w dziesiątkę.", author: "Tomek", rating: 5 },
    { text: "Używałem przy montażu mebli - rewelacja!", author: "Michał", rating: 5 },
    { text: "Solidne wykonanie, w tej cenie to okazja!", author: "Andrzej", rating: 5 }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%)',
      fontFamily: "'Bebas Neue', 'Impact', sans-serif",
      color: '#ffffff',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      {/* Animated background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `linear-gradient(rgba(255,120,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,120,0,0.03) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
        pointerEvents: 'none',
        zIndex: 0,
        transform: `translateY(${scrollY * 0.1}px)`
      }} />

      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{
          position: 'fixed',
          width: `${15 + i * 8}px`,
          height: `${15 + i * 8}px`,
          background: `radial-gradient(circle, rgba(255,100,0,${0.1 + i * 0.03}) 0%, transparent 70%)`,
          borderRadius: '50%',
          top: `${10 + i * 18}%`,
          left: `${5 + i * 20}%`,
          pointerEvents: 'none',
          zIndex: 1,
          animation: `float${i % 3} ${5 + i}s ease-in-out infinite`,
          filter: 'blur(3px)'
        }} />
      ))}

      {/* Glowing orbs with parallax */}
      <div style={{
        position: 'fixed',
        top: '15%',
        right: '-15%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(255,100,0,0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 0,
        transform: `translateY(${scrollY * 0.15}px)`
      }} />
      <div style={{
        position: 'fixed',
        bottom: '5%',
        left: '-10%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(0,150,255,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 0,
        transform: `translateY(${-scrollY * 0.1}px)`
      }} />

      {/* Fixed Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: scrollY > 50 ? 'rgba(10,10,10,0.95)' : 'transparent',
        backdropFilter: scrollY > 50 ? 'blur(10px)' : 'none',
        borderBottom: scrollY > 50 ? '1px solid rgba(255,120,0,0.2)' : 'none',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          fontSize: 'clamp(18px, 5vw, 26px)',
          fontWeight: 'bold',
          letterSpacing: '2px',
          color: '#ff6600',
          textShadow: '0 0 20px rgba(255,100,0,0.5)'
        }}>
          TOOL<span style={{ color: '#fff' }}>KIT</span><span style={{ color: '#ff6600' }}>PRO</span>
        </div>
        <button 
          onClick={() => window.location.href = 'https://buy.stripe.com/00wbIU2Au75P3jl3BHbwk00'}
          style={{ 
            padding: '8px 16px',
            fontSize: 'clamp(11px, 3vw, 14px)',
            background: 'linear-gradient(135deg, #ff6600 0%, #ff8800 100%)',
            border: 'none',
            color: '#000',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: '1px'
          }}
        >
          KUP TERAZ
        </button>
      </header>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '90px 20px 50px',
        textAlign: 'center'
      }}>
        {/* Badge */}
        <div style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(-30px)',
          transition: 'all 0.8s ease-out',
          display: 'inline-block',
          padding: '8px 20px',
          background: 'linear-gradient(135deg, #ff6600 0%, #ff8800 100%)',
          marginBottom: '20px',
          fontSize: 'clamp(11px, 3vw, 14px)',
          letterSpacing: '1px',
          fontFamily: "'Roboto Condensed', sans-serif",
          fontWeight: 'bold',
          color: '#000',
          animation: 'pulse 2s infinite'
        }}>
          🔥 ZESTAW 2 W 1 — OSZCZĘDŹ 40%
        </div>
        
        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(32px, 11vw, 80px)',
          lineHeight: 0.95,
          margin: '0 0 15px 0',
          letterSpacing: '-1px',
          textTransform: 'uppercase',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 1s ease-out 0.2s'
        }}>
          <span style={{ display: 'block' }}>Kompletny</span>
          <span style={{ 
            display: 'block', 
            color: '#ff6600', 
            textShadow: '0 0 40px rgba(255,100,0,0.4)',
            animation: 'glow 2s ease-in-out infinite alternate'
          }}>Zestaw</span>
          <span style={{ display: 'block' }}>Majsterkowicza</span>
        </h1>

        <p style={{
          fontSize: 'clamp(13px, 4vw, 18px)',
          color: '#888',
          maxWidth: '450px',
          lineHeight: 1.7,
          margin: '0 auto 25px',
          fontFamily: "'Roboto Condensed', sans-serif",
          fontWeight: 300,
          padding: '0 15px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 1s ease-out 0.4s'
        }}>
          Elastyczny przedłużacz 290mm + zestaw 3 adapterów nasadkowych. 
          Wszystko czego potrzebujesz w jednym pakiecie.
        </p>

        {/* Product Images */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(10px, 3vw, 20px)',
          margin: '15px 0 30px',
          flexWrap: 'wrap',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.8)',
          transition: 'all 1s ease-out 0.6s'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '15px',
            padding: 'clamp(12px, 4vw, 20px)',
            border: '1px solid rgba(255,100,0,0.2)',
            animation: 'floatProduct 3s ease-in-out infinite'
          }}>
            <img 
              src="/przedluzacz.png" 
              alt="Elastyczny przedłużacz" 
              style={{ 
                height: 'clamp(80px, 22vw, 160px)', 
                objectFit: 'contain', 
                filter: 'drop-shadow(0 10px 25px rgba(255,100,0,0.3))'
              }} 
            />
          </div>
          <div style={{ 
            fontSize: 'clamp(24px, 8vw, 42px)', 
            color: '#ff6600', 
            fontWeight: 'bold', 
            textShadow: '0 0 25px rgba(255,100,0,0.5)',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}>+</div>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '15px',
            padding: 'clamp(12px, 4vw, 20px)',
            border: '1px solid rgba(0,150,255,0.2)',
            animation: 'floatProduct 3s ease-in-out infinite 0.5s'
          }}>
            <img 
              src="/adaptery.png" 
              alt="Adaptery nasadkowe" 
              style={{ 
                height: 'clamp(65px, 18vw, 130px)', 
                objectFit: 'contain', 
                filter: 'drop-shadow(0 10px 25px rgba(0,150,255,0.3))'
              }} 
            />
          </div>
        </div>

        {/* Price */}
        <div style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 1s ease-out 0.8s',
          marginBottom: '20px'
        }}>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ 
              fontSize: 'clamp(14px, 4vw, 18px)', 
              color: '#666',
              textDecoration: 'line-through',
              fontFamily: "'Roboto Condensed', sans-serif",
              marginRight: '12px'
            }}>83,50 zł</span>
            <span style={{ 
              fontSize: 'clamp(42px, 14vw, 68px)', 
              fontWeight: 'bold',
              color: '#fff',
              textShadow: '0 0 30px rgba(255,100,0,0.3)'
            }}>50 <span style={{ fontSize: 'clamp(22px, 7vw, 34px)', color: '#ff6600' }}>zł</span></span>
          </div>
          <div style={{ 
            display: 'inline-block',
            background: '#4CAF50',
            color: '#fff',
            padding: '6px 18px',
            fontSize: 'clamp(11px, 3vw, 14px)',
            letterSpacing: '1px',
            fontFamily: "'Roboto Condensed', sans-serif"
          }}>
            OSZCZĘDZASZ 33,50 zł!
          </div>
        </div>

        {/* CTA Button */}
        <button 
          onClick={() => window.location.href = 'https://buy.stripe.com/00wbIU2Au75P3jl3BHbwk00'}
          className="main-cta"
          style={{
            padding: 'clamp(14px, 4vw, 22px) clamp(35px, 10vw, 70px)',
            fontSize: 'clamp(15px, 5vw, 22px)',
            fontWeight: 'bold',
            letterSpacing: '2px',
            background: 'linear-gradient(135deg, #ff6600 0%, #ff8800 100%)',
            border: 'none',
            color: '#000',
            cursor: 'pointer',
            fontFamily: "'Bebas Neue', sans-serif",
            boxShadow: '0 15px 45px rgba(255,100,0,0.5)',
            position: 'relative',
            overflow: 'hidden',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1s ease-out 1s'
          }}
        >
          <span style={{ position: 'relative', zIndex: 1 }}>KUP ZESTAW</span>
          <div className="btn-shine" />
        </button>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'bounce 2s infinite',
          opacity: 0.4
        }}>
          <div style={{
            width: '24px',
            height: '40px',
            border: '2px solid #ff6600',
            borderRadius: '12px',
            position: 'relative'
          }}>
            <div style={{
              width: '4px',
              height: '8px',
              background: '#ff6600',
              borderRadius: '2px',
              position: 'absolute',
              top: '6px',
              left: '50%',
              transform: 'translateX(-50%)',
              animation: 'scrollDown 2s infinite'
            }} />
          </div>
        </div>
      </section>

      {/* Bundle Section */}
      <section id="bundle" style={{ 
        position: 'relative', 
        zIndex: 10, 
        padding: 'clamp(40px, 10vw, 80px) 15px',
        background: 'linear-gradient(180deg, rgba(255,100,0,0.05) 0%, transparent 100%)',
        opacity: visibleSections.bundle ? 1 : 0,
        transform: visibleSections.bundle ? 'translateY(0)' : 'translateY(50px)',
        transition: 'all 0.8s ease-out'
      }}>
        <h2 style={{ 
          fontSize: 'clamp(24px, 7vw, 44px)', 
          textAlign: 'center', 
          marginBottom: 'clamp(25px, 7vw, 50px)', 
          letterSpacing: '1px' 
        }}>
          CO ZAWIERA <span style={{ color: '#ff6600' }}>ZESTAW</span>?
        </h2>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
          gap: '15px', 
          maxWidth: '900px', 
          margin: '0 auto' 
        }}>
          {/* Product 1 */}
          <div className="product-card" style={{ 
            background: 'rgba(0,0,0,0.4)', 
            border: '1px solid rgba(255,100,0,0.3)', 
            padding: 'clamp(20px, 5vw, 35px)', 
            position: 'relative',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ 
              position: 'absolute', 
              top: '-1px', 
              left: '15px', 
              background: '#ff6600', 
              color: '#000', 
              padding: '4px 12px', 
              fontSize: '11px', 
              fontWeight: 'bold', 
              letterSpacing: '1px', 
              fontFamily: "'Roboto Condensed', sans-serif" 
            }}>#1</div>
            <div style={{ 
              fontSize: 'clamp(16px, 5vw, 22px)', 
              marginBottom: '12px', 
              letterSpacing: '1px', 
              marginTop: '8px' 
            }}>ELASTYCZNY PRZEDŁUŻACZ</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
              <img 
                src="/przedluzacz.png" 
                alt="Elastyczny przedłużacz" 
                style={{ height: 'clamp(70px, 18vw, 100px)', objectFit: 'contain' }} 
              />
            </div>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0, 
              fontFamily: "'Roboto Condensed', sans-serif", 
              fontSize: 'clamp(11px, 3.5vw, 14px)', 
              color: '#aaa', 
              lineHeight: 1.9 
            }}>
              <li>✓ Długość: 290mm</li>
              <li>✓ Gniazdo: 1/4" Hex (6.35mm)</li>
              <li>✓ Materiał: Stal stopowa</li>
              <li>✓ Pełna elastyczność 360°</li>
            </ul>
          </div>

          {/* Product 2 */}
          <div className="product-card" style={{ 
            background: 'rgba(0,0,0,0.4)', 
            border: '1px solid rgba(0,150,255,0.3)', 
            padding: 'clamp(20px, 5vw, 35px)', 
            position: 'relative',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ 
              position: 'absolute', 
              top: '-1px', 
              left: '15px', 
              background: '#0096ff', 
              color: '#000', 
              padding: '4px 12px', 
              fontSize: '11px', 
              fontWeight: 'bold', 
              letterSpacing: '1px', 
              fontFamily: "'Roboto Condensed', sans-serif" 
            }}>#2</div>
            <div style={{ 
              fontSize: 'clamp(16px, 5vw, 22px)', 
              marginBottom: '12px', 
              letterSpacing: '1px', 
              marginTop: '8px' 
            }}>ADAPTERY NASADKOWE 3 SZT.</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
              <img 
                src="/adaptery.png" 
                alt="Adaptery nasadkowe" 
                style={{ height: 'clamp(70px, 18vw, 100px)', objectFit: 'contain' }} 
              />
            </div>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0, 
              fontFamily: "'Roboto Condensed', sans-serif", 
              fontSize: 'clamp(11px, 3.5vw, 14px)', 
              color: '#aaa', 
              lineHeight: 1.9 
            }}>
              <li>✓ Rozmiary: 1/4", 3/8", 1/2"</li>
              <li>✓ Trzpień: Hex 1/4"</li>
              <li>✓ Materiał: Stal chromowana</li>
              <li>✓ Długość: ~50mm każdy</li>
            </ul>
          </div>
        </div>

        {/* Bundle price */}
        <div style={{ 
          maxWidth: '420px', 
          margin: '35px auto 0', 
          background: 'linear-gradient(135deg, rgba(255,100,0,0.1) 0%, rgba(0,150,255,0.1) 100%)', 
          border: '2px solid #ff6600', 
          padding: 'clamp(20px, 5vw, 35px)', 
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 'clamp(22px, 6vw, 30px)', color: '#666', textDecoration: 'line-through', marginBottom: '8px' }}>83,50 zł</div>
          <div style={{ fontSize: 'clamp(44px, 14vw, 68px)', fontWeight: 'bold', lineHeight: 1, marginBottom: '12px' }}>
            50 <span style={{ fontSize: 'clamp(22px, 7vw, 34px)', color: '#ff6600' }}>zł</span>
          </div>
          <div style={{ 
            display: 'inline-block', 
            background: '#4CAF50', 
            color: '#fff', 
            padding: '8px 20px', 
            fontSize: 'clamp(13px, 4vw, 16px)', 
            letterSpacing: '1px', 
            fontFamily: "'Roboto Condensed', sans-serif", 
            marginBottom: '15px' 
          }}>OSZCZĘDZASZ 33,50 zł!</div>
          <br />
          <button 
            onClick={() => window.location.href = 'https://buy.stripe.com/00wbIU2Au75P3jl3BHbwk00'} 
            className="main-cta"
            style={{ 
              marginTop: '10px', 
              padding: '12px 35px', 
              fontSize: 'clamp(13px, 4vw, 16px)', 
              fontWeight: 'bold', 
              letterSpacing: '2px', 
              background: 'linear-gradient(135deg, #ff6600 0%, #ff8800 100%)', 
              border: 'none', 
              color: '#000', 
              cursor: 'pointer', 
              fontFamily: "'Bebas Neue', sans-serif", 
              boxShadow: '0 10px 25px rgba(255,100,0,0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            ZAMÓW TERAZ
            <div className="btn-shine" />
          </button>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ 
        position: 'relative', 
        zIndex: 10, 
        padding: 'clamp(40px, 10vw, 80px) 15px',
        opacity: visibleSections.features ? 1 : 0,
        transform: visibleSections.features ? 'translateY(0)' : 'translateY(50px)',
        transition: 'all 0.8s ease-out'
      }}>
        <h2 style={{ 
          fontSize: 'clamp(24px, 7vw, 44px)', 
          textAlign: 'center', 
          marginBottom: 'clamp(25px, 7vw, 50px)', 
          letterSpacing: '2px' 
        }}>
          <span style={{ color: '#ff6600' }}>DLACZEGO</span> TEN ZESTAW?
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
          gap: '12px', 
          maxWidth: '900px', 
          margin: '0 auto' 
        }}>
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
              style={{ 
                padding: 'clamp(18px, 5vw, 35px) clamp(12px, 3vw, 25px)', 
                background: activeFeature === index 
                  ? 'linear-gradient(135deg, rgba(255,100,0,0.15) 0%, rgba(255,100,0,0.05) 100%)' 
                  : 'rgba(255,255,255,0.02)', 
                border: `1px solid ${activeFeature === index ? '#ff6600' : 'rgba(255,255,255,0.1)'}`, 
                textAlign: 'center', 
                transform: activeFeature === index ? 'scale(1.03)' : 'scale(1)', 
                transition: 'all 0.5s ease'
              }}
            >
              <div style={{ 
                fontSize: 'clamp(28px, 9vw, 42px)', 
                marginBottom: '10px', 
                filter: activeFeature === index ? 'none' : 'grayscale(1)',
                transition: 'all 0.3s ease'
              }}>{feature.icon}</div>
              <h3 style={{ 
                fontSize: 'clamp(14px, 4.5vw, 20px)', 
                marginBottom: '6px', 
                color: activeFeature === index ? '#ff6600' : '#fff', 
                letterSpacing: '1px' 
              }}>{feature.title}</h3>
              <p style={{ 
                fontSize: 'clamp(10px, 3vw, 13px)', 
                color: '#888', 
                fontFamily: "'Roboto Condensed', sans-serif", 
                margin: 0 
              }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" style={{ 
        position: 'relative', 
        zIndex: 10, 
        padding: 'clamp(40px, 10vw, 80px) 15px', 
        background: 'rgba(255,100,0,0.02)',
        opacity: visibleSections.reviews ? 1 : 0,
        transform: visibleSections.reviews ? 'translateY(0)' : 'translateY(50px)',
        transition: 'all 0.8s ease-out'
      }}>
        <h2 style={{ 
          fontSize: 'clamp(24px, 7vw, 44px)', 
          textAlign: 'center', 
          marginBottom: 'clamp(25px, 7vw, 50px)', 
          letterSpacing: '1px' 
        }}>
          CO MÓWIĄ <span style={{ color: '#ff6600' }}>KLIENCI</span>
        </h2>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '15px', 
          flexWrap: 'wrap',
          maxWidth: '1100px',
          margin: '0 auto'
        }}>
          {reviews.map((review, i) => (
            <div 
              key={i} 
              className="review-card"
              style={{ 
                background: 'rgba(0,0,0,0.4)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                padding: 'clamp(20px, 5vw, 35px)', 
                maxWidth: '300px',
                width: '100%',
                position: 'relative',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ 
                position: 'absolute', 
                top: '-8px', 
                left: '15px', 
                fontSize: '40px', 
                color: '#ff6600', 
                opacity: 0.3, 
                fontFamily: 'Georgia, serif' 
              }}>"</div>
              <div style={{ marginBottom: '12px' }}>
                {[...Array(review.rating)].map((_, j) => (
                  <span key={j} style={{ color: '#ff6600', fontSize: '16px' }}>★</span>
                ))}
              </div>
              <p style={{ 
                fontFamily: "'Roboto Condensed', sans-serif", 
                fontSize: 'clamp(12px, 3.5vw, 15px)', 
                lineHeight: 1.7, 
                color: '#ccc', 
                marginBottom: '12px' 
              }}>{review.text}</p>
              <div style={{ 
                fontSize: '12px', 
                color: '#666', 
                letterSpacing: '1px', 
                fontFamily: "'Roboto Condensed', sans-serif" 
              }}>— {review.author}</div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '10px', 
          marginTop: '35px', 
          flexWrap: 'wrap' 
        }}>
          {[
            { value: '4.9/5', label: 'OCENA' },
            { value: '99%', label: 'POZYTYWNYCH' },
            { value: '2000+', label: 'SPRZEDANYCH' }
          ].map((stat, i) => (
            <div key={i} style={{ 
              padding: '12px 20px', 
              background: 'rgba(255,100,0,0.1)', 
              border: '1px solid #ff6600', 
              textAlign: 'center',
              minWidth: '100px'
            }}>
              <span style={{ fontSize: 'clamp(18px, 5vw, 24px)', fontWeight: 'bold' }}>{stat.value}</span>
              <span style={{ 
                display: 'block', 
                fontSize: '9px', 
                color: '#888', 
                letterSpacing: '1px', 
                fontFamily: "'Roboto Condensed', sans-serif", 
                marginTop: '3px' 
              }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ 
        position: 'relative', 
        zIndex: 10, 
        padding: 'clamp(50px, 12vw, 100px) 15px', 
        textAlign: 'center', 
        background: 'linear-gradient(180deg, transparent 0%, rgba(255,100,0,0.12) 100%)' 
      }}>
        <h2 style={{ 
          fontSize: 'clamp(24px, 7vw, 50px)', 
          marginBottom: '20px', 
          letterSpacing: '1px' 
        }}>
          ZAMÓW <span style={{ color: '#ff6600' }}>ZESTAW</span> TERAZ
        </h2>
        
        <div style={{ marginBottom: '25px' }}>
          <span style={{ 
            fontSize: 'clamp(14px, 4vw, 18px)', 
            color: '#666', 
            textDecoration: 'line-through', 
            fontFamily: "'Roboto Condensed', sans-serif",
            marginRight: '12px'
          }}>83,50 zł</span>
          <span style={{ 
            fontSize: 'clamp(44px, 14vw, 68px)', 
            fontWeight: 'bold', 
            color: '#fff'
          }}>50 <span style={{ fontSize: 'clamp(22px, 7vw, 34px)', color: '#ff6600' }}>zł</span></span>
        </div>

        <button 
          onClick={() => window.location.href = 'https://buy.stripe.com/00wbIU2Au75P3jl3BHbwk00'} 
          className="main-cta final-cta"
          style={{ 
            padding: 'clamp(16px, 5vw, 28px) clamp(40px, 12vw, 90px)', 
            fontSize: 'clamp(16px, 5vw, 26px)', 
            fontWeight: 'bold', 
            letterSpacing: '3px', 
            background: 'linear-gradient(135deg, #ff6600 0%, #ff8800 100%)', 
            border: 'none', 
            color: '#000', 
            cursor: 'pointer', 
            fontFamily: "'Bebas Neue', sans-serif", 
            boxShadow: '0 20px 55px rgba(255,100,0,0.5)',
            position: 'relative',
            overflow: 'hidden',
            animation: 'pulseButton 2s ease-in-out infinite'
          }}
        >
          ZAMÓW — 50 ZŁ
          <div className="btn-shine" />
        </button>
        
        <div style={{ 
          marginTop: '20px', 
          fontSize: 'clamp(10px, 3vw, 13px)', 
          color: '#666', 
          fontFamily: "'Roboto Condensed', sans-serif", 
          letterSpacing: '1px' 
        }}>
          🚚 WYSYŁKA W 24H • 📦 30 DNI ZWROT • ✅ GWARANCJA
        </div>

        {/* Payment methods */}
        <div style={{
          marginTop: '25px',
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          opacity: 0.5
        }}>
          {['BLIK', 'VISA', 'Mastercard', 'Apple Pay', 'Google Pay'].map((method, i) => (
            <span key={i} style={{
              padding: '4px 10px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '3px',
              fontSize: '10px',
              fontFamily: "'Roboto Condensed', sans-serif",
              letterSpacing: '1px'
            }}>{method}</span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        position: 'relative', 
        zIndex: 10, 
        padding: '25px 15px', 
        borderTop: '1px solid rgba(255,255,255,0.1)', 
        textAlign: 'center',
        fontFamily: "'Roboto Condensed', sans-serif", 
        fontSize: '11px', 
        color: '#666' 
      }}>
        <div>© 2025 TOOLKIT PRO</div>
      </footer>

      {/* Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto+Condensed:wght@300;400;700&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        
        @keyframes float0 { 0%, 100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-20px) translateX(10px); } }
        @keyframes float1 { 0%, 100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-30px) translateX(-15px); } }
        @keyframes float2 { 0%, 100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-25px) translateX(20px); } }
        @keyframes floatProduct { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes glow { 0% { text-shadow: 0 0 20px rgba(255,100,0,0.4); } 100% { text-shadow: 0 0 40px rgba(255,100,0,0.8), 0 0 60px rgba(255,100,0,0.4); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.85; transform: scale(1.03); } }
        @keyframes pulseButton { 0%, 100% { box-shadow: 0 20px 55px rgba(255,100,0,0.5); } 50% { box-shadow: 0 25px 70px rgba(255,100,0,0.7); } }
        @keyframes bounce { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }
        @keyframes scrollDown { 0% { opacity: 1; top: 6px; } 100% { opacity: 0; top: 20px; } }
        
        .btn-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shine 3s infinite;
        }
        @keyframes shine { 0% { left: -100%; } 50%, 100% { left: 100%; } }
        
        .main-cta:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 25px 65px rgba(255,100,0,0.6) !important; }
        .main-cta:active { transform: translateY(-2px) scale(0.98); }
        .product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 35px rgba(0,0,0,0.3); }
        .review-card:hover { transform: translateY(-4px); border-color: rgba(255,100,0,0.3); }
        .feature-card:hover { background: rgba(255,100,0,0.08) !important; }
      `}</style>
    </div>
  );
}
