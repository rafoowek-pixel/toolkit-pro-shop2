import React, { useState, useEffect } from 'react';

export default function FlexiBitBundleLandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [activeProduct, setActiveProduct] = useState(0);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'transfer'
  });
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // WAŻNE: Zamień YOUR_FORM_ID na swój ID z formspree.io
    try {
      const response = await fetch('https://formspree.io/f/mpqwqqwn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          product: 'Zestaw TOOLKIT PRO - Elastyczny przedłużacz + Adaptery nasadkowe',
          price: formData.paymentMethod === 'cod' ? '60 zł' : '50 zł',
          orderDate: new Date().toLocaleString('pl-PL')
        })
      });
      if (response.ok) setOrderSubmitted(true);
    } catch (error) {
      console.error('Błąd wysyłki:', error);
    }
    setIsSubmitting(false);
  };

  const features = [
    { icon: "🔧", title: "2 w 1", desc: "Kompletny zestaw do każdego zadania" },
    { icon: "⚡", title: "Uniwersalne", desc: "Pasuje do każdej wiertarki" },
    { icon: "🏗️", title: "Stal chromowana", desc: "Maksymalna wytrzymałość" },
    { icon: "🔄", title: "360° Flex", desc: "Pełna elastyczność ruchu" }
  ];

  const reviews = [
    { text: "Świetny zestaw! Adaptery + flexi to strzał w dziesiątkę.", author: "Tomek", rating: 5 },
    { text: "Używałem przy montażu mebli - rewelacja!", author: "Michał", rating: 5 },
    { text: "Solidne wykonanie, w tej cenie to okazja!", author: "Andrzej", rating: 5 }
  ];

  const products = [
    { name: "Elastyczny Przedłużacz", size: "300mm / 12\"" },
    { name: "Adaptery Nasadkowe", size: "1/4\" + 3/8\" + 1/2\"" }
  ];

  const inputStyle = {
    width: '100%',
    padding: '15px 20px',
    fontSize: '16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    fontFamily: "'Roboto Condensed', sans-serif",
    outline: 'none',
    transition: 'border-color 0.3s'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '12px',
    letterSpacing: '2px',
    color: '#888',
    fontFamily: "'Roboto Condensed', sans-serif"
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%)',
      fontFamily: "'Bebas Neue', 'Impact', sans-serif",
      color: '#ffffff',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Order Form Modal */}
      {showOrderForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.9)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          overflow: 'auto'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
            border: '1px solid rgba(255,100,0,0.3)',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => { setShowOrderForm(false); setOrderSubmitted(false); }}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                color: '#888',
                fontSize: '24px',
                cursor: 'pointer',
                zIndex: 10
              }}
            >✕</button>

            {!orderSubmitted ? (
              <div style={{ padding: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <div style={{ fontSize: '14px', letterSpacing: '3px', color: '#ff6600', marginBottom: '10px', fontFamily: "'Roboto Condensed', sans-serif" }}>
                    ZAMÓWIENIE
                  </div>
                  <h2 style={{ fontSize: '32px', margin: '0 0 15px 0', letterSpacing: '2px' }}>
                    ZESTAW TOOLKIT PRO
                  </h2>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ff6600' }}>50 zł</div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>IMIĘ I NAZWISKO *</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleInputChange} style={inputStyle} placeholder="Jan Kowalski" />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>EMAIL *</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} style={inputStyle} placeholder="jan@example.com" />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>TELEFON *</label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} style={inputStyle} placeholder="123 456 789" />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>ADRES DOSTAWY *</label>
                    <input type="text" name="address" required value={formData.address} onChange={handleInputChange} style={inputStyle} placeholder="ul. Przykładowa 123/4" />
                  </div>

                  <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>MIASTO *</label>
                      <input type="text" name="city" required value={formData.city} onChange={handleInputChange} style={inputStyle} placeholder="Kraków" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>KOD POCZTOWY *</label>
                      <input type="text" name="zipCode" required value={formData.zipCode} onChange={handleInputChange} style={inputStyle} placeholder="00-000" />
                    </div>
                  </div>

                  <div style={{ marginBottom: '30px' }}>
                    <label style={labelStyle}>METODA PŁATNOŚCI *</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <label style={{
                        display: 'flex', alignItems: 'center', gap: '10px', padding: '15px',
                        background: formData.paymentMethod === 'transfer' ? 'rgba(255,100,0,0.1)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${formData.paymentMethod === 'transfer' ? '#ff6600' : 'rgba(255,255,255,0.1)'}`,
                        cursor: 'pointer', fontFamily: "'Roboto Condensed', sans-serif"
                      }}>
                        <input type="radio" name="paymentMethod" value="transfer" checked={formData.paymentMethod === 'transfer'} onChange={handleInputChange} />
                        <div>
                          <div style={{ color: '#fff', fontWeight: 'bold' }}>Przelew bankowy</div>
                          <div style={{ fontSize: '12px', color: '#888' }}>Dane do przelewu otrzymasz na email</div>
                        </div>
                      </label>
                      <label style={{
                        display: 'flex', alignItems: 'center', gap: '10px', padding: '15px',
                        background: formData.paymentMethod === 'cod' ? 'rgba(255,100,0,0.1)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${formData.paymentMethod === 'cod' ? '#ff6600' : 'rgba(255,255,255,0.1)'}`,
                        cursor: 'pointer', fontFamily: "'Roboto Condensed', sans-serif"
                      }}>
                        <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} />
                        <div>
                          <div style={{ color: '#fff', fontWeight: 'bold' }}>Płatność przy odbiorze</div>
                          <div style={{ fontSize: '12px', color: '#888' }}>+10 zł za pobranie</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,100,0,0.1)', padding: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontFamily: "'Roboto Condensed', sans-serif" }}>
                      <span style={{ color: '#888' }}>Zestaw TOOLKIT PRO</span>
                      <span>50 zł</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontFamily: "'Roboto Condensed', sans-serif" }}>
                      <span style={{ color: '#888' }}>Wysyłka</span>
                      <span style={{ color: '#4CAF50' }}>GRATIS</span>
                    </div>
                    {formData.paymentMethod === 'cod' && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontFamily: "'Roboto Condensed', sans-serif" }}>
                        <span style={{ color: '#888' }}>Opłata za pobranie</span>
                        <span>10 zł</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '20px', fontWeight: 'bold' }}>
                      <span>RAZEM</span>
                      <span style={{ color: '#ff6600' }}>{formData.paymentMethod === 'cod' ? '60' : '50'} zł</span>
                    </div>
                  </div>

                  <button type="submit" disabled={isSubmitting} style={{
                    width: '100%', padding: '20px', fontSize: '18px', fontWeight: 'bold', letterSpacing: '3px',
                    background: isSubmitting ? '#666' : 'linear-gradient(135deg, #ff6600 0%, #ff8800 100%)',
                    border: 'none', color: '#000', cursor: isSubmitting ? 'wait' : 'pointer',
                    fontFamily: "'Bebas Neue', sans-serif", boxShadow: '0 10px 30px rgba(255,100,0,0.3)'
                  }}>
                    {isSubmitting ? 'WYSYŁANIE...' : 'ZAMAWIAM I PŁACĘ'}
                  </button>

                  <p style={{ fontSize: '11px', color: '#666', textAlign: 'center', marginTop: '15px', fontFamily: "'Roboto Condensed', sans-serif" }}>
                    Klikając przycisk, akceptujesz regulamin sklepu i politykę prywatności.
                  </p>
                </form>
              </div>
            ) : (
              <div style={{ padding: '60px 40px', textAlign: 'center' }}>
                <div style={{ fontSize: '80px', marginBottom: '20px' }}>✅</div>
                <h2 style={{ fontSize: '32px', marginBottom: '20px', letterSpacing: '2px' }}>DZIĘKUJEMY ZA ZAMÓWIENIE!</h2>
                <p style={{ fontSize: '16px', color: '#888', fontFamily: "'Roboto Condensed', sans-serif", lineHeight: 1.8, marginBottom: '30px' }}>
                  Potwierdzenie zamówienia oraz {formData.paymentMethod === 'transfer' ? 'dane do przelewu' : 'szczegóły dostawy'} zostały wysłane na adres:
                  <br /><strong style={{ color: '#ff6600' }}>{formData.email}</strong>
                </p>
                <p style={{ fontSize: '14px', color: '#666', fontFamily: "'Roboto Condensed', sans-serif" }}>
                  Numer zamówienia: <strong>#{Date.now().toString().slice(-6)}</strong>
                </p>
                <button onClick={() => { setShowOrderForm(false); setOrderSubmitted(false); setFormData({ name: '', email: '', phone: '', address: '', city: '', zipCode: '', paymentMethod: 'transfer' }); }}
                  style={{ marginTop: '30px', padding: '15px 40px', fontSize: '16px', background: 'transparent', border: '1px solid #ff6600', color: '#ff6600', cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px' }}>
                  ZAMKNIJ
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `linear-gradient(rgba(255,120,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,120,0,0.03) 1px, transparent 1px)`, backgroundSize: '50px 50px', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255,100,0,0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Header */}
      <header style={{ position: 'relative', zIndex: 10, padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,120,0,0.2)' }}>
        <div style={{ fontSize: '28px', fontWeight: 'bold', letterSpacing: '4px', color: '#ff6600', textShadow: '0 0 20px rgba(255,100,0,0.5)' }}>
          TOOL<span style={{ color: '#fff' }}>KIT</span><span style={{ color: '#ff6600' }}>PRO</span>
        </div>
        <nav style={{ display: 'flex', gap: '30px', fontFamily: "'Roboto Condensed', sans-serif", fontSize: '14px', letterSpacing: '2px' }}>
          <a href="#bundle" style={{ color: '#888', textDecoration: 'none' }}>ZESTAW</a>
          <a href="#features" style={{ color: '#888', textDecoration: 'none' }}>CECHY</a>
          <a href="#reviews" style={{ color: '#888', textDecoration: 'none' }}>OPINIE</a>
        </nav>
      </header>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 10, minHeight: '85vh', display: 'flex', alignItems: 'center', padding: '60px 80px', gap: '60px' }}>
        <div style={{ flex: 1, opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(-50px)', transition: 'all 1s ease-out' }}>
          <div style={{ display: 'inline-block', padding: '8px 20px', background: 'linear-gradient(135deg, #ff6600 0%, #ff8800 100%)', marginBottom: '20px', fontSize: '14px', letterSpacing: '3px', fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 'bold', color: '#000' }}>
            🔥 ZESTAW 2 W 1 — OSZCZĘDŹ 40%
          </div>
          
          <h1 style={{ fontSize: 'clamp(42px, 7vw, 84px)', lineHeight: 0.95, margin: 0, letterSpacing: '-2px', textTransform: 'uppercase' }}>
            <span style={{ display: 'block' }}>Kompletny</span>
            <span style={{ display: 'block', color: '#ff6600', textShadow: '0 0 40px rgba(255,100,0,0.4)' }}>Zestaw</span>
            <span style={{ display: 'block' }}>Majsterkowicza</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#888', maxWidth: '500px', lineHeight: 1.8, marginTop: '30px', fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 300 }}>
            Elastyczny przedłużacz 300mm + zestaw 3 adapterów nasadkowych. Wszystko czego potrzebujesz w jednym pakiecie.
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginTop: '50px' }}>
            <button onClick={() => setShowOrderForm(true)} style={{
              padding: '20px 50px', fontSize: '18px', fontWeight: 'bold', letterSpacing: '3px',
              background: 'linear-gradient(135deg, #ff6600 0%, #ff8800 100%)', border: 'none', color: '#000',
              cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif", boxShadow: '0 10px 40px rgba(255,100,0,0.4)'
            }}>
              KUP ZESTAW
            </button>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '16px', color: '#666', textDecoration: 'line-through', fontFamily: "'Roboto Condensed', sans-serif" }}>83,50 zł</div>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#fff', lineHeight: 1 }}>50 <span style={{ fontSize: '24px', color: '#ff6600' }}>zł</span></div>
              <div style={{ fontSize: '12px', color: '#4CAF50', letterSpacing: '2px', fontFamily: "'Roboto Condensed', sans-serif" }}>OSZCZĘDZASZ 33,50 zł!</div>
            </div>
          </div>
        </div>

        {/* Product Visual */}
        <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(50px)', transition: 'all 1s ease-out 0.3s' }}>
          <div style={{ width: '100%', maxWidth: '500px', height: '350px', background: 'conic-gradient(from 0deg, #1a1a1a, #2a2a2a, #1a1a1a)', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', boxShadow: 'inset 0 0 60px rgba(0,0,0,0.8), 0 0 80px rgba(255,100,0,0.2)', marginBottom: '30px' }}>
            <div style={{ position: 'absolute', width: '380px', height: '380px', border: '2px solid transparent', borderTopColor: '#ff6600', borderRadius: '50%', animation: 'rotate 8s linear infinite' }} />
            <div style={{ position: 'absolute', top: '20px', right: '20px', background: '#ff6600', color: '#000', padding: '10px 15px', fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 'bold', fontSize: '14px', letterSpacing: '1px' }}>BUNDLE</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
              <div style={{ width: '180px', height: '35px', background: 'linear-gradient(180deg, #4a4a4a 0%, #2a2a2a 50%, #1a1a1a 100%)', borderRadius: '17px', position: 'relative', transform: 'rotate(-20deg)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} style={{ position: 'absolute', left: `${15 + i * 18}px`, top: '6px', width: '14px', height: '23px', background: 'linear-gradient(180deg, #ff6600 0%, #cc5500 100%)', borderRadius: '3px', transform: `rotate(${Math.sin(i * 0.5) * 5}deg)` }} />
                ))}
                <div style={{ position: 'absolute', right: '-20px', top: '5px', width: '25px', height: '25px', background: 'linear-gradient(135deg, #555 0%, #333 100%)', clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }} />
              </div>
              <div style={{ fontSize: '36px', color: '#ff6600', fontWeight: 'bold', textShadow: '0 0 20px rgba(255,100,0,0.5)' }}>+</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                {[{ size: '1/2"', width: 50 }, { size: '3/8"', width: 42 }, { size: '1/4"', width: 35 }].map((adapter, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: `${adapter.width}px`, height: '25px', background: 'linear-gradient(180deg, #888 0%, #555 50%, #444 100%)', borderRadius: '3px', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '-12px', top: '4px', width: '15px', height: '17px', background: 'linear-gradient(135deg, #666 0%, #444 100%)', clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }} />
                    </div>
                    <span style={{ fontSize: '11px', color: '#888', fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 'bold' }}>{adapter.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '15px', width: '100%', maxWidth: '500px' }}>
            {products.map((product, i) => (
              <div key={i} onClick={() => setActiveProduct(i)} style={{ flex: 1, padding: '15px 20px', background: activeProduct === i ? 'linear-gradient(135deg, rgba(255,100,0,0.2) 0%, rgba(255,100,0,0.1) 100%)' : 'rgba(255,255,255,0.03)', border: `1px solid ${activeProduct === i ? '#ff6600' : 'rgba(255,255,255,0.1)'}`, cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: activeProduct === i ? '#ff6600' : '#fff', letterSpacing: '1px', marginBottom: '5px' }}>{product.name}</div>
                <div style={{ fontSize: '12px', color: '#666', fontFamily: "'Roboto Condensed', sans-serif" }}>{product.size}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle Section */}
      <section id="bundle" style={{ position: 'relative', zIndex: 10, padding: '80px', background: 'linear-gradient(180deg, rgba(255,100,0,0.05) 0%, transparent 100%)' }}>
        <h2 style={{ fontSize: '48px', textAlign: 'center', marginBottom: '60px', letterSpacing: '2px' }}>CO ZAWIERA <span style={{ color: '#ff6600' }}>ZESTAW</span>?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,100,0,0.3)', padding: '40px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-1px', left: '30px', background: '#ff6600', color: '#000', padding: '5px 15px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', fontFamily: "'Roboto Condensed', sans-serif" }}>#1</div>
            <div style={{ fontSize: '24px', marginBottom: '20px', letterSpacing: '2px', marginTop: '10px' }}>ELASTYCZNY PRZEDŁUŻACZ</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: "'Roboto Condensed', sans-serif", fontSize: '14px', color: '#aaa', lineHeight: 2 }}>
              <li>✓ Długość: 300mm (12")</li>
              <li>✓ Gniazdo: 1/4" Hex</li>
              <li>✓ Materiał: Stal stopowa</li>
              <li>✓ Pełna elastyczność 360°</li>
            </ul>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,150,255,0.3)', padding: '40px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-1px', left: '30px', background: '#0096ff', color: '#000', padding: '5px 15px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', fontFamily: "'Roboto Condensed', sans-serif" }}>#2</div>
            <div style={{ fontSize: '24px', marginBottom: '20px', letterSpacing: '2px', marginTop: '10px' }}>ADAPTERY NASADKOWE 3 SZT.</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: "'Roboto Condensed', sans-serif", fontSize: '14px', color: '#aaa', lineHeight: 2 }}>
              <li>✓ Rozmiary: 1/4", 3/8", 1/2"</li>
              <li>✓ Trzpień: Hex 1/4"</li>
              <li>✓ Materiał: Stal chromowana</li>
              <li>✓ Długość: ~50mm każdy</li>
            </ul>
          </div>
        </div>
        <div style={{ maxWidth: '600px', margin: '60px auto 0', background: 'linear-gradient(135deg, rgba(255,100,0,0.1) 0%, rgba(0,150,255,0.1) 100%)', border: '2px solid #ff6600', padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', color: '#666', textDecoration: 'line-through', marginBottom: '10px' }}>83,50 zł</div>
          <div style={{ fontSize: '72px', fontWeight: 'bold', lineHeight: 1, marginBottom: '20px' }}>50 <span style={{ fontSize: '36px', color: '#ff6600' }}>zł</span></div>
          <div style={{ display: 'inline-block', background: '#4CAF50', color: '#fff', padding: '10px 30px', fontSize: '18px', letterSpacing: '2px', fontFamily: "'Roboto Condensed', sans-serif", marginBottom: '20px' }}>OSZCZĘDZASZ 33,50 zł!</div>
          <br />
          <button onClick={() => setShowOrderForm(true)} style={{ marginTop: '20px', padding: '20px 60px', fontSize: '18px', fontWeight: 'bold', letterSpacing: '3px', background: 'linear-gradient(135deg, #ff6600 0%, #ff8800 100%)', border: 'none', color: '#000', cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif", boxShadow: '0 10px 30px rgba(255,100,0,0.3)' }}>
            ZAMÓW TERAZ
          </button>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ position: 'relative', zIndex: 10, padding: '100px 80px' }}>
        <h2 style={{ fontSize: '48px', textAlign: 'center', marginBottom: '60px', letterSpacing: '4px' }}><span style={{ color: '#ff6600' }}>DLACZEGO</span> TEN ZESTAW?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          {features.map((feature, index) => (
            <div key={index} style={{ padding: '40px 30px', background: activeFeature === index ? 'linear-gradient(135deg, rgba(255,100,0,0.15) 0%, rgba(255,100,0,0.05) 100%)' : 'rgba(255,255,255,0.02)', border: `1px solid ${activeFeature === index ? '#ff6600' : 'rgba(255,255,255,0.1)'}`, textAlign: 'center', transform: activeFeature === index ? 'scale(1.05)' : 'scale(1)', transition: 'all 0.5s ease' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px', filter: activeFeature === index ? 'none' : 'grayscale(1)' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '24px', marginBottom: '10px', color: activeFeature === index ? '#ff6600' : '#fff', letterSpacing: '2px' }}>{feature.title}</h3>
              <p style={{ fontSize: '14px', color: '#888', fontFamily: "'Roboto Condensed', sans-serif", margin: 0 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" style={{ position: 'relative', zIndex: 10, padding: '100px 80px', background: 'rgba(255,100,0,0.02)' }}>
        <h2 style={{ fontSize: '48px', textAlign: 'center', marginBottom: '60px', letterSpacing: '2px' }}>CO MÓWIĄ <span style={{ color: '#ff6600' }}>KLIENCI</span></h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
          {reviews.map((review, i) => (
            <div key={i} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '40px', maxWidth: '350px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-15px', left: '30px', fontSize: '60px', color: '#ff6600', opacity: 0.3, fontFamily: 'Georgia, serif' }}>"</div>
              <div style={{ marginBottom: '20px' }}>{[...Array(review.rating)].map((_, j) => <span key={j} style={{ color: '#ff6600', fontSize: '20px' }}>★</span>)}</div>
              <p style={{ fontFamily: "'Roboto Condensed', sans-serif", fontSize: '16px', lineHeight: 1.8, color: '#ccc', marginBottom: '20px' }}>{review.text}</p>
              <div style={{ fontSize: '14px', color: '#666', letterSpacing: '2px', fontFamily: "'Roboto Condensed', sans-serif" }}>— {review.author}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: 'relative', zIndex: 10, padding: '100px 80px', textAlign: 'center', background: 'linear-gradient(180deg, transparent 0%, rgba(255,100,0,0.15) 100%)' }}>
        <h2 style={{ fontSize: 'clamp(36px, 6vw, 64px)', marginBottom: '30px', letterSpacing: '2px' }}>ZAMÓW <span style={{ color: '#ff6600' }}>ZESTAW</span> TERAZ</h2>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', marginBottom: '40px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '18px', color: '#666', textDecoration: 'line-through', fontFamily: "'Roboto Condensed', sans-serif" }}>83,50 zł</div>
          <div style={{ fontSize: '72px', fontWeight: 'bold', color: '#fff', lineHeight: 1 }}>50 <span style={{ fontSize: '36px', color: '#ff6600' }}>zł</span></div>
          <div style={{ background: '#4CAF50', color: '#fff', padding: '10px 20px', fontSize: '16px', fontWeight: 'bold', fontFamily: "'Roboto Condensed', sans-serif" }}>-40%</div>
        </div>
        <button onClick={() => setShowOrderForm(true)} style={{ padding: '25px 80px', fontSize: '24px', fontWeight: 'bold', letterSpacing: '4px', background: 'linear-gradient(135deg, #ff6600 0%, #ff8800 100%)', border: 'none', color: '#000', cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif", boxShadow: '0 15px 50px rgba(255,100,0,0.5)' }}>
          ZAMÓW ZESTAW — 50 ZŁ
        </button>
        <div style={{ marginTop: '30px', fontSize: '14px', color: '#666', fontFamily: "'Roboto Condensed', sans-serif", letterSpacing: '2px' }}>
          🚚 WYSYŁKA W 24H • 📦 30 DNI NA ZWROT • ✅ 12 MIESIĘCY GWARANCJI
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 10, padding: '40px 80px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'Roboto Condensed', sans-serif", fontSize: '12px', color: '#666' }}>
        <div>© 2025 TOOLKIT PRO</div>
        <div style={{ letterSpacing: '2px' }}>TOOL<span style={{ color: '#ff6600' }}>KIT</span>PRO</div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto+Condensed:wght@300;400;700&display=swap');
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        button:hover { transform: translateY(-3px); box-shadow: 0 20px 60px rgba(255,100,0,0.6) !important; }
        a:hover { color: #ff6600 !important; }
        input:focus { border-color: #ff6600 !important; }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
