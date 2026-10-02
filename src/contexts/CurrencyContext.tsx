import React, { createContext, useContext, useEffect, useState } from 'react';

type Currency = 'INR' | 'USD';

interface CurrencyContextType {
    currency: Currency;
    symbol: string;
    amount: number;
    originalAmount: number | null;
    isLoading: boolean;
    syncCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currency, setCurrency] = useState<Currency>('INR');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const detectCurrency = async () => {
            try {
                const response = await fetch('/api/pricing');
                if (!response.ok) throw new Error('Pricing is unavailable');
                const data = await response.json();
                setCurrency(data.currency === 'USD' ? 'USD' : 'INR');
            } catch (error) {
                console.error('Currency lookup failed, defaulting to INR:', error);
                setCurrency('INR');
            } finally {
                setIsLoading(false);
            }
        };

        detectCurrency();
    }, []);

    const value = {
        currency,
        symbol: currency === 'INR' ? '₹' : '$',
        amount: currency === 'INR' ? 99 : 4.99,
        originalAmount: currency === 'INR' ? 999 : null,
        isLoading,
        syncCurrency: setCurrency,
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
