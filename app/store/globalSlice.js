export const globalSlice = (set, get) => ({
    isLoading: false,
    isFailed: false,
    setIsLoading: () => {
        set({ isLoading : true });
    },
    setOperationFailed: () => {
        set({ isLoading: false, isFailed: true })
    },
    setOperationSuccess: () => {
        set({ isLoading: false, isFailed: false })
    },
})