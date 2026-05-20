import { useEffect, useState } from 'react';

export interface GuestInfo {
  name: string;
  inviteType: 'vip' | 'general' | 'family';
  isCoupled: boolean;
}

export const useGuest = (): GuestInfo => {
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    name: 'Sahakar Family Guests',
    inviteType: 'general',
    isCoupled: false,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // Check multiple query variations
    const rawName = params.get('guest') || params.get('g') || params.get('to') || params.get('name');
    const rawInv = params.get('inv') || params.get('invite') || '';
    
    let name = 'Sahakar Family Guests';
    let inviteType: 'vip' | 'general' | 'family' = 'general';
    let isCoupled = false;

    if (rawName) {
      // Decode and clean string
      const decoded = decodeURIComponent(rawName).trim();
      
      // Check for couples or families: "and", "&", "n"
      if (/\s(and|&|n)\s/i.test(decoded)) {
        isCoupled = true;
      }
      
      // Capitalize words
      name = decoded
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }

    if (rawInv.toLowerCase() === 'vip') {
      inviteType = 'vip';
    } else if (rawInv.toLowerCase() === 'family') {
      inviteType = 'family';
    }

    setGuestInfo({ name, inviteType, isCoupled });
  }, []);

  return guestInfo;
};
