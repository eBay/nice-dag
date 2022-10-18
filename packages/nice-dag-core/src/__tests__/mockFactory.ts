import { GetNodeSize, IViewModel, NiceDagInitArgs, Node, ViewModelConfig, Size } from "../types";
import ViewModel from "../ViewModel";
import * as niceDagHolder from '../niceDagHolder';
import ReadOnlyNiceDag from "../ReadOnlyNiceDag";
import WritableNiceDag from "../WritableNiceDag";

function defaultGetNodeSize(): Size {
    return {
        width: 60,
        height: 60
    };
}

export function initNiceDagHolder(readonly: boolean = true, getNodeSize: GetNodeSize = defaultGetNodeSize) {
    const initArgs: NiceDagInitArgs = {
        getNodeSize,
        container: document.createElement('div')
    };
    const niceDag = readonly ? new ReadOnlyNiceDag(initArgs) : new WritableNiceDag(initArgs);
    niceDagHolder.set('mock-dag', niceDag);
}

export function createViewModel({ id, nodes, vmConfig, isRootModel }: {
    id: string, nodes: Node[],
    vmConfig?: ViewModelConfig, isRootModel: boolean
}): IViewModel {
    const vm: IViewModel = new ViewModel({
        dagId: 'mock-dag',
        id: id || 'root-m',
        nodes,
        vmConfig: vmConfig || {
        },
        isRootModel
    });
    return vm;
}