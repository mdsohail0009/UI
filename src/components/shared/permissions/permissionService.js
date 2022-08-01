import { store } from "../../../store"

const getFeatureId = (path) => {
    const { menuItems: { features } } = store.getState();
    const feature = features?.data?.find(item => item.path == path);
    return feature.id;
}
export { getFeatureId };