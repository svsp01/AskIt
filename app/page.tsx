import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  ArrowRight, 
  Search, 
  Users, 
  Brain,
  TrendingUp,
  Tag
} from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 -z-10" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Find Answers, Share Knowledge, Grow Together
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Ask questions, get answers from the community, and chat with our AI assistant trained on our platform's content.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/ask">
                <Button size="lg" className="gap-2">
                  Ask a Question <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              
              <Link href="/search">
                <Button size="lg" variant="outline" className="gap-2">
                  Browse Questions <Search className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">How AskIt AI Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard
              icon={<MessageSquare className="h-10 w-10 text-blue-500" />}
              title="Ask Questions"
              description="Post your technical questions and get answers from our knowledgeable community members."
            />
            
            <FeatureCard
              icon={<Users className="h-10 w-10 text-emerald-500" />}
              title="Community Answers"
              description="Exchange knowledge and expertise with developers, data scientists, and tech enthusiasts."
            />
            
            <FeatureCard
              icon={<Brain className="h-10 w-10 text-purple-500" />}
              title="AI Assistance"
              description="Get instant help from our AI trained specifically on our platform's content, providing context-aware answers."
            />
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Growing Community</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard number="5,000+" label="Questions" icon={<MessageSquare className="h-6 w-6 text-blue-500" />} />
            <StatCard number="12,000+" label="Answers" icon={<TrendingUp className="h-6 w-6 text-green-500" />} />
            <StatCard number="1,500+" label="Users" icon={<Users className="h-6 w-6 text-orange-500" />} />
            <StatCard number="100+" label="Topics" icon={<Tag className="h-6 w-6 text-purple-500" />} />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get answers?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Join our community today and start asking questions, sharing knowledge, or chatting with our AI assistant.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="text-primary gap-2">
                Create Account <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            
            <Link href="/ai/chat">
              <Button size="lg" variant="outline" className="border-primary-foreground gap-2">
                Try AI Chat <Brain className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string; }) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-lg transition-all">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function StatCard({ number, label, icon }: { number: string; label: string; icon: React.ReactNode; }) {
  return (
    <div className="bg-background rounded-lg p-6 shadow-sm border flex flex-col items-center text-center">
      <div className="mb-2">{icon}</div>
      <p className="text-3xl font-bold mb-1">{number}</p>
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
}