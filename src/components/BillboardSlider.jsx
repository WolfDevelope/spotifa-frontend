import React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import '../assets/styles/main.css';
const slides = [
  {
    img: 'assets/images/billie-eilish.jpg',
    name: 'Billie Eilish',
    desc: 'You can have easy access to every song of billie eilish by just clicking on the Listen now button. You can also follow her too for supporting her and keeping it up with what she does.',
    link: 'https://www.youtube.com/channel/UCiGm_E4ZwYSHV3bcW1pnSeQ',
  },
  {
    img: 'assets/images/adele.jpg',
    name: 'Adele',
    desc: 'You can have easy access to every song of adele by just clicking on the Listen now button. You can also follow her too for supporting her and keeping it up with what she does.',
    link: 'https://www.youtube.com/channel/UCsRM0YB_dabtEPGPTKo-gcw',
  },
  { 
    img: 'assets/images/dua lipa.jpg',
    name: 'Dua Lipa',
    desc: 'You can have easy access to every song of dua lipa by just clicking on the Listen now button. You can also follow her too for supporting her and keeping it up with what she does.',
    link: 'https://www.youtube.com/channel/UC-J-KZfRV8c13fOCkhXdLiQ',
  }
];

const BillboardSlider = () => (
  <div className="relative flex justify-center items-center mb-8">
    <Splide
      options={{
        type: 'loop',
        perPage: 1,
        autoplay: true,
        interval: 4000,
        arrows: true,
        pagination: true,
        height: '18rem',
      }}
      aria-label="Billboard Slider"
      className="max-w-4xl mx-auto mb-8"
    >
      {slides.map((slide, idx) => (
        <SplideSlide key={idx}>
          <div className="flex items-center justify-between bg-[#2d2240] relative rounded-xl overflow-hidden h-72">
            <img src={slide.img} alt={slide.name} className="absolute inset-0 w-full h-full object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#23172b]/90 via-[#23172b]/60 to-transparent"></div>
            <div className="relative z-10 flex flex-col justify-center h-full pl-10 w-2/3">
              <h3 className="text-3xl font-bold mb-4">{slide.name}</h3>
              <p className="text-base mb-6">{slide.desc}</p>
              <div className="flex space-x-4">
                <a href={slide.link} target="_blank" rel="noopener noreferrer">
                  <button className="cursor-pointer border-2 border-pink-400 text-pink-400 px-6 py-2 rounded-xl font-semibold hover:bg-pink-400 hover:text-white transition">Listen Now</button>
                </a>
                <a href={slide.link} target="_blank" rel="noopener noreferrer">
                  <button className="cursor-pointer border-2 border-cyan-400 text-cyan-400 px-6 py-2 rounded-xl font-semibold hover:bg-cyan-400 hover:text-white transition">Follow</button>
                </a>
              </div>
            </div>
          </div>
        </SplideSlide>
      ))}
    </Splide>
  </div>
);

export default BillboardSlider;