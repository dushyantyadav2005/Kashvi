import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, MessageCircle, ThumbsUp, Calendar, Mail } from "lucide-react";
import { motion } from "framer-motion";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/contact");
      setFeedbacks(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setError("Failed to load feedbacks. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cream-50 to-cream-100 px-4 md:px-6">
        <div className="rounded-xl border-l-4 border-maroon-600 bg-white p-6 md:p-8 shadow-lg max-w-sm w-full">
          <div className="text-center">
            <div className="mb-3 text-3xl text-maroon-600">⚠️</div>
            <h3 className="mb-2 text-lg md:text-xl font-semibold text-maroon-800 font-playfair">
              Error Loading Feedbacks
            </h3>
            <p className="text-sm md:text-base text-gray-600 font-montserrat">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-100 p-6 md:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-gold-100 bg-white p-4 md:p-6 shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-maroon-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 md:h-4 w-3/4 rounded bg-maroon-100" />
                    <div className="h-2 md:h-3 w-1/2 rounded bg-maroon-100" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-2 md:h-3 rounded bg-maroon-100" />
                  <div className="h-2 md:h-3 w-5/6 rounded bg-maroon-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-100 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="relative mb-12 md:mb-16 text-center">
          <div className="absolute left-1/2 top-0 w-16 md:w-24 -translate-x-1/2 bg-gradient-to-r from-maroon-600 to-gold-500 h-1"></div>
          <h1 className="pt-6 text-3xl md:text-5xl font-bold text-maroon-800 font-playfair">
            Testimonials & Feedback
          </h1>
          <p className="mt-2 text-sm md:text-base text-maroon-600 font-montserrat">
            Hear what our customers have to say about us.
          </p>
        </div>

        {/* Feedback Grid */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {feedbacks.map((feedback, index) => (
            <motion.div
              key={feedback._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl border border-gold-100 bg-white p-5 md:p-6 shadow-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              {/* User Info */}
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-gradient-to-br from-maroon-600 to-gold-500 shadow-md">
                  <User size={20} className="text-white md:w-6 md:h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-playfair text-lg md:text-xl font-bold text-maroon-800">{feedback.name}</h3>
                  <div className="mt-1 flex items-center text-xs md:text-sm text-maroon-500 font-montserrat">
                    <Mail size={12} className="mr-1 md:mr-2 md:w-5 md:h-5" />
                    {feedback.email}
                  </div>
                </div>
                <div className="rounded-full bg-gold-50 px-2 py-1 text-xs md:text-sm text-gold-600 font-montserrat">
                  <Calendar size={12} className="mr-1 md:mr-2 md:w-5 md:h-5 inline" />
                  {new Date(feedback.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
              </div>

              {/* Feedback Message */}
              <div className="relative mt-3 md:mt-4">
                <MessageCircle size={30} className="absolute -left-1 top-0 text-gold-200 md:w-8 md:h-8" />
                <div className="ml-6">
                  <p className="text-maroon-700 text-sm md:text-base font-open-sans leading-relaxed">{feedback.message}</p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-4 md:mt-6 flex items-center justify-between border-t border-gold-100 pt-3 md:pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center space-x-1 md:space-x-2"
                >
                  <div className="rounded-full bg-gold-50 p-1.5 md:p-2">
                    <ThumbsUp size={16} className="text-gold-500 md:w-6 md:h-6 transition-colors group-hover:text-gold-600" />
                  </div>
                  <span className="text-xs md:text-sm text-maroon-600 font-montserrat group-hover:text-maroon-800">
                    Helpful
                  </span>
                </motion.button>
                <div className="rounded-full bg-maroon-600 px-2 py-1 text-xs text-white font-montserrat">
                  #{feedback._id?.slice(-4) || index + 1}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackList;