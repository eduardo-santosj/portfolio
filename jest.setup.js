import '@testing-library/jest-dom'

// framer-motion: renderiza as tags puras, sem animação, descartando as props de motion.
jest.mock('framer-motion', () => {
  const React = require('react')
  const MOTION_PROPS = ['initial', 'animate', 'exit', 'whileInView', 'whileHover', 'whileTap', 'transition', 'viewport', 'variants', 'layout', 'layoutId', 'style']
  const cache = {}
  const motion = new Proxy({}, {
    get: (_, tag) => {
      if (!cache[tag]) {
        const Component = React.forwardRef((props, ref) => {
          const clean = { ...props }
          MOTION_PROPS.forEach((key) => delete clean[key])
          return React.createElement(tag, { ref, ...clean })
        })
        Component.displayName = `motion.${String(tag)}`
        cache[tag] = Component
      }
      return cache[tag]
    },
  })
  const motionValue = (value = 0) => ({ get: () => value, set: () => {}, on: () => () => {} })
  return {
    motion,
    MotionConfig: ({ children }) => children,
    AnimatePresence: ({ children }) => children,
    useScroll: () => ({ scrollYProgress: motionValue(0), scrollY: motionValue(0) }),
    useSpring: () => motionValue(0),
    useTransform: () => motionValue(1),
    useMotionValue: (v) => motionValue(v),
    useMotionValueEvent: () => {},
    useInView: () => true,
    useReducedMotion: () => false,
  }
})

// next/image: <img> simples (sem as props exclusivas do Next).
jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text, @typescript-eslint/no-unused-vars
  default: ({ fill, priority, sizes, ...props }) => <img {...props} />,
}))

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
})

// jsdom não implementa scroll; o menu mobile rola até a seção ao fechar.
window.scrollTo = jest.fn()
