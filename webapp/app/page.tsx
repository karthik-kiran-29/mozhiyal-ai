"use client"

import VoiceChat from "@/components/VoiceChat";
import { useState } from "react";
import axios from "axios";




export default function Home() {

  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async(e:any) => {
    const isSuccess = await addEmail(email);
    e.preventDefault;
    if (isSuccess) {
      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  async function addEmail(email:string):Promise<boolean> {
    try{
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/waitlist`;
    const data = {email};

    const response = await axios.post(url,data);

    if(!response.data){
      return false;
    }

    return true;
    }catch(error){
      console.log("error:addEmail func -",error);
      return false;
    }
  }

  const features = [
    {
      title: "Customize Your Model",
      description: "Tailor your AI voice model to match your brand's personality. Choose from various voice tones, speaking styles, and response patterns. Configure the model's behavior to align perfectly with your website's purpose and audience expectations.",
      image: "land_page/customise_your_model.png"
    },
    {
      title: "Test The Voice Model",
      description: "Before going live, thoroughly test your voice model in our sandbox environment. Try different scenarios, adjust parameters in real-time, and ensure the AI responds exactly how you want. Perfect your conversational flow before deployment.",
      image: "land_page/test_the_model.png"
    },
    {
      title: "Copy & Paste on your Page",
      description: "Integration couldn't be simpler. Just copy our lightweight code snippet and paste it into your website. No complex setup, no backend configuration needed. Your website will be talking to visitors in minutes, not hours.",
      image: "land_page/copy_and_paste.png"
    }
  ];
  return (
    <>
    <div className="h-screen">
      <div className="flex justify-between h-5 p-10 font-bold text-3xl md:mx-10">
        <h1>MOLIYAL AI</h1>
        <h1>BETA</h1>
      </div>
      <div className="flex text-center w-full justify-around md:mt-30 mt-15">
        <div className="py-2 px-5 mt-1 text-3xl rounded-xl z-10 absolute bg-black">In Just Few Clicks</div>
        <div className="py-3 px-6 text-3xl rounded-xl bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-violet-500">In Just Few Clicks</div>
      </div>
      <div className="text-center p-10 text-7xl font-bold">Make Your Website Talk!</div>
      <div className="flex flex-col justify-between">
        <VoiceChat Idle="/land_page/sphere.svg" Speaking="/land_page/sphere.svg" Processing="/land_page/sphere.svg"/>
        <img src={"/land_page/hero_background.svg"} className="w-full absolute md:pt-25 pt-55"></img>
      </div>
    </div>
    {/* Features Section */}
      <div className="py-20 px-4 md:px-10">
        {features.map((feature, index) => (
          <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 md:gap-16  h-screen`}>
            {/* Image */}
            <div className="w-full lg:w-1/2">
              <div className="relative group">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="relative w-full h-64 md:h-80 object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </div>
            
            {/* Content */}
            <div className="w-full lg:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {feature.title}
              </h2>
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Waitlist Section */}
      <div className="py-20 px-4 md:px-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Join the Waitlist
          </h2>
          <p className="text-gray-300 text-lg md:text-xl mb-12">
            Be the first to experience the future of website interaction. Get early access and exclusive updates.
          </p>
          
          <div className="space-y-6">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-6 py-4 text-lg bg-gray-900 border border-gray-700 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
            
            <button
              onClick={handleSubmit}
              className="w-full md:w-auto px-8 py-4 text-lg font-semibold bg-blue-500 rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Join Waitlist
            </button>
          </div>

          {isSubmitted && (
            <div className="mt-6 p-4 bg-green-900/20 border border-green-500/20 rounded-xl">
              <p className="text-green-400">Thanks for joining! We&apos;ll be in touch soon.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-4 md:px-10 border-t border-gray-800">
        <div className="text-center">
          <p className="text-gray-400">
            Developed by <span className="text-blue-400 font-semibold">Karthik Kiran</span> with ❤️
          </p>
        </div>
      </footer>

    </>
  );
}
