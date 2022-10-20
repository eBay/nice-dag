import { ref } from 'vue';
import type { Ref } from 'vue';


const DagObversorsMap: {
    [key: string]: Ref<number>
} = {};

function create(id: string): Ref<number> {
    const obversorRef = ref(0);
    DagObversorsMap[id] = obversorRef;
    return obversorRef;
}

function get(id: string): Ref<number> | undefined {
    return DagObversorsMap[id];
}

function inc(id: string) {
    if (DagObversorsMap[id]) {
        DagObversorsMap[id].value += 1;
    } else {
        console.log(id, DagObversorsMap);
    }
}

export default {
    create,
    get,
    inc
}