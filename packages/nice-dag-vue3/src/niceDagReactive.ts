import { reactive } from 'vue';
import NiceDag from "@ebay/nice-dag-core";
import NiceDagTypes from '@ebay/nice-dag-core/lib/types';

export interface NiceDagReactiveType {
    id: string;
    observor: number,
    use: () => NiceDagTypes.NiceDag | undefined;
}

const NiceDagReactiveTypesMap: {
    [key: string]: NiceDagReactiveType
} = {};

function create(id: string) {
    const NiceDagReactiveType = reactive<NiceDagReactiveType>({
        id,
        observor: 0,
        use: () => {
            return NiceDag.use(id);
        }
    });
    NiceDagReactiveTypesMap[id] = NiceDagReactiveType;
    return NiceDagReactiveType;
}

function get(id: string) {
    return NiceDagReactiveTypesMap[id];
}

function remove(id: string) {
    delete NiceDagReactiveTypesMap[id];
}

function inc(id: string) {
    if (NiceDagReactiveTypesMap[id]) {
        NiceDagReactiveTypesMap[id].observor += 1;
    } else {
        console.error(`Can't find observor with dag id:${id}`);
    }
}

export default {
    create,
    get,
    inc,
    remove
}