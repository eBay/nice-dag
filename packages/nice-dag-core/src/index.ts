import ReadOnlyNiceDag from './ReadOnlyNiceDag';
import WritableNiceDag from './WritableNiceDag';
import { NiceDagInitArgs, NiceDag } from "./types";
import * as niceDagHolder from './niceDagHolder';

function init(initArgs: NiceDagInitArgs, editable: boolean = false): NiceDag {
    const niceDag = editable ? new WritableNiceDag(initArgs) : new ReadOnlyNiceDag(initArgs);
    niceDagHolder.set(niceDag.id, niceDag);
    return niceDag;
}


export default {
    use: niceDagHolder.use,
    init,
}