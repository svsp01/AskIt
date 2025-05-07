"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, MessageSquare, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/shared/mode-toggle';
import { useAuth } from '@/queries/useAuth';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { href: '/', label: 'Home', exact: true },
    { href: '/ask', label: 'Ask a Question' },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/ai/chat', label: 'AI Chat', icon: MessageSquare },
  ];

  const NavItems = () => (
    <>
      {navLinks.map(({ href, label, icon: Icon, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);
        return (
          <li key={href}>
            <Link 
              href={href}
              onClick={closeMenu}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'hover:bg-primary/5'
              }`}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {label}
            </Link>
          </li>
        );
      })}
    </>
  );

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-colors duration-200 ${
        isScrolled ? 'bg-background/95 backdrop-blur-sm border-b' : 'bg-transparent'
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl hidden sm:inline-block">AskIt AI</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-1">
            <NavItems />
            <li>
              <ModeToggle />
            </li>
            {user ? (
              <>
                <li>
                  <Link href={`/profile/${user._id}`}>
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <User className="h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                </li>
                <li>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <LogIn className="h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register">
                    <Button variant="default" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Mobile Navigation Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <ModeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 border-b bg-background/95 backdrop-blur-sm animate-in slide-in-from-top-5 md:hidden">
          <div className="container py-4">
            <ul className="flex flex-col gap-2">
              <NavItems />
              {user ? (
                <>
                  <li className="border-t my-2 pt-2">
                    <Link 
                      href={`/profile/${user.username}`}
                      onClick={closeMenu}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-primary/5"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Button variant="outline" size="sm" onClick={() => { logout(); closeMenu(); }} className="w-full">
                      Logout
                    </Button>
                  </li>
                </>
              ) : (
                <>
                  <li className="border-t my-2 pt-2">
                    <Link 
                      href="/auth/login"
                      onClick={closeMenu}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-primary/5"
                    >
                      <LogIn className="h-4 w-4" />
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth/register" onClick={closeMenu}>
                      <Button className="w-full">
                        Sign Up
                      </Button>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}