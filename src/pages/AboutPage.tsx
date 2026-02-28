import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import logo from '../assets/pioneer-aushadhisewa.png';

export default function AboutPage() {
  const socialLinks = [
    { icon: "/socials/linkedin.svg", url: '#', label: 'LinkedIn' },
    { icon: "/socials/x.svg", url: '#', label: 'Twitter' },
    { icon: "/socials/youtube.svg", url: '#', label: 'YouTube' },
    { icon: "/socials/instagram-icon.svg", url: '#', label: 'Instagram' },
    { icon: "/socials/gmail.svg", url: 'mailto:pioneeraushadhisewa@gmail.com', label: 'Email' },
    { icon: "/socials/tiktok-icon-light.svg", url: '#', label: 'TikTok' },
    { icon: "/socials/facebook-icon.svg", url: '#', label: 'Facebook' },
  ];

  return (
    <main className="min-h-screen">
      <section className="mx-auto w-full max-w-5xl px-4 py-10">
        <Card className="bg-transparent">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-neutral-900">About Pioneer Aushadhi Sewa</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral max-w-none">
            <p className='text-black'>
               Pioneer Aushadhi Sewa is a modern online pharmacy focused on fast, reliable medicine delivery
              and a smooth shopping experience. We aim to make healthcare more accessible by
              combining verified products with helpful information and customer-first support.
            </p>
            <h3 className='pt-4'>What we value</h3>
        <ol className="list-disc list-inside space-y-1">
              <li>Authentic, quality-checked medicines</li>
              <li>Clear pricing and transparent communication</li>
              <li>Fast delivery within our service areas</li>
              <li>Privacy and data protection</li>
            </ol>
            <h3 className='pt-4'>Contact</h3>
            <p>
              Have questions? Reach us at <strong>pioneeraushadhisewa@gmail.com</strong> or call
              <strong> +977 9705467105</strong>.
            </p>
          </CardContent>
      
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center justify-center">
              {/* Left Side - Profile Image and Name */}
              <div className="flex flex-col items-center justify-center w-full md:w-1/3 flex-shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#16a34a] mb-4 mx-auto md:mx-0">
                  <img
                    src={logo}
                    alt="Samir Akhtar"
                    className="w-full h-full object-cover"
                  />
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-neutral-800 mb-1 text-center w-full">
                  SAMIR AKHTAR
                </h2>
                <p className="text-sm md:text-base font-semibold text-[#16a34a] mb-0 text-center w-full">
                  FOUNDER & CEO
                </p>
              </div>

              {/* Right Side - About Text and Social Icons */}
              <div className="flex-1 md:w-2/3 w-full">
                <h3 className="text-xl md:text-2xl font-bold text-[#16a34a] mb-4 md:mb-6">
                  ABOUT SAMIR
                </h3>
                
                <div className="space-y-3 text-neutral-700 text-sm md:text-base leading-relaxed">
                  <p>
                    Samir Akhtar is a Computer Engineering graduate from India and the passionate founder of 
                    Pioneer Aushadhi Sewa. With a strong technical background and entrepreneurial drive, 
                    he combines innovation with healthcare accessibility to revolutionize medicine delivery 
                    in Nepal through digital solutions.
                  </p>
                  <p>
                    His leadership focuses on building robust, user-friendly systems that prioritize customer 
                    experience. Committed to making quality healthcare accessible, Samir's vision extends 
                    beyond business success to creating a positive impact on digital transformation in the 
                    pharmaceutical industry.
                  </p>
                </div>

                {/* Horizontal Line - Aligned with Social Icons */}
                <div className="w-full max-w-fit h-0.5 bg-[#2563eb] my-6"></div>

                {/* Social Media Icons */}
                <div className="flex flex-wrap gap-3 md:gap-4">
                  {socialLinks.map((social, index) => {
              
                    return (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-transparent flex items-center justify-center text-white hover:bg-gray-100 hover:scale-110 hover:shadow-lg transition-all duration-200"
                        aria-label={social.label}
                      >
                        <img
                          src={social.icon}
                          alt={social.label}
                          className="w-5 h-5 md:w-6 md:h-6"
                        />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}