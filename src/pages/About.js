import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const featureVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.7, type: 'spring', stiffness: 60 },
  }),
};

// Animated background component
const BackgroundAnimation = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    {/* Debug: Add border to see circles, remove border-green-500 later */}
    <motion.div
      className="absolute top-1/4 left-1/5 w-[22rem] h-[22rem] bg-green-400 opacity-60 rounded-full blur-xl border-4 border-green-500"
      animate={{ x: [0, 80, -80, 0], y: [0, 60, -60, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute top-2/3 left-2/3 w-[30rem] h-[30rem] bg-white opacity-30 rounded-full blur-lg border-4 border-green-500"
      animate={{ x: [0, -120, 120, 0], y: [0, -80, 80, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute top-1/2 left-3/4 w-80 h-80 bg-green-300 opacity-40 rounded-full blur-lg border-4 border-green-500"
      animate={{ x: [0, 60, -60, 0], y: [0, 80, -80, 0] }}
      transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute top-1/5 left-3/4 w-60 h-60 bg-white opacity-30 rounded-full blur-lg border-4 border-green-500"
      animate={{ x: [0, -40, 40, 0], y: [0, 40, -40, 0] }}
      transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
    />
  </div>
);

// Fallback SVG animated wave background
const SVGWaveBackground = () => (
  <svg className="fixed inset-0 w-full h-full -z-20 pointer-events-none" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ minHeight: '100vh', width: '100vw' }}>
    <motion.path
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
      fill="#22c55e" fillOpacity="0.18"
    />
    <motion.path
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 1 }}
      d="M0,224L60,197.3C120,171,240,117,360,117.3C480,117,600,171,720,186.7C840,203,960,181,1080,154.7C1200,128,1320,96,1380,80L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
      fill="#fff" fillOpacity="0.08"
    />
  </svg>
);

const About = () => (
  <div className="min-h-screen bg-[#18162a] text-white">
    <BackgroundAnimation />
    <SVGWaveBackground />
    <main className="flex flex-col items-center justify-center py-12">
      <motion.h1
        className="text-5xl font-bold text-center text-green-400 mb-2"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 70 }}
      >
        Welcome to HabitNEST
      </motion.h1>
      <motion.h2
        className="text-2xl text-green-300 mb-8 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7, type: 'spring', stiffness: 60 }}
      >
        Build Better Habits, Build a Better Life
      </motion.h2>
      <motion.div
        className="flex flex-col md:flex-row gap-8 mb-12"
        initial="hidden"
        animate="visible"
      >
        {[{
          icon: '🎯',
          title: 'Track Your Goals',
          desc: 'Set, monitor, and achieve your personal goals with our intuitive tracking system.'
        }, {
          icon: '📈',
          title: 'Visual Progress',
          desc: 'Watch your progress through beautiful charts and analytics.'
        }, {
          icon: '🏆',
          title: 'Earn Achievements',
          desc: 'Stay motivated with our rewarding achievement system.'
        }].map((feature, i) => (
          <motion.div
            key={feature.title}
            className="bg-[#23213a] rounded-lg p-8 flex-1 text-center shadow-lg"
            custom={i}
            variants={featureVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05, boxShadow: '0 8px 32px rgba(34,197,94,0.15)' }}
          >
            <div className="text-green-400 text-3xl mb-2">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p>{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
      <motion.section
        className="bg-[#23213a] rounded-lg p-8 max-w-2xl text-center shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.7, type: 'spring', stiffness: 60 }}
      >
        <h3 className="text-2xl font-bold text-green-400 mb-4">Why Choose HabitNEST?</h3>
        <p className="text-lg text-green-200">HabitNEST is your personal companion in building and maintaining positive habits. We understand that creating lasting change isn't easy, which is why we've created a powerful yet simple platform to support your journey.</p>
      </motion.section>
    </main>
  </div>
);

export default About; 