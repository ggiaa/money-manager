export const globalSlice = (set, get) => ({
    isLoading: true,
    isFailed: false,
    setIsLoading: (val) => {
        set({ isLoading : val });
    },
    setIsFailed: (val) => {
        set({ isFailed : val });
    },
})