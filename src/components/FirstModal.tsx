import { useState } from "react";
import { BaseModal } from "../app/modal_lib/BaseModal";
import { useModalRenderer } from "../app/modal_lib/hooks/useModalRenderer";
import { ConfirmModal } from "./ConfirmModal";

export function FirstModal() {
  const { open, replace, replaceWithBack, close } = useModalRenderer();
  const [value, setValue] = useState("");

  return (
    <BaseModal title="Первая модалка">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button
          onClick={() =>
            replace(ConfirmModal, {
              message: "Открыта вместо первой (replace)",
              onConfirm: () => alert("подтверждено"),
            })
          }
        >
          Открыть ConfirmModal вместо этой
        </button>

        <button
          onClick={() =>
            open(ConfirmModal, {
              message: "Открыта поверх первой (open)",
              onConfirm: () => alert("подтверждено"),
            })
          }
        >
          Открыть ConfirmModal поверх
        </button>

        <button
          onClick={() =>
            replaceWithBack(ConfirmModal, {
              message: "Открыта вместо первой (replaceWithBack)",
              onConfirm: () => alert("подтверждено"),
            })
          }
        >
          Открыть ConfirmModal вместо этой (с возвратом)
        </button>

        <button onClick={() => close()}>Закрыть</button>

        <input
          type="text"
          placeholder="Введите текст"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </BaseModal>
  );
}
