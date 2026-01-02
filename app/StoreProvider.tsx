'use client';

import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { fetchHabits, fetchLogs } from '@/store/habitSlice';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
             store.dispatch(fetchHabits());
             store.dispatch(fetchLogs());
             initialized.current = true;
        }
    }, []);

  return <Provider store={store}>{children}</Provider>;
}
