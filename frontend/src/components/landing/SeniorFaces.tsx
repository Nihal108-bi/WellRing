"use client";

import Image from "next/image";

const seniors = [
  { src: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=300&h=300&fit=crop&q=80", name: "Kamla ji", city: "Lucknow" },
  { src: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&q=80", name: "Rajan", city: "Chennai" },
  { src: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=300&h=300&fit=crop&q=80", name: "Meera", city: "Pune" },
  { src: "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?w=300&h=300&fit=crop&q=80", name: "Suresh", city: "Ahmedabad" },
  { src: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=300&h=300&fit=crop&q=80", name: "Lakshmi", city: "Hyderabad" },
  { src: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=300&h=300&fit=crop&q=80", name: "Ram ji", city: "Jaipur" },
];

export default function SeniorFaces() {
  return (
    <section className="py-16 px-5 bg-[#f7f6f3] dark:bg-[#18191a]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2
            className="text-2xl md:text-3xl text-[#1a1a18] dark:text-[#f0efe9] mb-2"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Meet the seniors WellRing watches over, every morning.
          </h2>
          <p className="text-sm text-[#555550] dark:text-[#888884]">Real families. Real peace of mind.</p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
          {seniors.map(({ src, name, city }) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <div className="relative w-full rounded-2xl overflow-hidden shadow-md aspect-square hover:scale-105 transition-transform duration-300">
                <Image src={src} alt={name} fill className="object-cover" sizes="(max-width: 768px) 30vw, 160px" />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap flex items-center gap-1 bg-emerald-500/90 backdrop-blur-sm rounded-full px-2 py-0.5 text-[9px] md:text-[10px] text-white font-medium shadow">
                  ✓ <span className="hidden sm:inline">Daily calls active</span><span className="sm:hidden">Active</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-[#1a1a18] dark:text-[#f0efe9] leading-tight">{name}</p>
                <p className="text-[10px] text-[#888884]">{city}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
