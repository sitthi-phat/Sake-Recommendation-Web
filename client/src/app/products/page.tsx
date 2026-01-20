'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Wine, Star, Loader2, LogOut } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    type: string;
    description: string;
    image: string;
    price: string;
}

function ProductsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { data: session, status } = useSession();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            if (status === 'loading') return;

            try {
                // @ts-ignore
                const sessionUserId = session?.user?.id;
                const urlParamId = searchParams.get('customerId');
                const isGuest = searchParams.get('guest');

                let query = '';

                // Prioritize Session ID, then URL param, then Guest
                if (sessionUserId) {
                    query = `?customerId=${sessionUserId}`;
                } else if (urlParamId) {
                    query = `?customerId=${urlParamId}`;
                } else if (isGuest) {
                    query = `?guest=true`;
                }

                if (!query) {
                    setLoading(false);
                    return;
                }

                // Note: For local dev, ensure the server is running on port 4000
                const res = await fetch(`/api/proxy/products${query}`);
                const data = await res.json();

                setProducts(data.products);
                setMode(data.mode);
                setMessage(data.message);
            } catch (error) {
                console.error('Failed to fetch products', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchParams, session, status]);

    const handleLogout = () => {
        signOut({ callbackUrl: '/' });
    };

    return (
        <>
            <header style={styles.header}>
                <button onClick={() => router.push('/')} className="secondary-btn" style={styles.backBtn}>
                    <ArrowLeft size={20} /> Back
                </button>
                <h1 style={styles.title}>Sake Selection</h1>
                <div style={{ marginLeft: 'auto' }}>
                    {session && (
                        <button onClick={handleLogout} className="secondary-btn" style={styles.logoutBtn}>
                            <LogOut size={20} /> Logout
                        </button>
                    )}
                </div>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel"
                style={styles.messageParams}
            >
                <Star size={16} color="var(--primary)" fill="var(--primary)" />
                <span>{message}</span>
            </motion.div>

            {loading ? (
                <div style={styles.loader}>
                    <Loader2 className="animate-spin" size={48} color="var(--primary)" />
                </div>
            ) : (
                <div style={styles.grid}>
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-panel"
                            style={styles.card}
                            whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
                        >
                            <div style={styles.imagePlaceholder}>
                                <Wine size={48} color="var(--foreground)" style={{ opacity: 0.5 }} />
                            </div>
                            <div style={styles.cardContent}>
                                <span style={styles.type}>{product.type}</span>
                                <h3 style={styles.name}>{product.name}</h3>
                                <p style={styles.description}>{product.description}</p>
                                <div style={styles.footer}>
                                    <span style={styles.price}>{product.price}</span>
                                    <button className="primary-btn" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                                        View
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </>
    );
}

export default function ProductsPage() {
    return (
        <main style={styles.container}>
            <div style={styles.bgOverlay} />
            <Suspense fallback={
                <div style={styles.loader}>
                    <Loader2 className="animate-spin" size={48} color="var(--primary)" />
                </div>
            }>
                <ProductsContent />
            </Suspense>
        </main>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        minHeight: '100vh',
        padding: '40px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
    },
    bgOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 10%, #1a2035 0%, #0B1026 100%)',
        zIndex: -1,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '40px',
        position: 'relative',
    },
    backBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        marginRight: '20px',
    },
    logoutBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderColor: '#e53e3e',
        color: '#e53e3e',
    },
    title: {
        fontSize: '2.5rem',
    },
    messageParams: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 24px',
        marginBottom: '32px',
        color: 'var(--primary)',
        fontWeight: 600,
    },
    loader: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '50px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px',
    },
    card: {
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    imagePlaceholder: {
        height: '200px',
        background: 'rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardContent: {
        padding: '24px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    type: {
        fontSize: '0.8rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'var(--primary)',
        marginBottom: '8px',
    },
    name: {
        fontSize: '1.5rem',
        marginBottom: '12px',
        color: '#fff',
    },
    description: {
        color: '#A0AEC0',
        marginBottom: '20px',
        lineHeight: '1.6',
        flex: 1,
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
    },
    price: {
        fontSize: '1.2rem',
        fontWeight: 600,
    }
};
