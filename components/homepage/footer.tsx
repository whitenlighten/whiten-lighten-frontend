import { Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-muted py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-bold text-primary mb-4">
              Whiten Lighten
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your trusted celebrity dentist providing world-class dental care
              for professionals and everyone seeking exceptional service.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className=" w-[260px]">
                6th Floor, Polystar Building, Marwa Bus-stop, 128 Remi Olowode
                Street, Lekki Phase 1, Lagos, Nigeria.
              </span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="#services"
                  className="hover:text-primary transition-colors">
                  General Dentistry
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="hover:text-primary transition-colors">
                  Cosmetic Dentistry
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="hover:text-primary transition-colors">
                  Orthodontics
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="hover:text-primary transition-colors">
                  Teeth Whitening
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="#services"
                  className="hover:text-primary transition-colors">
                  Our Services
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="hover:text-primary transition-colors">
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-primary transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Insurance
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a
                  href="tel:+2348171615134"
                  className="hover:text-primary transition-colors">
                  +234 8145-4742-98 | +234 9129-7514-05
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <div className=" flex flex-col">
                  <a
                    href="mailto:info@whitenlighten.com"
                    className="hover:text-primary transition-colors">
                    info@whitenlighten.com
                  </a>
                  <a
                    href="mailto:whitenlightenlounge@gmail.com"
                    className="hover:text-primary transition-colors">
                    whitenlightenlounge@gmail.com
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Whiten Lighten Dental Clinic. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
