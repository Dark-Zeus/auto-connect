import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Zap, Shield, Users, TrendingUp } from 'lucide-react';
import elephantImage from '../../assets/images/AutoConnectMascot.png';
import { toast } from 'react-toastify';
import subscriptionPaymentAPI from '../../services/subscriptionPaymentApiService';

const SubscriptionPlans = () => {

  const [processingCycle, setProcessingCycle] = useState(null);

  const planData = {
    plus: {
      monthly: {
        costPerAd: 'Free',
        totalCost: 12000,
        validity: '1 Month',
        adsPerMonth: 'Unlimited',
        promotionVoucher: '3 Days Bump Up'
      },
      quarterly: {
        costPerAd: 'Free',
        totalCost: 24000,
        validity: '3 Months',
        adsPerMonth: 'Unlimited',
        promotionVoucher: '3 Days Bump Up'
      },
      yearly: {
        costPerAd: 'Free',
        totalCost: 48000,
        validity: '12 Months',
        adsPerMonth: 'Unlimited',
        promotionVoucher: '3 Days Bump Up'
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(amount).replace('LKR', 'LKR ');
  };

  const handleSelectPlan = async (cycle, data) => {
    try {
      setProcessingCycle(cycle);
      const planLabel = `Plus - ${cycle}`;

      // Try to read userId from a persisted user object if available
      let userId;
      try {
        const raw = localStorage.getItem("user");
        if (raw) userId = JSON.parse(raw)?._id;
      } catch (e) {
        // ignore parse errors
      }

      const { url } = await subscriptionPaymentAPI.createSession({
        amount: data.totalCost,
        planLabel,
        userId, // backend also supports req.user if you add an auth guard
      });

      if (url) {
        window.location.href = url;
      } else {
        toast.error("Failed to start checkout.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to create checkout session");
    } finally {
      setProcessingCycle(null);
    }
  };

  const PlanCard = ({ data, billingCycle, isPopular = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`tw:relative tw:bg-white tw:rounded-2xl tw:shadow-lg tw:p-6 tw:border-2 tw:transition-all tw:duration-300 tw:hover:shadow-xl tw:hover:scale-105 ${
        isPopular ? 'tw:border-blue-500 tw:shadow-blue-100' : 'tw:border-gray-200'
      }`}
    >
      {isPopular && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="tw:absolute tw:-top-3 tw:-right-3 tw:bg-gradient-to-r tw:from-orange-500 tw:to-red-500 tw:text-white tw:px-4 tw:py-1 tw:rounded-full tw:text-sm tw:font-semibold tw:shadow-lg"
        >
          Popular
        </motion.div>
      )}
      
      <div className="tw:text-center tw:mb-6">
        <h3 className="tw:text-2xl tw:font-bold tw:text-gray-800 tw:mb-2 tw:capitalize">{billingCycle}</h3>
        <motion.div
          key={billingCycle}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="tw:text-4xl tw:font-bold tw:text-transparent tw:bg-clip-text tw:bg-gradient-to-r tw:bg-[linear-gradient(135deg,var(--sky-blue),var(--navy-blue))] "
        >
          {formatCurrency(data.totalCost)}
        </motion.div>
      </div>

      <div className="tw:space-y-4 tw:mb-8">
        <div className="tw:flex tw:items-center tw:text-gray-600">
          <TrendingUp className="tw:w-5 tw:h-5 tw:mr-3 tw:text-green-500" />
          <div>
            <span className="tw:text-sm tw:text-gray-500">Cost Per ad</span>
            <div className="tw:font-semibold">LKR {data.costPerAd}</div>
          </div>
        </div>

        <div className="tw:flex tw:items-center tw:text-gray-600">
          <Shield className="tw:w-5 tw:h-5 tw:mr-3 tw:text-blue-500" />
          <div>
            <span className="tw:text-sm tw:text-gray-500">Validity Period</span>
            <div className="tw:font-semibold">{data.validity}</div>
          </div>
        </div>

        <div className="tw:flex tw:items-center tw:text-gray-600">
          <Users className="tw:w-5 tw:h-5 tw:mr-3 tw:text-purple-500" />
          <div>
            <span className="tw:text-sm tw:text-gray-500">Number of ads per month</span>
            <div className="tw:font-semibold">{data.adsPerMonth}</div>
          </div>
        </div>

        <div className="tw:flex tw:items-center tw:text-gray-600">
          <Star className="tw:w-5 tw:h-5 tw:mr-3 tw:text-yellow-500" />
          <div>
            <span className="tw:text-sm tw:text-gray-500">Free Promotion</span>
            <div className="tw:font-semibold">{data.promotionVoucher.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={processingCycle === billingCycle}
        onClick={() => handleSelectPlan(billingCycle, data)}
        className={`tw:w-full tw:bg-gradient-to-r tw:bg-[linear-gradient(135deg,var(--sky-blue),var(--navy-blue))]  tw:text-white tw:py-3 tw:px-6 tw:rounded-xl tw:font-semibold tw:shadow-lg tw:hover:shadow-xl tw:hover:cursor-pointer tw:transition-all tw:duration-300 ${
          processingCycle === billingCycle ? 'tw:opacity-70 tw:cursor-not-allowed' : ''
        }`}
      >
        {processingCycle === billingCycle ? 'Processing...' : 'Select Plan'}
      </motion.button>
    </motion.div>
  );

  return (
    <div className="tw:min-h-screen tw:w-7xl tw:bg-gray-50 tw:py-16 tw:rounded-xl">
      <div className="tw:max-w-7xl tw:mx-auto tw:p-6">
        {/* Header */}
        {/* ...existing code... */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="tw:flex  tw:items-center tw:mb-4"
        >
          <div className="tw:space-y-8">
            <div className="tw:w-80 tw:h-80 tw:bg-gradient-to-br tw:from-blue-100 tw:to-blue-200 tw:rounded-full tw:flex tw:items-center tw:justify-center tw:shadow-2xl">
              <img
                src={elephantImage}
                alt="Elephant Mascot"
                className="tw:w-80 tw:h-auto tw:object-contain"
              />
            </div>
          </div>
          <div className="tw:flex tw:flex-col tw:items-center tw:ml-10">
            <h1 className="tw:text-4xl tw:font-bold tw:text-gray-800 tw:mb-4">
              Simple, transparent pricing
            </h1>
            <div className="tw:text-gray-600 tw:text-lg">
              No contracts. No surprise fees.
            </div>
          </div>
        </motion.div>
        {/* ...existing code... */}

        {/* Plan Cards (Plus only) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="tw:grid tw:grid-cols-3 tw:gap-8 tw:max-w-6xl tw:mx-auto"
        >
          {Object.entries(planData.plus).map(([cycle, data]) => (
            <PlanCard
              key={cycle}
              data={data}
              billingCycle={cycle}
              isPopular={cycle === 'quarterly'}
            />
          ))}
        </motion.div>

        {/* Features Section */}
        {/* ...existing code... */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="tw:mt-16 tw:text-center"
        >
          <h2 className="tw:text-2xl tw:font-bold tw:text-gray-800 tw:mb-8">
            All plans include
          </h2>
          <div className="tw:grid tw:grid-cols-1 tw:md:tw:grid-cols-3 tw:gap-8 tw:max-w-4xl tw:mx-auto">
            {[
              { icon: Zap, title: 'Lightning Fast', desc: 'Quick ad deployment' },
              { icon: Shield, title: 'Secure & Reliable', desc: 'Enterprise-grade security' },
              { icon: Users, title: '24/7 Support', desc: 'Round-the-clock assistance' }
            ].map(({ icon: Icon, title, desc }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="tw:text-center tw:p-6"
              >
                <div className="tw:w-16 tw:h-16 tw:bg-gradient-to-r tw:bg-[linear-gradient(135deg,var(--sky-blue),var(--navy-blue))] tw:rounded-full tw:flex tw:items-center tw:justify-center tw:mx-auto tw:mb-4">
                  <Icon className="tw:w-8 tw:h-8 tw:text-white" />
                </div>
                <h3 className="tw:text-xl tw:font-semibold tw:text-gray-800 tw:mb-2">{title}</h3>
                <p className="tw:text-gray-600">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* ...existing code... */}
      </div>
    </div>
  );
};

export default SubscriptionPlans;