'use client';

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Image from "next/image";

const heroImages = [
    { imgUrl: '/assets/images/hero-1.svg', alt: 'product-1' },
    { imgUrl: '/assets/images/hero-2.svg', alt: 'product-2' },
    { imgUrl: '/assets/images/hero-3.svg', alt: 'product-3' },
    { imgUrl: '/assets/images/hero-4.svg', alt: 'product-4' },
    { imgUrl: '/assets/images/hero-5.svg', alt: 'product-5' }
]

const HeroCarousel = () => {
  return (
    <div className='hero-carousel'>
        <Carousel
            showThumbs={false}
            autoPlay
            infiniteLoop
            interval={2000}
            showArrows={false}
            showStatus={false}
        >
           {heroImages.map((image) => (
            <Image
                src={image.imgUrl}
                alt={image.alt}
                width={484}
                height={484}
                className='object-contain'
                key={image.alt}
            />
           ))}
        </Carousel>

        <Image 
            src='assets/icons/hand-drawn-arrow.svg'
            alt='arrow'
            width={175}
            height={175}
            className='max-xl:hidden absolute -left-10 bottom-5 z-1'
        />
    </div>
  )
}

export default HeroCarousel