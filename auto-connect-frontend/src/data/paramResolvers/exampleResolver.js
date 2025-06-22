import { exampleSlice } from "store/slices/exampleSlice";

export const resolveExample = (state, dispatch, params) => {
    // const meters = state.meters.list;
    // const customerId = params?.customerId;
    // const metersStatus = state.meters.status;

    // if (!customerId) {
    //     return { options: [], shouldFetch: false };
    // }

    // if (metersStatus === 'loading') {
    //     return { options: [], shouldFetch: false };
    // }

    // if (!meters || metersStatus === 'idle') {
    //     return {
    //         options: [],
    //         shouldFetch: true,
    //         fetchThunk: () => fetchMeters({ customerId, page: 1, pageSize: 100 }),
    //     };
    // }

    // return {
    //     options: meters.map(m => ({ 
    //         value: String(m._id || ''), 
    //         label: m.meterName || `Meter ${m._id}` 
    //     })),
    //     shouldFetch: false
    // };

    return {
        options: [],
        shouldFetch: false,
        fetchThunk: () => {},
    };
};