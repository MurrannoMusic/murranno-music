import { useNavigate } from 'react-router-dom';
import { WelcomeCarousel } from '@/components/mobile/WelcomeCarousel';

export const Welcome = () => {
  const navigate = useNavigate();

  const handleCarouselComplete = () => {
    navigate('/user-type-selection');
  };

  return <WelcomeCarousel onComplete={handleCarouselComplete} />;
};