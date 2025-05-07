import Link from 'next/link';
import { MessageSquare, Twitter, Facebook, Instagram, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg">AskIt AI</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              Your social Q&A platform with integrated AI assistance.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-sm mb-3">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/ask" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Ask a Question
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/ai/chat" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  AI Chat
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-sm mb-3">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-sm mb-3">Connect</h3>
            <div className="flex gap-4">
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-10 border-t pt-6">
          <p className="text-xs text-center text-muted-foreground">
            © {new Date().getFullYear()} AskIt AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}