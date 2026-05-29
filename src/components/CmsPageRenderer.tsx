import { useCmsPage } from "@/hooks/useCmsPage";
import { CmsBlocksRenderer } from "@/components/CmsBlocksRenderer";
import { Loader2 } from "lucide-react";

interface CmsPageRendererProps {
  slug: string;
  fallback: React.ReactNode;
}

export function CmsPageRenderer({ slug, fallback }: CmsPageRendererProps) {
  const { page, loading } = useCmsPage(slug);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (page?.is_published && page.blocks.length > 0) {
    return <CmsBlocksRenderer page={page} />;
  }

  return <>{fallback}</>;
}
