import '@testing-library/jest-dom'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, whileInView, transition, viewport, ...props }) => <div {...props}>{children}</div>,
    h2: ({ children, initial, whileInView, transition, viewport, ...props }) => <h2 {...props}>{children}</h2>,
  },
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useSpring: () => ({ get: () => 0 }),
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}))

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}