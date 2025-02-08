import BlazeSlider from 'blaze-slider'
import type { BlazeConfig } from 'blaze-slider'
import 'blaze-slider/dist/blaze.css'

interface CarouselConfig {
  duration: number
  slides: {
    mobile: number
    md?: number
    lg?: number
  }
  group: boolean
  autoplay: boolean
  autoplayInterval: number
}

export function initializeSlider(slider: HTMLElement) {
  // Check if slider is already initialized
  if (slider.dataset.carouselInitialized === 'true') return

  const config: CarouselConfig = {
    duration: Number(slider.dataset.duration) || 600,
    slides: JSON.parse(slider.dataset.slides || '{"mobile": 1, "md": 2, "lg": 3}'),
    group: slider.dataset.group === 'true',
    autoplay: slider.dataset.autoplay === 'true',
    autoplayInterval: Number(slider.dataset?.autoplayInterval) || 5000,
  }

  const blazeConfig: BlazeConfig = {
    all: {
      transitionDuration: config.duration,
      slidesToShow: config.slides.mobile,
      slidesToScroll: config.group ? config.slides.mobile : 1,
      enablePagination: true,
      slideGap: '1rem',
      enableAutoplay: config.autoplay,
      autoplayInterval: config.autoplay ? config.autoplayInterval : 0,
    },
    '(min-width: 768px)': {
      slidesToShow: config.slides.md || config.slides.mobile,
      slidesToScroll: config.group ? config.slides.md : 1,
      slideGap: '1.25rem',
    },
    '(min-width: 1024px)': {
      slidesToShow: config.slides.lg || config.slides.md || config.slides.mobile,
      slidesToScroll: config.group ? config.slides.lg : 1,
      slideGap: '1.5rem',
    },
  }

  new BlazeSlider(slider, blazeConfig)
  slider.dataset.carouselInitialized = 'true'
}

export function initializeAllSliders() {
  document.querySelectorAll('.blaze-slider').forEach((slider) => {
    if (slider instanceof HTMLElement) {
      try {
        initializeSlider(slider)
      } catch (error) {
        console.error('Error initializing Blaze Slider:', error)
      }
    }
  })
}
