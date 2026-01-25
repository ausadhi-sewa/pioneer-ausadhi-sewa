import { useEffect, useState } from 'react';
import { productApi, type Product } from '../../api/productApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../../utils/hooks/useCart';
import ProductCard from '../products/ProductCard';

export default function Productcategories() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                    const response = await productApi.getProductsByCategory(categoryId as string, {
                    page: 1,
                    limit: 10,
                    sortBy: 'createdAt',
                    order: 'desc'
                });
                setProducts(response.data.products);
                setLoading(false);
            } catch (error) {
                setError(error as string);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categoryId]);

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
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {/* {products.length === 0 && <div>No products found</div>} */}
            {products.map((product) => (
              <ProductCard key={product.id} product={product} handleProductClick={handleProductClick} handleAddToCart={handleAddToCart} isLoading={loading} />
            ))}
            </div>
        </div>
    );
}   