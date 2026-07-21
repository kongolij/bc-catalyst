'use client';

import Link from 'next/link';
import { type ReactNode } from 'react';

interface Props {
  className?: string;
  logoUrl?: string;
  logoAlt?: string;
  logoText?: string;
  homeHref?: string;
  showSearch?: boolean;
  showAccount?: boolean;
  showWishlist?: boolean;
  showCart?: boolean;
  showLanguage?: boolean;
  sticky?: boolean;
  nav?: ReactNode;
}

export function GesSiteHeaderClient({
  className,
  logoUrl,
  logoAlt = 'Logo',
  logoText = 'BRAND',
  homeHref = '/',
  showSearch = true,
  showAccount = true,
  showWishlist = false,
  showCart = true,
  showLanguage = false,
  sticky = false,
  nav,
}: Props) {
  return (
    <header
      className={['ges-site-header', sticky ? 'ges-site-header--sticky' : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="ges-site-header__inner">
        <Link className="ges-site-header__logo" href={homeHref}>
          {logoUrl ? <img alt={logoAlt} src={logoUrl} /> : <span>{logoText}</span>}
        </Link>

        <div className="ges-site-header__nav">{nav}</div>

        <div className="ges-site-header__actions">
          {showSearch && (
            <button aria-label="Search" className="ges-site-header__btn" type="button">
              🔍
            </button>
          )}
          {showLanguage && (
            <button aria-label="Language" className="ges-site-header__btn" type="button">
              EN
            </button>
          )}
          {showAccount && (
            <Link aria-label="Account" className="ges-site-header__btn" href="/account">
              👤
            </Link>
          )}
          {showWishlist && (
            <Link aria-label="Wishlist" className="ges-site-header__btn" href="/account/wishlists">
              ♡
            </Link>
          )}
          {showCart && (
            <Link aria-label="Cart" className="ges-site-header__btn" href="/cart">
              🛒
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
