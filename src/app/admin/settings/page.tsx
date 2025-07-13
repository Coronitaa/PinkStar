
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Paintbrush } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Site Settings</h1>
        <p className="text-muted-foreground">Configure global settings for your PinkStar instance.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <SettingsCard
          title="Code Highlighter Theme"
          description="Customize the color palette for all code blocks displayed on the site to match your branding."
          icon={Paintbrush}
          linkHref="/admin/settings/code-highlighter"
          linkText="Customize Theme"
        />
        {/* Future settings cards can be added here */}
      </div>
    </div>
  );
}

interface SettingsCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  linkHref: string;
  linkText: string;
  disabled?: boolean;
}

function SettingsCard({ title, description, icon: Icon, linkHref, linkText, disabled }: SettingsCardProps) {
  return (
    <Card className="h-full bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow flex flex-col border-border/30 hover:border-primary/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
        <Icon className="h-6 w-6 text-primary" />
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant={disabled ? "outline" : "default"} className={disabled ? "cursor-not-allowed opacity-50" : "button-primary-glow"} disabled={disabled}>
          <Link href={disabled ? "#" : linkHref}>{linkText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}


