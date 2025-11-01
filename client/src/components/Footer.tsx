import { Mountain, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-4">
              <Mountain className="h-5 w-5 text-primary" />
              <span>AltiDawg</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Discover authentic Nepal, powered by locals and AI.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>About Us</li>
              <li>Become an Operator</li>
              <li>Help & Support</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                hello@altidawg.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Kathmandu, Nepal
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © 2025 AltiDawg. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
