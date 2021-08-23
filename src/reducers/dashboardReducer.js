const HANDLE_DASHBOARD_FETCH = "handleDashboardFetch";


const handleDashboardFetch = (payload)=>{
    return{
        type:HANDLE_DASHBOARD_FETCH,
        payload
    }
}

const initialState = {}