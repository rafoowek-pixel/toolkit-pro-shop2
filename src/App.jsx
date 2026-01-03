import React, { useState, useEffect } from 'react';

export default function FlexiBitBundleLandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedPaczkomat, setSelectedPaczkomat] = useState(null);
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
    { 
      id: 'inpost-paczkomat', 
      name: 'InPost Paczkomat', 
      price: 12, 
      time: '1-2 dni robocze',
      logo: 'https://inpost.pl/themes/inpost/logo.svg',
      requiresPaczkomat: true
    },
    { 
      id: 'inpost-kurier', 
      name: 'InPost Kurier', 
      price: 16, 
      time: '1-2 dni robocze',
      logo: 'https://inpost.pl/themes/inpost/logo.svg',
      requiresPaczkomat: false
    },
    { 
      id: 'dpd', 
      name: 'DPD Kurier', 
      price: 18, 
      time: '1-2 dni robocze',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/DPD_logo_%282015%29.svg',
      requiresPaczkomat: false
    },
    { 
      id: 'dhl', 
      name: 'DHL Kurier', 
      price: 20, 
      time: '1-2 dni robocze',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/DHL_Logo.svg',
      requiresPaczkomat: false
    },
    { 
      id: 'poczta', 
      name: 'Poczta Polska', 
      price: 14, 
      time: '2-4 dni robocze',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/POL_Poczta_Polska_Logo.svg',
      requiresPaczkomat: false
    },
    { 
      id: 'orlen', 
      name: 'Orlen Paczka', 
      price: 11, 
      time: '1-3 dni robocze',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/PKN_Orlen_logo.svg',
      requiresPaczkomat: false
    }
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
      setSelectedPaczkomat(null);
    }
  };

  const openPackomatSelector = () => {
    // Dynamicznie ładujemy skrypt InPost Geowidget
    if (!document.getElementById('inpost-geowidget-script')) {
      const script = document.createElement('script');
      script.id = 'inpost-geowidget-script';
      script.src = 'https://geowidget.inpost.pl/inpost-geowidget.js';
      script.async = true;
      document.body.appendChild(script);

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://geowidget.inpost.pl/inpost-geowidget.css';
      document.head.appendChild(link);

      script.onload = () => {
        setTimeout(() => openModal(), 300);
      };
    } else {
      openModal();
    }

    function openModal() {
      if (window.easyPack) {
        window.easyPack.init({
          mapType: 'osm',
          searchType: 'osm',
          points: { types: ['parcel_locker'] },
          map: { initialTypes: ['parcel_locker'] }
        });
        window.easyPack.modalMap(function(point, modal) {
          setSelectedPaczkomat(point);
          modal.closeModal();
        }, { width: 500, height: 600 });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedCourier?.requiresPaczkomat && !selectedPaczkomat) {
      alert('Proszę wybrać Paczkomat z mapy');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://formspree.io/f/mpqwqqwn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          paczkomat: selectedPaczkomat 
            ? `${selectedPaczkomat.name} - ${selectedPaczkomat.address?.line1}, ${selectedPaczkomat.address?.line2}` 
            : 'Nie dotyczy',
          wybranyKurier: selectedCourier?.name,
          kosztDostawy: selectedCourier?.price + ' zł',
          cenaProduktu: basePrice + ' zł',
          SUMA: totalPrice + ' zł',
          produkt: 'Zestaw TOOLKIT PRO - Elastyczny przedłużacz + Adaptery nasadkowe',
          dataZamowienia: new Date().toLocaleString('pl-PL')
        })
      });
      if (response.ok) setOrderSubmitted(true);
    } catch (error) {
      console.error('Błąd wysyłki:', error);
    }
    setIsSubmitting(false);
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
    outline: 'none',
    transition: 'all 0.3s ease'
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

  // Emoji logo jako fallback
  const getCourierEmoji = (id) => {
    const emojis = {
      'inpost-paczkomat': '📦',
      'inpost-kurier': '📦',
      'dpd': '🚚',
      'dhl': '✈️',
      'poczta': '📮',
      'orlen': '⛽'
    };
    return emojis[id] || '📦';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0d0d0d 100%)',
      fontFamily: "'Bebas Neue', 'Impact', sans-serif",
      color: '#ffffff',
      overflowX: 'hidden',
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
          background: 'rgba(0,0,0,0.95)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '10px',
          overflowY: 'auto'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
            border: '1px solid rgba(255,100,0,0.3)',
            borderRadius: '16px',
            maxWidth: '520px',
            width: '100%',
            margin: '10px 0',
            position: 'relative',
            boxShadow: '0 25px 80px rgba(0,0,0,0.5)'
          }}>
            {/* Close button */}
            <button
              onClick={() => { setShowOrderForm(false); setOrderSubmitted(false); }}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#888',
                fontSize: '18px',
                cursor: 'pointer',
                zIndex: 10,
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >✕</button>

            {!orderSubmitted ? (
              <div style={{ padding: 'clamp(20px, 5vw, 35px)' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#ff6600', marginBottom: '6px', fontFamily: "'Roboto Condensed', sans-serif" }}>
                    ZAMÓWIENIE
                  </div>
                  <h2 style={{ fontSize: 'clamp(22px, 6vw, 28px)', margin: '0 0 10px 0', letterSpacing: '2px' }}>
                    ZESTAW TOOLKIT PRO
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <img src="/przedluzacz.png" alt="Przedłużacz" style={{ height: '40px', objectFit: 'contain' }} />
                    <span style={{ color: '#ff6600', fontSize: '20px' }}>+</span>
                    <img src="/adaptery.png" alt="Adaptery" style={{ height: '35px', objectFit: 'contain' }} />
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Personal Data */}
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '13px', color: '#ff6600', marginBottom: '12px', letterSpacing: '2px', fontFamily: "'Roboto Condensed', sans-serif", display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>👤</span> DANE ODBIORCY
                    </h3>
                    
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

                  {/* Courier Selection */}
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '13px', color: '#ff6600', marginBottom: '12px', letterSpacing: '2px', fontFamily: "'Roboto Condensed', sans-serif", display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>🚚</span> WYBIERZ DOSTAWĘ *
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {couriers.map((courier) => (
                        <label 
                          key={courier.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '12px 14px',
                            background: formData.courier === courier.id ? 'rgba(255,100,0,0.15)' : 'rgba(255,255,255,0.02)',
                            border: `2px solid ${formData.courier === courier.id ? '#ff6600' : 'rgba(255,255,255,0.08)'}`,
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <input
                            type="radio"
                            name="courier"
                            value={courier.id}
                            checked={formData.courier === courier.id}
                            onChange={handleInputChange}
                            style={{ display: 'none' }}
                          />
                          
                          {/* Radio circle */}
                          <div style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: `2px solid ${formData.courier === courier.id ? '#ff6600' : '#444'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {formData.courier === courier.id && (
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff6600' }} />
                            )}
                          </div>

                          {/* Logo */}
                          <div style={{
                            width: '48px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#fff',
                            borderRadius: '4px',
                            padding: '3px',
                            flexShrink: 0,
                            overflow: 'hidden'
                          }}>
                            <img 
                              src={courier.logo} 
                              alt={courier.name}
                              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                            <span style={{ 
                              display: 'none', 
                              fontSize: '16px',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '100%',
                              height: '100%'
                            }}>{getCourierEmoji(courier.id)}</span>
                          </div>

                          {/* Name & time */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontSize: '13px', fontWeight: 'bold', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {courier.name}
                            </div>
                            <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontSize: '10px', color: '#888' }}>
                              {courier.time}
                            </div>
                          </div>

                          {/* Price */}
                          <div style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: '16px',
                            color: formData.courier === courier.id ? '#ff6600' : '#fff',
                            fontWeight: 'bold',
                            flexShrink: 0
                          }}>
                            +{courier.price} zł
                          </div>
                        </label>
                      ))}
                    </div>

                    {/* Paczkomat selector button */}
                    {formData.courier === 'inpost-paczkomat' && (
                      <div style={{ marginTop: '12px' }}>
                        <button
                          type="button"
                          onClick={openPackomatSelector}
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            background: selectedPaczkomat ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255,100,0,0.08)',
                            border: `2px dashed ${selectedPaczkomat ? '#4CAF50' : '#ff6600'}`,
                            borderRadius: '10px',
                            color: selectedPaczkomat ? '#4CAF50' : '#ff6600',
                            cursor: 'pointer',
                            fontFamily: "'Roboto Condensed', sans-serif",
                            fontSize: '13px',
                            textAlign: 'left',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {selectedPaczkomat ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '22px' }}>✓</span>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{selectedPaczkomat.name}</div>
                                <div style={{ fontSize: '11px', opacity: 0.8 }}>
                                  {selectedPaczkomat.address?.line1}, {selectedPaczkomat.address?.line2}
                                </div>
                              </div>
                              <span style={{ fontSize: '11px', opacity: 0.7 }}>Zmień →</span>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '18px' }}>📍</span>
                              <span>Kliknij aby wybrać Paczkomat z mapy</span>
                            </div>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div style={{
                    background: 'rgba(255,100,0,0.08)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '16px'
                  }}>
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

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.courier || (selectedCourier?.requiresPaczkomat && !selectedPaczkomat)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      fontSize: '17px',
                      fontWeight: 'bold',
                      letterSpacing: '2px',
                      background: (!formData.courier || isSubmitting || (selectedCourier?.requiresPaczkomat && !selectedPaczkomat))
                        ? '#444'
                        : 'linear-gradient(135deg, #ff6600 0%, #ff8800 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      color: (!formData.courier || isSubmitting) ? '#888' : '#000',
                      cursor: (!formData.courier || isSubmitting || (selectedCourier?.requiresPaczkomat && !selectedPaczkomat)) ? 'not-allowed' : 'pointer',
                      fontFamily: "'Bebas Neue', sans-serif",
                      boxShadow: (formData.courier && !isSubmitting) ? '0 10px 30px rgba(255,100,0,0.3)' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {isSubmitting ? 'WYSYŁANIE...' : 
                     !formData.courier ? 'WYBIERZ DOSTAWĘ' :
                     (selectedCourier?.requiresPaczkomat && !selectedPaczkomat) ? 'WYBIERZ PACZKOMAT' :
                     `ZAMAWIAM — ${totalPrice} ZŁ`}
                  </button>

                  <p style={{ fontSize: '10px', color: '#666', textAlign: 'center', marginTop: '10px', fontFamily: "'Roboto Condensed', sans-serif", lineHeight: 1.5 }}>
                    Po złożeniu zamówienia otrzymasz email z potwierdzeniem<br />i danymi do płatności (BLIK, przelew, karta).
                  </p>
                </form>
              </div>
            ) : (
              /* Success message */
              <div style={{ padding: '45px 25px', textAlign: 'center' }}>
                <div style={{ fontSize: '60px', marginBottom: '15px' }}>✅</div>
                <h2 style={{ fontSize: 'clamp(22px, 6vw, 28px)', marginBottom: '12px', letterSpacing: '2px' }}>DZIĘKUJEMY!</h2>
                <p style={{ fontSize: '14px', color: '#888', fontFamily: "'Roboto Condensed', sans-serif", lineHeight: 1.6, marginBottom: '15px' }}>
                  Twoje zamówienie zostało przyjęte.<br />
                  Szczegóły i dane do płatności wysłaliśmy na:<br />
                  <strong style={{ color: '#ff6600' }}>{formData.email}</strong>
                </p>
                <div style={{ background: 'rgba(255,100,0,0.1)', borderRadius: '10px', padding: '12px', marginBottom: '20px' }}>
                  <div style={{ fontFamily: "'Roboto Condensed', sans-serif", fontSize: '12px', color: '#888', marginBottom: '4px' }}>Do zapłaty:</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff6600' }}>{totalPrice} zł</div>
                </div>
                <button
                  onClick={() => { 
                    setShowOrderForm(false); 
                    setOrderSubmitted(false); 
                    setFormData({ name: '', email: '', phone: '', street: '', city: '', zipCode: '', courier: '' });
                    setSelectedPaczkomat(null);
                  }}
                  style={{ padding: '10px 30px', fontSize: '13px', background: 'transparent', border: '2px solid #ff6600', borderRadius: '8px', color: '#ff6600', cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px' }}
                >
                  ZAMKNIJ
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Background effects */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `linear-gradient(rgba(255,120,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,120,0,0.03) 1px, transparent 1px)`, backgroundSize: '50px 50px', pointerEvents: 'none', zIndex: 0, transform: `translateY(${scrollY * 0.1}px)` }} />

      {[...Array(5)].map((_, i) => (
        <div key={i} style={{ position: 'fixed', width: `${15 + i * 8}px`, height: `${15 + i * 8}px`, background: `radial-gradient(circle, rgba(255,100,0,${0.1 + i * 0.03}) 0%, transparent 70%)`, borderRadius: '50%', top: `${10 + i * 18}%`, left: `${5 + i * 20}%`, pointerEvents: 'none', zIndex: 1, animation: `float${i % 3} ${5 + i}s ease-in-out infinite`, filter: 'blur(3px)' }} />
      ))}

      <div style={{ position: 'fixed', top: '15%', right: '-15%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(255,100,0,0.12) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0, transform: `translateY(${scrollY * 0.15}px)` }} />

      {/* Fixed Header */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: scrollY > 50 ? 'rgba(10,10,10,0.95)' : 'transparent', backdropFilter: scrollY > 50 ? 'blur(10px)' : 'none', borderBottom: scrollY > 50 ? '1px solid rgba(255,120,0,0.2)' : 'none', transition: 'all 0.3s ease' }}>
        <div style={{ fontSize: 'clamp(18px, 5vw, 26px)', fontWeight: 'bold', letterSpacing: '2px', color: '#ff6600', textShadow: '0 0 20px rgba(255,100,0,0.5)' }}>
          TOOL<span style={{ color: '#fff' }}>KIT</span><span style={{ color: '#ff6600' }}>PRO</span>
        </div>
        <button onClick={() => setShowOrderForm(true)} style={{ padding: '8px 16px', fontSize: 'clamp(11px, 3vw, 14px)', background: 'linear-gradient(135deg, #ff6600 0%, #ff8800 100%)', border: 'none', color: '#000', fontWeight: 'bold', cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px', borderRadius: '4px' }}>
          KUP TERAZ
        </button>
      </header>

      {/* Hero Section */}
      <section style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '90px 20px 50px', textAlign: 'center' }}>
        <div style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(-30px)', transition: 'all 0.8s ease-out', display: 'inline-block', padding: '8px 20px', background: 'linear-gradient(135deg, #ff6600 0%, #ff8800 100%)', marginBottom: '20px', fontSize: 'clamp(11px, 3vw, 14px)', letterSpacing: '1px', fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 'bold', color: '#000', borderRadius: '4px' }}>
          🔥 ZESTAW 2 W 1 — OSZCZĘDŹ 40%
        </div>
        
        <h1 style={{ fontSize: 'clamp(32px, 11vw, 80px)', lineHeight: 0.95, margin: '0 0 15px 0', letterSpacing: '-1px', textTransform: 'uppercase', opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 1s ease-out 0.2s' }}>
          <span style={{ display: 'block' }}>Kompletny</span>
          <span style={{ display: 'block', color: '#ff6600', textShadow: '0 0 40px rgba(255,100,0,0.4)', animation: 'glow 2s ease-in-out infinite alternate' }}>Zestaw</span>
          <span style={{ display: 'block' }}>Majsterkowicza</span>
        </h1>

        <p style={{ fontSize: 'clamp(13px, 4vw, 18px)', color: '#888', maxWidth: '450px', lineHeight: 1.7, margin: '0 auto 25px', fontFamily: "'Roboto Condensed', sans-serif", fontWeight: 300, padding: '0 15px', opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 1s ease-out 0.4s' }}>
          Elastyczny przedłużacz 290mm + zestaw 3 adapterów nasadkowych. 
          Wszystko czego potrzebujesz w jednym pakiecie.
        </p>

        {/* Product Images */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(10px, 3vw, 20px)', margin: '15px 0 30px', flexWrap: 'wrap', opacity: isVisible ? 1 : 0, transform: isVisible ? 'scale(1)' : 'scale(0.8)', transition: 'all 1s ease-out 0.6s' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '15px', padding: 'clamp(12px, 4vw, 20px)', border: '1px solid rgba(255,100,0,0.2)', animation: 'floatProduct 3s ease-in-out infinite' }}>
            <img src="/przedluzacz.png" alt="Elastyczny przedłużacz" style={{ height: 'clamp(80px, 22vw, 160px)', objectFit: 'contain', filter: 'drop-shadow(0 10px 25px rgba(255,100,0,0.3))' }} />
          </div>
          <div style={{ fontSize: 'clamp(24px, 8vw, 42px)', color: '#ff6600', fontWeight: 'bold', textShadow: '0 0 25px rgba(255,100,0,0.5)', animation: 'pulse 1.5s ease-in-out infinite' }}>+</div>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '15px', padding: 'clamp(12px, 4vw, 20px)', border: '1px solid rgba(0,150,255,0.2)', animation: 'floatProduct 3s ease-in-out infinite 0.5s' }}>
            <img src="/adaptery.png" alt="Adaptery nasadkowe" style={{ height: 'clamp(65px, 18vw, 130px)', objectFit: 'contain', filter: 'drop-shadow(0 10px 25px rgba(0,150,255,0.3))' }} />
          </div>
        </div>

        {/* Price */}
        <div style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 1s ease-out 0.8s', marginBottom: '20px' }}>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: 'clamp(14px, 4vw, 18px)', color: '#666', textDecoration: 'line-through', fontFamily: "'Roboto Condensed', sans-serif", marginRight: '12px' }}>83,50 zł</span>
            <span style={{ fontSize: 'clamp(42px, 14vw, 68px)', fontWeight: 'bold', color: '#fff', textShadow: '0 0 30px rgba(255,100,0,0.3)' }}>50 <span style={{ fontSize: 'clamp(22px, 7vw, 34px)', color: '#ff6600' }}>zł</span></span>
          </div>
          <div style={{ display: 'inline-block', background: '#4CAF50', color: '#fff', padding: '6px 18px', fontSize: 'clamp(11px, 3vw, 14px)', letterSpacing: '1px', fontFamily: "'Roboto Condensed', sans-serif", borderRadius: '4px' }}>
            + KOSZT DOSTAWY OD 11 ZŁ
          </div>
        </div>

        {/* CTA Button */}
        <button onClick={() => setShowOrderForm(true)} className="main-cta" style={{ padding: 'clamp(14px, 4vw, 22px) clamp(35px, 10vw, 70px)', fontSize: 'clamp(15px, 5vw, 22px)', fontWeight: 'bold', letterSpacing: '2px', background: 'linear-gradient(135deg, #ff6600 0%, #ff8800 100%)', border: 'none', borderRadius: '8px', color: '#000', cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif", boxShadow: '0 15px 45px rgba(255,100,0,0.5)', position: 'relative', overflow: 'hidden', opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 1s ease-out 1s' }}>
          <span style={{ position: 'relative', zIndex: 1 }}>KUP ZESTAW</span>
          <div className="btn-shine" />
        </button>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', animation: 'bounce 2s infinite', opacity: 0.4 }}>
          <div style={{ width: '24px', height: '40px', border: '2px solid #ff6600', borderRadius: '12px', position: 'relative' }}>
            <div style={{ width: '4px', height: '8px', background: '#ff6600', borderRadius: '2px', position: 'absolute', top: '6px', left: '50%', transform: 'translateX(-50%)', animation: 'scrollDown 2s infinite' }} />
          </div>
        </div>
      </section>

      {/* Bundle Section */}
      <section id="bundle" style={{ position: 'relative', zIndex: 10, padding: 'clamp(40px, 10vw, 80px) 15px', background: 'linear-gradient(180deg, rgba(255,100,0,0.05) 0%, transparent 100%)', opacity: visibleSections.bundle ? 1 : 0, transform: visibleSections.bundle ? 'translateY(0)' : 'translateY(50px)', transition: 'all 0.8s ease-out' }}>
        <h2 style={{ fontSize: 'clamp(24px, 7vw, 44px)', textAlign: 'center', marginBottom: 'clamp(25px, 7vw, 50px)', letterSpacing: '1px' }}>
          CO ZAWIERA <span style={{ color: '#ff6600' }}>ZESTAW</span>?
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '15px', maxWidth: '900px', margin: '0 auto' }}>
          <div className="product-card" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,100,0,0.3)', borderRadius: '12px', padding: 'clamp(20px, 5vw, 35px)', position: 'relative', transition: 'all 0.3s ease' }}>
            <div style={{ position: 'absolute', top: '-1px', left: '20px', background: '#ff6600', color: '#000', padding: '4px 12px', fontSize: '11px', fontWeight: 'bold', borderRadius: '0 0 6px 6px', fontFamily: "'Roboto Condensed', sans-serif" }}>#1</div>
            <div style={{ fontSize: 'clamp(16px, 5vw, 22px)', marginBottom: '12px', letterSpacing: '1px', marginTop: '8px' }}>ELASTYCZNY PRZEDŁUŻACZ</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
              <img src="/przedluzacz.png" alt="Elastyczny przedłużacz" style={{ height: 'clamp(70px, 18vw, 100px)', objectFit: 'contain' }} />
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: "'Roboto Condensed', sans-serif", fontSize: 'clamp(11px, 3.5vw, 14px)', color: '#aaa', lineHeight: 1.9 }}>
              <li>✓ Długość: 290mm</li>
              <li>✓ Gniazdo: 1/4" Hex (6.35mm)</li>
              <li>✓ Materiał: Stal stopowa</li>
              <li>✓ Pełna elastyczność 360°</li>
            </ul>
          </div>

          <div className="product-card" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,150,255,0.3)', borderRadius: '12px', padding: 'clamp(20px, 5vw, 35px)', position: 'relative', transition: 'all 0.3s ease' }}>
            <div style={{ position: 'absolute', top: '-1px', left: '20px', background: '#0096ff', color: '#000', padding: '4px 12px', fontSize: '11px', fontWeight: 'bold', borderRadius: '0 0 6px 6px', fontFamily: "'Roboto Condensed', sans-serif" }}>#2</div>
            <div style={{ fontSize: 'clamp(16px, 5vw, 22px)', marginBottom: '12px', letterSpacing: '1px', marginTop: '8px' }}>ADAPTERY NASADKOWE 3 SZT.</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
              <img src="/adaptery.png" alt="Adaptery nasadkowe" style={{ height: 'clamp(70px, 18vw, 100px)', objectFit: 'contain' }} />
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: "'Roboto Condensed', sans-serif", fontSize: 'clamp(11px, 3.5vw, 14px)', color: '#aaa', lineHeight: 1.9 }}>
              <li>✓ Rozmiary: 1/4", 3/8", 1/2"</li>
              <li>✓ Trzpień: Hex 1/4"</li>
              <li>✓ Materiał: Stal chromowana</li>
              <li>✓ Długość: ~50mm każdy</li>
            </ul>
          </div>
        </div>

        <div style={{ maxWidth: '420px', margin: '35px auto 0', background: 'linear-gradient(135deg, rgba(255,100,0,0.1) 0%, rgba(0,150,255,0.1) 100%)', border: '2px solid #ff6600', borderRadius: '16px', padding: 'clamp(20px, 5vw, 35px)', textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(22px, 6vw, 30px)', color: '#666', textDecoration: 'line-through', marginBottom: '8px' }}>83,50 zł</div>
          <div style={{ fontSize: 'clamp(44px, 14vw, 68px)', fontWeight: 'bold', lineHeight: 1, marginBottom: '12px' }}>50 <span style={{ fontSize: 'clamp(22px, 7vw, 34px)', color: '#ff6600' }}>zł</span></div>
          <div style={{ display: 'inline-block', background: '#4CAF50', color: '#fff', padding: '8px 20px', fontSize: 'clamp(13px, 4vw, 16px)', letterSpacing: '1px', fontFamily: "'Roboto Condensed', sans-serif", marginBottom: '15px', borderRadius: '4px' }}>OSZCZĘDZASZ 33,50 zł!</div>
          <br />
          <button onClick={() => setShowOrderForm(true)} className="main-cta" style={{ marginTop: '10px', padding: '12px 35px', fontSize: 'clamp(13px, 4vw, 16px)', fontWeight: 'bold', letterSpacing: '2px', background: 'linear-gradient(135deg, #ff6600 0%, #ff8800 100%)', border: 'none', borderRadius: '8px', color: '#000', cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif", boxShadow: '0 10px 25px rgba(255,100,0,0.3)', position: 'relative', overflow: 'hidden' }}>
            ZAMÓW TERAZ
            <div className="btn-shine" />
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
            <div key={index} className="feature-card" style={{ padding: 'clamp(18px, 5vw, 35px) clamp(12px, 3vw, 25px)', background: activeFeature === index ? 'linear-gradient(135deg, rgba(255,100,0,0.15) 0%, rgba(255,100,0,0.05) 100%)' : 'rgba(255,255,255,0.02)', border: `1px solid ${activeFeature === index ? '#ff6600' : 'rgba(255,255,255,0.1)'}`, borderRadius: '12px', textAlign: 'center', transform: activeFeature === index ? 'scale(1.03)' : 'scale(1)', transition: 'all 0.5s ease' }}>
              <div style={{ fontSize: 'clamp(28px, 9vw, 42px)', marginBottom: '10px', filter: activeFeature === index ? 'none' : 'grayscale(1)', transition: 'all 0.3s ease' }}>{feature.icon}</div>
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
            <div key={i} className="review-card" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: 'clamp(20px, 5vw, 35px)', maxWidth: '300px', width: '100%', position: 'relative', transition: 'all 0.3s ease' }}>
              <div style={{ position: 'absolute', top: '-8px', left: '15px', fontSize: '40px', color: '#ff6600', opacity: 0.3, fontFamily: 'Georgia, serif' }}>"</div>
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

        <button onClick={() => setShowOrderForm(true)} className="main-cta final-cta" style={{ padding: 'clamp(16px, 5vw, 28px) clamp(40px, 12vw, 90px)', fontSize: 'clamp(16px, 5vw, 26px)', fontWeight: 'bold', letterSpacing: '3px', background: 'linear-gradient(135deg, #ff6600 0%, #ff8800 100%)', border: 'none', borderRadius: '10px', color: '#000', cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif", boxShadow: '0 20px 55px rgba(255,100,0,0.5)', position: 'relative', overflow: 'hidden', animation: 'pulseButton 2s ease-in-out infinite' }}>
          ZAMÓW — OD 61 ZŁ
          <div className="btn-shine" />
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
        
        @keyframes float0 { 0%, 100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-20px) translateX(10px); } }
        @keyframes float1 { 0%, 100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-30px) translateX(-15px); } }
        @keyframes float2 { 0%, 100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-25px) translateX(20px); } }
        @keyframes floatProduct { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes glow { 0% { text-shadow: 0 0 20px rgba(255,100,0,0.4); } 100% { text-shadow: 0 0 40px rgba(255,100,0,0.8), 0 0 60px rgba(255,100,0,0.4); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.85; transform: scale(1.03); } }
        @keyframes pulseButton { 0%, 100% { box-shadow: 0 20px 55px rgba(255,100,0,0.5); } 50% { box-shadow: 0 25px 70px rgba(255,100,0,0.7); } }
        @keyframes bounce { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }
        @keyframes scrollDown { 0% { opacity: 1; top: 6px; } 100% { opacity: 0; top: 20px; } }
        
        .btn-shine { position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); animation: shine 3s infinite; }
        @keyframes shine { 0% { left: -100%; } 50%, 100% { left: 100%; } }
        
        .main-cta:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 25px 65px rgba(255,100,0,0.6) !important; }
        .main-cta:active { transform: translateY(-2px) scale(0.98); }
        .product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 35px rgba(0,0,0,0.3); }
        .review-card:hover { transform: translateY(-4px); border-color: rgba(255,100,0,0.3); }
        .feature-card:hover { background: rgba(255,100,0,0.08) !important; }
        
        input:focus { border-color: #ff6600 !important; background: rgba(255,100,0,0.05) !important; }
      `}</style>
    </div>
  );
}
