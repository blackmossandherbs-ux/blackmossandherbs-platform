"use client";

import { useState, useEffect } from 'react';
import { Package, Plus, Search, Filter, Edit2, Trash2, X, Check, Loader2 } from 'lucide-react';
import Button from '@/components/Button';

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    category: string;
    stock: number;
    active: boolean;
    type: 'PHYSICAL' | 'DIGITAL';
    therapeuticGoals: string[];
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isManifesting, setIsManifesting] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        price: '',
        category: 'Gels',
        stock: '0',
        type: 'PHYSICAL',
        active: true,
        description: '',
        images: [] as string[]
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/products');
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error('Failed to sync manifest:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleManifest = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
        const method = editingProduct ? 'PATCH' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    images: formData.images.length > 0 ? formData.images : ['/images/placeholder.jpg']
                })
            });

            if (res.ok) {
                setIsManifesting(false);
                setEditingProduct(null);
                fetchProducts();
            }
        } catch (error) {
            console.error('Manifestation failure:', error);
        }
    };

    const deleteProduct = async (id: string) => {
        if (!confirm('Are you certain you wish to purge this alchemical record?')) return;
        try {
            await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
            fetchProducts();
        } catch (error) {
            console.error('Purge failure:', error);
        }
    };

    const openEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            ...formData,
            name: product.name,
            slug: product.slug,
            price: product.price.toString(),
            category: product.category,
            stock: product.stock.toString(),
            type: product.type,
            active: product.active
        });
        setIsManifesting(true);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="py-12 bg-earth-950 min-h-screen relative overflow-hidden">
            <div className="container relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="font-serif text-5xl font-bold bg-gradient-to-r from-secondary-400 to-primary-400 bg-clip-text text-transparent mb-2">
                            Inventory Authority
                        </h1>
                        <p className="text-earth-400 text-lg">Manage your herbal formulas and alkaline stocks.</p>
                    </div>
                    <Button
                        onClick={() => {
                            setEditingProduct(null);
                            setFormData({ name: '', slug: '', price: '', category: 'Gels', stock: '0', type: 'PHYSICAL', active: true, description: '', images: [] });
                            setIsManifesting(true);
                        }}
                        className="h-16 px-8 rounded-2xl flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Manifest New Product
                    </Button>
                </div>

                {/* Manifest Overlay */}
                {isManifesting && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-earth-950/90 backdrop-blur-xl">
                        <div className="card w-full max-w-2xl border border-earth-800 bg-earth-900 p-10 rounded-[3rem] max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-serif font-bold text-white">
                                    {editingProduct ? 'Update Alchemical Record' : 'Manifest New Compound'}
                                </h2>
                                <button onClick={() => setIsManifesting(false)} className="text-earth-500 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleManifest} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-earth-500 ml-2">Compound Name</label>
                                        <input
                                            required
                                            className="w-full h-14 bg-earth-950/50 border border-earth-800 rounded-xl px-4 text-white focus:border-primary-500/50 outline-none transition-all"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-earth-500 ml-2">Slug Identifier</label>
                                        <input
                                            required
                                            className="w-full h-14 bg-earth-950/50 border border-earth-800 rounded-xl px-4 text-white focus:border-primary-500/50 outline-none transition-all"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-earth-500 ml-2">Price (£)</label>
                                        <input
                                            required
                                            type="number"
                                            step="0.01"
                                            className="w-full h-14 bg-earth-950/50 border border-earth-800 rounded-xl px-4 text-white focus:border-primary-500/50 outline-none transition-all"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-earth-500 ml-2">Current Stock</label>
                                        <input
                                            required
                                            type="number"
                                            className="w-full h-14 bg-earth-950/50 border border-earth-800 rounded-xl px-4 text-white focus:border-primary-500/50 outline-none transition-all"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-earth-500 ml-2">Alchemical Category</label>
                                        <select
                                            className="w-full h-14 bg-earth-950/50 border border-earth-800 rounded-xl px-4 text-white focus:border-primary-500/50 outline-none transition-all"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option>Gels</option>
                                            <option>Capsules</option>
                                            <option>Syrups</option>
                                            <option>Teas</option>
                                            <option>Oils</option>
                                            <option>Bundles</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-earth-500 ml-2">Manifestation Type</label>
                                        <select
                                            className="w-full h-14 bg-earth-950/50 border border-earth-800 rounded-xl px-4 text-white focus:border-primary-500/50 outline-none transition-all"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                        >
                                            <option value="PHYSICAL">Physical Compound</option>
                                            <option value="DIGITAL">Digital Wisdom</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 py-4">
                                    <input
                                        type="checkbox"
                                        id="active"
                                        checked={formData.active}
                                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                        className="w-5 h-5 rounded border-earth-800 bg-earth-950/50 text-secondary-500"
                                    />
                                    <label htmlFor="active" className="text-xs font-bold text-earth-300 uppercase tracking-widest">Active in Matrix</label>
                                </div>

                                <Button className="w-full h-16 rounded-2xl flex items-center justify-center gap-2 text-sm">
                                    {editingProduct ? <Check size={20} /> : <Plus size={20} />}
                                    {editingProduct ? 'Apply Alchemical Changes' : 'Manifest into Store'}
                                </Button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Search and Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-earth-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search inventory matrix..."
                            className="w-full h-16 bg-earth-900/50 border border-earth-800 rounded-2xl pl-16 pr-6 text-white focus:outline-none focus:border-primary-500 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-earth-500" size={20} />
                        <select className="w-full h-16 bg-earth-900/50 border border-earth-800 rounded-2xl pl-16 pr-6 text-earth-300 focus:outline-none appearance-none font-bold text-xs uppercase tracking-widest">
                            <option>All Categories</option>
                            <option>Gels</option>
                            <option>Capsules</option>
                            <option>Syrups</option>
                            <option>Teas</option>
                        </select>
                    </div>
                </div>

                {/* Product Table */}
                <div className="card border border-earth-800 bg-earth-900/60 backdrop-blur-xl overflow-hidden rounded-[2.5rem]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-earth-950/50 border-b border-earth-800">
                                <tr>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-earth-500">Product</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-earth-500">Category</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-earth-500">Price</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-earth-500">Stock</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-earth-500">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-earth-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-earth-800/50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <Loader2 className="w-10 h-10 text-secondary-500 animate-spin" />
                                                <div className="text-earth-500 font-bold uppercase text-[10px] tracking-widest">Synchronizing Matrix...</div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredProducts.length > 0 ? filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-earth-800/20 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-earth-800 rounded-xl flex items-center justify-center text-xl shadow-inner border border-earth-700">
                                                    {product.type === 'PHYSICAL' ? '🌿' : '💎'}
                                                </div>
                                                <div className="font-bold text-white group-hover:text-primary-400 transition-colors uppercase tracking-tight">
                                                    {product.name}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-earth-400 text-sm">{product.category}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-bold text-secondary-400">£{product.price.toFixed(2)}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-sm font-bold ${product.stock < 10 && product.type === 'PHYSICAL' ? 'text-amber-500' : 'text-earth-300'}`}>
                                                {product.type === 'PHYSICAL' ? `${product.stock} Units` : 'Unlimited'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${product.active ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50' :
                                                'bg-red-900/30 text-red-400 border border-red-800/50'
                                                }`}>
                                                {product.active ? 'Active' : 'Archived'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => openEdit(product)}
                                                    className="p-3 bg-earth-800/50 hover:bg-earth-800 rounded-xl text-earth-400 transition-all border border-earth-700/50"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => deleteProduct(product.id)}
                                                    className="p-3 bg-red-900/10 hover:bg-red-900/20 rounded-xl text-red-500 transition-all border border-red-900/20"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center text-earth-500 font-bold uppercase text-[10px] tracking-widest">
                                            No alchemical records matches your query.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
