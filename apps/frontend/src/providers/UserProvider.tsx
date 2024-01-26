import { useState, ReactNode, useMemo, useCallback, useContext } from 'react';
import { User } from '../types/User';
import { UserContext } from '../contexts/userContext';

type UserProviderProps = {
  children: ReactNode;
};

const { host } = window.location;
const userStorageKey = `user-jobs-app-${host}}`;

const getCurrentUser = (): User | undefined => {
  const currentUser = sessionStorage.getItem(userStorageKey);
  return currentUser ? (JSON.parse(currentUser) as User) : undefined;
};

const setCurrentUser = (user: User | undefined) => {
  user
    ? sessionStorage.setItem(userStorageKey, JSON.stringify(user))
    : sessionStorage.removeItem(userStorageKey);
};

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | undefined>(() => getCurrentUser());

  const changeUser = useCallback(
    (user?: User) => {
      setUser(user);
      setCurrentUser(user);
    },
    [user]
  );

  const contextValue = useMemo(
    () => ({
      user,
      changeUser,
    }),
    [user]
  );

  return (
    <UserContext.Provider value={contextValue}>
      <>{children}</>
    </UserContext.Provider>
  );
};

export default UserProvider;

export const useUser = () => useContext(UserContext);
