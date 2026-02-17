import { useEffect, useRef, useState } from 'react';
import { productApi, type Product } from '../../api/productApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../../utils/hooks/useCart';
import ProductCard from '../products/ProductCard';

export default function Productcategories() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const previousCategoryIdRef = useRef<string | undefined>(undefined);
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            if (!categoryId) {
                setLoading(false);
                setHasMore(false);
                return;
            }

            if (previousCategoryIdRef.current !== categoryId) {
                previousCategoryIdRef.current = categoryId;
                if (page !== 1) return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await productApi.getProductsByCategory(categoryId, {
                    page,
                    limit: 10,
                    sortBy: 'createdAt',
                    order: 'desc'
                });

                const fetchedProducts: Product[] = response.data.products || [];
                const totalPages = response.data.pagination?.totalPages || 0;

                setProducts((prev) => {
                    if (page === 1) return fetchedProducts;

                    const existingIds = new Set(prev.map((product) => product.id));
                    const uniqueProducts = fetchedProducts.filter(
                        (product) => !existingIds.has(product.id)
                    );
                    return [...prev, ...uniqueProducts];
                });

                setHasMore(totalPages > 0 ? page < totalPages : fetchedProducts.length === 10);
            } catch (error) {
                const message =
                    error instanceof Error ? error.message : 'Failed to fetch products';
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId, page]);

    useEffect(() => {
        setProducts([]);
        setPage(1);
        setHasMore(true);
        setError(null);
    }, [categoryId]);

    useEffect(() => {
        const target = loadMoreRef.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (!entry.isIntersecting || loading || !hasMore) return;
                setPage((prev) => prev + 1);
            },
            { root: null, rootMargin: '200px 0px', threshold: 0.1 }
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [loading, hasMore]);

    const handleProductClick = (productId: string) => {
        navigate(`/product/${productId}`);
    };

    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.stopPropagation(); // Prevent navigation to product details
        addToCart(product);
    };

        return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-neutral-800 mb-6">Products</h1>  

            {/* {loading && <div><Skeleton className="w-full bg-gray-200 h-10 animate-pulse" /></div>}*/}
            {error && <div>Error: {error}</div>} 
            {!loading && !error && products.length === 0 ? (
              <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200  p-10 text-center">
                <div>
                  <p className="text-4xl font-semibold text-slate-800">Opss No products found</p>
                  <p className="text-lg text-slate-600 mt-1">
                    There are no products in this category yet. Please check back later.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    handleProductClick={handleProductClick}
                    handleAddToCart={handleAddToCart}
                    isLoading={false}
                  />
                ))}
              </div>
            )}
            <div className="mt-8 flex justify-center">
              {loading && products.length > 0 && (
                <p className="text-sm text-neutral-500">Loading more products...</p>
              )}
              {!hasMore && products.length > 0 && (
                <p className="text-sm text-neutral-500">You have reached the end.</p>
              )}
            </div>
            <div ref={loadMoreRef} aria-hidden="true" className="h-1" />
        </div>
    );
}   
