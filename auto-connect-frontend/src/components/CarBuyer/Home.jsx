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
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const cardHoverVariants = {
    hover: {
      y: -12,
      scale: 1.05,
      boxShadow: "0 30px 60px rgba(30, 58, 138, 0.25)",
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const navigate = useNavigate();

  return (
    <div className="tw:min-h-screen tw:w-full tw:w-max-7xl tw:bg-gradient-to-br tw:from-slate-100 tw:via-white tw:to-blue-100 tw:rounded-3xl tw:mx-auto tw:overflow-hidden tw:relative">
      {/* Enhanced Background Elements */}
      <div className="tw:absolute tw:inset-0 tw:opacity-10 tw:pointer-events-none">
        <div className="tw:absolute tw:-top-10 tw:-left-10 tw:w-[500px] tw:h-[500px] tw:bg-gradient-to-r tw:from-indigo-300 tw:to-blue-300 tw:rounded-full tw:blur-3xl tw:animate-pulse-slow"></div>
        <div className="tw:absolute tw:bottom-0 tw:right-0 tw:w-[600px] tw:h-[600px] tw:bg-gradient-to-r tw:from-purple-300 tw:to-indigo-300 tw:rounded-full tw:blur-3xl tw:animate-pulse-slow tw:delay-1000"></div>
      </div>

      <div className="tw:max-w-7xl tw:mx-auto  tw:px-12 tw:py-20 tw:relative tw:z-10">
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="tw:grid tw:grid-cols-2 tw:gap-12 tw:items-center tw:mb-28 tw:min-h-[650px]"
        >
          {/* Left Side - Image */}
          <motion.div
            variants={itemVariants}
            className="tw:flex tw:justify-start tw:order-1 "
          >
            <div className="tw:relative tw:group">
              <div className="tw:w-[420px] tw:h-[420px] tw:bg-gradient-to-br tw:from-indigo-200 tw:via-blue-200 tw:to-purple-200 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:shadow-2xl tw:border-4 tw:border-white/60 tw:backdrop-blur-md">
                <motion.img
                  src={elephantImage}
                  alt="AutoConnect Mascot"
                  className="tw:w-[360px] tw:h-[360px] tw:object-contain tw:drop-shadow-2xl"
                  whileHover={{ scale: 1.12, rotate: 8 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
              {/* Enhanced Floating Elements */}
              <motion.div
                className="tw:absolute tw:-top-6 tw:-right-6 tw:w-24 tw:h-24 tw:bg-gradient-to-br tw:from-yellow-500 tw:to-orange-600 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:shadow-xl tw:group-hover:shadow-2xl tw:transition-shadow"
                animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Star className="tw:w-10 tw:h-10 tw:text-white" />
              </motion.div>
              <motion.div
                className="tw:absolute tw:-bottom-8 tw:-left-8 tw:w-20 tw:h-20 tw:bg-gradient-to-br tw:from-emerald-500 tw:to-green-600 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:shadow-xl tw:group-hover:shadow-2xl tw:transition-shadow"
                animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Shield className="tw:w-8 tw:h-8 tw:text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            variants={itemVariants}
            className="tw:order-2  tw:text-left"
          >
            <motion.h1
              variants={itemVariants}
              className="tw:text-7xl tw:font-extrabold tw:bg-gradient-to-r tw:from-slate-900 tw:via-indigo-800 tw:to-blue-700 tw:bg-clip-text tw:text-transparent tw:mb-8 tw:leading-tight tw:tracking-tighter"
            >
              Welcome to{' '}
              <span className="tw:block tw:bg-gradient-to-r tw:from-indigo-700 tw:to-purple-700 tw:bg-clip-text tw:text-transparent">
                AutoConnect
              </span>
            </motion.h1>
            
            <motion.div
              variants={itemVariants}
              className="tw:text-xl tw:text-slate-700 tw:mb-10 tw:leading-relaxed tw:font-light tw:max-w-2xl tw:mx-auto tw:lg:tw:mx-0"
            >
              Your ultimate vehicle marketplace and history platform. Discover, buy, sell, and verify vehicles with unparalleled confidence and ease.
            </motion.div>

            {/* Enhanced Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="tw:flex tw:flex-row  tw:gap-10 tw:mb-12 tw:justify-center tw:lg:tw:justify-start"
            >
              <motion.div 
                className="tw:flex tw:items-center tw:gap-5"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.4 }}
              >
                <div className="tw:w-20 tw:h-20 tw:bg-gradient-to-br tw:from-indigo-600 tw:to-blue-700 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:shadow-2xl">
                  <Award className="tw:w-10 tw:h-10 tw:text-white" />
                </div>
                <div className="tw:text-left">
                  <div className="tw:text-3xl tw:font-bold tw:text-slate-900">10,000+</div>
                  <div className="tw:text-sm tw:text-slate-600 tw:font-medium">Trusted Users</div>
                </div>
              </motion.div>
              
              <motion.div 
                className="tw:flex tw:items-center tw:gap-5"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.4 }}
              >
                <div className="tw:w-20 tw:h-20 tw:bg-gradient-to-br tw:from-emerald-600 tw:to-green-700 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:shadow-2xl">
                  <TrendingUp className="tw:w-10 tw:h-10 tw:text-white" />
                </div>
                <div className="tw:text-left">
                  <div className="tw:text-3xl tw:font-bold tw:text-slate-900">99.9%</div>
                  <div className="tw:text-sm tw:text-slate-600 tw:font-medium">Satisfaction Rate</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Enhanced CTA Button */}
            <motion.div
              variants={itemVariants}
              className="tw:flex tw:justify-center tw:lg:tw:justify-start"
            >
              <motion.button
                className="tw:bg-gradient-to-r tw:from-indigo-700 tw:to-blue-700 tw:text-white tw:px-10 tw:py-5 tw:rounded-full tw:text-xl tw:font-semibold tw:shadow-xl tw:flex tw:items-center tw:gap-4 tw:hover:shadow-2xl tw:transition-all tw:duration-400"
                whileHover={{ scale: 1.08, backgroundColor: "#1E40AF", cursor: "pointer" }}
                whileTap={{ scale: 0.92 }}
                onClick={() => navigate('/buyvehicles')}
              >
                Get Started Today
                <ArrowRight className="tw:w-6 tw:h-6" />
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Feature Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="tw:grid tw:grid-cols-3 tw:gap-10 tw:max-w-6xl tw:mx-auto tw:mb-28"
        >
          <motion.div
            variants={itemVariants}
            whileHover="hover"
            className="tw:group tw:cursor-pointer"
            onClick={() => navigate('/buyvehicles')}
          >
            <motion.div
              variants={cardHoverVariants}
              className="tw:bg-white/95 tw:backdrop-blur-lg tw:rounded-3xl tw:shadow-xl tw:p-12 tw:h-[360px] tw:flex tw:flex-col tw:items-center tw:justify-center tw:border tw:border-white/40 tw:relative tw:overflow-hidden"
            >
              <div className="tw:absolute tw:inset-0 tw:bg-gradient-to-br tw:from-indigo-200/20 tw:to-blue-200/20 tw:opacity-0 group-hover:tw:opacity-100 tw:transition-opacity tw:duration-600"></div>
              <div className="tw:relative tw:z-10 tw:text-center">
                <div className="tw:w-24 tw:h-24 tw:bg-gradient-to-br tw:from-indigo-600 tw:to-blue-700 tw:rounded-2xl tw:flex tw:items-center tw:justify-center tw:mb-8 tw:shadow-2xl">
                  <ShoppingCart className="tw:w-12 tw:h-12 tw:text-white" />
                </div>
                <h3 className="tw:text-3xl tw:font-semibold tw:text-slate-900 tw:mb-5 tw:tracking-tight">Buy a Vehicle</h3>
                <p className="tw:text-slate-700 tw:mb-8 tw:leading-relaxed tw:font-light">Explore our premium selection of vehicles with verified histories and detailed insights.</p>
                <div className="tw:flex tw:items-center tw:gap-3 tw:text-indigo-700 tw:font-semibold">
                  <span>Explore Now</span>
                  <ArrowRight className="tw:w-6 tw:h-6 tw:transform tw:transition-transform group-hover:tw:translate-x-3" />
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
              className="tw:bg-white/95 tw:backdrop-blur-lg tw:rounded-3xl tw:shadow-xl tw:p-12 tw:h-[360px] tw:flex tw:flex-col tw:items-center tw:justify-center tw:border tw:border-white/40 tw:relative tw:overflow-hidden"
            >
              <div className="tw:absolute tw:inset-0 tw:bg-gradient-to-br tw:from-emerald-200/20 tw:to-green-200/20 tw:opacity-0 group-hover:tw:opacity-100 tw:transition-opacity tw:duration-600"></div>
              <div className="tw:relative tw:z-10 tw:text-center">
                <div className="tw:w-24 tw:h-24 tw:bg-gradient-to-br tw:from-emerald-600 tw:to-green-700 tw:rounded-2xl tw:flex tw:items-center tw:justify-center tw:mb-8 tw:shadow-2xl">
                  <Car className="tw:w-12 tw:h-12 tw:text-white" />
                </div>
                <h3 className="tw:text-3xl tw:font-semibold tw:text-slate-900 tw:mb-5 tw:tracking-tight">Sell a Vehicle</h3>
                <p className="tw:text-slate-700 tw:mb-8 tw:leading-relaxed tw:font-light">List your vehicle effortlessly and connect with verified buyers on our trusted platform.</p>
                <div className="tw:flex tw:items-center tw:gap-3 tw:text-emerald-700 tw:font-semibold">
                  <span>Start Selling</span>
                  <ArrowRight className="tw:w-6 tw:h-6 tw:transform tw:transition-transform group-hover:tw:translate-x-3" />
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
              className="tw:bg-white/95 tw:backdrop-blur-lg tw:rounded-3xl tw:shadow-xl tw:p-12 tw:h-[360px] tw:flex tw:flex-col tw:items-center tw:justify-center tw:border tw:border-white/40 tw:relative tw:overflow-hidden"
            >
              <div className="tw:absolute tw:inset-0 tw:bg-gradient-to-br tw:from-purple-200/20 tw:to-indigo-200/20 tw:opacity-0 group-hover:tw:opacity-100 tw:transition-opacity tw:duration-600"></div>
              <div className="tw:relative tw:z-10 tw:text-center">
                <div className="tw:w-24 tw:h-24 tw:bg-gradient-to-br tw:from-purple-600 tw:to-indigo-700 tw:rounded-2xl tw:flex tw:items-center tw:justify-center tw:mb-8 tw:shadow-2xl">
                  <FileText className="tw:w-12 tw:h-12 tw:text-white" />
                </div>
                <h3 className="tw:text-3xl tw:font-semibold tw:text-slate-900 tw:mb-5 tw:tracking-tight">Check Vehicle History</h3>
                <p className="tw:text-slate-700 tw:mb-8 tw:leading-relaxed tw:font-light">Access comprehensive vehicle history reports for confident decision-making.</p>
                <div className="tw:flex tw:items-center tw:gap-3 tw:text-purple-700 tw:font-semibold">
                  <span>Check History</span>
                  <ArrowRight className="tw:w-6 tw:h-6 tw:transform tw:transition-transform group-hover:tw:translate-x-3" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Benefits Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="tw:text-center"
        >
          <motion.h2
            variants={itemVariants}
            className="tw:text-5xl tw:lg:tw:text-6xl tw:font-extrabold tw:bg-gradient-to-r tw:from-slate-900 tw:to-indigo-900 tw:bg-clip-text tw:text-transparent tw:mb-8 tw:tracking-tighter"
          >
            Why Choose AutoConnect?
          </motion.h2>
          
          <motion.div
            variants={itemVariants}
            className="tw:text-xl tw:text-slate-700 tw:mb-14 tw:max-w-4xl tw:mx-auto tw:font-light tw:leading-relaxed"
          >
            Experience a seamless vehicle trading journey with our innovative platform, designed for modern buyers and sellers.
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="tw:grid tw Grid-cols-1 tw:md:tw:grid-cols-3 tw:gap-10 tw:max-w-6xl tw:mx-auto"
          >
            <motion.div
              variants={itemVariants}
              className="tw:group tw:p-10 tw:bg-white/90 tw:backdrop-blur-lg tw:rounded-3xl tw:border tw:border-white/40 tw:shadow-xl tw:hover:shadow-2xl tw:transition-all tw:duration-500"
            >
              <div className="tw:w-20 tw:h-20 tw:bg-gradient-to-br tw:from-indigo-600 tw:to-blue-700 tw:rounded-xl tw:flex tw:items-center tw:justify-center tw:mx-auto tw:mb-8 tw:shadow-2xl tw:group-hover:shadow-2xl tw:transition-shadow tw:duration-500">
                <Shield className="tw:w-10 tw:h-10 tw:text-white" />
              </div>
              <h3 className="tw:text-2xl tw:font-semibold tw:text-slate-900 tw:mb-5 tw:tracking-tight">Secure Transactions</h3>
              <p className="tw:text-slate-700 tw:leading-relaxed tw:font-light">Bank-grade encryption ensures your data and payments are always secure and protected.</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="tw:group tw:p-10 tw:bg-white/90 tw:backdrop-blur-lg tw:rounded-3xl tw:border tw:border-white/40 tw:shadow-xl tw:hover:shadow-2xl tw:transition-all tw:duration-500"
            >
              <div className="tw:w-20 tw:h-20 tw:bg-gradient-to-br tw:from-emerald-600 tw:to-green-700 tw:rounded-xl tw:flex tw:items-center tw:justify-center tw:mx-auto tw:mb-8 tw:shadow-2xl tw:group-hover:shadow-2xl tw:transition-shadow tw:duration-500">
                <Users className="tw:w-10 tw:h-10 tw:text-white" />
              </div>
              <h3 className="tw:text-2xl tw:font-semibold tw:text-slate-900 tw:mb-5 tw:tracking-tight">Expert Support</h3>
              <p className="tw:text-slate-700 tw:leading-relaxed tw:font-light">Our team of automotive experts is available 24/7 to assist you at every step.</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="tw:group tw:p-10 tw:bg-white/90 tw:backdrop-blur-lg tw:rounded-3xl tw:border tw:border-white/40 tw:shadow-xl tw:hover:shadow-2xl tw:transition-all tw:duration-500"
            >
              <div className="tw:w-20 tw:h-20 tw:bg-gradient-to-br tw:from-purple-600 tw:to-indigo-700 tw:rounded-xl tw:flex tw:items-center tw:justify-center tw:mx-auto tw:mb-8 tw:shadow-2xl tw:group-hover:shadow-2xl tw:transition-shadow tw:duration-500">
                <Wrench className="tw:w-10 tw:h-10 tw:text-white" />
              </div>
              <h3 className="tw:text-2xl tw:font-semibold tw:text-slate-900 tw:mb-5 tw:tracking-tight">Certified Vehicles</h3>
              <p className="tw:text-slate-700 tw:leading-relaxed tw:font-light">Every vehicle is rigorously inspected and verified for quality and reliability.</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;