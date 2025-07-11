import React from 'react';
import { motion } from 'framer-motion';
import { Car, ShoppingCart, FileText, Shield, Users, Wrench, Star, Award, TrendingUp, ArrowRight } from 'lucide-react';
import elephantImage from '../../assets/images/AutoConnectMascot.png';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.4
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  const cardHoverVariants = {
    hover: {
      y: -10,
      scale: 1.03,
      boxShadow: "0 25px 50px rgba(30, 58, 138, 0.2)",
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

    const navigate = useNavigate();

  return (
    <div className="tw:min-h-screen tw:w-full tw:max-w-7xl tw:bg-gray-50 tw:relative tw:overflow-hidden tw:rounded-3xl tw:mx-auto">
      {/* Background Elements */}
      <div className="tw:absolute tw:inset-0 tw:opacity-10">
        <div className="tw:absolute tw:top-10 tw:left-10 tw:w-96 tw:h-96 tw:bg-gradient-to-r tw:from-indigo-400 tw:to-blue-400 tw:rounded-full tw:blur-3xl"></div>
        <div className="tw:absolute tw:bottom-10 tw:right-10 tw:w-80 tw:h-80 tw:bg-gradient-to-r tw:from-purple-400 tw:to-indigo-400 tw:rounded-full tw:blur-3xl"></div>
      </div>

      <div className="tw:max-w-7xl tw:mx-auto tw:px-8 tw:py-24 tw:relative tw:z-10">
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="tw:text-center tw:mb-24"
        >
          <motion.div
            variants={itemVariants}
            className="tw:flex tw:justify-center tw:mb-10"
          >
            <div className="tw:relative">
              <motion.img
                src={elephantImage}
                alt="AutoConnect Mascot"
                className="tw:w-36 tw:h-36 tw:object-contain tw:drop-shadow-2xl"
                whileHover={{ scale: 1.15, rotate: 8 }}
                transition={{ duration: 0.4 }}
              />
              <motion.div
                className="tw:absolute tw:-top-3 tw:-right-3 tw:w-10 tw:h-10 tw:bg-amber-300 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:shadow-md"
                animate={{ scale: [1, 1.25, 1], rotate: [0, 12, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Star className="tw:w-5 tw:h-5 tw:text-amber-600" />
              </motion.div>
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="tw:text-6xl md:tw:text-7xl tw:font-extrabold tw:bg-gradient-to-r tw:from-indigo-600 tw:via-blue-600 tw:to-purple-700 tw:bg-clip-text tw:text-transparent tw:mb-6 tw:leading-tight tw:tracking-tight"
          >
            Welcome to AutoConnect
          </motion.h1>
          
          <motion.h4
            variants={itemVariants}
            className="tw:text-xl md:tw:text-2xl tw:bg-gradient-to-r tw:from-slate-700 tw:to-slate-900 tw:bg-clip-text tw:text-transparent tw:mb-12 tw:max-w-3xl tw:mx-auto tw:leading-relaxed tw:font-light tw:px-4 tw:tracking-wide"
            >
            Your premier vehicle marketplace and history platform. Discover, buy, sell, and verify vehicles with unmatched confidence.
            </motion.h4>

            <motion.div
            variants={itemVariants}
            className="tw:flex tw:flex-col md:tw:flex-row tw:justify-center tw:gap-6 tw:mb-16"
            >
            <motion.div 
                className="tw:bg-white/70 tw:backdrop-blur-sm tw:rounded-full tw:px-6 tw:py-3 tw:shadow-md tw:border tw:border-indigo-100 tw:flex tw:items-center tw:gap-3 tw:text-sm md:tw:text-base tw:text-slate-700 tw:font-medium"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(79, 70, 229, 0.15)" }}
                transition={{ duration: 0.3 }}
            >
                <div className="tw:bg-indigo-100 tw:p-2 tw:rounded-full">
                <Award className="tw:w-5 tw:h-5 tw:text-indigo-600" />
                </div>
                <span>Trusted by <span className="tw:font-bold tw:text-indigo-600">10,000+</span> users</span>
            </motion.div>
            
            <motion.div 
                className="tw:bg-white/70 tw:backdrop-blur-sm tw:rounded-full tw:px-6 tw:py-3 tw:shadow-md tw:border tw:border-emerald-100 tw:flex tw:items-center tw:gap-3 tw:text-sm md:tw:text-base tw:text-slate-700 tw:font-medium"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(16, 185, 129, 0.15)" }}
                transition={{ duration: 0.3 }}
            >
                <div className="tw:bg-emerald-100 tw:p-2 tw:rounded-full">
                <TrendingUp className="tw:w-5 tw:h-5 tw:text-emerald-600" />
                </div>
                <span><span className="tw:font-bold tw:text-emerald-600">99.9%</span> customer satisfaction</span>
            </motion.div>
            </motion.div>
            </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="tw:grid tw:grid-cols-1 tw:md:tw:grid-cols-3 tw:gap-8 tw:max-w-6xl tw:mx-auto tw:mb-24"
        >
          <motion.div
            variants={itemVariants}
            whileHover="hover"
            className="tw:group tw:cursor-pointer"
            onClick={() => navigate('/buyvehicles')}
          >
            <motion.div
              variants={cardHoverVariants}
              className="tw:bg-white/90 tw:backdrop-blur-md tw:rounded-3xl tw:shadow-lg tw:p-10 tw:h-80 tw:flex tw:flex-col tw:items-center tw:justify-center tw:border tw:border-white/30 tw:relative tw:overflow-hidden"
            >
              <div className="tw:absolute tw:inset-0 tw:bg-gradient-to-br tw:from-indigo-100/10 tw:to-blue-100/10 tw:opacity-0 group-hover:tw:opacity-100 tw:transition-opacity tw:duration-500"></div>
              <div className="tw:relative tw:z-10 tw:text-center">
                <div className="tw:w-20 tw:h-20 tw:bg-gradient-to-br tw:from-indigo-500 tw:to-blue-600 tw:rounded-2xl tw:flex tw:items-center tw:justify-center tw:mb-6 tw:shadow-xl">
                  <ShoppingCart className="tw:w-10 tw:h-10 tw:text-white" />
                </div>
                <h3 className="tw:text-2xl tw:font-semibold tw:text-slate-800 tw:mb-4 tw:tracking-tight">Buy a Vehicle</h3>
                <p className="tw:text-slate-600 tw:mb-6 tw:leading-relaxed tw:font-light">Browse our curated selection of premium vehicles with verified histories and detailed insights.</p>
                <div className="tw:flex tw:items-center tw:gap-2 tw:text-indigo-600 tw:font-semibold">
                  <span>Explore Now</span>
                  <ArrowRight className="tw:w-5 tw:h-5 tw:transform tw:transition-transform group-hover:tw:translate-x-2" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover="hover"
            className="tw:group tw:cursor-pointer"
            onClick={() => navigate('/sell')}
          >
            <motion.div
              variants={cardHoverVariants}
              className="tw:bg-white/90 tw:backdrop-blur-md tw:rounded-3xl tw:shadow-lg tw:p-10 tw:h-80 tw:flex tw:flex-col tw:items-center tw:justify-center tw:border tw:border-white/30 tw:relative tw:overflow-hidden"
            >
              <div className="tw:absolute tw:inset-0 tw:bg-gradient-to-br tw:from-emerald-100/10 tw:to-green-100/10 tw:opacity-0 group-hover:tw:opacity-100 tw:transition-opacity tw:duration-500"></div>
              <div className="tw:relative tw:z-10 tw:text-center">
                <div className="tw:w-20 tw:h-20 tw:bg-gradient-to-br tw:from-emerald-500 tw:to-green-600 tw:rounded-2xl tw:flex tw:items-center tw:justify-center tw:mb-6 tw:shadow-xl">
                  <Car className="tw:w-10 tw:h-10 tw:text-white" />
                </div>
                <h3 className="tw:text-2xl tw:font-semibold tw:text-slate-800 tw:mb-4 tw:tracking-tight">Sell a Vehicle</h3>
                <p className="tw:text-slate-600 tw:mb-6 tw:leading-relaxed tw:font-light">List your vehicle effortlessly and connect with verified buyers on our trusted platform.</p>
                <div className="tw:flex tw:items-center tw:gap-2 tw:text-emerald-600 tw:font-semibold">
                  <span>Start Selling</span>
                  <ArrowRight className="tw:w-5 tw:h-5 tw:transform tw:transition-transform group-hover:tw:translate-x-2" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover="hover"
            className="tw:group tw:cursor-pointer"
            onClick={() => navigate('/checkreports')}
          >
            <motion.div
              variants={cardHoverVariants}
              className="tw:bg-white/90 tw:backdrop-blur-md tw:rounded-3xl tw:shadow-lg tw:p-10 tw:h-80 tw:flex tw:flex-col tw:items-center tw:justify-center tw:border tw:border-white/30 tw:relative tw:overflow-hidden"
            >
              <div className="tw:absolute tw:inset-0 tw:bg-gradient-to-br tw:from-purple-100/10 tw:to-indigo-100/10 tw:opacity-0 group-hover:tw:opacity-100 tw:transition-opacity tw:duration-500"></div>
              <div className="tw:relative tw:z-10 tw:text-center">
                <div className="tw:w-20 tw:h-20 tw:bg-gradient-to-br tw:from-purple-500 tw:to-indigo-600 tw:rounded-2xl tw:flex tw:items-center tw:justify-center tw:mb-6 tw:shadow-xl">
                  <FileText className="tw:w-10 tw:h-10 tw:text-white" />
                </div>
                <h3 className="tw:text-2xl tw:font-semibold tw:text-slate-800 tw:mb-4 tw:tracking-tight">Check Vehicle History</h3>
                <p className="tw:text-slate-600 tw:mb-6 tw:leading-relaxed tw:font-light">Access detailed vehicle history reports to make informed decisions with confidence.</p>
                <div className="tw:flex tw:items-center tw:gap-2 tw:text-purple-600 tw:font-semibold">
                  <span>Check History</span>
                  <ArrowRight className="tw:w-5 tw:h-5 tw:transform tw:transition-transform group-hover:tw:translate-x-2" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="tw:text-center"
        >
          <motion.h2
            variants={itemVariants}
            className="tw:text-5xl tw:font-bold tw:bg-gradient-to-r tw:from-slate-800 tw:to-indigo-800 tw:bg-clip-text tw:text-transparent tw:mb-6 tw:tracking-tight"
          >
            Why Choose AutoConnect?
          </motion.h2>
          
          <motion.h4
            variants={itemVariants}
            className="tw:text-lg tw:text-slate-600 tw:mb-12 tw:max-w-3xl tw:mx-auto tw:font-light tw:leading-relaxed tw:items-center tw:justify-center tw:content-center"
          >
            Discover a seamless vehicle trading experience with our cutting-edge platform designed for modern buyers and sellers.
          </motion.h4>

          <motion.div
            variants={containerVariants}
            className="tw:grid tw:grid-cols-1 tw:md:tw:grid-cols-3 tw:gap-8 tw:max-w-6xl tw:mx-auto"
          >
            <motion.div
              variants={itemVariants}
              className="tw:group tw:p-8 tw:bg-white/80 tw:backdrop-blur-md tw:rounded-3xl tw:border tw:border-white/30 tw:shadow-lg tw:hover:shadow-2xl tw:transition-all tw:duration-400"
            >
              <div className="tw:w-16 tw:h-16 tw:bg-gradient-to-br tw:from-indigo-500 tw:to-blue-600 tw:rounded-xl tw:flex tw:items-center tw:justify-center tw:mx-auto tw:mb-6 tw:shadow-xl tw:group-hover:shadow-2xl tw:transition-shadow tw:duration-400">
                <Shield className="tw:w-8 tw:h-8 tw:text-white" />
              </div>
              <h3 className="tw:text-xl tw:font-semibold tw:text-slate-800 tw:mb-4 tw:tracking-tight">Secure Transactions</h3>
              <p className="tw:text-slate-600 tw:leading-relaxed tw:font-light">Bank-grade encryption ensures your data and payments are always secure and protected.</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="tw:group tw:p-8 tw:bg-white/80 tw:backdrop-blur-md tw:rounded-3xl tw:border tw:border-white/30 tw:shadow-lg tw:hover:shadow-2xl tw:transition-all tw:duration-400"
            >
              <div className="tw:w-16 tw:h-16 tw:bg-gradient-to-br tw:from-emerald-500 tw:to-green-600 tw:rounded-xl tw:flex tw:items-center tw:justify-center tw:mx-auto tw:mb-6 tw:shadow-xl tw:group-hover:shadow-2xl tw:transition-shadow tw:duration-400">
                <Users className="tw:w-8 tw:h-8 tw:text-white" />
              </div>
              <h3 className="tw:text-xl tw:font-semibold tw:text-slate-800 tw:mb-4 tw:tracking-tight">Expert Support</h3>
              <p className="tw:text-slate-600 tw:leading-relaxed tw:font-light">Our team of automotive experts is available 24/7 to assist you at every step.</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="tw:group tw:p-8 tw:bg-white/80 tw:backdrop-blur-md tw:rounded-3xl tw:border tw:border-white/30 tw:shadow-lg tw:hover:shadow-2xl tw:transition-all tw:duration-400"
            >
              <div className="tw:w-16 tw:h-16 tw:bg-gradient-to-br tw:from-purple-500 tw:to-indigo-600 tw:rounded-xl tw:flex tw:items-center tw:justify-center tw:mx-auto tw:mb-6 tw:shadow-xl tw:group-hover:shadow-2xl tw:transition-shadow tw:duration-400">
                <Wrench className="tw:w-8 tw:h-8 tw:text-white" />
              </div>
              <h3 className="tw:text-xl tw:font-semibold tw:text-slate-800 tw:mb-4 tw:tracking-tight">Certified Vehicles</h3>
              <p className="tw:text-slate-600 tw:leading-relaxed tw:font-light">Every vehicle is rigorously inspected and verified for quality and reliability.</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;