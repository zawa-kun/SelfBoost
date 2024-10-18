import { useUser } from '../contexts/UserContext';

export const useAuth = () => {
  const { user, loading } = useUser();
  return { user, loading };
};