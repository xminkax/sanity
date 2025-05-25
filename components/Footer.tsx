import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  return (
    <footer
      className={`${pathname === "/games" && "text-[#F0E6D2]"} w-full flex items-center justify-center gap-6 py-6`}
    >
      <a
        href="https://github.com/xminkax/sanity"
        target="_blank"
        className="link-hover focus-ring"
        aria-label="GitHub"
      >
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 .297a12 12 0 00-3.794 23.4c.6.111.82-.258.82-.577v-2.256c-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.776.42-1.305.762-1.605-2.665-.306-5.467-1.333-5.467-5.932 0-1.31.467-2.381 1.235-3.221-.123-.304-.535-1.527.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 016.004 0c2.29-1.552 3.296-1.23 3.296-1.23.653 1.649.241 2.872.12 3.176.77.84 1.232 1.911 1.232 3.221 0 4.61-2.807 5.624-5.48 5.921.432.372.816 1.102.816 2.222v3.293c0 .322.218.694.825.576A12.003 12.003 0 0012 .297z" />
        </svg>
      </a>

      <a
        href="https://www.linkedin.com/in/monika-kindernayova-990477a6/"
        target="_blank"
        className="link-hove focus-ring"
        aria-label="LinkedIn"
      >
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.11 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.1c.53-1 1.84-2.2 3.9-2.2 4.17 0 4.94 2.75 4.94 6.32V24h-4v-7.5c0-1.8-.03-4.12-2.5-4.12-2.5 0-2.88 1.95-2.88 3.98V24h-4V8z" />
        </svg>
      </a>
    </footer>
  );
}
