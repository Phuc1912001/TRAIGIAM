import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

export interface IContext {
    isLoading: boolean;
    showLoading: (key?: string) => void;
    closeLoading: (key?: string) => void;
    closeAllLoading: () => void;
    createLoading: (key: string) => { showLoading: (key?: string) => void; closeLoading: (key?: string) => void };
}

export interface IProps {
    children?: React.ReactNode;
}

export const LoadingContext = createContext<IContext>({
    isLoading: false,
    showLoading: () => 1,
    closeLoading: () => 1,
    closeAllLoading: () => 1,
    createLoading: () => ({ showLoading: () => 1, closeLoading: () => 1 })
});

export const LoadingProvider = (props: IProps) => {
    const [loadingList, setLoadingList] = useState<string[]>([]);
    const loadingListRef = useRef<string[]>([]);
    const defaultKey = `SHOW-DETAULT-LOADING`;

    const setLoadingState = useCallback((list: string[]) => {
        loadingListRef.current = [...list];
        setLoadingList([...list]);
    }, []);

    const removeCurrentFocus = () => {
        const nav = document.querySelector('.ant-layout-sider-children') as HTMLElement;
        if (nav) {
            nav.setAttribute('tabindex', '-1');
            nav.focus();
            nav.removeAttribute('tabindex');
        }
    };

    const showLoading = useCallback((loadingKey = defaultKey) => {
        const tempKey = loadingKey || defaultKey;
        removeCurrentFocus();
        const theNewList = Array.from(new Set([...loadingListRef.current, tempKey]));
        setLoadingState(theNewList);
    }, []);
    const closeLoading = useCallback((loadingKey = defaultKey) => {
        const tempKey = loadingKey || defaultKey;
        const theNewList = loadingListRef.current.filter((item) => item !== tempKey);
        setLoadingState(theNewList);
    }, []);
    const closeAllLoading = () => {
        setLoadingState([]);
    };

    const createLoading = (key: string) => {
        return {
            showLoading: () => {
                showLoading(key);
            },
            closeLoading: () => {
                closeLoading(key);
            }
        };
    };
    const isLoading = useMemo(() => Boolean(loadingList.length), [loadingList]);

    return (
        <LoadingContext.Provider
            value={{
                isLoading,
                showLoading,
                closeLoading,
                closeAllLoading,
                createLoading
            }}
        >
            {props.children}
        </LoadingContext.Provider>
    );
};

export const LoadingConsumer = LoadingContext.Consumer;

export const useLoading = () => useContext(LoadingContext);
