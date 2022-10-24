import { NiceDag } from "./types";

const NiceDagHolder: {
    [key: string]: NiceDag
} = {};

export function use(id: string | undefined): NiceDag | undefined {
    return id ? NiceDagHolder[id] : undefined;
}

export function set(id: string, niceDag: NiceDag): void {
    NiceDagHolder[id] = niceDag;
}