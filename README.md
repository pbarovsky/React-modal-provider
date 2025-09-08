# Создание и управление модальными окнами React

## Использование

Обернуть приложение в провайдер

```ts
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ModalProvider>
      <App />
    </ModalProvider>
  </StrictMode>
);
```

### Modal

Базовый компонент модалки с полной кастомизацией.

| Пропс               | Тип               | Описание                                                                    |
| ------------------- | ----------------- | --------------------------------------------------------------------------- |
| `isOpen`            | `boolean`         | Флаг видимости модалки.                                                     |
| `onClose`           | `() => void`      | Функция закрытия модалки.                                                   |
| `title`             | `ReactNode`       | Заголовок модалки.                                                          |
| `children`          | `ReactNode`       | Контент модалки.                                                            |
| `size`              | `sm md lg full`   | Ширина модалки.                                                             |
| `closeOnBackdrop`   | `boolean`         | Закрывать модалку при клике по бекдропу.                                    |
| `showCloseButton`   | `boolean`         | Показать кнопку закрытия.                                                   |
| `animationDuration` | `number`          | Длительность анимации открытия/закрытия в мс (доп. настроить в .css файле). |
| `className`         | `string`          | Дополнительный класс для модалки.                                           |
| `backdropClassName` | `string`          | Дополнительный класс для бекдропа.                                          |
| `id`                | `string`          | Для `aria-labelledby`.                                                      |
| `ariaLabel`         | `string`          | Для `aria-label`.                                                           |
| `container`         | `Element \| null` | Контейнер для портала (по умолчанию `document.body`).                       |
| `preventBodyScroll` | `boolean`         | Блокировать скролл body при открытой модалке.                               |
| `titleIcon`         | `string`          | Иконка рядом с заголовком.                                                  |
| `showBackdrop`      | `boolean`         | Показывать бекдроп.                                                         |
| `renderHeader`      | `() => ReactNode` | Кастомный заголовок.                                                        |
| `renderActions`     | `() => ReactNode` | Кастомные действия (футер).                                                 |

### BaseModal

Упрощённая обертка над `Modal`.

Особенность: не требует передачи `isOpen` и `onClose` — они берутся из контекста модалки.

Использование:

```tsx
import React from "react";
import { type ModalComponentProps } from "../app/modal_lib/ModalProvider";
import { BaseModal } from "../app/modal_lib/BaseModal";
import ConfirmModalActions from "./ConfirmModalActions";

export interface ConfirmModalProps extends ModalComponentProps {
  message: string;
  onConfirm: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  message,
  onConfirm,
  ...baseModalProps
}) => {
  return (
    <BaseModal
      title="Подтвердите"
      size="sm"
      {...baseModalProps}
      renderActions={() => (
        <ConfirmModalActions // buttons
          onConfirm={onConfirm}
          onClose={baseModalProps.onClose}
        />
      )}
    >
      <p>{message}</p>
    </BaseModal>
  );
};
```

### Хук

```tsx
const { stack, open, replace, replaceWithBack, close, closeAll } =
  useModalRenderer();
```

| Функция                             | Описание                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------- |
| `open(Component, props)`            | Открыть новую модалку поверх текущей.                                           |
| `replace(Component, props)`         | Заменить верхнюю модалку.                                                       |
| `replaceWithBack(Component, props)` | Заменить верхнюю модалку, предыдущая временно скрыта и вернётся после закрытия. |
| `close([id])`                       | Закрыть верхнюю или указанную модалку.                                          |
| `closeAll()`                        | Закрыть все модалки.                                                            |

## Пример использования функций управления

```tsx
import { useModalRenderer } from "../hooks/useModalRenderer";
import { ConfirmModal } from "./ConfirmModal";

export function Demo() {
  const { open, replace, replaceWithBack, close } = useModalRenderer();

  return (
    <div>
      <button
        onClick={() =>
          open(ConfirmModal, {
            message: "Поверх текущей",
            onConfirm: () => alert("OK"),
          })
        }
      >
        Открыть поверх
      </button>

      <button
        onClick={() =>
          replace(ConfirmModal, {
            message: "Заменяем текущую",
            onConfirm: () => alert("OK"),
          })
        }
      >
        Заменить текущую
      </button>

      <button
        onClick={() =>
          replaceWithBack(ConfirmModal, {
            message: "Замена с возвратом",
            onConfirm: () => alert("OK"),
          })
        }
      >
        Заменить с возвратом
      </button>

      <button onClick={() => close()}>Закрыть текущую</button>
    </div>
  );
}
```

Рекомендации

> Используйте BaseModal для большинства модалок.

> Для управления стеком используйте `useModalRenderer`.

> Не передавайте `isOpen` и `onClose` вручную в модалки внутри `BaseModal`.
