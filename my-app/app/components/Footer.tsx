'use client';

export default function Footer() {
  return (
    <footer className="py-12 px-6 bg-gray-800 border-t border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Kontak */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-white transition-colors duration-300">
              Kontak
            </h4>
            <div className="space-y-2 text-gray-400 transition-colors duration-300">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>(021) 1234-5678</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>bk@smktarunabhakti.sch.id</span>
              </div>
            </div>
          </div>

          {/* Alamat */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-white transition-colors duration-300">
              Alamat
            </h4>
            <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-400 transition-colors duration-300">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Jl. Pendidikan No. 123, Jakarta</span>
            </div>
          </div>

          {/* Media Sosial */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-white transition-colors duration-300">
              Media Sosial
            </h4>
            <div className="flex justify-center md:justify-start space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-600  transition-colors duration-300"
                aria-label="Instagram"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-600  transition-colors duration-300"
                aria-label="Facebook"
              >
                Facebook
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-600  transition-colors duration-300"
                aria-label="Twitter"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 text-center border-t border-gray-600 ">
          <p className="text-gray-400 transition-colors duration-300">
            © 2024 SMK Taruna Bhakti. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}





