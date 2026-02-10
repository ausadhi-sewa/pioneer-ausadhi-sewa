import { deliveryApi } from "@/api/delivery";
import type { Delivery } from "@/api/delivery";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface DeliveryState {
    fees: Delivery[];
    loading: boolean;
    error: string | null;
}

const initialState: DeliveryState = {
    fees: [],
    loading: false,
    error: null,
};

export const fetchDeliveryFee = createAsyncThunk(
    'delivery/fetchDeliveryFee',
    async () => {
        const data = await deliveryApi.getDeliveryFee();
        return data;
    }
);

export const updateDeliveryFee = createAsyncThunk(
    'delivery/updateDeliveryFee',
    async (fee: Delivery) => {
        const data = await deliveryApi.updateDeliveryFee(fee);
        return data;
    }
);

export const createDeliveryFee = createAsyncThunk(
    'delivery/createDeliveryFee',
    async (fee: Delivery) => {
        const data = await deliveryApi.createDeliveryFee(fee);
        return data;
    }
);

export const deleteDeliveryFee = createAsyncThunk(
    'delivery/deleteDeliveryFee',
    async (id: string) => {
        const data = await deliveryApi.deleteDeliveryFee(id);
        return data;
    }
);

export const getActiveDeliveryFee = createAsyncThunk( 'delivery/getActiveDeliveryFee', async () => {
    const data = await deliveryApi.getActiveDeliveryFee();
    return data;
});
const deliverySlice = createSlice({
    name: 'delivery',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDeliveryFee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDeliveryFee.fulfilled, (state, action) => {
                state.loading = false;
                state.fees = Array.isArray(action.payload) ? action.payload : [action.payload];
            })
            .addCase(fetchDeliveryFee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch delivery fee';
            })
            .addCase(updateDeliveryFee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDeliveryFee.fulfilled, (state, action) => {
                state.loading = false;
                const idx = state.fees.findIndex((f) => f.id === action.payload.id);
                if (idx >= 0) {
                    state.fees[idx] = action.payload;
                } else {
                    state.fees.unshift(action.payload);
                }
            })
            .addCase(updateDeliveryFee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update delivery fee';
            })
            .addCase(createDeliveryFee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createDeliveryFee.fulfilled, (state, action) => {
                state.loading = false;
                state.fees.unshift(action.payload);
            })
            .addCase(createDeliveryFee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create delivery fee';
            })
            .addCase(deleteDeliveryFee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDeliveryFee.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = (action.meta.arg as string) || '';
                state.fees = state.fees.filter((f) => f.id !== deletedId);
            })
            .addCase(deleteDeliveryFee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete delivery fee';
            }).addCase(getActiveDeliveryFee.pending, (state) => {
                state.loading = true;
                state.error = null;
            }).addCase(getActiveDeliveryFee.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    const idx = state.fees.findIndex((f) => f.id === action.payload?.id);
                    if (idx >= 0) {
                        state.fees[idx] = action.payload;
                    } else {
                        state.fees.unshift(action.payload);
                    }
                }
            }).addCase(getActiveDeliveryFee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch active delivery fee';        
    })
}});

export default deliverySlice.reducer;
