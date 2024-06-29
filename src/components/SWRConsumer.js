"use client";
import { SWRConfig } from "swr";
import fetcher from '@/lib/fetcher';

export default function SWRConsumer({ children, initialData}) {
    return <SWRConfig value={
        {fallback: initialData,
            fetcher: fetcher,
            refreshInterval:30000,
        }
        }>
        {children}
    </SWRConfig>
}