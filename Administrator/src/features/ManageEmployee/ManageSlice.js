import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const axios = require('axios').default;

export const doDeleteEmployeeThunk = createAsyncThunk(
    'doDeleteEmployeeThunk',
    async (data, thunkAPI) => {
        thunkAPI.dispatch(updateValue({value: true, option: ["isLoading"]}));
        thunkAPI.dispatch(updateValue({value: "", option: ["message"]}));

        let ret = await axios.post("http://localhost:3000/employees/delete", {account: data})
            .then(result => {
                return result.data;
            })
            .catch(err => {
                return {"status": false, "message": "An error occurred"};
            });

        thunkAPI.dispatch(updateValue({value: ret.message, option: ["message"]}));
        thunkAPI.dispatch(updateValue({value: false, option: ["isLoading"]}));
    }
);


export const doGetEmployeeThunk = createAsyncThunk(
    'doGetEmployeeThunk',
    async (data, thunkAPI) => {
        thunkAPI.dispatch(updateValue({value: false, option: ["isStart"]}));
        thunkAPI.dispatch(updateValue({value: true, option: ["isLoading"]}));
        let state = thunkAPI.getState().manageSlice;
        let ret = await axios.post("http://localhost:3000/employees/query",
            {
                condition: {
                    account:{'$regex':state.userAccountFilter.account}
                },
                sort: {time: -1},
                limit: state.userAccountFilter.limit,
                skip: state.userAccountFilter.skip
            }
            )
            .then(result => {
                return result.data;
            })
            .catch(err => {
                return {"status": false, "message": "An error occurred"};
            });


        thunkAPI.dispatch(updateValue({value: ret.results, option: ["dataUserAccount"]}));
        thunkAPI.dispatch(updateValue({value: ret.total, option: ["totalData", "total"]}));
        thunkAPI.dispatch(updateValue({value: false, option: ["isLoading"]}));


    }
);

const manageSlice = createSlice({
    name: 'manageSlice',
    initialState: {
        total: 0,
        dataUserAccount: [],
        totalData: 0,
        currentPage: 1,
        totalPage: 0,
        userAccountFilter: {
            account:"",
            sort: {time: -1},
            skip: 0,
            limit: 10
        },
        isStart: true,
        isLoading: false,

    },

    extraReducers: {
        // Add reducers for additional action types here, and handle loading state as needed
        [doGetEmployeeThunk.fulfilled]: (state, action) => {
            // Add user to the state array
            /*state.entities.push(action.payload)*/
        },

        [doDeleteEmployeeThunk.fulfilled]: (state, action) => {
            // Add user to the state array
            /*state.entities.push(action.payload)*/
        },
    },

    reducers: {
        updateValue: (state, action) => {

            if (action.payload.option.includes("isStart")) {
                state.isStart = action.payload.value;
            }

            if (action.payload.option.includes("dataUserAccount")) {
                state.dataUserAccount = action.payload.value;
            }

            if (action.payload.option.includes("total")) {
                state.total = action.payload.value;
            }

            if (action.payload.option.includes("isLoading")) {
                state.isLoading = action.payload.value;
            }

            if (action.payload.option.includes("account")) {
                state.userAccountFilter.account = action.payload.value;
            }

            if (action.payload.option.includes("skip")) {
                state.userAccountFilter.skip = action.payload.query;
                state.currentPage = Math.ceil(state.userAccountFilter.skip / state.userAccountFilter.limit);
            }

            if (action.payload.option.includes("totalData")) {
                state.totalData = action.payload.value;
                state.totalPage = Math.ceil(state.totalData / state.userAccountFilter.limit);
            }

            if (action.payload.option.includes("currentPage")) {
                if (action.payload.value > 0 && action.payload.value <= state.totalPage) {
                    state.currentPage = action.payload.value;
                    state.userAccountFilter.skip = state.userAccountFilter.limit * (state.currentPage - 1);
                }

            }
        }

    },
});

export const manageModel = state => state.manageSlice;
export const {updateValue} = manageSlice.actions;
export default manageSlice.reducer;