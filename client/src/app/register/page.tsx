'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, ArrowRight, Loader2, LogOut } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [formData, setFormData] = useState({
        nickName: '',
        firstName: '',
        lastName: '',
        mobile: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        } else if (session?.user?.email) {
            setFormData(prev => ({ ...prev, email: session?.user?.email || '' }));
            if (session?.user?.name) {
                const names = session.user.name.split(' ');
                setFormData(prev => ({
                    ...prev,
                    firstName: names[0] || '',
                    lastName: names.slice(1).join(' ') || ''
                }));
            }
        }
    }, [session, status, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // @ts-ignore
            const channelUserId = session?.user?.id;
            // @ts-ignore
            const registeredChannel = session?.user?.provider;

            if (!channelUserId || !registeredChannel) {
                throw new Error('Authentication error. Please try logging in again.');
            }

            const res = await fetch('/api/proxy/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    channelUserId,
                    // Capitalize first letter to match Enum in DB (Line, Google, Facebook)
                    registeredChannel: registeredChannel.charAt(0).toUpperCase() + registeredChannel.slice(1)
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Registration failed');
            }

            router.push('/products');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading') {
        return (
            <div style={styles.loader}>
                <Loader2 className="animate-spin" size={48} color="var(--primary)" />
            </div>
        );
    }

    return (
        <main style={styles.container}>
            <div style={styles.bgOverlay} />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel"
                style={styles.formCard}
            >
                <div style={styles.header}>
                    <h1 style={styles.title}>Welcome!</h1>
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="secondary-btn" style={styles.logoutBtn} title="Logout">
                        <LogOut size={16} /> <span style={{ fontSize: '0.8rem' }}>Logout</span>
                    </button>
                </div>
                <p style={styles.subtitle}>Please complete your registration to continue.</p>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Nickname <span style={{ color: 'red' }}>*</span></label>
                        <div style={styles.inputWrapper}>
                            <User size={18} style={styles.icon} />
                            <input
                                name="nickName"
                                value={formData.nickName}
                                onChange={handleChange}
                                style={styles.input}
                                required
                                placeholder="How should we call you?"
                            />
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>First Name</label>
                            <input
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                style={styles.input}
                                placeholder="First Name"
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Last Name</label>
                            <input
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                style={styles.input}
                                placeholder="Last Name"
                            />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Mobile Phone</label>
                        <div style={styles.inputWrapper}>
                            <Phone size={18} style={styles.icon} />
                            <input
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                style={styles.input}
                                placeholder="0XX-XXXXXXX"
                            />
                        </div>
                        <p style={styles.hint}>We will send you exclusive promotions via SMS.</p>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <div style={styles.inputWrapper}>
                            <Mail size={18} style={styles.icon} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                style={styles.input}
                                placeholder="name@example.com"
                            />
                        </div>
                        <p style={styles.hint}>We will send you updates and offers via Email.</p>
                    </div>

                    <button type="submit" className="primary-btn" style={styles.submitBtn} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <>Complete Registration <ArrowRight size={20} /></>}
                    </button>

                </form>
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
        padding: '20px',
        position: 'relative',
    },
    bgOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, #1a2035 0%, #0B1026 100%)',
        zIndex: -1,
    },
    loader: {
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    formCard: {
        padding: '40px',
        width: '100%',
        maxWidth: '500px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
        marginBottom: '8px',
    },
    logoutBtn: {
        padding: '4px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        borderColor: 'rgba(255,255,255,0.2)',
        color: '#A0AEC0',
    },
    title: {
        fontSize: '2rem',
        marginBottom: '0',
        textAlign: 'left',
    },
    subtitle: {
        color: '#A0AEC0',
        marginBottom: '32px',
        textAlign: 'left',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    row: {
        display: 'flex',
        gap: '16px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flex: 1,
    },
    label: {
        fontSize: '0.9rem',
        fontWeight: 600,
        color: '#E2E8F0',
    },
    inputWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        position: 'absolute',
        left: '12px',
        color: '#A0AEC0',
    },
    input: {
        width: '100%',
        padding: '12px 12px 12px 40px',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(0, 0, 0, 0.2)',
        color: '#fff',
        fontSize: '1rem',
    },
    hint: {
        fontSize: '0.75rem',
        color: '#718096',
        marginTop: '-4px',
    },
    submitBtn: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        marginTop: '16px',
        padding: '14px',
    },
    error: {
        background: 'rgba(229, 62, 62, 0.2)',
        border: '1px solid #e53e3e',
        color: '#fc8181',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '0.9rem',
        textAlign: 'center',
    }
};
