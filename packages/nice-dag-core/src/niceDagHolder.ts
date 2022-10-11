import { NiceDag } from "./types";

const NiceDagHolder: {
    [key: string]: NiceDag
} = {};

export function use(id: string): NiceDag {
    return NiceDagHolder[id];
}

export function set(id: string, niceDag: NiceDag): void {
    NiceDagHolder[id] = niceDag;
}