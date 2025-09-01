import { useState, useEffect } from 'react';
import { UserType, User } from '@/types/user';

// Mock user data for UI demonstration
const mockUsers = {
  artist: {
    id: '1',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    accountType: 'artist' as UserType,
    profileImage: undefined
  },
  label: {
    id: '2', 
    name: 'Sound Wave Records',
    email: 'contact@soundwave.com',
    accountType: 'label' as UserType,
    artists: [
      { id: 'a1', name: 'Luna Sol', stageName: 'Luna Sol', isActive: true, labelId: '2', profileImage: undefined },
      { id: 'a2', name: 'The Echoes', stageName: 'The Echoes', isActive: true, labelId: '2', profileImage: undefined },
      { id: 'a3', name: 'Midnight Drive', stageName: 'Midnight Drive', isActive: true, labelId: '2', profileImage: undefined }
    ],
    companyName: 'Sound Wave Records'
  },
  agency: {
    id: '3',
    name: 'Promo Masters',
    email: 'hello@promomasters.com', 
    accountType: 'agency' as UserType,
    companyName: 'Promo Masters Agency',
    clientArtists: ['a1', 'a2', 'a4', 'a5']
  }
};

export const useUserType = () => {
  // For demo purposes, we'll cycle through user types
  const [currentUserType, setCurrentUserType] = useState<UserType>('artist');
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);

  const currentUser = mockUsers[currentUserType];

  const switchUserType = (type: UserType) => {
    setCurrentUserType(type);
    setSelectedArtist(null);
  };

  const selectArtist = (artistId: string) => {
    setSelectedArtist(artistId);
  };

  return {
    currentUserType,
    currentUser,
    selectedArtist,
    switchUserType,
    selectArtist,
    isLabel: currentUserType === 'label',
    isAgency: currentUserType === 'agency',
    isArtist: currentUserType === 'artist'
  };
};