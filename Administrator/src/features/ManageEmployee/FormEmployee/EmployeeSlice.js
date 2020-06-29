import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const axios = require('axios').default;


export const doCreateEmployeeThunk = createAsyncThunk(
    'doCreateEmployeeThunk',
    async (data, thunkAPI) => {
        thunkAPI.dispatch(updateValueEmployee({value: true, option: ["isLoading"]}));
        thunkAPI.dispatch(updateValueEmployee({value: "", option: ["message"]}));

        let ret = await axios.post("http://localhost:3000/employees/", thunkAPI.getState().employeeSlice.profile)
            .then(result => {
                return result.data;
            })
            .catch(err => {
                return {"status": false, "message": "An error occurred"};
            });

        thunkAPI.dispatch(updateValueEmployee({value: ret.message, option: ["message"]}));
        thunkAPI.dispatch(updateValueEmployee({value: false, option: ["isLoading"]}));


    }
);

export const doUpdateEmployeeThunk = createAsyncThunk(
    'doUpdateEmployeeThunk',
    async (data, thunkAPI) => {
        thunkAPI.dispatch(updateValueEmployee({value: true, option: ["isLoading"]}));
        thunkAPI.dispatch(updateValueEmployee({value: "", option: ["message"]}));

        let ret = await axios.put("http://localhost:3000/employees/", thunkAPI.getState().employeeSlice.profile)
            .then(result => {
                return result.data;
            })
            .catch(err => {
                return {"status": false, "message": "An error occurred"};
            });

        thunkAPI.dispatch(updateValueEmployee({value: ret.message, option: ["message"]}));
        thunkAPI.dispatch(updateValueEmployee({value: false, option: ["isLoading"]}));


    }
);


const employeeSlice = createSlice({
    name: 'employeeSlice',
    initialState: {
        profile: {
            account: "nhutthanh340",
            pass: "123456789",
            fullName: "Thanh",
            email: "thanh@gmail.com",
            phone: "09559893587"
        },
        message: "",
        isLoading: false,
        mode: 0 // 0: tạo, 1: chỉnh sửa, 2: xem
    },

    extraReducers: {
        // Add reducers for additional action types here, and handle loading state as needed
        [doCreateEmployeeThunk.fulfilled]: (state, action) => {
            // Add user to the state array
            /*state.entities.push(action.payload)*/
        },
        [doUpdateEmployeeThunk.fulfilled]: (state, action) => {
            // Add user to the state array
            /*state.entities.push(action.payload)*/
        },

    },

    reducers: {
        ClearAll: state => {

            state.profile = {
                account: "",
                pass: "",
                fullName: "",
                email: "",
                phone: ""
            };

            state.message = "";
        },
        updateValueEmployee: (state, action) => {
            if (action.payload.option.includes("account")) {
                state.profile.account = action.payload.value;
            }

            if (action.payload.option.includes("pass")) {
                state.profile.pass = action.payload.value;
            }

            if (action.payload.option.includes("fullName")) {
                state.profile.fullName = action.payload.value;
            }
            if (action.payload.option.includes("email")) {
                state.profile.email = action.payload.value;
            }
            if (action.payload.option.includes("phone")) {
                state.profile.phone = action.payload.value;
            }

            if (action.payload.option.includes("isLoading")) {
                state.isLoading = action.payload.value;
            }

            if (action.payload.option.includes("mode")) {
                state.mode = action.payload.value;
            }

            if (action.payload.option.includes("message")) {
                state.message = action.payload.value;
            }


        },

        setEmployee: (state, action) => {
            state.profile = {
                account: action.payload.account,
                pass: action.payload.pass,
                fullName: action.payload.profile.fullName,
                email: action.payload.profile.email,
                phone: action.payload.profile.phone
            };
        }

    },
});

export const employeeModel = state => state.employeeSlice;
export const {updateValueEmployee, ClearAll, setEmployee} = employeeSlice.actions;
export default employeeSlice.reducer;