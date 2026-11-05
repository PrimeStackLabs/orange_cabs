import re

html_content = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Orange Cabs — Karnataka's Most Trusted Corporate Transport Partner. ISO 9001:2015 certified, 500+ GPS-enabled vehicles, 24/7 operations, and executive chauffeur services.">
  <meta name="keywords" content="Orange Cabs, Sri Vijay Travels, Corporate Transport Bengaluru, Employee Transportation Bangalore, Cab Service Bengaluru, Executive Car Rental, EV Corporate Transport">
  <meta name="author" content="primepro.ai">
  <title>Orange Cabs | Karnataka's Most Trusted Corporate Transport Partner</title>

  <!-- Google Fonts: Syne & Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">

  <!-- FontAwesome 6 -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

  <!-- Three.js 3D Library -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

  <!-- Master Stylesheet -->
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

  <!-- ==========================================================================
       NAVIGATION BAR
       ========================================================================== -->
  <header class="navbar">
    <div class="container nav-container">
      <a href="index.html" class="brand-logo" aria-label="Orange Cabs Home">
        <div class="logo-symbol">
          <span>OC</span>
        </div>
        <div class="logo-text-group">
          <div class="brand-title">ORANGE<span>CABS</span></div>
          <div class="brand-subtitle">Sri Vijay Mobility • Est. 2016</div>
        </div>
      </a>

      <nav>
        <ul class="nav-links">
          <li class="nav-item"><a href="#about" class="active">About</a></li>
          <li class="nav-item"><a href="#services">Services</a></li>
          <li class="nav-item"><a href="#fleet">Fleet</a></li>
          <li class="nav-item"><a href="#operations">Operations</a></li>
          <li class="nav-item"><a href="#technology">Technology</a></li>
          <li class="nav-item"><a href="#certifications">Credentials</a></li>
          <li class="nav-item"><a href="#clients">Clients</a></li>
          <li class="nav-item"><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      <div class="nav-actions">
        <a href="tel:+919845233300" class="nav-phone" title="Call Operations 24/7">
          <i class="fas fa-phone-alt"></i>
          <span>+91 98452 33300</span>
        </a>
        <a href="#" class="btn btn-primary btn-glow" data-modal-target="modal-quote">
          <span>Get Quote</span>
          <i class="fas fa-arrow-right"></i>
        </a>
        <button class="mobile-toggle" aria-label="Open mobile menu">
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </div>
  </header>

  <!-- ==========================================================================
       1. HERO SECTION (CINEMATIC 3D VIDEO ANIMATION & TELEMETRY PARTICLES)
       ========================================================================== -->
  <section class="hero-section" id="hero">
    <!-- Cinematic Video Background Loop -->
    <div class="hero-video-wrap">
      <video class="hero-video-bg" autoplay loop muted playsinline preload="auto">
        <source src="assets/videos/hero_animation.mp4" type="video/mp4">
      </video>
      <div class="hero-video-overlay"></div>
    </div>

    <div class="container hero-content">
      <div class="hero-badge-pill">
        <span class="pill-dot"></span>
        <span>🏆 ISO 9001:2015 CERTIFIED • MSME REGISTERED • BENGALURU</span>
      </div>

      <h1 class="hero-title">
        Driven by Reliability, <br>
        <span class="gradient-text">Elevated by Innovation.</span>
      </h1>

      <p class="hero-description" style="margin: 0 auto 30px;">
        Karnataka's most trusted corporate transportation company. Delivering safe, punctual, and GPS-powered mobility solutions for enterprises across Bengaluru and beyond. Powered by Nyletech &amp; Technology Partners.
      </p>

      <div class="hero-actions" style="justify-content: center;">
        <a href="#booking-card" class="btn btn-primary btn-glow">
          <i class="fas fa-bolt"></i>
          <span>Request a Quote</span>
        </a>
        <a href="#services" class="btn btn-outline">
          <span>Explore Services</span>
          <i class="fas fa-chevron-right"></i>
        </a>
        <a href="fleet.html" class="btn btn-outline" style="border-color: rgba(255, 94, 0, 0.4);">
          <i class="fas fa-car-side"></i>
          <span>View 500+ Fleet</span>
        </a>
      </div>

      <!-- Glassmorphic Booking Widget -->
      <div class="hero-booking-widget" id="booking-card">
        <div class="booking-service-tabs">
          <button type="button" class="tab-btn active" onclick="switchBookingTab(this, 'Outstation One-Way')">
            <i class="fas fa-route"></i> Outstation One-Way
          </button>
          <button type="button" class="tab-btn" onclick="switchBookingTab(this, 'Round Trip')">
            <i class="fas fa-sync-alt"></i> Round Trip
          </button>
          <button type="button" class="tab-btn" onclick="switchBookingTab(this, 'Airport Transfer')">
            <i class="fas fa-plane-departure"></i> Airport Transfer
          </button>
          <button type="button" class="tab-btn" onclick="switchBookingTab(this, 'Local Rental / Shifts')">
            <i class="fas fa-clock"></i> Local Rental (Hourly/Shift)
          </button>
        </div>

        <form id="hero-quick-booking" onsubmit="handleHeroQuickBooking(event)">
          <div class="booking-fields-row">
            <div class="b-field-box">
              <label class="b-field-label"><i class="fas fa-map-marker-alt"></i> Pickup City / Location</label>
              <input type="text" id="hb-pickup" class="b-input" placeholder="e.g. Bangalore" value="Bangalore" required>
            </div>

            <div class="b-field-box">
              <label class="b-field-label"><i class="fas fa-location-arrow"></i> Drop Destination</label>
              <input type="text" id="hb-drop" class="b-input" placeholder="e.g. Mysore / Whitefield" value="Mysore" required>
            </div>

            <div class="b-field-box">
              <label class="b-field-label"><i class="fas fa-calendar-alt"></i> Pickup Date</label>
              <input type="date" id="hb-date" class="b-input" required>
            </div>

            <div class="b-field-box">
              <label class="b-field-label"><i class="fas fa-clock"></i> Time</label>
              <input type="time" id="hb-time" class="b-input" value="09:00" required>
            </div>

            <div class="b-field-box">
              <label class="b-field-label"><i class="fas fa-car"></i> Preferred Cab</label>
              <select id="hb-cab" class="b-select">
                <option value="Executive Sedan (Dzire/Etios)">Executive Sedan</option>
                <option value="Electric Vehicle (EV Sedan)">Electric EV Sedan</option>
                <option value="Toyota Innova Crysta">Innova Crysta SUV</option>
                <option value="Force Tempo Traveller">Tempo Traveller</option>
                <option value="Staff Commuter Bus">Staff Bus</option>
              </select>
            </div>

            <button type="submit" class="btn-book-submit">
              <span>BOOK NOW</span>
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </form>
      </div>

      <div class="hero-stats-row" style="margin-top: 50px;">
        <div class="hero-stat-item">
          <div class="stat-number counter-val" data-target="500" data-suffix="+">500+</div>
          <div class="stat-label">Fleet Vehicles</div>
        </div>
        <div class="hero-stat-item">
          <div class="stat-number counter-val" data-target="10" data-suffix="+">10+</div>
          <div class="stat-label">Corporate Clients</div>
        </div>
        <div class="hero-stat-item">
          <div class="stat-number counter-val" data-target="15" data-suffix="+">15+</div>
          <div class="stat-label">Years of Service</div>
        </div>
        <div class="hero-stat-item">
          <div class="stat-number">24/7</div>
          <div class="stat-label">Operations Support</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================================================
       2. TRUST CREDENTIALS STRIP
       ========================================================================== -->
  <div class="trust-strip">
    <div class="container">
      <div class="trust-items">
        <div class="trust-card">
          <div class="trust-icon">🏅</div>
          <div class="trust-text">
            <h4>ISO 9001:2015</h4>
            <p>Quality Management Certified</p>
          </div>
        </div>
        <div class="trust-card">
          <div class="trust-icon">📜</div>
          <div class="trust-text">
            <h4>MSME &amp; MCA Registered</h4>
            <p>Govt. of India Compliant</p>
          </div>
        </div>
        <div class="trust-card">
          <div class="trust-icon">🛡️</div>
          <div class="trust-text">
            <h4>Police &amp; POSH Verified</h4>
            <p>100% Screened Chauffeurs</p>
          </div>
        </div>
        <div class="trust-card">
          <div class="trust-icon">🛰️</div>
          <div class="trust-text">
            <h4>Nyletech Telematics</h4>
            <p>Real-Time GPS &amp; AI Routing</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ==========================================================================
       3. ABOUT US SECTION (EXACT 2-COLUMN LAYOUT FROM DESIGN)
       ========================================================================== -->
  <section class="section-padding" id="about">
    <div class="container">
      <div style="display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 50px; align-items: center;">
        
        <!-- Left Stats Showcase Card -->
        <div style="background: var(--bg-surface); border: 1px solid var(--border-glass-bright); border-radius: 28px; padding: 40px; position: relative; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.7);">
          <div style="position: absolute; top: -30px; right: -30px; width: 140px; height: 140px; background: radial-gradient(circle, rgba(255,94,0,0.3) 0%, transparent 70%); border-radius: 50%;"></div>
          
          <div style="font-family: var(--font-heading); font-size: 3.4rem; font-weight: 800; color: #FFFFFF; line-height: 1; margin-bottom: 4px;">
            2016
          </div>
          <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 24px;">
            YEAR OF ESTABLISHMENT
          </div>

          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass); border-radius: 16px; padding: 20px; margin-bottom: 24px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <span style="color: #34D399; font-size: 1.2rem;">✓</span>
              <strong style="color: #FFFFFF; font-size: 1.1rem;">ISO 9001:2015 CERTIFIED</strong>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Internationally Audited Quality Management System</p>
          </div>

          <h4 style="font-size: 1.2rem; color: #FFFFFF; margin-bottom: 18px;">Karnataka's Premium Corporate Transport Partner</h4>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;">
            <div style="background: rgba(255,94,0,0.08); border: 1px solid rgba(255,94,0,0.25); border-radius: 12px; padding: 12px 16px;">
              <span style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: var(--orange-light); display: block;">500+</span>
              <span style="font-size: 0.75rem; color: var(--text-soft); text-transform: uppercase;">Vehicles</span>
            </div>
            <div style="background: rgba(255,94,0,0.08); border: 1px solid rgba(255,94,0,0.25); border-radius: 12px; padding: 12px 16px;">
              <span style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: var(--orange-light); display: block;">10+</span>
              <span style="font-size: 0.75rem; color: var(--text-soft); text-transform: uppercase;">Clients</span>
            </div>
            <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--border-glass); border-radius: 12px; padding: 12px 16px;">
              <span style="font-weight: 700; color: #FFFFFF; font-size: 0.95rem; display: block;">MSME</span>
              <span style="font-size: 0.75rem; color: var(--text-muted);">Registered</span>
            </div>
            <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--border-glass); border-radius: 12px; padding: 12px 16px;">
              <span style="font-weight: 700; color: #FFFFFF; font-size: 0.95rem; display: block;">GST</span>
              <span style="font-size: 0.75rem; color: var(--text-muted);">Compliant</span>
            </div>
          </div>
        </div>

        <!-- Right Narrative & 4 Value Pillars -->
        <div>
          <div class="section-tag"><i class="fas fa-shield-alt"></i> About Us</div>
          <h2 class="section-title text-left">Karnataka's Most <em>Trusted</em> Transport Partner</h2>
          <p style="font-size: 1.05rem; line-height: 1.7; color: var(--text-soft); margin-bottom: 24px;">
            <strong>Sri Vijay Tours &amp; Travels Pvt. Ltd. (Orange Cabs)</strong> is a leading corporate transportation company headquartered in Bengaluru. With over two decades of excellence, we specialize in providing seamless, safe, and technology-enabled transport solutions for India's top enterprises.
          </p>
          <p style="font-size: 0.95rem; line-height: 1.7; color: var(--text-muted); margin-bottom: 30px;">
            Our commitment to punctuality, safety, and driver discipline — backed by our technology partnerships with <strong>Nyletech</strong> and Technology Partners — makes us the preferred transport vendor for IT companies, BPOs, hospitals, schools, and large enterprise campuses across Karnataka.
          </p>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 32px;">
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass); border-radius: 14px; padding: 16px 20px;">
              <div style="font-size: 0.95rem; font-weight: 700; color: #FFFFFF; margin-bottom: 4px;">🎯 Mission</div>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0;">Deliver safe, punctual, and dignified transportation for every commuter, every day.</p>
            </div>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass); border-radius: 14px; padding: 16px 20px;">
              <div style="font-size: 0.95rem; font-weight: 700; color: #FFFFFF; margin-bottom: 4px;">🌟 Vision</div>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0;">To be South India's most technology-driven employee transportation company.</p>
            </div>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass); border-radius: 14px; padding: 16px 20px;">
              <div style="font-size: 0.95rem; font-weight: 700; color: #FFFFFF; margin-bottom: 4px;">💡 Values</div>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0;">Reliability, Safety, Transparency, Innovation, and Customer Centricity.</p>
            </div>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass); border-radius: 14px; padding: 16px 20px;">
              <div style="font-size: 0.95rem; font-weight: 700; color: #FFFFFF; margin-bottom: 4px;">🛡️ Compliance</div>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0;">100% RTO compliant, police-verified drivers, fitness-certified fleet.</p>
            </div>
          </div>

          <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            <a href="#director" class="btn btn-primary">
              <i class="fas fa-user-tie"></i> Meet Our Director
            </a>
            <a href="#contact" class="btn btn-outline">
              <i class="fas fa-envelope"></i> Contact Us
            </a>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- ==========================================================================
       4. WHY CHOOSE US — THE STANDARD OTHERS ASPIRE TO (4 CARDS)
       ========================================================================== -->
  <section class="section-padding" style="background: var(--bg-deep); border-top: 1px solid var(--border-glass); border-bottom: 1px solid var(--border-glass);" id="why-choose-us">
    <div class="container">
      <div class="section-header">
        <div class="section-tag"><i class="fas fa-check-circle"></i> Why Choose Us</div>
        <h2 class="section-title">The Standard Others <em>Aspire To</em></h2>
        <p class="section-sub">
          Two decades of excellence, 500+ vehicles, and a relentless commitment to safety have made Sri Vijay Tours &amp; Travels the benchmark for corporate transport in Karnataka.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px;">
        <div class="service-card-3d">
          <div class="service-icon-box">🛡️</div>
          <h3 class="service-title">Zero-Compromise Safety</h3>
          <p class="service-desc">Police-verified drivers, CCTV-equipped vehicles, SOS alerts, and 24/7 monitoring for every trip.</p>
        </div>
        <div class="service-card-3d">
          <div class="service-icon-box">⏱️</div>
          <h3 class="service-title">Punctuality Guaranteed</h3>
          <p class="service-desc">GPS-optimised routes and automated scheduling ensure on-time arrivals — every single day.</p>
        </div>
        <div class="service-card-3d">
          <div class="service-icon-box">🛰️</div>
          <h3 class="service-title">Live GPS Tracking</h3>
          <p class="service-desc">Real-time vehicle visibility powered by Nyletech's advanced tracking platform — for you and your employees.</p>
        </div>
        <div class="service-card-3d">
          <div class="service-icon-box">📋</div>
          <h3 class="service-title">End-to-End Compliance</h3>
          <p class="service-desc">ISO 9001:2015 certified, MSME registered, fully RTO and GST compliant — no paperwork headaches.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================================================
       5. STICKY WHY SECTION — 100+ COMPANIES COUNT ON US (01 TO 07 NUMBERED CARDS)
       ========================================================================== -->
  <section class="sticky-why-section" id="sticky-why">
    <div class="container">
      <div class="sticky-why-layout">

        <!-- Left Sticky Panel -->
        <div class="sticky-why-left">
          <div class="section-tag"><i class="fas fa-award"></i> Why Choose Us</div>
          <h2>100+ Companies <br><span class="orange-text">Count On Us</span></h2>
          <p>
            From Bangalore and Beyond: <strong>Sri Vijay Tours &amp; Travels (Orange Cabs)</strong> — one ride at a time.
          </p>

          <div class="sticky-stats-mini">
            <div class="sticky-stat-box">
              <h4>500+</h4>
              <p>GPS-Enabled Vehicles</p>
            </div>
            <div class="sticky-stat-box">
              <h4>15+</h4>
              <p>Years of Excellence</p>
            </div>
            <div class="sticky-stat-box">
              <h4>24/7</h4>
              <p>Control Room Support</p>
            </div>
          </div>

          <div style="margin-top: 30px;">
            <a href="#contact" class="btn btn-primary" style="width: 100%;">
              <span>Request Fleet Consultation</span>
              <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>

        <!-- Right Numbered 01 to 07 Cards -->
        <div class="numbered-cards-list">
          
          <!-- 01 -->
          <div class="numbered-card-item">
            <div class="numbered-card-top">
              <div class="numbered-icon-wrap">
                <div class="numbered-icon">👷</div>
                <span class="numbered-step-tag">01 / 07</span>
              </div>
              <span class="numbered-badge-pill">✓ POSH Certified</span>
            </div>
            <h3>Trained &amp; Compliant Staff</h3>
            <p>Our professionally trained team undergoes regular POSH compliance and safety awareness programs. Every driver is police-verified, POSH-trained, and briefed on emergency response protocols — ensuring passenger safety is never an afterthought.</p>
          </div>

          <!-- 02 -->
          <div class="numbered-card-item">
            <div class="numbered-card-top">
              <div class="numbered-icon-wrap">
                <div class="numbered-icon">🧾</div>
                <span class="numbered-step-tag">02 / 07</span>
              </div>
              <span class="numbered-badge-pill">✓ GST Compliant</span>
            </div>
            <h3>Unified Billing</h3>
            <p>Our integrated software generates a single, consolidated invoice covering both transport and technology services. No more juggling between multiple vendors — one clean invoice, one point of contact, complete transparency.</p>
          </div>

          <!-- 03 -->
          <div class="numbered-card-item">
            <div class="numbered-card-top">
              <div class="numbered-icon-wrap">
                <div class="numbered-icon">🛡️</div>
                <span class="numbered-step-tag">03 / 07</span>
              </div>
              <span class="numbered-badge-pill">✓ SOS Enabled</span>
            </div>
            <h3>Safe &amp; Secure Travel</h3>
            <p>Physical SOS buttons in every vehicle combined with app-based alerts provide immediate emergency response around the clock. Our 24/7 control room monitors every trip in real-time, ensuring your employees always travel in safety.</p>
          </div>

          <!-- 04 -->
          <div class="numbered-card-item">
            <div class="numbered-card-top">
              <div class="numbered-icon-wrap">
                <div class="numbered-icon">🎯</div>
                <span class="numbered-step-tag">04 / 07</span>
              </div>
              <span class="numbered-badge-pill">✓ 24/7 Available</span>
            </div>
            <h3>On-Route Assistance</h3>
            <p>Real-time support is available every minute of every journey. From navigation assistance to breakdown support and emergency response — our operations team is always reachable via in-vehicle SOS buttons and dedicated helplines.</p>
          </div>

          <!-- 05 -->
          <div class="numbered-card-item">
            <div class="numbered-card-top">
              <div class="numbered-icon-wrap">
                <div class="numbered-icon">📍</div>
                <span class="numbered-step-tag">05 / 07</span>
              </div>
              <span class="numbered-badge-pill">✓ GPS Optimised Routes</span>
            </div>
            <h3>Convenient Locations</h3>
            <p>We offer multiple strategically planned pickup and drop-off points, making commutes more accessible and practical for your entire workforce. Smart route optimisation reduces travel time without compromising comfort.</p>
          </div>

          <!-- 06 -->
          <div class="numbered-card-item">
            <div class="numbered-card-top">
              <div class="numbered-icon-wrap">
                <div class="numbered-icon">🚘</div>
                <span class="numbered-step-tag">06 / 07</span>
              </div>
              <span class="numbered-badge-pill">✓ ISO 9001:2015</span>
            </div>
            <h3>Fleet Hygiene &amp; Inspection</h3>
            <p>All vehicles undergo mandatory pre-trip inspections, scheduled maintenance, and thorough sanitization. Our ISO 9001:2015 quality processes ensure every car in our fleet meets the highest standards of cleanliness and roadworthiness.</p>
          </div>

          <!-- 07 -->
          <div class="numbered-card-item">
            <div class="numbered-card-top">
              <div class="numbered-icon-wrap">
                <div class="numbered-icon">⚖️</div>
                <span class="numbered-step-tag">07 / 07</span>
              </div>
              <span class="numbered-badge-pill">✓ Fully Compliant</span>
            </div>
            <h3>Statutory Compliance</h3>
            <p>Every aspect of our operation is fully compliant with government and transport safety regulations. RTO-certified vehicles, MSME registered, GST compliant, and backed by comprehensive insurance — zero risk, complete peace of mind.</p>
          </div>

        </div>

      </div>
    </div>
  </section>

  <!-- ==========================================================================
       6. COMPLETE TRANSPORT SOLUTIONS (6 SERVICES)
       ========================================================================== -->
  <section class="section-padding services-section" id="services">
    <div class="container">
      <div class="section-header">
        <div class="section-tag"><i class="fas fa-cubes"></i> Our Services</div>
        <h2 class="section-title">Complete <em>Transport Solutions</em></h2>
        <p class="section-sub">
          A sophisticated, innovative, robust, and comprehensive platform for managing, streamlining, and automating all your employee transport management operations.
        </p>
      </div>

      <div class="services-grid">

        <div class="service-card-3d">
          <div class="service-icon-box"><i class="fas fa-building"></i></div>
          <h3 class="service-title">Corporate Transport Services</h3>
          <p class="service-desc">
            Dedicated corporate transport fleets for IT companies, BPOs, and large enterprises. Scheduled, safe, and GPS-supervised commutes around the clock.
          </p>
          <ul class="service-features-list">
            <li><i class="fas fa-check-circle"></i> AI-Optimized pickup &amp; drop routing</li>
            <li><i class="fas fa-check-circle"></i> Strict gender-safety protocols &amp; escorts</li>
            <li><i class="fas fa-check-circle"></i> Consolidated single-window monthly billing</li>
          </ul>
        </div>

        <div class="service-card-3d">
          <div class="service-icon-box"><i class="fas fa-users"></i></div>
          <h3 class="service-title">Employee Transportation</h3>
          <p class="service-desc">
            End-to-end employee mobility — rostering, routing, night cab management, and gender-sensitive safety protocols. Safety, reliability, and value focused.
          </p>
          <ul class="service-features-list">
            <li><i class="fas fa-check-circle"></i> Shift-based automated dispatching</li>
            <li><i class="fas fa-check-circle"></i> Live employee mobile app with ETAs</li>
            <li><i class="fas fa-check-circle"></i> Guaranteed zero-delay SLA threshold</li>
          </ul>
        </div>

        <div class="service-card-3d">
          <div class="service-icon-box"><i class="fas fa-calendar-alt"></i></div>
          <h3 class="service-title">Event Transport Services</h3>
          <p class="service-desc">
            Premium event logistics for corporate conferences, product launches, team outings, and airport transfers with coordinated fleet management.
          </p>
          <ul class="service-features-list">
            <li><i class="fas fa-check-circle"></i> Airport curbside protocols &amp; marshals</li>
            <li><i class="fas fa-check-circle"></i> Multi-axle Volvo coaches &amp; Innovas</li>
            <li><i class="fas fa-check-circle"></i> On-ground coordination supervisors</li>
          </ul>
        </div>

        <div class="service-card-3d">
          <div class="service-icon-box"><i class="fas fa-car"></i></div>
          <h3 class="service-title">Fleet Management</h3>
          <p class="service-desc">
            Outsource your entire fleet — procurement, maintenance, insurance, driver management, and compliance handled end-to-end by our expert team.
          </p>
          <ul class="service-features-list">
            <li><i class="fas fa-check-circle"></i> Zero depreciation risk on client books</li>
            <li><i class="fas fa-check-circle"></i> Routine mechanical fitness audits</li>
            <li><i class="fas fa-check-circle"></i> Instant replacement vehicle guarantee</li>
          </ul>
        </div>

        <div class="service-card-3d">
          <div class="service-icon-box"><i class="fas fa-satellite"></i></div>
          <h3 class="service-title">GPS Tracking &amp; Technology</h3>
          <p class="service-desc">
            Advanced GPS tracking, live trip monitoring, automated billing, and AI-powered route optimization powered by Nyletech's platform.
          </p>
          <ul class="service-features-list">
            <li><i class="fas fa-check-circle"></i> Geofencing &amp; overspeeding alarms</li>
            <li><i class="fas fa-check-circle"></i> Automated mileage calculation</li>
            <li><i class="fas fa-check-circle"></i> Real-time corporate telemetry portal</li>
          </ul>
        </div>

        <div class="service-card-3d">
          <div class="service-icon-box"><i class="fas fa-headset"></i></div>
          <h3 class="service-title">24/7 Operations Support</h3>
          <p class="service-desc">
            Round-the-clock control room support, emergency response, SOS management, and dedicated account managers for enterprise clients.
          </p>
          <ul class="service-features-list">
            <li><i class="fas fa-check-circle"></i> Physical in-cabin SOS panic alarms</li>
            <li><i class="fas fa-check-circle"></i> Under 3-minute SOS response time</li>
            <li><i class="fas fa-check-circle"></i> Dedicated executive escalation desks</li>
          </ul>
        </div>

      </div>
    </div>
  </section>

  <!-- ==========================================================================
       7. DIRECTOR LEADERSHIP SPOTLIGHT
       ========================================================================== -->
  <section class="section-padding director-section" id="director">
    <div class="container">
      <div class="director-card-wrap">
        <div class="director-image-box">
          <img src="assets/images/Founder.png" alt="Mr. P. N. Divakar Naidu - Director" onerror="this.src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80';">
          <div class="director-badge-corner">
            <h4>Mr. P. N. Divakar Naidu</h4>
            <p>Director — Sri Vijay Tours &amp; Travels Pvt. Ltd.</p>
          </div>
        </div>

        <div class="director-bio">
          <div class="section-tag"><i class="fas fa-crown"></i> Leadership</div>
          <h3>Meet Our <em>Director</em></h3>
          <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 16px;">
            The visionary behind Sri Vijay Tours &amp; Travels — Karnataka's most trusted corporate transport company.
          </p>
          
          <div class="director-quote">
            "Mr. P. N. Divakar Naidu, Director of Sri Vijay Tours and Travels Pvt. Ltd., is a visionary leader with a deep-rooted passion for the transportation industry."
          </div>
          
          <p>
            Beginning his journey from the ground level, he has gained hands-on experience in every aspect of operations, steadily growing through dedication, innovation, and a commitment to excellence. His step-by-step rise reflects not only his strong work ethic but also his ability to inspire teams, adapt to changing industry needs, and drive sustainable growth.
          </p>
          <p>
            Today, as a dynamic and forward-thinking young leader, he continues to steer Sri Vijay Tours &amp; Travels towards new horizons with integrity, customer focus, and a future-ready mindset.
          </p>

          <div class="director-signature">
            <a href="#contact" class="btn btn-primary">
              <i class="fas fa-handshake"></i>
              <span>Connect with Us</span>
            </a>
            <a href="#fleet" class="btn btn-outline">
              <i class="fas fa-car"></i>
              <span>View Fleet</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================================================
       8. MODERN FLEET SHOWCASE (7 VEHICLE 3D TILT CARDS)
       ========================================================================== -->
  <section class="section-padding fleet-section" id="fleet">
    <div class="container">
      <div class="section-header">
        <div class="section-tag"><i class="fas fa-car-side"></i> Our Fleet</div>
        <h2 class="section-title">Modern <em>Fleet Showcase</em></h2>
        <p class="section-sub">
          500+ well-maintained, GPS-enabled, RTO-compliant vehicles for every corporate requirement — from executive sedans to large capacity buses.
        </p>
      </div>

      <!-- Filter Chips -->
      <div class="fleet-filter-bar">
        <button class="filter-chip active" data-filter="all">All Vehicles</button>
        <button class="filter-chip" data-filter="ev">Electric (EV)</button>
        <button class="filter-chip" data-filter="cng">CNG</button>
        <button class="filter-chip" data-filter="sedan">Sedans</button>
        <button class="filter-chip" data-filter="suv">SUVs &amp; MUVs</button>
        <button class="filter-chip" data-filter="tempo">Tempo Travellers</button>
        <button class="filter-chip" data-filter="coach">Luxury Coaches</button>
        <button class="filter-chip" data-filter="bus">Buses</button>
      </div>

      <!-- Fleet Grid -->
      <div class="fleet-grid" id="fleet-grid">

        <!-- Card 1: EV -->
        <div class="fleet-card-3d" data-category="ev">
          <div class="fleet-media-wrap">
            <img src="assets/images/ev.jpeg" alt="Electric Vehicle" onerror="this.src='https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&auto=format&fit=crop&q=80';">
            <div class="fleet-media-overlay"></div>
            <span class="fleet-category-tag">🌱 EV Mobility</span>
            <span class="fleet-seat-tag">4 Seater</span>
          </div>
          <div class="fleet-card-body">
            <h3 class="fleet-vehicle-name">Electric Vehicle (EV)</h3>
            <p class="fleet-vehicle-desc">Zero-emission electric cars for eco-conscious corporate commutes — silent, sustainable, and cost-efficient.</p>
            <div class="fleet-specs-grid">
              <div class="spec-badge"><span class="emoji">⚡</span><span>4 Seater</span></div>
              <div class="spec-badge"><span class="emoji">🍃</span><span>EV Zero CO₂</span></div>
              <div class="spec-badge"><span class="emoji">🛰️</span><span>GPS</span></div>
            </div>
            <div class="fleet-card-actions">
              <a href="https://wa.me/919845233300?text=Hello%20Orange%20Cabs!%20I%20am%20interested%20in%20Electric%20Vehicles%20(EV)." target="_blank" class="btn btn-primary btn-card-inquire">
                <i class="fab fa-whatsapp"></i> Inquire EV
              </a>
              <button class="btn btn-card-specs">View Specs</button>
            </div>
          </div>
        </div>

        <!-- Card 2: CNG -->
        <div class="fleet-card-3d" data-category="cng">
          <div class="fleet-media-wrap">
            <img src="assets/images/cng.jpeg" alt="CNG Vehicle" onerror="this.src='https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80';">
            <div class="fleet-media-overlay"></div>
            <span class="fleet-category-tag">⛽ Clean Fuel</span>
            <span class="fleet-seat-tag">4 Seater</span>
          </div>
          <div class="fleet-card-body">
            <h3 class="fleet-vehicle-name">CNG Vehicle</h3>
            <p class="fleet-vehicle-desc">Fuel-efficient, low-emission CNG cars ideal for daily employee commutes at optimized running costs.</p>
            <div class="fleet-specs-grid">
              <div class="spec-badge"><span class="emoji">🍃</span><span>4 Seater</span></div>
              <div class="spec-badge"><span class="emoji">⛽</span><span>CNG</span></div>
              <div class="spec-badge"><span class="emoji">🛰️</span><span>GPS</span></div>
            </div>
            <div class="fleet-card-actions">
              <a href="https://wa.me/919845233300?text=Hello%20Orange%20Cabs!%20I%20would%20like%20a%20quote%20for%20CNG%20Vehicles." target="_blank" class="btn btn-primary btn-card-inquire">
                <i class="fab fa-whatsapp"></i> Inquire CNG
              </a>
              <button class="btn btn-card-specs">View Specs</button>
            </div>
          </div>
        </div>

        <!-- Card 3: Executive Sedan -->
        <div class="fleet-card-3d" data-category="sedan">
          <div class="fleet-media-wrap">
            <img src="assets/images/Executive_Sedan.jpg" alt="Executive Sedan" onerror="this.src='https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&auto=format&fit=crop&q=80';">
            <div class="fleet-media-overlay"></div>
            <span class="fleet-category-tag">🚗 Executive</span>
            <span class="fleet-seat-tag">4 Seater</span>
          </div>
          <div class="fleet-card-body">
            <h3 class="fleet-vehicle-name">Executive Sedan</h3>
            <p class="fleet-vehicle-desc">Toyota Etios / Honda Amaze / Maruti Dzire — AC, GPS Tracked, Professional Driver.</p>
            <div class="fleet-specs-grid">
              <div class="spec-badge"><span class="emoji">🛋️</span><span>4 Seater</span></div>
              <div class="spec-badge"><span class="emoji">❄️</span><span>AC Climate</span></div>
              <div class="spec-badge"><span class="emoji">🛰️</span><span>GPS Tracked</span></div>
            </div>
            <div class="fleet-card-actions">
              <a href="https://wa.me/919845233300?text=Hello%20Orange%20Cabs!%20Please%20provide%20a%20quote%20for%20Executive%20Sedans." target="_blank" class="btn btn-primary btn-card-inquire">
                <i class="fab fa-whatsapp"></i> Inquire Sedan
              </a>
              <button class="btn btn-card-specs">View Specs</button>
            </div>
          </div>
        </div>

        <!-- Card 4: SUV / MUV -->
        <div class="fleet-card-3d" data-category="suv">
          <div class="fleet-media-wrap">
            <img src="assets/images/SUV.jpg" alt="SUV MUV Ertiga Innova" onerror="this.src='https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=80';">
            <div class="fleet-media-overlay"></div>
            <span class="fleet-category-tag">🚙 Luxury SUV</span>
            <span class="fleet-seat-tag">7 Seater</span>
          </div>
          <div class="fleet-card-body">
            <h3 class="fleet-vehicle-name">SUV / MUV — Ertiga / Innova</h3>
            <p class="fleet-vehicle-desc">Maruti Ertiga &amp; Toyota Innova Crysta — ideal for team pick-ups and corporate trips.</p>
            <div class="fleet-specs-grid">
              <div class="spec-badge"><span class="emoji">💺</span><span>7 Seater</span></div>
              <div class="spec-badge"><span class="emoji">❄️</span><span>Rear AC</span></div>
              <div class="spec-badge"><span class="emoji">🛰️</span><span>GPS Tracked</span></div>
            </div>
            <div class="fleet-card-actions">
              <a href="https://wa.me/919845233300?text=Hello%20Orange%20Cabs!%20Inquiring%20about%20Innova%20Crysta%20and%20Ertiga." target="_blank" class="btn btn-primary btn-card-inquire">
                <i class="fab fa-whatsapp"></i> Inquire SUV
              </a>
              <button class="btn btn-card-specs">View Specs</button>
            </div>
          </div>
        </div>

        <!-- Card 5: Tempo Traveller -->
        <div class="fleet-card-3d" data-category="tempo">
          <div class="fleet-media-wrap">
            <img src="assets/images/tempo_Traveller.jpg" alt="Tempo Traveller" onerror="this.src='https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80';">
            <div class="fleet-media-overlay"></div>
            <span class="fleet-category-tag">🚐 Group Transit</span>
            <span class="fleet-seat-tag">12–17 Seater</span>
          </div>
          <div class="fleet-card-body">
            <h3 class="fleet-vehicle-name">Tempo Traveller</h3>
            <p class="fleet-vehicle-desc">Force Traveller — push-back seats, AC, ideal for team outings and airport groups.</p>
            <div class="fleet-specs-grid">
              <div class="spec-badge"><span class="emoji">🛋️</span><span>12–17 Seater</span></div>
              <div class="spec-badge"><span class="emoji">❄️</span><span>AC Individual</span></div>
              <div class="spec-badge"><span class="emoji">🛰️</span><span>GPS Tracked</span></div>
            </div>
            <div class="fleet-card-actions">
              <a href="https://wa.me/919845233300?text=Hello%20Orange%20Cabs!%20We%20require%20Force%20Tempo%20Travellers." target="_blank" class="btn btn-primary btn-card-inquire">
                <i class="fab fa-whatsapp"></i> Inquire Tempo
              </a>
              <button class="btn btn-card-specs">View Specs</button>
            </div>
          </div>
        </div>

        <!-- Card 6: Luxury Coach -->
        <div class="fleet-card-3d" data-category="coach">
          <div class="fleet-media-wrap">
            <img src="assets/images/Luxury_Coach.jpg" alt="Luxury Coach" onerror="this.src='https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&auto=format&fit=crop&q=80';">
            <div class="fleet-media-overlay"></div>
            <span class="fleet-category-tag">🚍 Luxury Coach</span>
            <span class="fleet-seat-tag">35–45 Seater</span>
          </div>
          <div class="fleet-card-body">
            <h3 class="fleet-vehicle-name">Luxury Coach</h3>
            <p class="fleet-vehicle-desc">Volvo / Scania — air suspension, Wi-Fi, reclining seats for premium corporate events.</p>
            <div class="fleet-specs-grid">
              <div class="spec-badge"><span class="emoji">☁️</span><span>35–45 Seater</span></div>
              <div class="spec-badge"><span class="emoji">✨</span><span>Air Suspension</span></div>
              <div class="spec-badge"><span class="emoji">🛰️</span><span>GPS Tracked</span></div>
            </div>
            <div class="fleet-card-actions">
              <a href="https://wa.me/919845233300?text=Hello%20Orange%20Cabs!%20Inquiring%20about%20Volvo%20Luxury%20Coaches." target="_blank" class="btn btn-primary btn-card-inquire">
                <i class="fab fa-whatsapp"></i> Inquire Coach
              </a>
              <button class="btn btn-card-specs">View Specs</button>
            </div>
          </div>
        </div>

        <!-- Card 7: Staff Bus -->
        <div class="fleet-card-3d" data-category="bus">
          <div class="fleet-media-wrap">
            <img src="assets/images/Staff_Bus.jpg" alt="Staff Bus" onerror="this.src='https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80';">
            <div class="fleet-media-overlay"></div>
            <span class="fleet-category-tag">🚎 Heavy Transit</span>
            <span class="fleet-seat-tag">50+ Seater</span>
          </div>
          <div class="fleet-card-body">
            <h3 class="fleet-vehicle-name">Staff Bus</h3>
            <p class="fleet-vehicle-desc">Ashok Leyland / TATA — daily employee commute with CCTV, GPS, and route tracking.</p>
            <div class="fleet-specs-grid">
              <div class="spec-badge"><span class="emoji">👥</span><span>50+ Seater</span></div>
              <div class="spec-badge"><span class="emoji">📹</span><span>CCTV Camera</span></div>
              <div class="spec-badge"><span class="emoji">🛰️</span><span>GPS Tracked</span></div>
            </div>
            <div class="fleet-card-actions">
              <a href="https://wa.me/919845233300?text=Hello%20Orange%20Cabs!%20We%20require%20high-capacity%20staff%20buses." target="_blank" class="btn btn-primary btn-card-inquire">
                <i class="fab fa-whatsapp"></i> Inquire Bus
              </a>
              <button class="btn btn-card-specs">View Specs</button>
            </div>
          </div>
        </div>

      </div>

      <div style="text-align: center; margin-top: 55px;">
        <a href="#" class="btn btn-primary btn-glow" data-modal-target="modal-fleet-inquiry" style="padding: 16px 38px;">
          <i class="fas fa-car"></i>
          <span>🚗 Request Custom Fleet Proposal</span>
        </a>
      </div>
    </div>
  </section>

  <!-- ==========================================================================
       9. OPERATIONS IN ACTION — PRECISION AT EVERY MILE
       ========================================================================== -->
  <section class="section-padding ops-matrix-section" id="operations">
    <div class="ops-bg-glow"></div>
    <div class="container">
      <div class="section-header">
        <div class="section-tag"><i class="fas fa-satellite-dish"></i> Operations in Action</div>
        <h2 class="section-title">Precision at Every <em>Mile</em></h2>
        <p class="section-sub">
          Our operations never sleep. From the first pickup at dawn to the last drop-off at midnight, every vehicle is tracked, every driver is monitored, and every client is supported — all in real time.
        </p>
      </div>

      <div class="ops-dashboard-mockup">
        <div class="ops-telematics-grid">
          <div class="telematic-card">
            <div class="telematic-label">Live Tracking</div>
            <div class="telematic-value">500+</div>
            <div class="telematic-status"><span class="pulse-indicator"></span> Real-Time Stream to Dashboard</div>
          </div>
          <div class="telematic-card">
            <div class="telematic-label">Daily Trips Managed</div>
            <div class="telematic-value">1,000+</div>
            <div class="telematic-status"><span class="pulse-indicator"></span> Automated Rostering Engine</div>
          </div>
          <div class="telematic-card">
            <div class="telematic-label">Verified Drivers</div>
            <div class="telematic-value">600+</div>
            <div class="telematic-status"><span class="pulse-indicator"></span> Police &amp; POSH Screened</div>
          </div>
          <div class="telematic-card">
            <div class="telematic-label">Response Time</div>
            <div class="telematic-value">&lt; 3 min</div>
            <div class="telematic-status"><span class="pulse-indicator"></span> Immediate Action Protocol</div>
          </div>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; border-top: 1px solid var(--border-glass); padding-top: 24px; margin-top: 10px;">
          <div class="section-tag" style="margin: 0; background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); color: var(--text-soft);">
            🛰️ Powered by <strong style="color: var(--orange-light); margin-left: 6px;">Nyletech GPS</strong>
          </div>
          <div class="section-tag" style="margin: 0; background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); color: var(--text-soft);">
            ⚙️ Managed by <strong style="color: var(--orange-light); margin-left: 6px;">Technology Partners</strong>
          </div>
          <div class="section-tag" style="margin: 0; background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); color: var(--text-soft);">
            📅 <strong style="color: var(--orange-light); margin-right: 6px;">15+ Years</strong> of Operational Excellence
          </div>
          <a class="btn btn-primary" href="#contact" style="margin-left: auto;">
            <span>Talk to Our Team</span>
            <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================================================
       10. TECHNOLOGY PARTNERS (GPS PARTNER)
       ========================================================================== -->
  <section class="section-padding" style="background: #090D18; border-bottom: 1px solid var(--border-glass);" id="tech-partners">
    <div class="container">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items: center;">
        <div>
          <div class="section-tag"><i class="fas fa-satellite"></i> GPS Partner</div>
          <h2 class="section-title text-left">Powered by <em>Industry-Leading</em> Technology</h2>
          <p style="font-size: 1.05rem; line-height: 1.7; color: var(--text-soft); margin-bottom: 24px;">
            Sri Vijay Tours &amp; Travels (Orange Cabs) transport operations are supported by Nyletech GPS tracking for precise visibility, safer trips, and dependable real-time monitoring across Karnataka.
          </p>
          <div style="display: flex; gap: 14px; flex-wrap: wrap;">
            <div class="spec-badge" style="background: rgba(255,94,0,0.1); padding: 8px 16px; border-radius: 8px; color: var(--orange-light);"><i class="fas fa-check"></i> Satellite Live Ping</div>
            <div class="spec-badge" style="background: rgba(255,94,0,0.1); padding: 8px 16px; border-radius: 8px; color: var(--orange-light);"><i class="fas fa-check"></i> Automated Geofencing</div>
            <div class="spec-badge" style="background: rgba(255,94,0,0.1); padding: 8px 16px; border-radius: 8px; color: var(--orange-light);"><i class="fas fa-check"></i> Panic SOS Sensor</div>
          </div>
        </div>

        <div style="background: var(--bg-surface); border: 1px solid var(--border-glass-bright); border-radius: 24px; padding: 36px; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.6);">
          <div style="width: 140px; height: 60px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <img src="assets/images/Nyletech.png" alt="Nyletech GPS Partner" style="max-width: 100%; max-height: 100%; object-fit: contain;">
          </div>
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--orange-light); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px;">
            GPS &amp; TRACKING PARTNER
          </div>
          <h3 style="font-size: 1.4rem; color: #FFFFFF; margin-bottom: 12px;">Nyletech Telematics Platform</h3>
          <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin: 0;">
            Real-time GPS tracking, live vehicle visibility, route monitoring, and instant safety alerts for every corporate trip.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================================================
       11. POWERED BY SMART TECHNOLOGY (8 CARDS GRID)
       ========================================================================== -->
  <section class="section-padding" id="technology">
    <div class="container">
      <div class="section-header">
        <div class="section-tag"><i class="fas fa-microchip"></i> Technology &amp; Safety</div>
        <h2 class="section-title">Powered by <em>Smart Technology</em></h2>
        <p class="section-sub">
          Our integrated transport management platform — built on Nyletech and Technology Partners — ensures every trip is tracked, monitored, and optimized in real time.
        </p>
      </div>

      <div class="tech-features-grid">
        <div class="tech-feature-card">
          <div class="tech-icon-circle">📡</div>
          <h4>GPS Live Tracking</h4>
          <p>Real-time vehicle location with geofencing alerts and live trip monitoring.</p>
        </div>
        <div class="tech-feature-card">
          <div class="tech-icon-circle">🗺️</div>
          <h4>Intelligent Routing</h4>
          <p>AI-powered dynamic route optimization to reduce costs and improve punctuality.</p>
        </div>
        <div class="tech-feature-card">
          <div class="tech-icon-circle">📋</div>
          <h4>Automated Rostering</h4>
          <p>Smart shift-based scheduling with automatic driver and vehicle assignment.</p>
        </div>
        <div class="tech-feature-card">
          <div class="tech-icon-circle">💳</div>
          <h4>Automated Billing</h4>
          <p>Transparent, accurate billing with mileage calculation and detailed reports.</p>
        </div>
        <div class="tech-feature-card">
          <div class="tech-icon-circle">📱</div>
          <h4>Driver Mobile App</h4>
          <p>Trip acceptance, navigation, attendance, and communication — all in one app.</p>
        </div>
        <div class="tech-feature-card">
          <div class="tech-icon-circle">👩‍💻</div>
          <h4>Employee Mobile App</h4>
          <p>Cab booking, live tracking, ETA alerts, and trip history for employees.</p>
        </div>
        <div class="tech-feature-card">
          <div class="tech-icon-circle">🆘</div>
          <h4>SOS &amp; Emergency</h4>
          <p>One-tap SOS button, 24/7 emergency response and police coordination.</p>
        </div>
        <div class="tech-feature-card">
          <div class="tech-icon-circle">📊</div>
          <h4>Analytics Dashboard</h4>
          <p>Corporate admin view with trip logs, cost reports, and fleet utilization data.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================================================
       12. OUR CREDENTIALS / CERTIFICATIONS (4 CARDS)
       ========================================================================== -->
  <section class="section-padding" style="background: var(--bg-deep); border-top: 1px solid var(--border-glass);" id="certifications">
    <div class="container">
      <div class="section-header">
        <div class="section-tag"><i class="fas fa-certificate"></i> Certifications</div>
        <h2 class="section-title">Our <em>Credentials</em></h2>
        <p class="section-sub">
          Legally compliant, industry-certified, and recognized by government regulatory bodies.
        </p>
      </div>

      <div class="credentials-grid">
        <div class="credential-card">
          <div class="credential-icon">🏅</div>
          <h3>ISO 9001:2015</h3>
          <p>Quality Management System certified for consistent, world-class service delivery standards.</p>
          <span class="credential-badge">✓ Internationally Verified</span>
        </div>

        <div class="credential-card">
          <div class="credential-icon">📜</div>
          <h3>GST Certificate</h3>
          <p>Fully GST registered and compliant — valid invoices and proper input tax credit for all clients.</p>
          <span class="credential-badge">✓ Government Registered</span>
        </div>

        <div class="credential-card">
          <div class="credential-icon">🏭</div>
          <h3>MSME Certificate</h3>
          <p>Registered Micro, Small &amp; Medium Enterprise under the Government of India framework.</p>
          <span class="credential-badge">✓ MSME Registered</span>
        </div>

        <div class="credential-card">
          <div class="credential-icon">📑</div>
          <h3>Certificate of Incorporation</h3>
          <p>Incorporated under the Companies Act and registered with MCA, Government of India.</p>
          <span class="credential-badge">✓ MCA Registered</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================================================
       13. CLIENT MARQUEE & PARTNERS
       ========================================================================== -->
  <section class="section-padding client-section" id="clients">
    <div class="container">
      <div class="section-header">
        <div class="section-tag"><i class="fas fa-building"></i> Our Clientele</div>
        <h2 class="section-title">Trusted by <em>Industry Leaders</em></h2>
        <p class="section-sub">
          Proudly serving India's most respected companies across tech, finance, construction, education, and healthcare sectors.
        </p>
      </div>
    </div>

    <!-- Scrolling Marquee -->
    <div class="marquee-container">
      <div class="marquee-track">
        <div class="client-logo-card"><img src="assets/images/AECOM.png" alt="AECOM"></div>
        <div class="client-logo-card"><img src="assets/images/AON.png" alt="AON"></div>
        <div class="client-logo-card"><img src="assets/images/Pearl_Global.png" alt="Pearl Global"></div>
        <div class="client-logo-card"><img src="assets/images/kwalee.jpg" alt="Kwalee"></div>
        <div class="client-logo-card"><img src="assets/images/PragmaEdge.jpg" alt="PragmaEdge"></div>
        <div class="client-logo-card"><img src="assets/images/VR_Builders_&_Developers.webp" alt="VR Builders"></div>
        <div class="client-logo-card"><img src="assets/images/Nurture_International_School.png" alt="Nurture School"></div>
        <div class="client-logo-card"><img src="assets/images/Nyletech.png" alt="Nyletech GPS"></div>
        <!-- Loop duplicate -->
        <div class="client-logo-card"><img src="assets/images/AECOM.png" alt="AECOM"></div>
        <div class="client-logo-card"><img src="assets/images/AON.png" alt="AON"></div>
        <div class="client-logo-card"><img src="assets/images/Pearl_Global.png" alt="Pearl Global"></div>
        <div class="client-logo-card"><img src="assets/images/kwalee.jpg" alt="Kwalee"></div>
        <div class="client-logo-card"><img src="assets/images/PragmaEdge.jpg" alt="PragmaEdge"></div>
        <div class="client-logo-card"><img src="assets/images/VR_Builders_&_Developers.webp" alt="VR Builders"></div>
      </div>
    </div>

    <!-- Testimonials -->
    <div class="container" style="margin-top: 50px;">
      <div class="section-header" style="margin-bottom: 40px;">
        <h2 class="section-title">What Our <em>Clients Say</em></h2>
      </div>

      <div class="testimonials-grid">
        <div class="testimonial-card-3d">
          <div class="test-stars">★★★★★</div>
          <p class="test-quote">
            "Sri Vijay Tours &amp; Travels has been our employee transport partner for years. Their GPS-enabled fleet, trained drivers, and responsive support team have made our HR team's job significantly easier and more confident."
          </p>
          <div class="test-author-box">
            <div class="author-avatar">AK</div>
            <div class="author-info">
              <h5>Admin Manager</h5>
              <p>[24]7.ai Bengaluru</p>
            </div>
          </div>
        </div>

        <div class="testimonial-card-3d">
          <div class="test-stars">★★★★★</div>
          <p class="test-quote">
            "The Nyletech-powered GPS tracking gives us real-time peace of mind for all our employees. SVT's punctuality and communication are unmatched among transport vendors we've worked with."
          </p>
          <div class="test-author-box">
            <div class="author-avatar">SM</div>
            <div class="author-info">
              <h5>Transport Head</h5>
              <p>AECOM India</p>
            </div>
          </div>
        </div>

        <div class="testimonial-card-3d">
          <div class="test-stars">★★★★★</div>
          <p class="test-quote">
            "Their event transport coordination for our annual conference was absolutely flawless — multiple pickup points, on-time arrivals, and professional drivers throughout. Highly recommended."
          </p>
          <div class="test-author-box">
            <div class="author-avatar">RP</div>
            <div class="author-info">
              <h5>Transport Head</h5>
              <p>AON</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================================================
       14. SAFETY FIRST, ALWAYS (TRAINING & COMPLIANCE 4 PILLARS)
       ========================================================================== -->
  <section class="section-padding safety-section" id="training">
    <div class="container">
      <div class="section-header">
        <div class="section-tag"><i class="fas fa-user-shield"></i> Training &amp; Compliance</div>
        <h2 class="section-title">Safety <em>First, Always</em></h2>
        <p class="section-sub">
          Our drivers and operations team undergo rigorous, structured training to ensure every passenger reaches safely, every time.
        </p>
      </div>

      <div class="safety-grid">
        <div class="safety-card">
          <span class="safety-card-icon">🚗</span>
          <h4>Driver Training Programs</h4>
          <p style="margin-bottom: 12px;">Comprehensive training covering defensive driving, road safety, first aid, and passenger handling.</p>
          <ul style="list-style: none; font-size: 0.82rem; color: var(--text-soft); display: flex; flex-direction: column; gap: 6px;">
            <li><i class="fas fa-check" style="color: var(--orange-primary); margin-right: 6px;"></i> Defensive driving certification</li>
            <li><i class="fas fa-check" style="color: var(--orange-primary); margin-right: 6px;"></i> Night driving &amp; fatigue control</li>
            <li><i class="fas fa-check" style="color: var(--orange-primary); margin-right: 6px;"></i> Emergency response training</li>
            <li><i class="fas fa-check" style="color: var(--orange-primary); margin-right: 6px;"></i> Periodic refresher programs</li>
          </ul>
        </div>

        <div class="safety-card">
          <span class="safety-card-icon">🛡️</span>
          <h4>Safety Standards</h4>
          <p style="margin-bottom: 12px;">All vehicles equipped with safety systems and all drivers background-verified for complete peace of mind.</p>
          <ul style="list-style: none; font-size: 0.82rem; color: var(--text-soft); display: flex; flex-direction: column; gap: 6px;">
            <li><i class="fas fa-check" style="color: var(--orange-primary); margin-right: 6px;"></i> Police verification for every driver</li>
            <li><i class="fas fa-check" style="color: var(--orange-primary); margin-right: 6px;"></i> Regular vehicle fitness checks</li>
            <li><i class="fas fa-check" style="color: var(--orange-primary); margin-right: 6px;"></i> CCTV cameras in all vehicles</li>
            <li><i class="fas fa-check" style="color: var(--orange-primary); margin-right: 6px;"></i> Women escort for night shifts</li>
          </ul>
        </div>

        <div class="safety-card">
          <span class="safety-card-icon">📋</span>
          <h4>Compliance Management</h4>
          <p style="margin-bottom: 12px;">End-to-end regulatory compliance handling — from RTO permits to vehicle insurance renewals.</p>
          <ul style="list-style: none; font-size: 0.82rem; color: var(--text-soft); display: flex; flex-direction: column; gap: 6px;">
            <li><i class="fas fa-check" style="color: var(--orange-primary); margin-right: 6px;"></i> RTO permit renewal tracking</li>
            <li><i class="fas fa-check" style="color: var(--orange-primary); margin-right: 6px;"></i> Motor insurance compliance</li>
            <li><i class="fas fa-check" style="color: var(--orange-primary); margin-right: 6px;"></i> PUC &amp; fitness management</li>
            <li><i class="fas fa-check" style="color: var(--orange-primary); margin-right: 6px;"></i> DL validation verification</li>
          </ul>
        </div>

        <div class="safety-card">
          <span class="safety-card-icon">👥</span>
          <h4>Staff Development</h4>
          <p style="margin-bottom: 12px;">Our operations and support staff are trained for efficient fleet coordination and client communication.</p>
          <ul style="list-style: none; font-size: 0.82rem; color: var(--text-soft); display: flex; flex-direction: column; gap: 6px;">
            <li><i class="fas fa-check" style="color: var(--orange-primary); margin-right: 6px;"></i> Customer service excellence</li>
            <li><i class="fas fa-check" style="color: var(--orange-primary); margin-right: 6px;"></i> Technology platform training</li>
            <li><i class="fas fa-check" style="color: var(--orange-primary); margin-right: 6px;"></i> Crisis management protocols</li>
            <li><i class="fas fa-check" style="color: var(--orange-primary); margin-right: 6px;"></i> Quality audit processes</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================================================
       15. FLEET GALLERY (A GLIMPSE OF OUR FLEET)
       ========================================================================== -->
  <section class="section-padding" style="background: #080B12; border-top: 1px solid var(--border-glass);" id="gallery">
    <div class="container">
      <div class="section-header">
        <div class="section-tag"><i class="fas fa-camera"></i> Fleet Gallery</div>
        <h2 class="section-title">A Glimpse of <em>Our Fleet</em></h2>
        <p class="section-sub">
          Actual photographs of our active corporate transport vehicles lined up and ready for deployment in Bengaluru.
        </p>
      </div>

      <div class="fleet-gallery-grid">
        <div class="gallery-photo-card">
          <img src="assets/images/gallery_1.jpeg" alt="Orange Cabs Fleet Lineup 1">
          <div class="gallery-overlay-tag">Executive Sedans Lineup</div>
        </div>
        <div class="gallery-photo-card">
          <img src="assets/images/gallery_2.jpeg" alt="Orange Cabs Fleet Lineup 2">
          <div class="gallery-overlay-tag">Corporate Shift Vehicles</div>
        </div>
        <div class="gallery-photo-card">
          <img src="assets/images/gallery_3.jpeg" alt="Orange Cabs Fleet Lineup 3">
          <div class="gallery-overlay-tag">Eco-Fleet Ready for Transit</div>
        </div>
        <div class="gallery-photo-card">
          <img src="assets/images/gallery_4.jpeg" alt="Orange Cabs Fleet Lineup 4">
          <div class="gallery-overlay-tag">SUV &amp; MUV Crysta Fleet</div>
        </div>
        <div class="gallery-photo-card">
          <img src="assets/images/gallery_5.jpeg" alt="Orange Cabs Fleet Lineup 5">
          <div class="gallery-overlay-tag">Tempo Travellers &amp; Vans</div>
        </div>
        <div class="gallery-photo-card">
          <img src="assets/images/gallery_6.jpeg" alt="Orange Cabs Fleet Lineup 6">
          <div class="gallery-overlay-tag">Inspection &amp; Dispatch Hub</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================================================
       16. INTERACTIVE CORPORATE FARE & FLEET ESTIMATOR CALCULATOR
       ========================================================================== -->
  <section class="section-padding calculator-section" id="calculator">
    <div class="container">
      <div class="section-header">
        <div class="section-tag"><i class="fas fa-calculator"></i> Corporate Budget Estimator</div>
        <h2 class="section-title">Calculate Your <em>Mobility Budget</em></h2>
        <p class="section-sub">
          Transparent, predictable corporate pricing. Select your vehicle preference and commute volume to calculate a reliable monthly enterprise projection.
        </p>
      </div>

      <div class="calc-container">
        <!-- Input Controls -->
        <div class="calc-inputs">
          <div class="calc-group">
            <label class="calc-label" for="calc-vehicle">
              <span>Select Vehicle Category</span>
            </label>
            <select id="calc-vehicle" class="calc-select">
              <option value="ev">Electric Sedan (EV 4-Seater) — Green Commute</option>
              <option value="cng">Eco CNG Sedan (4-Seater) — High Efficiency</option>
              <option value="sedan" selected>Executive Sedan (Dzire / Etios) — Classic Corporate</option>
              <option value="suv">Luxury SUV / MUV (Innova Crysta / Ertiga 7-Seater)</option>
              <option value="tempo">Tempo Traveller (12–17 Seater AC Group)</option>
              <option value="coach">Luxury Coach (35–45 Seater Volvo/Scania)</option>
              <option value="bus">Enterprise Staff Bus (50+ Seater Heavy Transit)</option>
            </select>
          </div>

          <div class="calc-group">
            <label class="calc-label" for="calc-distance">
              <span>Average Daily Distance per Vehicle</span>
              <span class="val-display" id="calc-distance-val">60 km / day</span>
            </label>
            <input type="range" id="calc-distance" class="calc-range" min="20" max="250" value="60" step="5">
          </div>

          <div class="calc-group">
            <label class="calc-label" for="calc-count">
              <span>Fleet Volume (Number of Cabs / Buses)</span>
              <span class="val-display" id="calc-count-val">5 vehicles</span>
            </label>
            <input type="range" id="calc-count" class="calc-range" min="1" max="50" value="5" step="1">
          </div>

          <div class="calc-group">
            <label class="calc-label" for="calc-shifts">
              <span>Daily Shift Operations</span>
            </label>
            <select id="calc-shifts" class="calc-select">
              <option value="1">Single Shift (Morning Pickup &amp; Evening Drop)</option>
              <option value="2">Two Shifts (General + Afternoon / Night)</option>
              <option value="3">Round-the-Clock (24/7 3-Shift BPO Operations)</option>
            </select>
          </div>
        </div>

        <!-- Real-Time Results Card -->
        <div class="calc-results-card">
          <div class="calc-results-header">
            <h3>Enterprise Projection</h3>
            <p>Based on 26 monthly operational billing days with GPS telematics included</p>
          </div>

          <div class="calc-estimated-box">
            <div class="calc-cost-label">Estimated Monthly Investment</div>
            <div class="calc-cost-val" id="calc-total-cost">₹2,79,500 <small>/ month</small></div>
          </div>

          <ul class="calc-summary-list">
            <li>
              <span>Vehicle Class</span>
              <span id="calc-sum-vehicle">Executive Sedan</span>
            </li>
            <li>
              <span>Fleet Sizing</span>
              <span id="calc-sum-vehicles">5 Fleet Units</span>
            </li>
            <li>
              <span>Daily Target</span>
              <span id="calc-sum-distance">60 km daily</span>
            </li>
            <li>
              <span>ESG Impact</span>
              <span id="calc-sum-eco" style="color: var(--orange-light);">Euro 6 Compliant</span>
            </li>
          </ul>

          <a href="#" id="calc-whatsapp-btn" target="_blank" class="btn btn-primary btn-glow" style="width: 100%;">
            <i class="fab fa-whatsapp"></i>
            <span>Lock In Enterprise Quote on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================================================
       17. FREQUENTLY ASKED QUESTIONS (ACCORDION)
       ========================================================================== -->
  <section class="section-padding faq-section" id="faq">
    <div class="container">
      <div class="section-header">
        <div class="section-tag"><i class="fas fa-question-circle"></i> FAQ</div>
        <h2 class="section-title">Frequently Asked <em>Questions</em></h2>
        <p class="section-sub">
          Everything enterprise HR leaders and facility managers need to know about partnering with Sri Vijay Tours &amp; Travels.
        </p>
      </div>

      <div class="faq-list">
        <div class="faq-item active">
          <div class="faq-question">
            <h4>What areas do you serve in Bengaluru?</h4>
            <div class="faq-toggle-icon"><i class="fas fa-plus"></i></div>
          </div>
          <div class="faq-answer">
            <p>
              We serve all major IT corridors in Bengaluru including Whitefield, Electronic City, Marathahalli, Bellandur, Sarjapur Road, Koramangala, and the Outer Ring Road tech parks. We're also based in Hosakote Taluk and serve surrounding industrial clusters.
            </p>
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <h4>Do you provide dedicated vehicles for companies?</h4>
            <div class="faq-toggle-icon"><i class="fas fa-plus"></i></div>
          </div>
          <div class="faq-answer">
            <p>
              Yes, we offer both dedicated (exclusive fleet for one client) and shared fleet models. Our account managers recommend the best model based on your headcount, shift patterns, and budget.
            </p>
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <h4>How is driver safety verified?</h4>
            <div class="faq-toggle-icon"><i class="fas fa-plus"></i></div>
          </div>
          <div class="faq-answer">
            <p>
              All drivers undergo police verification, medical fitness check, driving license validation, and background check before onboarding. They also receive periodic safety and soft-skills training throughout their tenure.
            </p>
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <h4>What technology solutions come with your transport service?</h4>
            <div class="faq-toggle-icon"><i class="fas fa-plus"></i></div>
          </div>
          <div class="faq-answer">
            <p>
              We provide GPS live tracking via Nyletech, employee and driver mobile apps, automated billing reports, rostering software by Technology Partners, and a corporate admin dashboard — all included in enterprise contracts.
            </p>
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <h4>Do you handle night shifts and women's safety requirements?</h4>
            <div class="faq-toggle-icon"><i class="fas fa-plus"></i></div>
          </div>
          <div class="faq-answer">
            <p>
              Absolutely. We have dedicated protocols for night cabs including mandatory escort/guard for women employees, real-time monitoring, and a 24/7 emergency helpline. All night vehicles are fitted with CCTV cameras.
            </p>
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <h4>How do I get a quote for my company?</h4>
            <div class="faq-toggle-icon"><i class="fas fa-plus"></i></div>
          </div>
          <div class="faq-answer">
            <p>
              Call us at +91 98452 33300 or +91 95352 29994, email sales@srivijaytravels.com, or click the "Request a Quote" button on this page. Our team responds within 2 business hours with a customized proposal.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================================================
       18. LATEST UPDATES (BLOG & NEWS 3 CARDS)
       ========================================================================== -->
  <section class="section-padding" style="background: var(--bg-deep); border-top: 1px solid var(--border-glass);" id="blog">
    <div class="container">
      <div class="section-header">
        <div class="section-tag"><i class="fas fa-newspaper"></i> Blog &amp; News</div>
        <h2 class="section-title">Latest <em>Updates</em></h2>
        <p class="section-sub">
          Insights on employee mobility, transport compliance in Karnataka, and corporate fleet sustainability.
        </p>
      </div>

      <div class="blog-updates-grid">
        <div class="blog-card">
          <div class="blog-card-media">
            <img src="assets/images/SAFETY.jpg" alt="GPS Tracking Safety">
            <span class="blog-tag">SAFETY</span>
          </div>
          <div class="blog-card-content">
            <div>
              <h3>5 Ways GPS Tracking Improves Corporate Transport Safety</h3>
              <p>How real-time GPS monitoring is transforming employee transport safety standards across Bengaluru's IT parks.</p>
            </div>
            <div class="blog-card-meta">
              <span>📅 Jan 2025</span>
              <span>5 min read</span>
            </div>
          </div>
        </div>

        <div class="blog-card">
          <div class="blog-card-media">
            <img src="assets/images/COMPLIANCE.jpg" alt="Karnataka Transport Rules">
            <span class="blog-tag">COMPLIANCE</span>
          </div>
          <div class="blog-card-content">
            <div>
              <h3>Karnataka Transport Rules Every Corporate Should Know in 2025</h3>
              <p>A guide to the latest RTO compliance requirements for corporate transport fleets in Karnataka.</p>
            </div>
            <div class="blog-card-meta">
              <span>📅 Mar 2025</span>
              <span>7 min read</span>
            </div>
          </div>
        </div>

        <div class="blog-card">
          <div class="blog-card-media">
            <img src="assets/images/SUSTAINABILITY.jpg" alt="EV Fleets in Bengaluru">
            <span class="blog-tag">INNOVATION</span>
          </div>
          <div class="blog-card-content">
            <div>
              <h3>The Future of Employee Transport: EV Fleets in Bengaluru</h3>
              <p>Sri Vijay Tours &amp; Travels explores the transition to electric vehicles for corporate transport and CSR goals.</p>
            </div>
            <div class="blog-card-meta">
              <span>📅 Apr 2025</span>
              <span>6 min read</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================================================
       19. CONTACT & ENTERPRISE RFP SECTION (LET'S CONNECT)
       ========================================================================== -->
  <section class="section-padding contact-section" id="contact">
    <div class="container">
      <div class="contact-layout">

        <!-- Left Info Panel -->
        <div class="contact-info-panel">
          <div>
            <div class="section-tag"><i class="fas fa-paper-plane"></i> Contact Us</div>
            <h2 class="section-title">Let’s <em>Connect</em></h2>
            <p class="section-sub">
              Reach out to discuss your transport requirements. Our team responds within 2 hours on business days.
            </p>
          </div>

          <div class="contact-card-box">
            <div class="contact-box-icon"><i class="fas fa-map-marker-alt"></i></div>
            <div class="contact-box-text">
              <h4>Registered Office</h4>
              <p>Shop No. 7, 8, 9, 1st Floor, Whitefield Main Road, Samethanahalli, Hosakote Taluk, Bengaluru – 560 067</p>
            </div>
          </div>

          <div class="contact-card-box">
            <div class="contact-box-icon"><i class="fas fa-phone-volume"></i></div>
            <div class="contact-box-text">
              <h4>Sales &amp; Enquiries</h4>
              <a href="tel:+919845233300">+91 98452 33300</a>
              <a href="tel:+919535229994">+91 95352 29994</a>
              <a href="tel:+917411144405">+91 74111 44405</a>
            </div>
          </div>

          <div class="contact-card-box">
            <div class="contact-box-icon"><i class="fas fa-envelope"></i></div>
            <div class="contact-box-text">
              <h4>Email Us</h4>
              <a href="mailto:sales@srivijaytravels.com">sales@srivijaytravels.com</a>
              <a href="mailto:mails@svtorg.com">mails@svtorg.com</a>
              <a href="mailto:support@srivijaytravels.com">support@srivijaytravels.com</a>
            </div>
          </div>

          <div class="contact-card-box">
            <div class="contact-box-icon"><i class="fas fa-clock"></i></div>
            <div class="contact-box-text">
              <h4>Working Hours</h4>
              <p>Operations: 24/7 • Office: Mon–Sat, 9:00 AM – 6:00 PM</p>
            </div>
          </div>
        </div>

        <!-- Right Contact Form -->
        <div class="contact-form-card">
          <h3 style="font-size: 1.6rem; margin-bottom: 8px;">Send Us a Message</h3>
          <p style="font-size: 0.92rem; margin-bottom: 28px;">Fill in your details and send your message directly to our official WhatsApp desk.</p>

          <form id="corporate-contact-form" onsubmit="handleFormSubmit(event)">
            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label" for="form-name">Full Name *</label>
                <input type="text" id="form-name" class="form-control" placeholder="e.g. Ramesh Kumar" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="form-company">Company Name</label>
                <input type="text" id="form-company" class="form-control" placeholder="e.g. Infosys / Bosch">
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label" for="form-email">Email *</label>
                <input type="email" id="form-email" class="form-control" placeholder="your@email.com" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="form-phone">Phone *</label>
                <input type="tel" id="form-phone" class="form-control" placeholder="+91 98452 33300" required>
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label" for="form-service">Service Required</label>
                <select id="form-service" class="form-control">
                  <option value="Corporate Transport">Corporate Transport</option>
                  <option value="Employee Transportation">Employee Transportation</option>
                  <option value="Event Transport">Event Transport</option>
                  <option value="Fleet Management">Fleet Management</option>
                  <option value="GPS & Technology">GPS &amp; Technology</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="form-volume">Number of Employees / Vehicles</label>
                <input type="text" id="form-volume" class="form-control" placeholder="e.g. 50 employees / 5 cabs">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="form-message">Message</label>
              <textarea id="form-message" class="form-control" placeholder="Tell us your pickup areas, shifts, or specific needs..."></textarea>
            </div>

            <button type="submit" class="btn btn-primary btn-glow" style="width: 100%; padding: 16px;">
              <i class="fab fa-whatsapp"></i>
              <span>Send via WhatsApp 💬</span>
            </button>
            <div style="font-size: 0.78rem; color: var(--text-dim); text-align: center; margin-top: 10px;">
              Your message will open directly in WhatsApp to +91 98452 33300
            </div>
          </form>
        </div>

      </div>
    </div>
  </section>

  <!-- ==========================================================================
       20. FOOTER (With Developer credit: Designed and developed by primepro.ai)
       ========================================================================== -->
  <footer class="footer">
    <div class="container">
      <div class="footer-top">

        <div class="footer-brand">
          <a href="index.html" class="brand-logo">
            <div class="logo-symbol"><span>OC</span></div>
            <div class="logo-text-group">
              <div class="brand-title">ORANGE<span>CABS</span></div>
              <div class="brand-subtitle">Sri Vijay Tours &amp; Travels Pvt. Ltd.</div>
            </div>
          </a>
          <p>
            Karnataka's most trusted ISO 9001:2015 certified corporate transport partner. Powered by Nyletech &amp; Technology Partners. Serving 10+ leading enterprises since 2016.
          </p>
          <div style="display: flex; gap: 12px; margin-top: 16px;">
            <a href="tel:+919845233300" class="spec-badge" style="background: rgba(255,255,255,0.05); padding: 8px 14px; border-radius: 8px;"><i class="fas fa-phone"></i> +91 98452 33300</a>
            <a href="https://wa.me/919845233300" target="_blank" class="spec-badge" style="background: rgba(37,211,102,0.15); color:#25D366; padding: 8px 14px; border-radius: 8px;"><i class="fab fa-whatsapp"></i> WhatsApp</a>
          </div>
        </div>

        <div class="footer-col">
          <h4>Services</h4>
          <ul class="footer-links">
            <li><a href="#services">Corporate Transport</a></li>
            <li><a href="#services">Employee Transportation</a></li>
            <li><a href="#services">Event Transport</a></li>
            <li><a href="#services">Fleet Management</a></li>
            <li><a href="#technology">GPS Technology</a></li>
            <li><a href="#operations">24/7 Support</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Company</h4>
          <ul class="footer-links">
            <li><a href="#about">About Us</a></li>
            <li><a href="#tech-partners">Technology Partners</a></li>
            <li><a href="#certifications">Certifications</a></li>
            <li><a href="#training">Training &amp; Safety</a></li>
            <li><a href="#clients">Our Clients</a></li>
            <li><a href="#blog">Blog &amp; News</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Contact Info</h4>
          <p style="font-size: 0.88rem; line-height: 1.6; margin-bottom: 10px; color: var(--text-soft);">
            Shop No. 7, 8, 9, 1st Floor, Whitefield Main Road, Samethanahalli, Hosakote Taluk, Bengaluru – 560 067
          </p>
          <div style="font-size: 0.85rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 4px;">
            <span>📞 +91 98452 33300</span>
            <span>📞 +91 95352 29994</span>
            <span>✉️ sales@srivijaytravels.com</span>
          </div>
        </div>

      </div>

      <div class="footer-bottom">
        <div class="footer-copy">
          © 2026 Sri Vijay Tours &amp; Travels Pvt. Ltd. (Orange Cabs). All rights reserved.
        </div>

        <!-- Strict user requirement: Designed and developed by primepro.ai -->
        <a href="https://primepro.ai" target="_blank" rel="noopener noreferrer" class="developer-badge" title="AI-Driven Web Architecture">
          <span>Designed and developed by</span>
          <strong>primepro.ai</strong>
          <i class="fas fa-external-link-alt" style="font-size: 0.75rem;"></i>
        </a>
      </div>
    </div>
  </footer>

  <!-- ==========================================================================
       FLOATING ACTION BUTTONS (CALLING, WHATSAPP, AI CHATBOT)
       ========================================================================== -->
  <div class="floating-widget-bar">
    <!-- Call Trigger -->
    <a href="tel:+919845233300" class="float-action-btn float-btn-call" aria-label="Call Sri Vijay Travels" title="Instant Phone Call">
      <i class="fas fa-phone-alt"></i>
      <span class="float-tooltip">Call +91 98452 33300</span>
    </a>

    <!-- WhatsApp Trigger -->
    <a href="https://wa.me/919845233300?text=Hello%20Orange%20Cabs!%20I%20would%20like%20to%20request%20an%20instant%20corporate%20mobility%20quote." target="_blank" class="float-action-btn float-btn-whatsapp" aria-label="WhatsApp Us" title="Instant WhatsApp">
      <i class="fab fa-whatsapp"></i>
      <span class="float-tooltip">Chat on WhatsApp</span>
    </a>

    <!-- 3D AI Concierge Bot Trigger -->
    <button type="button" class="float-action-btn float-btn-ai" id="ai-chatbot-toggle" aria-label="Open AI Assistant" title="OrangeAI Concierge">
      <div class="ai-ping-ring"></div>
      <div class="ai-status-badge"></div>
      <i class="fas fa-robot"></i>
      <span class="float-tooltip">OrangeAI Concierge</span>
    </button>
  </div>

  <!-- ==========================================================================
       AI CONCIERGE CHATBOT DIALOG WINDOW
       ========================================================================== -->
  <div class="ai-chatbot-window" id="ai-chatbot-window">
    <div class="chatbot-header">
      <div class="chatbot-brand-head">
        <div class="chatbot-avatar">
          <i class="fas fa-robot"></i>
        </div>
        <div class="chatbot-info">
          <h4>OrangeAI Concierge</h4>
          <p><span class="pulse-indicator"></span> Online • Instant Answers</p>
        </div>
      </div>
      <button class="chatbot-close-btn" id="ai-chatbot-close" aria-label="Close Assistant">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <div class="chatbot-messages-body" id="chatbot-messages">
      <div class="chat-bubble bot">
        Hello! 👋 Welcome to <strong>Sri Vijay Tours &amp; Travels (Orange Cabs)</strong>. I am your 24/7 AI Mobility Assistant. How may I assist your corporate commute or fleet planning today?
        <div class="chat-quick-chips">
          <span class="quick-chip">🌱 EV Fleet Options</span>
          <span class="quick-chip">💼 Corporate Quote</span>
          <span class="quick-chip">🛡️ Safety &amp; POSH</span>
          <span class="quick-chip">📞 Call Operations</span>
        </div>
      </div>
    </div>

    <div class="chatbot-input-footer">
      <input type="text" class="chatbot-input" id="chatbot-input" placeholder="Ask about fleets, rates, routes...">
      <button class="chatbot-send-btn" id="chatbot-send" aria-label="Send Message">
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
  </div>

  <!-- ==========================================================================
       MODALS: REQUEST QUOTE & FLEET INQUIRY
       ========================================================================== -->
  <div class="modal-overlay" id="modal-quote">
    <div class="modal-container">
      <button class="modal-close-btn">&times;</button>
      <div class="section-tag" style="margin-bottom: 12px;"><i class="fas fa-file-invoice"></i> Request a Quote</div>
      <h3 style="font-size: 1.8rem; margin-bottom: 8px;">Request a Quote</h3>
      <p style="font-size: 0.95rem; margin-bottom: 24px;">Fill in your details and we'll send your enquiry directly to our WhatsApp.</p>

      <form onsubmit="handleModalQuote(event)">
        <div class="form-group">
          <label class="form-label">Company Name *</label>
          <input type="text" id="modal-company" class="form-control" placeholder="e.g. Wipro / Infosys" required>
        </div>
        <div class="form-group">
          <label class="form-label">Contact Person *</label>
          <input type="text" id="modal-person" class="form-control" placeholder="e.g. Priya Sharma" required>
        </div>
        <div class="form-group">
          <label class="form-label">Phone *</label>
          <input type="tel" id="modal-phone" class="form-control" placeholder="+91 98452 33300" required>
        </div>
        <div class="form-group">
          <label class="form-label">Service Required</label>
          <select id="modal-vehicle" class="form-control">
            <option value="Corporate Transport">Corporate Transport</option>
            <option value="Employee Transportation" selected>Employee Transportation</option>
            <option value="Event Transport">Event Transport</option>
            <option value="Fleet Management">Fleet Management</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">No. of Employees / Vehicles</label>
          <input type="text" id="modal-count" class="form-control" placeholder="e.g. 50 employees">
        </div>
        <button type="submit" class="btn btn-primary btn-glow" style="width: 100%; padding: 14px; margin-top: 10px;">
          <i class="fab fa-whatsapp"></i> Send to WhatsApp 💬
        </button>
      </form>
    </div>
  </div>

  <!-- Fleet Inquiry Modal -->
  <div class="modal-overlay" id="modal-fleet-inquiry">
    <div class="modal-container">
      <button class="modal-close-btn">&times;</button>
      <div class="section-tag" style="margin-bottom: 12px;"><i class="fas fa-car"></i> Fleet Inquiry</div>
      <h3 style="font-size: 1.8rem; margin-bottom: 8px;">Fleet Inquiry</h3>
      <p style="font-size: 0.95rem; margin-bottom: 24px;">Tell us your fleet requirements and we'll tailor the perfect solution for you.</p>

      <form onsubmit="handleFleetInquiry(event)">
        <div class="form-group">
          <label class="form-label">Vehicle Type Needed *</label>
          <select id="fi-vehicle" class="form-control">
            <option value="Electric (EV)">Electric (EV)</option>
            <option value="CNG Vehicle">CNG Vehicle</option>
            <option value="Executive Sedan" selected>Executive Sedan</option>
            <option value="SUV / MUV — Ertiga / Innova">SUV / MUV — Ertiga / Innova</option>
            <option value="Tempo Traveller">Tempo Traveller</option>
            <option value="Luxury Coach">Luxury Coach</option>
            <option value="Staff Bus">Staff Bus</option>
            <option value="Mixed Fleet">Mixed Fleet</option>
          </select>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Quantity Required</label>
            <input type="number" id="fi-qty" class="form-control" value="5" min="1">
          </div>
          <div class="form-group">
            <label class="form-label">Contract Duration</label>
            <input type="text" id="fi-duration" class="form-control" placeholder="e.g. 1 Year">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Your Name &amp; Contact Number *</label>
          <input type="text" id="fi-contact" class="form-control" placeholder="Name and Phone Number" required>
        </div>
        <div class="form-group">
          <label class="form-label">Company Name</label>
          <input type="text" id="fi-company" class="form-control" placeholder="Company Name">
        </div>
        <button type="submit" class="btn btn-primary btn-glow" style="width: 100%; padding: 14px; margin-top: 10px;">
          <i class="fab fa-whatsapp"></i> Send Fleet Inquiry via WhatsApp 💬
        </button>
      </form>
    </div>
  </div>

  <!-- Modal: Fleet Specs -->
  <div class="modal-overlay" id="modal-fleet-specs">
    <div class="modal-container">
      <button class="modal-close-btn">&times;</button>
      <div class="section-tag" style="margin-bottom: 12px;"><i class="fas fa-info-circle"></i> Technical Blueprint</div>
      <h3 id="spec-modal-title" style="font-size: 1.8rem; margin-bottom: 8px;">Vehicle Specifications</h3>
      <p id="spec-modal-desc" style="font-size: 0.95rem; margin-bottom: 24px;">Comprehensive technical and comfort parameters for corporate fleet allocation.</p>

      <div style="background: rgba(255,255,255,0.03); border-radius: 14px; padding: 20px; border: 1px solid var(--border-glass); margin-bottom: 24px;">
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 12px; font-size: 0.92rem;">
          <li style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);"><i class="fas fa-satellite" style="color: var(--orange-primary); margin-right: 8px;"></i> Telematics:</span>
            <strong>Nyletech Real-Time GPS Tracking</strong>
          </li>
          <li style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);"><i class="fas fa-bell" style="color: var(--orange-primary); margin-right: 8px;"></i> Emergency Alert:</span>
            <strong>Dual In-Cabin Physical SOS Panic Buttons</strong>
          </li>
          <li style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);"><i class="fas fa-id-badge" style="color: var(--orange-primary); margin-right: 8px;"></i> Driver Screening:</span>
            <strong>Police Verified &amp; POSH Trained Chauffeur</strong>
          </li>
          <li style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);"><i class="fas fa-video" style="color: var(--orange-primary); margin-right: 8px;"></i> Surveillance:</span>
            <strong>CCTV Dashcam Monitored</strong>
          </li>
          <li style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);"><i class="fas fa-certificate" style="color: var(--orange-primary); margin-right: 8px;"></i> Compliance:</span>
            <strong>ISO 9001:2015 &amp; RTO Permitted</strong>
          </li>
        </ul>
      </div>

      <a href="https://wa.me/919845233300?text=Hello%20Orange%20Cabs!%20I%20would%20like%20to%20book%20a%20commercial%20trial%20for%20this%20vehicle%20category." target="_blank" class="btn btn-primary" style="width: 100%;">
        <i class="fab fa-whatsapp"></i> Book Corporate Inspection / Trial
      </a>
    </div>
  </div>

  <!-- Form Handling Script -->
  <script>
    function switchBookingTab(btn, serviceName) {
      document.querySelectorAll('.booking-service-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }

    function handleHeroQuickBooking(e) {
      e.preventDefault();
      const activeTab = document.querySelector('.booking-service-tabs .tab-btn.active').textContent.trim();
      const pickup = document.getElementById('hb-pickup').value;
      const drop = document.getElementById('hb-drop').value;
      const date = document.getElementById('hb-date').value;
      const time = document.getElementById('hb-time').value;
      const cab = document.getElementById('hb-cab').value;

      const text = encodeURIComponent(
        `*Quick Cab Booking — Sri Vijay Tours & Travels (Orange Cabs)*\n` +
        `• *Service:* ${activeTab}\n` +
        `• *From:* ${pickup}\n` +
        `• *To:* ${drop}\n` +
        `• *Date:* ${date}\n` +
        `• *Time:* ${time}\n` +
        `• *Vehicle:* ${cab}`
      );

      const whatsappHref = window.orangeContactSettings?.whatsappHref;
      if (whatsappHref) window.open(`${whatsappHref}?text=${text}`, '_blank');
    }

    function handleFormSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('form-name').value;
      const company = document.getElementById('form-company').value;
      const phone = document.getElementById('form-phone').value;
      const email = document.getElementById('form-email').value;
      const service = document.getElementById('form-service').value;
      const volume = document.getElementById('form-volume').value;
      const message = document.getElementById('form-message').value;

      const text = encodeURIComponent(
        `*New Corporate Mobility Inquiry — Sri Vijay Travels (Orange Cabs)*\n` +
        `• *Name:* ${name}\n` +
        `• *Company:* ${company || 'N/A'}\n` +
        `• *Phone:* ${phone}\n` +
        `• *Email:* ${email}\n` +
        `• *Service:* ${service}\n` +
        `• *Employees/Vehicles:* ${volume || 'N/A'}\n` +
        `• *Details:* ${message || 'N/A'}`
      );

      const whatsappHref = window.orangeContactSettings?.whatsappHref;
      if (whatsappHref) window.open(`${whatsappHref}?text=${text}`, '_blank');
    }

    function handleModalQuote(e) {
      e.preventDefault();
      const company = document.getElementById('modal-company').value;
      const person = document.getElementById('modal-person').value;
      const phone = document.getElementById('modal-phone').value;
      const service = document.getElementById('modal-vehicle').value;
      const count = document.getElementById('modal-count').value;

      const text = encodeURIComponent(
        `*Corporate RFP Quote Request — Sri Vijay Travels (Orange Cabs)*\n` +
        `• *Company:* ${company}\n` +
        `• *Contact:* ${person}\n` +
        `• *Phone:* ${phone}\n` +
        `• *Service:* ${service}\n` +
        `• *Employees/Vehicles:* ${count || 'N/A'}`
      );

      const whatsappHref = window.orangeContactSettings?.whatsappHref;
      if (whatsappHref) window.open(`${whatsappHref}?text=${text}`, '_blank');
      document.getElementById('modal-quote').classList.remove('open');
      document.body.style.overflow = '';
    }

    function handleFleetInquiry(e) {
      e.preventDefault();
      const vehicle = document.getElementById('fi-vehicle').value;
      const qty = document.getElementById('fi-qty').value;
      const duration = document.getElementById('fi-duration').value;
      const contact = document.getElementById('fi-contact').value;
      const company = document.getElementById('fi-company').value;

      const text = encodeURIComponent(
        `*Fleet Inquiry — Sri Vijay Travels (Orange Cabs)*\n` +
        `• *Vehicle Needed:* ${vehicle}\n` +
        `• *Quantity:* ${qty}\n` +
        `• *Duration:* ${duration || 'N/A'}\n` +
        `• *Contact:* ${contact}\n` +
        `• *Company:* ${company || 'N/A'}`
      );

      const whatsappHref = window.orangeContactSettings?.whatsappHref;
      if (whatsappHref) window.open(`${whatsappHref}?text=${text}`, '_blank');
      document.getElementById('modal-fleet-inquiry').classList.remove('open');
      document.body.style.overflow = '';
    }

    // Set today date as default in booking date picker
    document.addEventListener('DOMContentLoaded', () => {
      const dateInput = document.getElementById('hb-date');
      if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        dateInput.min = today;
      }
    });
  </script>

  <!-- Interactive Scripts -->
  <script src="assets/js/main.js"></script>
  <script src="assets/js/chatbot.js"></script>
</body>
</html>
'''

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print(f"Successfully wrote full index.html ({len(html_content)} characters)")
