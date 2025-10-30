import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface Release {
  id: string;
  title: string;
  cover_art_url: string | null;
  genre: string | null;
  upc_ean: string | null;
  label: string | null;
  copyright: string | null;
  language: string | null;
}

interface MetadataWarningsProps {
  release: Release;
}

export const MetadataWarnings = ({ release }: MetadataWarningsProps) => {
  const warnings: string[] = [];

  if (!release.cover_art_url) warnings.push('Missing cover artwork');
  if (!release.genre) warnings.push('No genre specified');
  if (!release.upc_ean) warnings.push('Missing UPC/EAN code');
  if (!release.label) warnings.push('No label information');
  if (!release.copyright) warnings.push('Missing copyright information');
  if (!release.language) warnings.push('Language not specified');

  if (warnings.length === 0) return null;

  return (
    <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-2">
          <p className="font-semibold">Metadata Issues Detected:</p>
          <div className="flex flex-wrap gap-2">
            {warnings.map((warning, index) => (
              <Badge key={index} variant="outline" className="border-destructive/50 text-destructive">
                {warning}
              </Badge>
            ))}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};
