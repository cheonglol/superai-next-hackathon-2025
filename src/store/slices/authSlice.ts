import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { User, LoginCredentials, RegisterData, AuthResponse, ResetPasswordData, ChangePasswordData } from "@/types/auth";

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  rememberMe: boolean;
  lastActivity: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("authToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  isAuthenticated: !!localStorage.getItem("authToken"),
  loading: false,
  error: null,
  rememberMe: localStorage.getItem("rememberMe") === "true",
  lastActivity: null,
};

// Async thunks
export const login = createAsyncThunk("auth/login", async (credentials: LoginCredentials, { rejectWithValue }) => {
  try {
    // Use mock authentication for both dev and production (for stakeholder demo)
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock authentication - same logic for dev and production
    if (credentials.email === "admin@jslwbistro.com" && credentials.password === "admin123") {
      const mockResponse: AuthResponse = {
        success: true,
        user: {
          id: "1",
          email: "admin@jslwbistro.com",
          name: "Admin User",
          role: "admin",
          avatar: "",
          permissions: ["read", "write", "delete", "admin"],
          lastLogin: new Date().toISOString(),
        },
        token: "mock-jwt-token-" + Date.now(),
        refreshToken: "mock-refresh-token-" + Date.now(),
        expiresIn: 3600,
        message: "Login successful",
      };
      return { ...mockResponse, rememberMe: credentials.rememberMe };
    } else if (credentials.email === "user@jslwbistro.com" && credentials.password === "user123") {
      const mockResponse: AuthResponse = {
        success: true,
        user: {
          id: "2",
          email: "user@jslwbistro.com",
          name: "Regular User",
          role: "user",
          avatar: "",
          permissions: ["read"],
          lastLogin: new Date().toISOString(),
        },
        token: "mock-jwt-token-" + Date.now(),
        refreshToken: "mock-refresh-token-" + Date.now(),
        expiresIn: 3600,
        message: "Login successful",
      };
      return { ...mockResponse, rememberMe: credentials.rememberMe };
    } else {
      throw new Error("Invalid email or password");
    }

    // TODO: In future production, uncomment this for real API calls
    // const response = await apiService.post<AuthResponse>("/auth/login", credentials);
    // return { ...response, rememberMe: credentials.rememberMe };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Login failed";
    return rejectWithValue(errorMessage);
  }
});

export const register = createAsyncThunk("auth/register", async (data: RegisterData, { rejectWithValue }) => {
  try {
    // Use mock registration for both dev and production (for stakeholder demo)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockResponse: AuthResponse = {
      success: true,
      user: {
        id: Date.now().toString(),
        email: data.email,
        name: data.name,
        role: data.role || "user",
        avatar: "",
        permissions: data.role === "admin" ? ["read", "write", "delete", "admin"] : ["read"],
        lastLogin: new Date().toISOString(),
      },
      token: "mock-jwt-token-" + Date.now(),
      refreshToken: "mock-refresh-token-" + Date.now(),
      expiresIn: 3600,
      message: "Registration successful",
    };
    return mockResponse;

    // TODO: In future production, uncomment this for real API calls
    // const response = await apiService.post<AuthResponse>("/auth/register", data);
    // return response;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Registration failed";
    return rejectWithValue(errorMessage);
  }
});

export const logout = createAsyncThunk("auth/logout", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState() as { auth: AuthState };
    const { token } = state.auth;

    if (token) {
      // For stakeholder demo, we skip API calls in both dev and production
      // TODO: In future production, uncomment this for real API calls
      // await apiService.post("/auth/logout", { token });
    }
    return true;
  } catch (error: unknown) {
    // Even if logout API fails, we should still clear local storage
    const errorMessage = error instanceof Error ? error.message : "Logout failed";
    return rejectWithValue(errorMessage);
  }
});

export const refreshAuth = createAsyncThunk("auth/refresh", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState() as { auth: AuthState };
    const { refreshToken, user } = state.auth;

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    // Use mock refresh for both dev and production (for stakeholder demo)
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (user) {
      const mockResponse: AuthResponse = {
        success: true,
        user: user,
        token: "mock-jwt-token-refreshed-" + Date.now(),
        refreshToken: "mock-refresh-token-refreshed-" + Date.now(),
        expiresIn: 3600,
        message: "Token refreshed successfully",
      };
      return mockResponse;
    }

    throw new Error("No user found for refresh");

    // TODO: In future production, uncomment this for real API calls
    // const response = await apiService.post<AuthResponse>("/auth/refresh", { refreshToken });
    // return response;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Token refresh failed";
    return rejectWithValue(errorMessage);
  }
});

export const resetPassword = createAsyncThunk("auth/resetPassword", async (data: ResetPasswordData, { rejectWithValue }) => {
  try {
    // Use mock reset password for both dev and production (for stakeholder demo)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { message: "Password reset email sent successfully" };

    // TODO: In future production, uncomment this for real API calls
    // const response = await apiService.post("/auth/reset-password", data);
    // return response;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Password reset failed";
    return rejectWithValue(errorMessage);
  }
});

export const changePassword = createAsyncThunk("auth/changePassword", async (data: ChangePasswordData, { rejectWithValue }) => {
  try {
    // Use mock change password for both dev and production (for stakeholder demo)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { message: "Password changed successfully" };

    // TODO: In future production, uncomment this for real API calls
    // const response = await apiService.post("/auth/change-password", data);
    // return response;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Password change failed";
    return rejectWithValue(errorMessage);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateLastActivity: (state) => {
      state.lastActivity = new Date().toISOString();
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.lastActivity = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("rememberMe");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken || null;
        state.isAuthenticated = true;
        state.rememberMe = action.payload.rememberMe || false;
        state.lastActivity = new Date().toISOString();

        // Store in localStorage
        localStorage.setItem("authToken", action.payload.token);
        if (action.payload.refreshToken) {
          localStorage.setItem("refreshToken", action.payload.refreshToken);
        }
        localStorage.setItem("rememberMe", String(action.payload.rememberMe || false));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken || null;
        state.isAuthenticated = true;
        state.lastActivity = new Date().toISOString();

        // Store in localStorage
        localStorage.setItem("authToken", action.payload.token);
        if (action.payload.refreshToken) {
          localStorage.setItem("refreshToken", action.payload.refreshToken);
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
        state.lastActivity = null;

        // Clear localStorage
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("rememberMe");
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        // Even if logout API fails, clear the local state
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;

        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("rememberMe");
      })

      // Refresh token
      .addCase(refreshAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken || state.refreshToken;
        state.isAuthenticated = true;
        state.lastActivity = new Date().toISOString();

        localStorage.setItem("authToken", action.payload.token);
        if (action.payload.refreshToken) {
          localStorage.setItem("refreshToken", action.payload.refreshToken);
        }
      })
      .addCase(refreshAuth.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;

        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("rememberMe");
      })

      // Reset password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Change password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, updateLastActivity, setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
