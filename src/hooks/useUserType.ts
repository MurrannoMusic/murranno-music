import { useState, useEffect } from 'react';
import { UserType, User } from '@/types/user';

const USER_TYPE_KEY = 'murranno-user-type';

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

// Get initial user type from localStorage or default to null
const getInitialUserType = (): UserType | null => {
  const stored = localStorage.getItem(USER_TYPE_KEY);
  if (stored && (stored === 'artist' || stored === 'label' || stored === 'agency')) {
    return stored as UserType;
  }
  return null;
};

export const useUserType = () => {
  const [currentUserType, setCurrentUserType] = useState<UserType | null>(getInitialUserType);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);

  // Persist user type to localStorage whenever it changes
  useEffect(() => {
    if (currentUserType) {
      localStorage.setItem(USER_TYPE_KEY, currentUserType);
    }
  }, [currentUserType]);

  const currentUser = currentUserType ? mockUsers[currentUserType] : null;

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