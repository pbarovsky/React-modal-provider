import { FirstModal } from "../components/FirstModal";
import { useModalRenderer } from "../app/modal_lib/hooks/useModalRenderer";

export function ExamplePage() {
  const { open } = useModalRenderer();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <h1>Примеры модалок</h1>
      <button onClick={() => open(FirstModal, {})}>Открыть</button>
    </div>
  );
}
