'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export interface Testimonial {
  content: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoplaySpeed?: number;
  className?: string;
}

export function TestimonialCarousel({
  testimonials,
  autoplaySpeed = 5000,
  className = '',
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  }, [testimonials.length]);

  useEffect(() => {
    if (!isPaused && autoplaySpeed > 0) {
      const interval = setInterval(nextSlide, autoplaySpeed);
      return () => clearInterval(interval);
    }
  }, [nextSlide, isPaused, autoplaySpeed]);

  if (!testimonials.length) return null;

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative h-full">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >            <div className="flex flex-col h-full justify-center p-8 bg-white rounded-xl shadow-sm border border-orange-100">
              <Quote className="text-orange-300 w-12 h-12 mb-4" />
              <p className="text-lg mb-6 italic text-gray-700">{testimonial.content}</p>
              
              <div className="flex items-center mt-auto">
                {testimonial.avatar ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.author} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (                  <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-4">
                    {testimonial.author.charAt(0)}
                  </div>
                )}
                
                <div>
                  <p className="font-medium text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {testimonials.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-2 z-20">          <button 
            onClick={prevSlide} 
            className="p-2 rounded-full bg-white/80 hover:bg-white border border-orange-200 shadow-sm text-orange-600"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={nextSlide}
            className="p-2 rounded-full bg-white/80 hover:bg-white border border-orange-200 shadow-sm text-orange-600"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {testimonials.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
          {testimonials.map((_, index) => (              <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-orange-500 w-4' : 'bg-orange-200'
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
