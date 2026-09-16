import React, { createContext, useContext, useEffect, useState } from 'react';

type Currency = 'INR' | 'USD';

interface CurrencyContextType {
    currency: Currency;
    symbol: string;
    amount: number;
    originalAmount: number;
    isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currency, setCurrency] = useState<Currency>('INR');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const detectCurrency = async () => {
            try {
                // First check localStorage to avoid unnecessary API calls
                const cachedCurrency = localStorage.getItem('user_currency') as Currency;
                if (cachedCurrency) {
                    setCurrency(cachedCurrency);
                    setIsLoading(false);
                    return;
                }

                // Detect country via IP
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();

                const detectedCurrency: Currency = data.country_code === 'IN' ? 'INR' : 'USD';
                setCurrency(detectedCurrency);
                localStorage.setItem('user_currency', detectedCurrency);
            } catch (error) {
                console.error('Currency detection failed, defaulting to INR:', error);
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
        amount: currency === 'INR' ? 99 : 9.99,
        originalAmount: currency === 'INR' ? 999 : 99.99, // Showing 90% off usually
        isLoading
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
