import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { fetchProducts } from "../features/products/productSlice";
import { fetchCategories } from "../features/categories/categorySlice";
import { useCart } from "../utils/hooks/useCart";
import type { Product, ProductFilters } from "../api/productApi";
import heroImage from "../assets/hero-removebg-preview.png";
import ProductCard from "@/components/products/ProductCard";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { products, loading, pagination } = useAppSelector(
    (state) => state.products
  );
  const { categories } = useAppSelector((state) => state.categories);
  const { addToCart } = useCart();
  const [api, setApi] = React.useState<any>();
  const [current, setCurrent] = React.useState(0);
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 9,
    sortBy: "createdAt",
    order: "desc",
  });

  // Autoplay plugin configuration
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );
  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);
  useEffect(() => {
    dispatch(fetchProducts(filters));
    dispatch(fetchCategories());
  }, []);

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleCategoryClick = async (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  const totalPages = pagination.totalPages;
  const currentPage = pagination.page;

  const bannerSlides = [
    {
      type: "content",
      title: "Pioneer Aushadhi Sewa",
      subtitle: "MEDICINE DELIVERY",
      description:
        "Pioneer Aushadhi Sewa is a modern online pharmacy focused on fast, reliable medicine delivery and a smooth shopping experience. We aim to make healthcare more accessible by combining verified products with helpful information and customer-first support.",
      image: heroImage,
      hasButton: false,
    },
    {
      type: "content",
      title: "EVERYDAY ESSENTIALS",
      subtitle: "",
      description: "",
      image: heroImage,
      hasButton: true,
      buttonText: "SHOP NOW",
      onButtonClick: () => navigate("/shop"),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner Carousel */}
      <section className="mx-auto max-w-7xl relative overflow-hidden border-b border-gray-100 rounded-4xl mt-6 ">
        <Carousel
          plugins={[plugin.current]}
          opts={{
            align: "start",
            loop: true,
          }}
          setApi={setApi}
          className="w-fullS"
        >
          <CarouselContent>
            {bannerSlides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="relative bg-gradient-to-r from-medical-green-500 via-medical-green-600 to-medical-green-700 py-12 md:py-16 lg:py-20 px-4 overflow-hidden flex items-center h-96">
                  {/* Background decorative elements */}
                  <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-medical-green-600 opacity-30 rounded-full transform translate-x-64 -translate-y-64"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-medical-green-800 opacity-40 rounded-full transform -translate-x-48 translate-y-48"></div>
                  </div>

                  <div className="relative max-w-7xl mx-auto z-10 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      <div className="text-white">
                        <h1 className="text-4xl md:text-5xl text-white font-bold mb-4 leading-tight">
                          {slide.title}
                        </h1>
                        {slide.subtitle && (
                          <p className="text-sm text-white/95 font-medium leading-tight mb-2">
                            {slide.subtitle}
                          </p>
                        )}
                        {slide.description && (
                          <p className="text-white/80 mb-6">
                            {slide.description}
                          </p>
                        )}
                        {slide.hasButton && (
                          <button
                            onClick={slide.onButtonClick}
                            className="px-6 py-3 shadow-medical-lg bg-button-color text-black rounded-full font-semibold hover:bg-medical-green-400 transition-colors duration-200"
                          >
                            {slide.buttonText}
                          </button>
                        )}
                      </div>
                      <div className="hidden lg:block relative">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-auto max-w-sm mx-auto drop-shadow-2xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="absolute bottom-6 left-0 right-0 z-20">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
              <CarouselPrevious className="relative left-0 translate-y-0" />

              <div className="flex gap-2">
                {bannerSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      current === index
                        ? "w-8 bg-white"
                        : "w-2 bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <CarouselNext className="relative right-0 translate-y-0" />
            </div>
          </div>
        </Carousel>
      </section>

      {/* Categories Section */}
      <section className="py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">
            Categories
          </h2>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {categories.map((category) => {
                return (
                  <CarouselItem
                    key={category.id}
                    className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 xl:basis-1/8"
                  >
                    <div
                      onClick={() => handleCategoryClick(category.id)}
                      className="flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md group border border-gray-100"
                    >
                      <div className="w-24 h-24 bg-medical-green-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-medical-green-200 transition-colors duration-200">
                        <img
                          src={category.image}
                          alt="categories-img"
                          className="shadow-lg"
                        />
                      </div>
                      <span className="text-md text-gray-700 text-center font-medium leading-tight">
                        {category.name}
                      </span>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      </section>

      {/* Main Content - Products */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-800">Our Products</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.map((product: Product) => (
            <ProductCard
              key={product.id}
              product={product}
              handleProductClick={handleProductClick}
              handleAddToCart={handleAddToCart}
              isLoading={loading}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-8 gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                const isCurrentPage = pageNumber === currentPage;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                      isCurrentPage
                        ? "bg-medical-green-500 text-white"
                        : "border border-neutral-300 hover:bg-neutral-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
