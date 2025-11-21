import { ShoppingCart, Menu, Globe } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const primaryLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
];

const utilityLinks = [
  { label: "Wishlist", href: "/wishlist" },
  { label: "Orders", href: "/orders" },
];

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 text-white border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <a href="/" className="text-xl tracking-tight font-medium">
              Andy's Roaster Co.
            </a>
            <div className="hidden md:flex items-center gap-6 text-sm">
              {primaryLinks.map((link) => (
                <a key={link.href} href={link.href} className="hover:text-orange-400 transition-colors">
                  {link.label}
                </a>
              ))}
              {utilityLinks.map((link) => (
                <a key={link.href} href={link.href} className="text-white/70 hover:text-orange-400 transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:text-orange-400 hover:bg-white/10">
                  <Globe className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black text-white border-white/20">
                <DropdownMenuItem className="hover:bg-white/10 hover:text-orange-400">
                  English
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/10 hover:text-orange-400">
                  Tiếng Việt
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button asChild variant="ghost" size="icon" className="text-white hover:text-orange-400 hover:bg-white/10">
              <a href="/cart" aria-label="Open cart">
                <ShoppingCart className="w-5 h-5" />
              </a>
            </Button>

            <Button asChild variant="secondary" className="hidden md:inline-flex bg-white text-black hover:bg-white/90">
              <a href="/login">Account</a>
            </Button>

            <Button variant="ghost" size="icon" className="md:hidden text-white hover:text-orange-400 hover:bg-white/10">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
