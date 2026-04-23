import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as auth from './authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSessionState] = useState(() => auth.getSession());

  const refresh = useCallback(() => {
    setSessionState(auth.getSession());
  }, []);

  const logout = useCallback(() => {
    auth.clearSession();
    setSessionState(null);
  }, []);

  const loginFn = useCallback((email, password) => {
    const r = auth.login(email, password);
    if (r.ok) refresh();
    return r;
  }, [refresh]);

  const registerFn = useCallback((data) => {
    const r = auth.register(data);
    if (r.ok) refresh();
    return r;
  }, [refresh]);

  const getCurrentUser = useCallback(() => auth.getCurrentUser(), []);
  const getEmergencyContacts = useCallback(() => auth.getEmergencyContacts(), []);
  const saveEmergencyContacts = useCallback((c) => auth.saveEmergencyContacts(c), []);
  const digitsOnly = useCallback((p) => auth.digitsOnly(p), []);

  const value = useMemo(
    () => ({
      session,
      refresh,
      logout,
      login: loginFn,
      register: registerFn,
      getCurrentUser,
      getEmergencyContacts,
      saveEmergencyContacts,
      digitsOnly
    }),
    [session, refresh, logout, loginFn, registerFn, getCurrentUser, getEmergencyContacts, saveEmergencyContacts, digitsOnly]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const v = useContext(AuthContext);
  if (!v) throw new Error('useAuth must be used within AuthProvider');
  return v;
}
