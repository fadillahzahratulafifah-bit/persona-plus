import Link from "next/link";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";
import { MOCK_BLOGS } from "../page";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const blog = MOCK_BLOGS.find(b => b.slug === params.slug);

  if (!blog) {
    notFound();
  }

  return (
    <article className="animate-in fade-in duration-500">
      {/* Header / Hero */}
      <div className={`w-full h-[40vh] min-h-[300px] ${blog.imageUrl} relative flex items-end`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="container mx-auto px-4 md:px-6 pb-12 relative z-10 text-white">
          <Link href="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Blog
          </Link>
          <div className="mb-4">
            <span className="px-3 py-1 bg-primary/80 backdrop-blur-md text-white text-xs font-bold rounded-full">
              {blog.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-6 max-w-3xl leading-tight">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-white/80">
            <span className="flex items-center gap-2"><User className="w-4 h-4" /> {blog.author}</span>
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {blog.date}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-12 flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-2/3">
          <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
            <p className="lead text-xl text-foreground font-medium mb-8">
              {blog.excerpt}
            </p>
            
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            
            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Persiapan Adalah Kunci</h3>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            
            <div className="my-8 p-6 bg-muted/50 rounded-2xl border-l-4 border-primary">
              <p className="italic text-foreground m-0">"Kecantikan sesungguhnya dimulai dari rasa percaya diri dan persiapan kulit yang baik sebelum diaplikasikan makeup apapun."</p>
            </div>

            <h3 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Memilih Produk yang Tepat</h3>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
          </div>

          <div className="mt-12 pt-8 border-t flex justify-between items-center">
            <div className="flex gap-2">
              {/* Tags */}
              <span className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">#{blog.category.toLowerCase()}</span>
              <span className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">#tips</span>
            </div>
            <Button variant="outline" size="sm" className="rounded-full">
              <Share2 className="w-4 h-4 mr-2" /> Bagikan
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-1/3">
          <div className="bg-card border rounded-3xl p-6 sticky top-24">
            <h3 className="font-bold text-lg mb-4">Artikel Lainnya</h3>
            <div className="space-y-4">
              {MOCK_BLOGS.filter(b => b.slug !== blog.slug).map(b => (
                <Link key={b.slug} href={`/blog/${b.slug}`} className="group flex gap-4">
                  <div className={`w-20 h-20 rounded-xl shrink-0 ${b.imageUrl}`}></div>
                  <div>
                    <h4 className="font-bold text-sm group-hover:text-primary transition-colors line-clamp-2 mb-1">{b.title}</h4>
                    <span className="text-xs text-muted-foreground">{b.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
