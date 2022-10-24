import NiceDag from "@ebay/nice-dag-core";
import NiceDagEdges from './components/NiceDagEdges.vue';
import NiceDagNodes from './components/NiceDagNodes.vue';
import NiceDagRootView from './components/NiceDagRootView.vue';
import NiceDagTypes from '@ebay/nice-dag-core/lib/types';
import NiceDagReactive from './niceDagReactive';
import { ref, onMounted, onUnmounted } from "vue";
import type { NiceDagReactiveType } from './niceDagReactive';
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
    niceDagReactive: NiceDagReactiveType;
    reset: () => void;
};

function uuid() {
    return Math.random()
        .toString(16)
        .slice(2);
}

function useNiceDag(args: UseNiceDagArgs): UseNiceDagType {
    const { onMount, scrollPosition, initNodes, getNodeSize, ...niceDagConfig } = args;
    const niceDagEl = ref<HTMLElement | undefined>();
    const minimapEl = ref<HTMLElement | undefined>();
    const niceDagReactive = NiceDagReactive.create(uuid());

    const onNiceDagChange = {
        onChange: () => {
            NiceDagReactive.inc(niceDagReactive.id);
        },
    };
    onMounted(() => {
        const niceDag = NiceDag.init(
            {
                id: niceDagReactive.id,
                container: niceDagEl.value as HTMLElement,
                getNodeSize,
                ...niceDagConfig,
                minimapContainer: minimapEl.value,
            },
            args.editable
        );
        niceDag.withNodes(initNodes).render();
        onMount && onMount();
        niceDag.addNiceDagChangeListener(onNiceDagChange);
        NiceDagReactive.inc(niceDagReactive.id);
    });

    onUnmounted(() => {
        NiceDag.use(niceDagReactive.id)?.destory();
        NiceDagReactive.remove(niceDagReactive.id);
    });

    return {
        niceDagReactive,
        niceDagEl,
        minimapEl,
        reset: (): void => {
            NiceDag.use(niceDagReactive.id)?.destory();
        }
    }
}

export {
    useNiceDag,
    NiceDagEdges,
    NiceDagNodes,
    NiceDagRootView,
}