import { For, Portal } from "solid-js/web";
import { createSignal, onMount, onCleanup } from "solid-js";
import type { JSX } from "solid-js";
import styles from "./DropdownOptions.module.css";

export type Option = {
  Label: string;
  Icon: any;
  OnClick: () => void;
};

type HorizontalAlign = "left" | "right";
type VerticalAlign = "top" | "bottom";

export type DropdownOptionsProps = {
  HorizontalAlign?: HorizontalAlign;
  HorizontalGap?: number;
  OnOutsideClick?: () => void;
  Options: Option[];
  PositionRef: HTMLElement;
  VerticalAlign?: VerticalAlign;
  VerticalGap?: number;
};

export const DropdownOptions = (props: DropdownOptionsProps) => {
  let optionContainerRef: HTMLDivElement;

  const [inlineStyles, setInlineStyles] = createSignal<JSX.CSSProperties>();

  const handleDocumentClick = (ev: MouseEvent) => {
    if (
      !ev.path.includes(optionContainerRef) &&
      !ev.path.includes(props.PositionRef)
    ) {
      props.OnOutsideClick?.();
    }
  };

  onMount(() => {
    // Create function to calculate the position of the options
    const calculatePosition = () => {
      const parent = props.PositionRef.getBoundingClientRect();
      const options = optionContainerRef?.getBoundingClientRect();

      // Calculate left value
      let left = parent.x;
      if (props.HorizontalAlign === "right") {
        left += parent?.width;
        left -= options?.width;
      }

      left += props.HorizontalGap || 0;

      // Calculate top value
      let top = parent.y + parent?.height;

      if (props.VerticalAlign === "top") {
        top -= parent?.height;
        top -= options?.height;
      }

      top += props.VerticalGap || 0;

      const styles = {
        left: `${left}px`,
        top: `${top}px`,
      };

      setInlineStyles(styles);
    };

    calculatePosition();

    // Listen for clicks
    document.addEventListener("click", handleDocumentClick);
  });

  onCleanup(() => {
    document.removeEventListener("click", handleDocumentClick);
  });

  return (
    <Portal>
      <div
        ref={optionContainerRef}
        class={styles.container}
        style={inlineStyles()}
      >
        <For each={props.Options}>
          {(option) => (
            <button
              class={styles.option}
              onClick={() => option.OnClick()}
              type="button"
            >
              {option.Label}
            </button>
          )}
        </For>
      </div>
    </Portal>
  );
};
