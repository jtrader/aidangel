import { SeoHead } from "@/components/SeoHead";
import HamburgerMenu from "@/components/HamburgerMenu";
import NetworkFooter from "@/components/NetworkFooter";
import MyLocation from "@/components/MyLocation";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function MyLocationPage() {
  return (
    <>
      <SeoHead
        lang="en"
        basePath="/my-location"
        title="My Location — First Aid Angel"
        description="Get your what3words address, GPS coordinates and nearest street address to share with 000 emergency services."
      />
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Home
            </Link>
            <HamburgerMenu />
          </div>
        </header>
        <main>
          <MyLocation />
        </main>
        <NetworkFooter />
      </div>
    </>
  );
}
