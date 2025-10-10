import { Release } from '@/types/release';
import prototype1 from '@/assets/prototype-1.jpg';
import prototype2 from '@/assets/prototype-2.jpg';
import prototype3 from '@/assets/prototype-3.jpg';

export const mockReleases: Release[] = [
  {
    id: '1',
    title: 'Soon Come',
    artist: 'Alexandre Febe',
    type: 'Single',
    year: 2024,
    releaseDate: '15 March, 2024',
    coverArt: prototype1,
    status: 'Live',
    metadata: {
      genre: 'Afrobeats',
      language: 'English',
      label: 'Febe Records',
      copyright: '℗ 2024 Febe Records',
      upcEan: '196871234567'
    },
    smartlink: 'https://music.febe.co/soon-come'
  },
  {
    id: '2',
    title: 'Lush',
    artist: 'Alexandre Febe',
    type: 'Single',
    year: 2023,
    releaseDate: '20 August, 2023',
    coverArt: prototype2,
    status: 'Live',
    metadata: {
      genre: 'Afro-fusion',
      language: 'English',
      label: 'Febe Records',
      copyright: '℗ 2023 Febe Records',
      upcEan: '196871234568'
    },
    smartlink: 'https://music.febe.co/lush'
  },
  {
    id: '3',
    title: 'Testament',
    artist: 'Alexandre Febe',
    type: 'Single',
    year: 2025,
    releaseDate: '10 January, 2025',
    coverArt: prototype3,
    status: 'Repair',
    metadata: {
      genre: 'Afrobeats',
      language: 'Yoruba/English',
      label: 'Febe Records',
      copyright: '℗ 2025 Febe Records',
      upcEan: '196871234569'
    },
    smartlink: 'https://music.febe.co/testament'
  },
  {
    id: '4',
    title: 'score line',
    artist: 'zombie roche',
    type: 'Album',
    year: 2023,
    releaseDate: '5 June, 2023',
    coverArt: prototype1,
    status: 'Takedown',
    metadata: {
      genre: 'Alternative Hip-Hop',
      language: 'English',
      label: 'Roche Music',
      copyright: '℗ 2023 Roche Music',
      upcEan: '196871234570'
    },
    smartlink: 'https://music.roche.co/score-line'
  },
  {
    id: '5',
    title: 'Midnight Vibes',
    artist: 'DJ Pulse',
    type: 'EP',
    year: 2024,
    releaseDate: '12 February, 2024',
    coverArt: prototype2,
    status: 'Live',
    metadata: {
      genre: 'Electronic',
      language: 'Instrumental',
      label: 'Pulse Records',
      copyright: '℗ 2024 Pulse Records',
      upcEan: '196871234571'
    },
    smartlink: 'https://music.pulse.co/midnight-vibes'
  },
  {
    id: '6',
    title: 'Golden Hour',
    artist: 'Sarah Melody',
    type: 'Single',
    year: 2024,
    releaseDate: '28 April, 2024',
    coverArt: prototype3,
    status: 'Live',
    metadata: {
      genre: 'Pop',
      language: 'English',
      label: 'Melody Music',
      copyright: '℗ 2024 Melody Music',
      upcEan: '196871234572'
    },
    smartlink: 'https://music.melody.co/golden-hour'
  },
  {
    id: '7',
    title: 'Street Tales',
    artist: 'MC Blaze',
    type: 'Album',
    year: 2023,
    releaseDate: '3 November, 2023',
    coverArt: prototype1,
    status: 'Repair',
    metadata: {
      genre: 'Hip-Hop',
      language: 'Pidgin English',
      label: 'Blaze Entertainment',
      copyright: '℗ 2023 Blaze Entertainment',
      upcEan: '196871234573'
    },
    smartlink: 'https://music.blaze.co/street-tales'
  },
  {
    id: '8',
    title: 'Rhythm of Love',
    artist: 'The Harmonics',
    type: 'Single',
    year: 2024,
    releaseDate: '14 May, 2024',
    coverArt: prototype2,
    status: 'Live',
    metadata: {
      genre: 'R&B',
      language: 'English',
      label: 'Harmonics Music',
      copyright: '℗ 2024 Harmonics Music',
      upcEan: '196871234574'
    },
    smartlink: 'https://music.harmonics.co/rhythm-of-love'
  }
];
