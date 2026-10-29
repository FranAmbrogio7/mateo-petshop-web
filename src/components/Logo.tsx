import Link from "next/link";

export default function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2 font-extrabold text-marca">
            <svg viewBox="0 0 32 32" aria-hidden="true" className="h-8 w-8 fill-current">
                <ellipse cx="16" cy="21" rx="7" ry="6" />
                <ellipse cx="7" cy="13" rx="3" ry="4" />
                <ellipse cx="13" cy="7.5" rx="3" ry="4" />
                <ellipse cx="19" cy="7.5" rx="3" ry="4" />
                <ellipse cx="25" cy="13" rx="3" ry="4" />
            </svg>
            <span className="text-lg leading-none">
                Mateo <span className="text-acento">Pet Shop</span>
            </span>
        </Link>
    );
}