import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 px-4 py-12">
      <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="text-xl font-bold">AutoInsight</h3>
          <p className="mt-2 text-slate-400">
            India's most trusted car review and community platform.
          </p>
        </div>
        <FooterColumn
          title="Quick Links"
          links={[
            ["/cars", "Browse Cars"],
            ["/review", "Write Review"],
            ["/community", "Community Forum"],
          ]}
        />
        <FooterColumn
          title="Resources"
          links={[
            ["/tips", "Tips & Problems"],
            ["#", "Buying Guide"],
            ["#", "Car Comparisons"],
          ]}
        />
        <FooterColumn
          title="Legal"
          links={[
            ["#", "Privacy Policy"],
            ["#", "Terms of Service"],
            ["#", "Contact Us"],
          ]}
        />
      </div>
      <p className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-center text-sm text-slate-500">
        © 2026 AutoInsight. All rights reserved.
      </p>
    </footer>
  );
}
function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="font-bold">{title}</h4>
      <ul className="mt-3 space-y-2 text-slate-400">
        {links.map(([to, label]) => (
          <li key={label}>
            <Link className="hover:text-blue-400" to={to}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
