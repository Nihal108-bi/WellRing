"use client";

import Image from "next/image";

type Review = { quote: string; name: string; location: string; avatar: string };

const row1: Review[] = [
  { quote: "My mother-in-law lives alone in Coimbatore. Since WellRing, she lights up every morning knowing the call is coming. She says it feels just like me.", name: "Priya S.", location: "NRI in London", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&q=80" },
  { quote: "I was sceptical about AI calls but the voice clone is genuinely moving. Dad actually asked why I don't call as long as 'that version of me' does!", name: "Rohan M.", location: "San Francisco", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&q=80" },
  { quote: "The smart alerts saved us once. WellRing flagged that Nani sounded confused, and we were at her door within the hour. I can't put a price on that.", name: "Anita K.", location: "Dubai", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&q=80" },
  { quote: "Papa is 81 and lives in Varanasi. He was so lonely after Ma passed. WellRing has genuinely given him a reason to wake up cheerfully every morning.", name: "Vikram T.", location: "Toronto", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&q=80" },
  { quote: "I cried the first time I heard the call. It was my voice, but kinder and more patient than I manage on most days. My mother deserves that every morning.", name: "Deepa R.", location: "Melbourne", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&q=80" },
  { quote: "The weekly video call with my face as the avatar was the moment my dad truly understood — and loved — what WellRing is. He calls it 'beta ki picture'.", name: "Arjun S.", location: "New York", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80" },
];

const row2: Review[] = [
  { quote: "Nani used to call us 5 times a day out of loneliness. Now WellRing gives her that morning connection and she's calmer. We all are.", name: "Sneha B.", location: "Singapore", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&q=80" },
  { quote: "My father has early Alzheimer's. The AI remembered details I'd forgotten — and he never noticed the difference. That consistency is medicine.", name: "Karan M.", location: "Chicago", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&q=80" },
  { quote: "We set it up for Dadi in Lucknow. She speaks Hinglish and the AI matches her perfectly. It remembered her grandson Aarav's birthday. She was thrilled.", name: "Pallavi J.", location: "Amsterdam", avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=80&h=80&fit=crop&q=80" },
  { quote: "As a geriatrician I was sceptical. But the behavioural baseline feature is genuinely impressive. It caught a cognitive shift before the family noticed.", name: "Dr. Meera N.", location: "Mumbai", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop&q=80" },
  { quote: "Setup took 20 minutes. Within a week my mother was asking 'has my daughter called yet?' — referring to the AI. That says everything.", name: "Rahul G.", location: "London", avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&h=80&fit=crop&q=80" },
  { quote: "The mood tracking alerted me my father was having a low week. I booked a flight home. When I arrived he hugged me and said 'I knew you'd come'.", name: "Sonia P.", location: "UAE", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&q=80" },
];

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="w-80 flex-shrink-0 mx-3 bg-zinc-900 dark:bg-zinc-800/60 border border-zinc-700/50 rounded-2xl p-5 flex flex-col">
      <div className="text-6xl text-emerald-500/20 font-serif leading-none mb-2 select-none">"</div>
      <div className="flex gap-0.5 mb-2">
        {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400 text-sm">★</span>)}
      </div>
      <p className="text-sm text-zinc-300 italic leading-relaxed flex-1">"{review.quote}"</p>
      <div className="border-t border-zinc-700/50 mt-3 pt-3 flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <Image src={review.avatar} alt={review.name} fill className="object-cover" sizes="40px" />
        </div>
        <div>
          <p className="font-medium text-white text-sm">{review.name}</p>
          <p className="text-xs text-zinc-400">{review.location}</p>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({ reviews, direction }: { reviews: Review[]; direction: "left" | "right" }) {
  const doubled = [...reviews, ...reviews];
  const animClass = direction === "left"
    ? "animate-[scroll-left_40s_linear_infinite]"
    : "animate-[scroll-right_55s_linear_infinite]";

  return (
    <div className="overflow-hidden group">
      <div className={`flex ${animClass} group-hover:[animation-play-state:paused]`}>
        {doubled.map((r, i) => <ReviewCard key={i} review={r} />)}
      </div>
    </div>
  );
}

export default function LandingTestimonials() {
  return (
    <section className="py-20 bg-[#f7f6f3] dark:bg-[#18191a] overflow-hidden">
      <div className="text-center mb-12 px-5">
        <h2 className="text-3xl text-[#1a1a18] dark:text-[#f0efe9] mb-3" style={{ fontFamily: "var(--font-dm-serif)" }}>
          Families across India &amp; the world trust WellRing
        </h2>
        <p className="text-sm text-[#555550] dark:text-[#888884]">
          12,000+ calls completed · 2,000+ families · 4.9★ average rating
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <MarqueeRow reviews={row1} direction="left" />
        <MarqueeRow reviews={row2} direction="right" />
      </div>
    </section>
  );
}
