import React, { useState, useEffect } from 'react';

export default function FlexiBitBundleLandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedPaczkomat, setSelectedPaczkomat] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    zipCode: '',
    courier: ''
  });
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const couriers = [
    { id: 'inpost-paczkomat', name: 'InPost Paczkomat', price: 12, time: '1-2 dni robocze', requiresPaczkomat: true },
    { id: 'inpost-kurier', name: 'InPost Kurier', price: 12, time: '1-2 dni robocze', requiresPaczkomat: false },
    { id: 'dpd', name: 'DPD Kurier', price: 12, time: '1-2 dni robocze', requiresPaczkomat: false },
    { id: 'dhl', name: 'DHL Kurier', price: 12, time: '1-2 dni robocze', requiresPaczkomat: false },
    { id: 'poczta', name: 'Poczta Polska', price: 12, time: '2-4 dni robocze', requiresPaczkomat: false },
    { id: 'orlen', name: 'Orlen Paczka', price: 12, time: '1-3 dni robocze', requiresPaczkomat: false }
  ];

  const basePrice = 50;
  const selectedCourier = couriers.find(c => c.id === formData.courier);
  const totalPrice = basePrice + (selectedCourier?.price || 0);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'courier' && value !== 'inpost-paczkomat') {
      setSelectedPaczkomat('');
    }
  };

  const openPackomatSelector = () => {
    // Załaduj skrypty InPost jeśli jeszcze nie załadowane
    const loadInpostWidget = () => {
      return new Promise((resolve) => {
        if (window.easyPack) {
          resolve();
          return;
        }
        
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://geowidget.easypack24.net/css/easypack.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://geowidget.easypack24.net/js/sdk-for-javascript.js';
        script.onload = () => {
          setTimeout(resolve, 500);
        };
        document.body.appendChild(script);
      });
    };

    loadInpostWidget().then(() => {
      if (window.easyPack) {
        window.easyPack.init({
          defaultLocale: 'pl',
          mapType: 'osm',
          searchType: 'osm',
          points: {
            types: ['parcel_locker']
          },
          map: {
            initialTypes: ['parcel_locker']
          }
        });
        window.easyPack.modalMap(function(point, modal) {
          setSelectedPaczkomat(point.name + ' - ' + point.address.line1 + ', ' + point.address.line2);
          modal.closeModal();
        }, { width: 600, height: 500 });
      } else {
        // Fallback - otwórz stronę InPost
        window.open('https://inpost.pl/znajdz-paczkomat', '_blank');
        alert('Znajdź paczkomat na mapie i wpisz jego nazwę (np. KRA123M)');
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedCourier?.requiresPaczkomat && !selectedPaczkomat) {
      alert('Proszę wybrać Paczkomat z mapy');
      return;
    }
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          paczkomat: selectedPaczkomat || 'Nie dotyczy',
          courier: selectedCourier?.name
        })
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Błąd tworzenia płatności. Spróbuj ponownie.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Błąd:', error);
      alert('Błąd połączenia. Spróbuj ponownie.');
      setIsSubmitting(false);
    }
  };

  const openForm = () => {
    setShowOrderForm(true);
  };

  const closeForm = () => {
    setShowOrderForm(false);
    setOrderSubmitted(false);
  };

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

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    fontSize: '15px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px',
    color: '#fff',
    fontFamily: "'Roboto Condensed', sans-serif",
    outline: 'none'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '11px',
    letterSpacing: '1.5px',
    color: '#888',
    fontFamily: "'Roboto Condensed', sans-serif",
    textTransform: 'uppercase'
  };

  const getCourierEmoji = (id) => {
    const emojis = { 'inpost-paczkomat': '📦', 'inpost-kurier': '📦', 'dpd': '🚚', 'dhl': '✈️', 'poczta': '📮', 'orlen': '⛽' };
    return emojis[id] || '📦';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%)', fontFamily: "'Bebas Neue', 'Impact', sans-serif", color: '#ffffff', overflowX: 'hidden', position: 'relative' }}>
      
      {/* ORDER FORM MODAL */}
      {showOrderForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '10px', overflowY: 'auto' }}>
          <div style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)', border: '1px solid rgba(255,100,0,0.3)', borderRadius: '16px', maxWidth: '520px', width: '100%', margin: '10px 0', position: 'relative', boxShadow: '0 25px 80px rgba(0,0,0,0.5)' }}>
            
            <button onClick={closeForm} style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#888', fontSize: '18px', cursor: 'pointer', zIndex: 10, width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>

            {!orderSubmitted ? (
              <div style={{ padding: 'clamp(20px, 5vw, 35px)' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#ff6600', marginBottom: '6px', fontFamily: "'Roboto Condensed', sans-serif" }}>ZAMÓWIENIE</div>
                  <h2 style={{ fontSize: 'clamp(22px, 6vw, 28px)', margin: '0 0 15px 0', letterSpacing: '2px' }}>ZESTAW TOOLKIT PRO</h2>
                  <img src="/zestaw.png" alt="Zestaw TOOLKIT PRO" style={{ maxHeight: '100px', objectFit: 'contain' }} />
                </div>

                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '13px', color: '#ff6600', marginBottom: '12px', letterSpacing: '2px', fontFamily: "'Roboto Condensed', sans-serif" }}>👤 DANE ODBIORCY</h3>
                    
                    <div style={{ marginBottom: '10px' }}>
                      <label style={labelStyle}>Imię i nazwisko *</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleInputChange} style={inputStyle} placeholder="Jan Kowalski" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                      <div>
                        <label style={labelStyle}>Email *</label>
                        <input type="email" name="email" required value={formData.email} onChange={handleInputChange} style={inputStyle} placeholder="jan@email.com" />
                      </div>
                      <div>
                        <label style={labelStyle}>Telefon *</label>
                        <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} style={inputStyle} placeholder="123 456 789" />
                      </div>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                      <label style={labelStyle}>Ulica i numer *</label>
                      <input type="text" name="street" required value={formData.street} onChange={handleInputChange} style={inputStyle} placeholder="ul. Przykładowa 123/4" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={labelStyle}>Miasto *</label>
                        <input type="text" name="city" required value={formData.city} onChange={handleInputChange} style={inputStyle} placeholder="Warszawa" />
                      </div>
                      <div>
                        <label style={labelStyle}>Kod pocztowy *</label>
                        <input type="text" name="zipCode" required value={formData.zipCode} onChange={handleInputChange} style={inputStyle} placeholder="00-000" />
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '13px', color: '#ff6600', marginBottom: '12px', letterSpacing: '2px', fontFamily: "'Roboto Condensed', sans-serif" }}>🚚 WYBIERZ DOSTAWĘ *</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {couriers.map((courier) => (
                        <label key={courier.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: formData.courier === courier.id ? 'rgba(255,100,0,0.15)' : 'rgba(255,255,255,0.02)', border: `2px solid ${formData.courier === courier.id ? '#ff6600' : 'rgba(255,255,255,0.08)'}`, borderRadius: '10px', cursor: 'pointer' }}>
                          <input type="radio" name="courier" value={courier.id} checked={formData.courier === courier.id} onChange={handleInputChange} style={{ display: 'none' }} />
                          
                          <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${formData.courier === courier.id ? '#ff6600' : '#444'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {formData.courier === courier.id && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff6600' }} />}
                          </div>

                          <span style={{ fontSize: '20px' }}>{getCourierEmoji(courier.id)}</span>

                          <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>{courier.name}</div>
                            <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontSize: '10px', color: '#888' }}>{courier.time}</div>
                          </div>

                          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', color: formData.courier === courier.id ? '#ff6600' : '#fff', fontWeight: 'bold' }}>+{courier.price} zł</div>
                        </label>
                      ))}
                    </div>

                    {formData.courier === 'inpost-paczkomat' && (
                      <div style={{ marginTop: '12px' }}>
                        <button 
                          type="button" 
                          onClick={openPackomatSelector}
                          style={{ 
                            width: '100%', 
                            padding: '16px', 
                            background: selectedPaczkomat ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255,100,0,0.1)', 
                            border: `2px dashed ${selectedPaczkomat ? '#4CAF50' : '#ff6600'}`, 
                            borderRadius: '10px', 
                            color: selectedPaczkomat ? '#4CAF50' : '#ff6600', 
                            cursor: 'pointer', 
                            fontFamily: "'Roboto Condensed', sans-serif", 
                            fontSize: '14px',
                            textAlign: 'center',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {selectedPaczkomat ? (
                            <div>
                              <div style={{ fontSize: '18px', marginBottom: '4px' }}>✓</div>
                              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{selectedPaczkomat}</div>
                              <div style={{ fontSize: '11px', opacity: 0.7 }}>Kliknij aby zmienić</div>
                            </div>
                          ) : (
                            <div>
                              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📍</div>
                              <div style={{ fontWeight: 'bold' }}>WYBIERZ PACZKOMAT Z MAPY</div>
                              <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px' }}>Kliknij aby otworzyć mapę</div>
                            </div>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  <div style={{ background: 'rgba(255,100,0,0.08)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontFamily: "'Roboto Condensed', sans-serif", fontSize: '13px' }}>
                      <span style={{ color: '#888' }}>Zestaw TOOLKIT PRO</span>
                      <span>{basePrice} zł</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontFamily: "'Roboto Condensed', sans-serif", fontSize: '13px' }}>
                      <span style={{ color: '#888' }}>Dostawa {selectedCourier ? `(${selectedCourier.name})` : ''}</span>
                      <span>{selectedCourier ? `${selectedCourier.price} zł` : '— wybierz —'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '20px', fontWeight: 'bold' }}>
                      <span>RAZEM</span>
                      <span style={{ color: '#ff6600' }}>{selectedCourier ? `${totalPrice} zł` : `${basePrice}+ zł`}</span>
                    </div>
                  </div>

                  <button type="submit" disabled={isSubmitting || !formData.courier || (selectedCourier?.requiresPaczkomat && !selectedPaczkomat)} style={{ width: '100%', padding: '16px', fontSize: '17px', fontWeight: 'bold', letterSpacing: '2px', background: (!formData.courier || isSubmitting || (selectedCourier?.requiresPaczkomat && !selectedPaczkomat)) ? '#444' : 'linear-gradient(135deg, #ff6600 0%, #ff8800 100%)', border: 'none', borderRadius: '10px', color: (!formData.courier || isSubmitting) ? '#888' : '#000', cursor: (!formData.courier || isSubmitting || (selectedCourier?.requiresPaczkomat && !selectedPaczkomat)) ? 'not-allowed' : 'pointer', fontFamily: "'Bebas Neue', sans-serif", boxShadow: (formData.courier && !isSubmitting) ? '0 10px 30px rgba(255,100,0,0.3)' : 'none' }}>
                    {isSubmitting ? 'WYSYŁANIE...' : !formData.courier ? 'WYBIERZ DOSTAWĘ' : (selectedCourier?.requiresPaczkomat && !selectedPaczkomat) ? 'WYBIERZ PACZKOMAT' : `ZAMAWIAM — ${totalPrice} ZŁ`}
                  </button>

                  <p style={{ fontSize: '10px', color: '#666', textAlign: 'center', marginTop: '10px', fontFamily: "'Roboto Condensed', sans-serif", lineHeight: 1.5 }}>
                    Po złożeniu zamówienia otrzymasz email z potwierdzeniem i danymi do płatności.
                  </p>
                </form>
              </div>
            ) : (
              <div style={{ padding: '45px 25px', textAlign: 'center' }}>
                <div style={{ fontSize: '60px', marginBottom: '15px' }}>✅</div>
                <h2 style={{ fontSize: 'clamp(22px, 6vw, 28px)', marginBottom: '12px', letterSpacing: '2px' }}>DZIĘKUJEMY!</h2>
                <p style={{ fontSize: '14px', color: '#888', fontFamily: "'Roboto Condensed', sans-serif", lineHeight: 1.6, marginBottom: '15px' }}>
                  Twoje zamówienie zostało przyjęte.<br />
                  Szczegóły wysłaliśmy na: <strong style={{ color: '#ff6600' }}>{formData.email}</strong>
                </p>
                <div style={{ background: 'rgba(255,100,0,0.1)', borderRadius: '10px', padding: '12px', marginBottom: '20px' }}>
                  <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontSize: '12px', color: '#888', marginBottom: '4px' }}>Do zapłaty:</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff6600' }}>{totalPrice} zł</div>
                </div>
                <button onClick={() => { closeForm(); setFormData({ name: '', email: '', phone: '', street: '', city: '', zipCode: '', courier: '' }); setSelectedPaczkomat(''); }} style={{ padding: '10px 30px', fontSize: '13px', background: 'transparent', border: '2px solid #ff6600', borderRadius: '8px', color: '#ff6600', cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px' }}>
                  ZAMKNIJ
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Background effects */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(255,120,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,120,0,0.03) 1px, transparent 1px)', backgroundSize: '50px 50px', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '15%', right: '-15%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(255,100,0,0.12) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Header */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: scrollY > 50 ? 'rgba(10,10,10,0.95)' : 'transparent', backdropFilter: scrollY > 50 ? 'blur(10px)' : 'none', borderBottom: scrollY > 50 ? '1px solid rgba(255,120,0,0.2)' : 'none', transition: 'all 0.3s ease' }}>
        <div style={{ fontSize: 'clamp(18px, 5vw, 26px)', fontWeight: 'bold', letterSpacing: '2px', color: '#ff6600', textShadow: '0 0 20px rgba(255,100,0,0.5)' }}>
          TOOL<span style={{ color: '#fff' }}>KIT</span><span style={{ color: '#ff6600' }}>PRO</span>
        </div>
        <button onClick={openForm} style={{ padding: '8px 16px', fontSize: 'clamp(11px, 3vw, 14px)', background: 'linear-gradient(135deg, #ff6600 0%, #ff8800 100%)', border: 'none', color: '#000', fontWeight: 'bold', cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px', borderRadius: '4px' }}>
          KUP TERAZ
        </button>
      </header>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '90px 20px 50px', textAlign: 'center' }}>
        <div style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(-30px)', transition: 'all 0.8s ease-out', display: 'inline-block', padding: '8px 20px', background: 'linear-gradient(135deg, #ff6600 0%, #ff8800 100%)', marginBottom: '20px', fontSize: 'clamp(11px, 3vw, 14px)', letterSpacing: '1px', fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 'bold', color: '#000', borderRadius: '4px' }}>
          🔥 ZESTAW 2 W 1 — OSZCZĘDŹ 40%
        </div>
        
        <h1 style={{ fontSize: 'clamp(32px, 11vw, 80px)', lineHeight: 0.95, margin: '0 0 15px 0', letterSpacing: '-1px', textTransform: 'uppercase', opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 1s ease-out 0.2s' }}>
          <span style={{ display: 'block' }}>Kompletny</span>
          <span style={{ display: 'block', color: '#ff6600', textShadow: '0 0 40px rgba(255,100,0,0.4)' }}>Zestaw</span>
          <span style={{ display: 'block' }}>Majsterkowicza</span>
        </h1>

        <p style={{ fontSize: 'clamp(13px, 4vw, 18px)', color: '#888', maxWidth: '450px', lineHeight: 1.7, margin: '0 auto 25px', fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 300, padding: '0 15px', opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 1s ease-out 0.4s' }}>
          Elastyczny przedłużacz 290mm + zestaw 3 adapterów nasadkowych. Wszystko czego potrzebujesz w jednym pakiecie.
        </p>

        {/* Product Image */}
        <div style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'scale(1)' : 'scale(0.8)', transition: 'all 1s ease-out 0.6s', margin: '15px 0 30px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: 'clamp(15px, 5vw, 30px)', border: '1px solid rgba(255,100,0,0.2)' }}>
            <img src="/zestaw.png" alt="Zestaw TOOLKIT PRO" style={{ maxHeight: 'clamp(120px, 35vw, 220px)', objectFit: 'contain', filter: 'drop-shadow(0 15px 35px rgba(255,100,0,0.25))' }} />
          </div>
        </div>

        {/* Price */}
        <div style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 1s ease-out 0.8s', marginBottom: '20px' }}>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: 'clamp(14px, 4vw, 18px)', color: '#666', textDecoration: 'line-through', fontFamily: "'Roboto Condensed', sans-serif", marginRight: '12px' }}>83,50 zł</span>
            <span style={{ fontSize: 'clamp(42px, 14vw, 68px)', fontWeight: 'bold', color: '#fff', textShadow: '0 0 30px rgba(255,100,0,0.3)' }}>50 <span style={{ fontSize: 'clamp(22px, 7vw, 34px)', color: '#ff6600' }}>zł</span></span>
          </div>
          <div style={{ display: 'inline-block', background: '#4CAF50', color: '#fff', padding: '6px 18px', fontSize: 'clamp(11px, 3vw, 14px)', letterSpacing: '1px', fontFamily: "'Roboto Condensed', sans-serif", borderRadius: '4px' }}>
            + DOSTAWA 12 ZŁ
          </div>
        </div>

        {/* CTA */}
        <button onClick={openForm} style={{ padding: 'clamp(14px, 4vw, 22px) clamp(35px, 10vw, 70px)', fontSize: 'clamp(15px, 5vw, 22px)', fontWeight: 'bold', letterSpacing: '2px', background: 'linear-gradient(135deg, #ff6600 0%, #ff8800 100%)', border: 'none', borderRadius: '8px', color: '#000', cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif", boxShadow: '0 15px 45px rgba(255,100,0,0.5)', opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 1s ease-out 1s' }}>
          KUP ZESTAW
        </button>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', opacity: 0.4 }}>
          <div style={{ width: '24px', height: '40px', border: '2px solid #ff6600', borderRadius: '12px' }} />
        </div>
      </section>

      {/* Bundle Section */}
      <section id="bundle" style={{ position: 'relative', zIndex: 10, padding: 'clamp(40px, 10vw, 80px) 15px', background: 'linear-gradient(180deg, rgba(255,100,0,0.05) 0%, transparent 100%)', opacity: visibleSections.bundle ? 1 : 0, transform: visibleSections.bundle ? 'translateY(0)' : 'translateY(50px)', transition: 'all 0.8s ease-out' }}>
        <h2 style={{ fontSize: 'clamp(24px, 7vw, 44px)', textAlign: 'center', marginBottom: 'clamp(25px, 7vw, 50px)', letterSpacing: '1px' }}>
          CO ZAWIERA <span style={{ color: '#ff6600' }}>ZESTAW</span>?
        </h2>

        <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
          <img src="/zestaw.png" alt="Zestaw TOOLKIT PRO" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', marginBottom: '30px' }} />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', textAlign: 'left' }}>
            <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,100,0,0.3)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ color: '#ff6600', fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', fontFamily: "'Roboto Condensed', sans-serif" }}>PRZEDŁUŻACZ ELASTYCZNY</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: "'Roboto Condensed', sans-serif", fontSize: '12px', color: '#aaa', lineHeight: 1.8 }}>
                <li>✓ Długość: 290mm</li>
                <li>✓ Gniazdo: 1/4" Hex</li>
                <li>✓ Elastyczność 360°</li>
              </ul>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,150,255,0.3)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ color: '#0096ff', fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', fontFamily: "'Roboto Condensed', sans-serif" }}>ADAPTERY 3 SZT.</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: "'Roboto Condensed', sans-serif", fontSize: '12px', color: '#aaa', lineHeight: 1.8 }}>
                <li>✓ 1/4", 3/8", 1/2"</li>
                <li>✓ Trzpień Hex 1/4"</li>
                <li>✓ Stal chromowana</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '400px', margin: '35px auto 0', background: 'linear-gradient(135deg, rgba(255,100,0,0.1) 0%, rgba(0,150,255,0.1) 100%)', border: '2px solid #ff6600', borderRadius: '16px', padding: 'clamp(20px, 5vw, 35px)', textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(20px, 5vw, 28px)', color: '#666', textDecoration: 'line-through', marginBottom: '5px' }}>83,50 zł</div>
          <div style={{ fontSize: 'clamp(40px, 12vw, 60px)', fontWeight: 'bold', lineHeight: 1, marginBottom: '10px' }}>50 <span style={{ fontSize: 'clamp(20px, 6vw, 30px)', color: '#ff6600' }}>zł</span></div>
          <div style={{ display: 'inline-block', background: '#4CAF50', color: '#fff', padding: '6px 16px', fontSize: 'clamp(12px, 3.5vw, 14px)', fontFamily: "'Roboto Condensed', sans-serif", marginBottom: '15px', borderRadius: '4px' }}>OSZCZĘDZASZ 33,50 zł!</div>
          <br />
          <button onClick={openForm} style={{ marginTop: '10px', padding: '12px 35px', fontSize: 'clamp(13px, 4vw, 16px)', fontWeight: 'bold', letterSpacing: '2px', background: 'linear-gradient(135deg, #ff6600 0%, #ff8800 100%)', border: 'none', borderRadius: '8px', color: '#000', cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif", boxShadow: '0 10px 25px rgba(255,100,0,0.3)' }}>
            ZAMÓW TERAZ
          </button>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ position: 'relative', zIndex: 10, padding: 'clamp(40px, 10vw, 80px) 15px', opacity: visibleSections.features ? 1 : 0, transform: visibleSections.features ? 'translateY(0)' : 'translateY(50px)', transition: 'all 0.8s ease-out' }}>
        <h2 style={{ fontSize: 'clamp(24px, 7vw, 44px)', textAlign: 'center', marginBottom: 'clamp(25px, 7vw, 50px)', letterSpacing: '2px' }}>
          <span style={{ color: '#ff6600' }}>DLACZEGO</span> TEN ZESTAW?
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', maxWidth: '900px', margin: '0 auto' }}>
          {features.map((feature, index) => (
            <div key={index} style={{ padding: 'clamp(18px, 5vw, 35px) clamp(12px, 3vw, 25px)', background: activeFeature === index ? 'linear-gradient(135deg, rgba(255,100,0,0.15) 0%, rgba(255,100,0,0.05) 100%)' : 'rgba(255,255,255,0.02)', border: `1px solid ${activeFeature === index ? '#ff6600' : 'rgba(255,255,255,0.1)'}`, borderRadius: '12px', textAlign: 'center', transform: activeFeature === index ? 'scale(1.03)' : 'scale(1)', transition: 'all 0.5s ease' }}>
              <div style={{ fontSize: 'clamp(28px, 9vw, 42px)', marginBottom: '10px', filter: activeFeature === index ? 'none' : 'grayscale(1)' }}>{feature.icon}</div>
              <h3 style={{ fontSize: 'clamp(14px, 4.5vw, 20px)', marginBottom: '6px', color: activeFeature === index ? '#ff6600' : '#fff', letterSpacing: '1px' }}>{feature.title}</h3>
              <p style={{ fontSize: 'clamp(10px, 3vw, 13px)', color: '#888', fontFamily: "'Roboto Condensed', sans-serif", margin: 0 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" style={{ position: 'relative', zIndex: 10, padding: 'clamp(40px, 10vw, 80px) 15px', background: 'rgba(255,100,0,0.02)', opacity: visibleSections.reviews ? 1 : 0, transform: visibleSections.reviews ? 'translateY(0)' : 'translateY(50px)', transition: 'all 0.8s ease-out' }}>
        <h2 style={{ fontSize: 'clamp(24px, 7vw, 44px)', textAlign: 'center', marginBottom: 'clamp(25px, 7vw, 50px)', letterSpacing: '1px' }}>
          CO MÓWIĄ <span style={{ color: '#ff6600' }}>KLIENCI</span>
        </h2>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', maxWidth: '1100px', margin: '0 auto' }}>
          {reviews.map((review, i) => (
            <div key={i} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: 'clamp(20px, 5vw, 35px)', maxWidth: '300px', width: '100%' }}>
              <div style={{ marginBottom: '12px' }}>{[...Array(review.rating)].map((_, j) => <span key={j} style={{ color: '#ff6600', fontSize: '16px' }}>★</span>)}</div>
              <p style={{ fontFamily: "'Roboto Condensed', sans-serif", fontSize: 'clamp(12px, 3.5vw, 15px)', lineHeight: 1.7, color: '#ccc', marginBottom: '12px' }}>{review.text}</p>
              <div style={{ fontSize: '12px', color: '#666', letterSpacing: '1px', fontFamily: "'Roboto Condensed', sans-serif" }}>— {review.author}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '35px', flexWrap: 'wrap' }}>
          {[{ value: '4.9/5', label: 'OCENA' }, { value: '99%', label: 'POZYTYWNYCH' }, { value: '2000+', label: 'SPRZEDANYCH' }].map((stat, i) => (
            <div key={i} style={{ padding: '12px 20px', background: 'rgba(255,100,0,0.1)', border: '1px solid #ff6600', borderRadius: '8px', textAlign: 'center', minWidth: '100px' }}>
              <span style={{ fontSize: 'clamp(18px, 5vw, 24px)', fontWeight: 'bold' }}>{stat.value}</span>
              <span style={{ display: 'block', fontSize: '9px', color: '#888', letterSpacing: '1px', fontFamily: "'Roboto Condensed', sans-serif", marginTop: '3px' }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ position: 'relative', zIndex: 10, padding: 'clamp(50px, 12vw, 100px) 15px', textAlign: 'center', background: 'linear-gradient(180deg, transparent 0%, rgba(255,100,0,0.12) 100%)' }}>
        <h2 style={{ fontSize: 'clamp(24px, 7vw, 50px)', marginBottom: '20px', letterSpacing: '1px' }}>
          ZAMÓW <span style={{ color: '#ff6600' }}>ZESTAW</span> TERAZ
        </h2>
        
        <div style={{ marginBottom: '25px' }}>
          <span style={{ fontSize: 'clamp(14px, 4vw, 18px)', color: '#666', textDecoration: 'line-through', fontFamily: "'Roboto Condensed', sans-serif", marginRight: '12px' }}>83,50 zł</span>
          <span style={{ fontSize: 'clamp(44px, 14vw, 68px)', fontWeight: 'bold', color: '#fff' }}>50 <span style={{ fontSize: 'clamp(22px, 7vw, 34px)', color: '#ff6600' }}>zł</span></span>
        </div>

        <button onClick={openForm} style={{ padding: 'clamp(16px, 5vw, 28px) clamp(40px, 12vw, 90px)', fontSize: 'clamp(16px, 5vw, 26px)', fontWeight: 'bold', letterSpacing: '3px', background: 'linear-gradient(135deg, #ff6600 0%, #ff8800 100%)', border: 'none', borderRadius: '10px', color: '#000', cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif", boxShadow: '0 20px 55px rgba(255,100,0,0.5)' }}>
          ZAMÓW — 62 ZŁ
        </button>
        
        <div style={{ marginTop: '20px', fontSize: 'clamp(10px, 3vw, 13px)', color: '#666', fontFamily: "'Roboto Condensed', sans-serif", letterSpacing: '1px' }}>
          🚚 WYSYŁKA W 24H • 📦 30 DNI ZWROT • ✅ GWARANCJA
        </div>

        <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', opacity: 0.5 }}>
          {['BLIK', 'Przelew', 'Karta', 'Apple Pay', 'Google Pay'].map((method, i) => (
            <span key={i} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', fontSize: '10px', fontFamily: "'Roboto Condensed', sans-serif", letterSpacing: '1px' }}>{method}</span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 10, padding: '25px 15px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', fontFamily: "'Roboto Condensed', sans-serif", fontSize: '11px', color: '#666' }}>
        <div>© 2025 TOOLKIT PRO</div>
      </footer>

      {/* Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto+Condensed:wght@300;400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        input:focus { border-color: #ff6600 !important; background: rgba(255,100,0,0.05) !important; }
        button:hover { transform: translateY(-2px); }
      `}</style>
    </div>
  );
}
