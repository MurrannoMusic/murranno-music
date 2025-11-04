import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { EnhancedAudioPlayer } from '@/components/audio/EnhancedAudioPlayer';
import { Card } from '@/components/ui/card';

const AudioDemo = () => {
  // Sample audio URL - in real app, this would come from your data
  const sampleAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
  
  return (
    <PageContainer>
      <PageHeader title="Audio Player Demo" />
      
      <p className="text-sm text-muted-foreground mb-6">
        Experience the enhanced audio player with landscape mode visualization
      </p>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Enhanced Audio Player</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Tap the fullscreen button to enter landscape mode with audio visualizations and enhanced controls.
          </p>
          
          <EnhancedAudioPlayer
            audioUrl={sampleAudioUrl}
            trackTitle="Sample Track"
            artistName="Demo Artist"
            coverArt="https://picsum.photos/seed/audio1/200/200"
          />
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Another Track</h2>
          <EnhancedAudioPlayer
            audioUrl={sampleAudioUrl}
            trackTitle="Second Track"
            artistName="Another Artist"
            coverArt="https://picsum.photos/seed/audio2/200/200"
          />
        </Card>

        <Card className="p-6 space-y-3">
          <h3 className="font-semibold">Features</h3>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
            <li>Compact player mode with essential controls</li>
            <li>Fullscreen landscape mode with real-time audio visualization</li>
            <li>Automatic screen orientation lock in fullscreen</li>
            <li>Haptic feedback for all interactions</li>
            <li>Skip forward/backward 10 seconds in fullscreen</li>
            <li>Beautiful gradient visualizations synced to audio</li>
            <li>Smooth animations and transitions</li>
          </ul>
        </Card>
      </div>
    </PageContainer>
  );
};

export default AudioDemo;
