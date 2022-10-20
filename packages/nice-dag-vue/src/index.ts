import NiceDag from "@ebay/nice-dag-core";
import NiceDagEdges from './components/NiceDagEdges.vue';
import NiceDagNodes from './components/NiceDagNodes.vue';
import NiceDagTypes from '@ebay/nice-dag-core/lib/types';
import MutationObversor from './mutationObversor';
import { ref, onMounted } from "vue";
import type { Ref } from 'vue';
import type { MinimapConfig } from '@ebay/nice-dag-core/lib/types';

export type UseNiceDagArgs = Omit<NiceDagTypes.NiceDagInitArgs, 'container'> & {
    scrollPosition?: NiceDagTypes.Point;
    initNodes: NiceDagTypes.Node[];
    onMount?: () => void;
    editable?: boolean;
    minimapConfig?: MinimapConfig;
};

export type UseNiceDagType = {
    niceDagEl: Ref<HTMLElement | undefined>;
    minimapEl: Ref<HTMLElement | undefined>;
    idRef: Ref<String>;
    use: () => NiceDagTypes.NiceDag | undefined;
    reset: () => void;
};

function uuid() {
    return Math.random()
        .toString(16)
        .slice(2);
}

function useNiceDag(args: UseNiceDagArgs): UseNiceDagType {
    const { onMount, scrollPosition, initNodes, ...niceDagConfig } = args;
    const niceDagEl = ref<HTMLElement | undefined>();
    const minimapEl = ref<HTMLElement | undefined>();
    const idRef = ref<string>(uuid());
    MutationObversor.create(idRef.value);

    const onNiceDagChange = {
        onChange: () => {
            MutationObversor.inc(idRef.value);
        },
    };
    onMounted(() => {
        const niceDag = NiceDag.init(
            {
                id: idRef.value,
                container: niceDagEl.value as HTMLElement,
                ...niceDagConfig,
                minimapContainer: minimapEl.value,
            },
            args.editable
        );
        niceDag.withNodes(initNodes).render();
        onMount && onMount();
        niceDag.addNiceDagChangeListener(onNiceDagChange);
        MutationObversor.inc(idRef.value);
        console.log('inc')
    });

    return {
        idRef,
        niceDagEl,
        minimapEl,
        // mutationObversor: MutationObserver.get(idRef.current)
        use: () => {
            const id = idRef.value;
            return id ? NiceDag.use(id) : undefined;
        },
        reset: (): void => {
            const id = idRef.value;
            if (id) {
                NiceDag.use(id)?.destory();
            }
        }
    }
}

export {
    useNiceDag,
    NiceDagEdges,
    NiceDagNodes
}