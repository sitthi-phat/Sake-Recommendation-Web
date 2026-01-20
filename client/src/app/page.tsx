'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LogIn, User, CircleUserRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Check if user is registered
      const checkRegistration = async () => {
        try {
          // @ts-ignore
          const channelUserId = session.user.id;
          // @ts-ignore
          const registeredChannel = session.user.provider;

          if (!channelUserId || !registeredChannel) {
            // Should not happen if auth works, but safe fallback
            router.push('/products');
            return;
          }

          // Capitalize first letter to match Enum in DB path
          const providerEnum = registeredChannel.charAt(0).toUpperCase() + registeredChannel.slice(1);

          const res = await fetch('/api/proxy/auth/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              channelUserId,
              registeredChannel: providerEnum
            }),
          });

          const data = await res.json();
          if (data.exists) {
            router.push('/products');
          } else {
            router.push('/register');
          }
        } catch (error) {
          console.error('Check registration failed', error);
          // Fallback to products or stay here? 
          // Better to let them through to products or show error? 
          // MVP rule: Fail safe to products? No, that breaks the "New User" flow requirement.
          // Let's go to register if check fails, or maybe just products.
          router.push('/products');
        }
      };

      checkRegistration();
    }
  }, [session, status, router]);

  const handleLogin = (provider: string) => {
    // Real OAuth Login
    const providerId = provider.toLowerCase();
    // Callback to home page so we can run the check logic
    signIn(providerId, { callbackUrl: '/' });
  };

  const socialButtons = [
    { name: 'Line', color: '#06C755', icon: 'L', textColor: '#fff' },
    { name: 'Google', color: '#fff', icon: 'G', textColor: '#000' },
    { name: 'Facebook', color: '#1877F2', icon: 'f', textColor: '#fff' },
    { name: 'Apple', color: '#000', icon: 'A', textColor: '#fff' },
  ];

  return (
    <main style={styles.container}>
      {/* Background Decorative Elements */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass-panel"
        style={styles.card}
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={styles.title}
        >
          Sake <span style={{ color: 'var(--primary)' }}>Select</span>
        </motion.h1>

        <p style={styles.subtitle}>Discover the perfect sake for your palate.</p>

        <div style={styles.buttonGroup}>
          {socialButtons.map((btn, index) => (
            <motion.button
              key={btn.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ ...styles.socialBtn, backgroundColor: btn.color, color: btn.textColor }}
              onClick={() => handleLogin(btn.name)}
            >
              <span style={styles.icon}>{btn.icon}</span>
              Continue with {btn.name}
            </motion.button>
          ))}
        </div>

        <div style={styles.separator}>
          <span style={styles.line}></span>
          <span style={styles.or}>or</span>
          <span style={styles.line}></span>
        </div>

        <Link href="/products?guest=true" style={{ width: '100%' }}>
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
            whileTap={{ scale: 0.98 }}
            style={styles.guestBtn}
            className="secondary-btn"
          >
            <User size={20} style={{ marginRight: 8 }} />
            Continue as Guest
          </motion.button>
        </Link>
      </motion.div>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: '20px',
  },
  blob1: {
    position: 'absolute',
    top: '-10%',
    left: '-10%',
    width: '50vw',
    height: '50vw',
    background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(0,0,0,0) 70%)',
    borderRadius: '50%',
    filter: 'blur(40px)',
    zIndex: -1,
  },
  blob2: {
    position: 'absolute',
    bottom: '-10%',
    right: '-10%',
    width: '40vw',
    height: '40vw',
    background: 'radial-gradient(circle, rgba(28,34,55,0.8) 0%, rgba(0,0,0,0) 70%)',
    borderRadius: '50%',
    filter: 'blur(40px)',
    zIndex: -1,
  },
  card: {
    padding: '40px',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: '3rem',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#A0AEC0',
    marginBottom: '32px',
    fontSize: '1.1rem',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px',
  },
  socialBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '1rem',
    border: 'none',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  icon: {
    marginRight: '10px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  separator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
    color: '#A0AEC0',
  },
  line: {
    height: '1px',
    background: 'rgba(255,255,255,0.1)',
    flex: 1,
  },
  or: {
    padding: '0 10px',
    fontSize: '0.9rem',
  },
  guestBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};
