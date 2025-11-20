import { ShoppingCart, Search, Menu, Globe } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black text-white border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-xl tracking-tight">Andy's Roaster Co.</h1>
            <div className="hidden md:flex items-center gap-6">
              <a href="#shop" className="text-sm hover:text-orange-500 transition-colors">Shop</a>
              <a href="#exotic" className="text-sm hover:text-orange-500 transition-colors">Exotic</a>
              <a href="#roastmaster" className="text-sm hover:text-orange-500 transition-colors">Roast Master</a>
              <a href="#about" className="text-sm hover:text-orange-500 transition-colors">About</a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:text-orange-500 hover:bg-white/10">
                  <Globe className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black text-white border-white/20">
                <DropdownMenuItem className="hover:bg-white/10 hover:text-orange-500">
                  English
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/10 hover:text-orange-500">
                  Tiếng Việt
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="ghost" size="icon" className="hidden md:flex text-white hover:text-orange-500 hover:bg-white/10">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:text-orange-500 hover:bg-white/10">
              <ShoppingCart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden text-white hover:text-orange-500 hover:bg-white/10">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
