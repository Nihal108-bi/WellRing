export default function LandingFooter() {
  return (
    <footer className="py-10 px-5 border-t border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#111210]">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xl text-[#1a6b55] dark:text-[#2d9574]" style={{ fontFamily: "var(--font-dm-serif)" }}>WellRing</span>
        <p className="text-xs text-[#888884] text-center">
          © {new Date().getFullYear()} WellRing Technologies Pvt. Ltd. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-xs text-[#555550] dark:text-[#888884]">
          {["Privacy", "Terms", "Contact"].map((link) => (
            <a key={link} href="#" className="hover:text-[#1a6b55] dark:hover:text-[#2d9574] transition-colors">{link}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
