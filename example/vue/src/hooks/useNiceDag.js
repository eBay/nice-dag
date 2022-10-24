import NiceDag from "@ebay/nice-dag-core";
import { ref, onMounted } from "vue";

export default function ({ getNodeSize, jointEdgeConnectorType, initNodes }, editable) {
    const niceDagRef = ref(null);
    const niceDagEl = ref(null);

    const onNiceDagChange = {
        onChange: () => {
            patchVersion.value = patchVersion.value + 1;
        },
    };
    onMounted(() => {
        niceDagRef.value = NiceDag.init(
            {
                container: niceDagEl.value,
                getNodeSize,
                jointEdgeConnectorType,
            },
            editable
        );
        niceDagRef.value.withNodes(initNodes).render();
        niceDagRef.value.addNiceDagChangeListener(onNiceDagChange);
    });

    return {
        niceDagEl,
        niceDagRef
    }
}