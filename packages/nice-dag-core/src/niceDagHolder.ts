import { NiceDag } from "./types";

const NiceDag: {
    [key: string]: NiceDag
} = {};

export function use(id: string): NiceDag {
    return NiceDag[id];
}

export function set(id: string, niceDag: NiceDag): void {
    NiceDag[id] = niceDag;
}