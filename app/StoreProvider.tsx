'use client';

import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { hydrate } from '@/store/habitSlice';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
             const stored = localStorage.getItem('redux-habit-state');
             if (stored) {
                 try {
                     const parsed = JSON.parse(stored);
                     store.dispatch(hydrate(parsed));
                 } catch (e) {
                     console.error("Failed to load state", e);
                 }
             }
             initialized.current = true;
        }
    }, []);

  return <Provider store={store}>{children}</Provider>;
}
