import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBanners } from '../services/bannerService';
import { getCategories } from '../services/categoryService';
import { getFeaturedProducts, getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import styles from './Home.module.css';

const testimonials = [
  { id: 1, name: "Priya S.", location: "Kochi", rating: 5, text: "Excellent collection and the quality is amazing. Fast delivery and beautiful packaging. Totally loved the Onam special collection!" },
  { id: 2, name: "Remni Nair", location: "Thrissur", rating: 5, text: "Very happy with the purchase. The pattu pavada is even more beautiful in person. My daughter loved it!" },
  { id: 3, name: "Jitha K.", location: "Trivandrum", rating: 5, text: "Capybara has the best traditional collection. Great customer service and premium quality products." },
];

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannersRes, catsRes, featuredRes, newRes] = await Promise.all([
          getBanners().catch(() => ({ results: [] })),
          getCategories().catch(() => ({ results: [] })),
          getFeaturedProducts().catch(() => ({ results: [] })),
          getProducts({ ordering: '-created_at', page_size: 4 }).catch(() => ({ results: [] })),
        ]);
        setBanners(bannersRes.results || bannersRes || []);
        setCategories(catsRes.results || catsRes || []);
        setFeatured(featuredRes.results || featuredRes || []);
        setNewArrivals(newRes.results || newRes || []);
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner />;

  const heroBanner = banners[0] || null;

  return (
    <div className={styles.home}>

    {/* Trust bar — scrolling marquee on mobile */}
      <div className={styles['trust-bar']}>
        <div className={styles['trust-track']}>
          <span>🚚 Free Shipping on orders above ₹999</span>
          <span>🔄 Easy 10-day returns</span>
          <span>⭐ Premium Quality — Trusted by 10,000+ customers</span>
          <span>🔒 Secure Payments</span>
          <span>📞 24/7 Support</span>
          {/* Duplicate for seamless loop */}
          <span>🚚 Free Shipping on orders above ₹999</span>
          <span>🔄 Easy 10-day returns</span>
          <span>⭐ Premium Quality — Trusted by 10,000+ customers</span>
          <span>🔒 Secure Payments</span>
          <span>📞 24/7 Support</span>
        </div>
      </div>

      {/* Category Circles */}
      {categories.length > 0 && (
        <section className={`${styles.categories} container`}>
          {categories.map(c => (
            <Link to={`/shop?category__slug=${c.slug}`} key={c.id} className={styles['cat-circle']}>
              <div className={styles['cat-circle-img']}>
                {c.image && <img src={c.image} alt={c.name} />}
              </div>
              <span>{c.name}</span>
            </Link>
          ))}
        </section>
      )}


      {/* Hero Banner */}
      {heroBanner && (
        <section className={styles['hero-banner']}>
          <Link to={heroBanner.button_url || '/shop'}>
            <img src={heroBanner.image} alt={heroBanner.title || 'Promotional Banner'} />
          </Link>
        </section>
      )}


      {/* Shop by Collection */}
      {categories.length > 0 && (
        <section className="section container">
          <h2 className="section-title">Shop by Collection</h2>
          <div className={styles['collections-grid']}>
            {categories.map(col => (
              <Link to={`/shop?category__slug=${col.slug}`} key={col.id} className={styles['collection-card']}>
                {col.image && <img src={col.image} alt={col.name} />}
                <div className={styles['collection-overlay']}><span>{col.name}</span></div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="section container">
          <h2 className="section-title">Featured Products ✨</h2>
          <div className={styles['products-grid']}>
            {featured.slice(0, 6).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="section container">
          <div className={styles['section-header']}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>New Arrivals ✨</h2>
            <Link to="/shop" className={styles['view-all']}>View All</Link>
          </div>
          <div className={styles['products-grid']}>
            {newArrivals.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className={styles.testimonials}>
        <div className="container">
          <h2 className="section-title">Thank You for Being a Part of Our Onam!</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '32px' }}>We love our customers &amp; they love us</p>
          <div className={styles['testimonials-grid']}>
            {testimonials.map(t => (
              <div key={t.id} className={styles['testimonial-card']}>
                <div className="stars" style={{ marginBottom: '8px' }}>
                  {[1, 2, 3, 4, 5].map(s => <span key={s} className="star filled">★</span>)}
                </div>
                <p>"{t.text}"</p>
                <div className={styles['testimonial-author']}>
                  <div className={styles['testimonial-avatar']}>{t.name[0]}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.location} · Verified Buyer</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <div className={`${styles['features-bar']} container`}>
        <div className={styles.feature}><span>🚚</span><div><strong>Free Shipping</strong><p>On all orders above ₹999</p></div></div>
        <div className={styles.feature}><span>🔄</span><div><strong>Easy Returns</strong><p>10-day return &amp; exchange policy</p></div></div>
        <div className={styles.feature}><span>🔒</span><div><strong>Secure Payments</strong><p>100% secure payments. Multiple payment options.</p></div></div>
        <div className={styles.feature}><span>📞</span><div><strong>24/7 Support</strong><p>Our customer support team is always here to help you</p></div></div>
      </div>
    </div>
  );
}
