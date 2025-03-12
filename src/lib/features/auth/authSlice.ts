import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

interface User {
    id: string
    name: string
    email: string
}

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    status: "idle" | "loading" | "succeeded" | "failed"
    error: string | null
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    status: "idle",
    error: null,
}

// Async thunk for fetching the current user
export const fetchCurrentUser = createAsyncThunk("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
    try {
        const response = await fetch("/api/auth/me")

        if (!response.ok) {
            throw new Error("Failed to fetch user")
        }

        const data = await response.json()
        return data.user
    } catch (error) {
        return rejectWithValue((error as Error).message)
    }
})

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload
            state.isAuthenticated = true
            state.status = "succeeded"
        },
        clearUser: (state) => {
            state.user = null
            state.isAuthenticated = false
            state.status = "idle"
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCurrentUser.pending, (state) => {
                state.status = "loading"
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.user = action.payload
                state.isAuthenticated = true
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload as string
                state.isAuthenticated = false
            })
    },
})

export const { setUser, clearUser } = authSlice.actions

export default authSlice.reducer

