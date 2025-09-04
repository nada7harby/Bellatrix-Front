import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { uploadForm } from "../../lib/api";

/**
 * @typedef {'idle' | 'loading' | 'succeeded' | 'failed'} LoadStatus
 * @typedef {Object} AuthState
 * @property {Object|null} user
 * @property {string|null} token
 * @property {LoadStatus} status
 * @property {string|null} error
 * @property {number|null} lastFetchedAt
 * @property {number} cacheTTLms
 */

const initialState = {
  user: null,
  token: localStorage.getItem("authToken") || null,
  status: "idle",
  error: null,
  lastFetchedAt: null,
  cacheTTLms: 5 * 60 * 1000, // 5 minutes
};

// Helper: check cache validity
const isCacheValid = (lastFetchedAt, cacheTTLms) => {
  if (!lastFetchedAt) return false;
  return Date.now() - lastFetchedAt < cacheTTLms;
};

// --- Async Thunks ---
export const createAdmin = createAsyncThunk(
  "auth/createAdmin",
  async ({ payload }, { signal, rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/create-admin", payload, {
        signal,
      });
      return { data: response.data, fetchedAt: Date.now() };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ payload }, { signal, rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/login", payload, { signal });
      const { token, user } = response.data.data || response.data;

      // Store token in localStorage
      if (token) {
        localStorage.setItem("authToken", token);
      }

      return { token, user, fetchedAt: Date.now() };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async ({ force = false } = {}, { getState, signal, rejectWithValue }) => {
    const { auth } = getState();

    if (!force && isCacheValid(auth.lastFetchedAt, auth.cacheTTLms)) {
      return { skip: true };
    }

    if (!auth.token) {
      return rejectWithValue({ message: "No authentication token available" });
    }

    try {
      const response = await api.get("/api/auth/profile", {
        headers: { Authorization: `Bearer ${auth.token}` },
        signal,
      });
      return {
        data: response.data.data || response.data,
        fetchedAt: Date.now(),
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const uploadImage = createAsyncThunk(
  "auth/uploadImage",
  async ({ payload }, { getState, signal, rejectWithValue }) => {
    const { auth } = getState();

    if (!auth.token) {
      return rejectWithValue({ message: "No authentication token available" });
    }

    try {
      const formData = new FormData();
      formData.append("image", payload.image);

      const response = await uploadForm(formData, "/api/auth/upload-image", {
        headers: { Authorization: `Bearer ${auth.token}` },
        signal,
      });

      return { data: response.data, fetchedAt: Date.now() };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
      state.lastFetchedAt = null;
      localStorage.removeItem("authToken");
    },
    clearError: (state) => {
      state.error = null;
    },
    setCacheTTL: (state, action) => {
      state.cacheTTLms = action.payload;
    },
  },
  extraReducers: (builder) => {
    // --- Create Admin ---
    builder
      .addCase(createAdmin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lastFetchedAt = action.payload.fetchedAt;
        state.error = null;
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to create admin";
      })
      // --- Login ---
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.lastFetchedAt = action.payload.fetchedAt;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Login failed";
        state.token = null;
        state.user = null;
        localStorage.removeItem("authToken");
      })
      // --- Get Profile ---
      .addCase(getProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        if (action.payload?.skip) return;
        state.status = "succeeded";
        state.user = action.payload.data;
        state.lastFetchedAt = action.payload.fetchedAt;
        state.error = null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch profile";
      })
      // --- Upload Image ---
      .addCase(uploadImage.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lastFetchedAt = action.payload.fetchedAt;
        state.error = null;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to upload image";
      });
  },
});

// --- Selectors ---
import { createSelector } from "reselect";

const selectAuth = (state) => state.auth;

export const selectUser = createSelector(selectAuth, (auth) => auth.user);
export const selectToken = createSelector(selectAuth, (auth) => auth.token);
export const selectAuthStatus = createSelector(
  selectAuth,
  (auth) => auth.status
);
export const selectAuthError = createSelector(selectAuth, (auth) => auth.error);
export const selectIsAuthenticated = createSelector(
  selectAuth,
  (auth) => !!auth.token
);
export const selectIsAuthLoading = createSelector(
  selectAuth,
  (auth) => auth.status === "loading"
);
export const selectIsAuthStale = createSelector(
  selectAuth,
  (auth) => !isCacheValid(auth.lastFetchedAt, auth.cacheTTLms)
);

export const { logout, clearError, setCacheTTL } = authSlice.actions;
export default authSlice.reducer;
