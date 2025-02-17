import React from 'react';

const FaqItem = ({ question, answer, index, activeIndex, setActiveIndex }) => {
  const isActive = activeIndex === index;

  return (
    <li className="bg-white my-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h2
        onClick={() => setActiveIndex(isActive ? null : index)}
        className="flex flex-row justify-between items-center font-semibold p-3 cursor-pointer hover:bg-saree-lightgold"
      >
        <span className="text-saree-maroon text-lg">{question}</span>
        <svg
          className={`fill-current text-saree-maroon h-6 w-6 transform transition-transform duration-500 ${
            isActive ? 'rotate-180' : ''
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M13.962,8.885l-3.736,3.739c-0.086,0.086-0.201,0.13-0.314,0.13S9.686,12.71,9.6,12.624l-3.562-3.56C5.863,8.892,5.863,8.611,6.036,8.438c0.175-0.173,0.454-0.173,0.626,0l3.25,3.247l3.426-3.424c0.173-0.172,0.451-0.172,0.624,0C14.137,8.434,14.137,8.712,13.962,8.885 M18.406,10c0,4.644-3.763,8.406-8.406,8.406S1.594,14.644,1.594,10S5.356,1.594,10,1.594S18.406,5.356,18.406,10 M17.521,10c0-4.148-3.373-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.147,3.374,7.521,7.521,7.521C14.148,17.521,17.521,14.147,17.521,10"></path>
        </svg>
      </h2>
      <div
        className={`border-l-2 border-saree-gold overflow-hidden duration-500 transition-all ${
          isActive ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <p className="p-3 text-saree-darknavy">{answer}</p>
      </div>
    </li>
  );
};

const Faq = () => {
  const [activeIndex, setActiveIndex] = React.useState(null);
  const faqs = [
    {
      question: "How do I care for my handloom saree?",
      answer: "We recommend dry cleaning for pure silk sarees and hand washing with mild detergent for cotton sarees. Always store in a cool, dry place using muslin cloth for preservation. Avoid direct sunlight exposure for prolonged periods."
    },
    {
      question: "Do you provide blouse stitching services?",
      answer: "Yes! We offer complimentary blouse stitching with select saree purchases. You can provide your measurements during checkout and our master tailors will craft the perfect fit. Allow 3-5 extra business days for stitched orders."
    },
    {
      question: "Can I customize saree borders or pallu designs?",
      answer: "Absolutely! Our bespoke service allows customization of borders, pallu patterns, and even color combinations. Please contact our design team at least 7 days before your required delivery date for custom orders."
    },
    {
      question: "How does international shipping work?",
      answer: "We ship worldwide via DHL/FedEx with full tracking. Most international orders reach in 5-7 business days. Duties/taxes are calculated at checkout for transparent pricing. Free shipping on orders over $300."
    },
    {
      question: "What if my saree doesn't fit properly?",
      answer: "We offer free exchanges within 7 days of delivery. Please note: Unstitched sarees can be exchanged for size, while customized/stitched items require a 50% restocking fee. Defective products are fully refundable."
    },
    {
      question: "How can I verify authenticity of handloom products?",
      answer: "Every handloom saree comes with a government-issued Handloom Mark tag and unique hologram. You can verify authenticity through our online portal using the 12-digit code included with your purchase."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, UPI, NetBanking, and EMI options. For COD (Cash on Delivery), a 2% convenience fee applies. International customers can pay via Wise or Western Union."
    },
    {
      question: "Do you offer wedding/bulk orders?",
      answer: "Yes! Contact our bulk order desk for special pricing on wedding trousseaus (minimum 10 sarees). We provide fabric swatches, color matching, and coordinated delivery for large orders."
    }
  ];

  return (
    <main className="p-5 bg-saree-cream min-h-screen">
      <div className="flex justify-center items-start my-2">
        <div className="w-full sm:w-10/12 md:w-3/4 lg:w-1/2 my-1">
          <h2 className="text-2xl font-semibold text-saree-maroon mb-4 text-center">
            Frequently Asked Questions
          </h2>
          <ul className="flex flex-col">
            {faqs.map((faq, index) => (
              <FaqItem
                key={index}
                index={index}
                question={faq.question}
                answer={faq.answer}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
              />
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Faq;