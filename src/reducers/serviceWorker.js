const UPDATE_SERVICE_WORKER = "updateServiceWorker";


const updateWorker = () => {
    return {
        type: UPDATE_SERVICE_WORKER
    }
}

const serviceWorkerReducer = (state = { isUpdateAvailable: false }, payload) => {
    switch (payload.type) {
        case UPDATE_SERVICE_WORKER:
            state = { ...state, isUpdateAvailable: true };
            return state;
        default:
            return state;
    }
}

export { updateWorker }
export default serviceWorkerReducer;