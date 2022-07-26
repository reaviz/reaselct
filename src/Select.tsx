import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  CloneElement,
  ConnectedOverlay,
  ConnectedOverlayContentRef,
  Placement,
  useId
} from 'rdk';
import { SelectInput, SelectInputProps, SelectInputRef } from './SelectInput';
import { SelectMenu, SelectMenuProps } from './SelectMenu';
import { SelectOptionProps, SelectValue } from './SelectOption';
import { useWidth } from './utils/useWidth';
import { useFuzzy } from 'react-use-fuzzy';
import { createOptions, getGroups } from './utils';
import isEqual from 'react-fast-compare';

export interface SelectProps {
  id?: string;
  name?: string;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  closeOnSelect?: boolean;
  value?: string | string[];
  required?: boolean;
  multiple?: boolean;
  placeholder?: string;
  filterable?: boolean;
  clearable?: boolean;
  loading?: boolean;
  refreshable?: boolean;
  createable?: boolean;
  children?: any;
  error?: boolean;
  menuPlacement?: Placement;
  menuDisabled?: boolean;
  onInputKeydown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onInputKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (
    event: React.FocusEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement>
  ) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRefresh?: () => void;
  onChange?: (value) => void;
  onOptionsChange?: (options: SelectOptionProps[]) => void;
  input?: ReactElement<SelectInputProps, typeof SelectInput>;
  menu?: ReactElement<SelectMenuProps, typeof SelectMenu>;
}

export const Select: FC<Partial<SelectProps>> = ({
  id,
  name,
  autoFocus,
  clearable,
  filterable,
  menuPlacement,
  closeOnSelect,
  menuDisabled,
  refreshable,
  placeholder,
  disabled,
  createable,
  loading,
  multiple,
  error,
  className,
  children,
  value,
  required,
  input,
  menu,
  onRefresh,
  onChange,
  onBlur: onInputBlur,
  onFocus: onInputFocus,
  onInputKeydown,
  onInputKeyUp,
  onOptionsChange,
  onInputChange
}) => {
  const overlayRef = useRef<ConnectedOverlayContentRef | null>(null);
  const inputRef = useRef<SelectInputRef | null>(null);
  const [internalValue, setInternalValue] = useState<string | string[] | null>(
    value
  );
  const [open, setOpen] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(-1);
  const internalId = useId(id);
  const [menuWidth, updateMenuWidth] = useWidth(
    inputRef.current?.containerRef,
    overlayRef
  );
  const [options, setOptions] = useState<SelectOptionProps[]>(
    createOptions(children)
  );

  useEffect(() => {
    const opts = createOptions(children);
    if (!isEqual(opts, options)) {
      setOptions(opts);
    }
  }, [children, options]);

  const { result, keyword, search, resetSearch } = useFuzzy<SelectOptionProps>(
    options,
    {
      keys: ['children', 'group']
    }
  );

  const groups = useMemo(() => getGroups(result), [result]);

  const selectedOption: SelectValue = useMemo(() => {
    if (multiple) {
      if (internalValue || internalValue === '') {
        return options.filter(o =>
          (internalValue as string[]).includes(o.value)
        );
      }

      return [];
    } else if (internalValue || internalValue === '') {
      return options.find(o => o.value === internalValue);
    }

    return null;
  }, [options, multiple, internalValue]);

  useLayoutEffect(() => {
    updateMenuWidth();
  }, [internalValue, updateMenuWidth]);

  useEffect(() => {
    // This is needed to alllow a select to have a
    // starting variable that is set from state
    if (!isEqual(value, internalValue)) {
      setInternalValue(value);
    }
  }, [value, internalValue]);

  useEffect(() => {
    if (internalValue && createable) {
      if (multiple) {
        for (const v of internalValue) {
          const newOptions = [];

          const has = options.find(o => o.value === v);
          if (!has) {
            newOptions.push({
              children: v,
              value: v
            });
          }

          if (newOptions.length) {
            const updatedOptions = [...options, ...newOptions];

            onOptionsChange?.(updatedOptions);
          }
        }
      } else {
        const has = options.find(o => o.value === internalValue);
        if (!has) {
          const updatedOptions = [
            ...options,
            {
              children: internalValue,
              value: internalValue
            }
          ];

          onOptionsChange?.(updatedOptions);
        }
      }
    }
  }, [createable, internalValue, multiple, options, onOptionsChange]);

  const resetInput = useCallback(() => {
    setIndex(-1);
    resetSearch();
  }, [resetSearch]);

  const resetSelect = useCallback(() => {
    setOpen(false);
    resetInput();
  }, [resetInput]);

  const onArrowUpKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      event.preventDefault();
      setIndex(Math.max(index - 1, -1));
    },
    [index]
  );

  const onArrowDownKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      event.preventDefault();
      setIndex(Math.min(index + 1, groups.itemsCount - 1));
    },
    [groups.itemsCount, index]
  );

  const onInputFocused = useCallback(
    (
      event:
        | React.FocusEvent<HTMLInputElement>
        | React.MouseEvent<HTMLDivElement>
    ) => {
      if (!disabled && !menuDisabled) {
        setOpen(true);
      }

      onInputFocus?.(event);
    },
    [disabled, menuDisabled, onInputFocus]
  );

  const onInputExpanded = useCallback(
    (event: React.MouseEvent<Element>) => {
      event.stopPropagation();

      if (!disabled && !menuDisabled) {
        setOpen(!open);
      }
    },
    [disabled, menuDisabled, open]
  );

  const onInputChanged = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      search(value);
      onInputChange?.(event);
    },
    [onInputChange, search]
  );

  const toggleSelectedMultiOption = useCallback(
    (selections: SelectOptionProps | SelectOptionProps[]) => {
      const newOptions: SelectOptionProps[] = [];
      let newSelectedOptions = selectedOption as SelectOptionProps[];

      if (!selections) {
        newSelectedOptions = [];
      } else {
        if (!Array.isArray(selections)) {
          selections = [selections];
        }

        for (const next of selections) {
          const hasOption = options.find(o => o.value === next.value);
          const has = (internalValue || []).includes(next.value);
          if (has) {
            newSelectedOptions = newSelectedOptions.filter(
              o => o.value !== next.value
            );
          } else {
            newSelectedOptions = [...newSelectedOptions, next];
          }

          if (!hasOption && createable) {
            newOptions.push(next);
          }
        }
      }

      return {
        newValue: newSelectedOptions.map(o => o.value),
        newSelectedOptions,
        newOptions
      };
    },
    [createable, internalValue, options, selectedOption]
  );

  const toggleSelectedOption = useCallback(
    (option: SelectValue) => {
      let newValue: string | string[] | null;

      if (multiple) {
        const result = toggleSelectedMultiOption(option);
        newValue = result.newValue;
        if (result.newOptions?.length) {
          onOptionsChange?.([...options, ...result.newOptions]);
        }

        if (closeOnSelect) {
          setOpen(false);
        }
      } else {
        const singleOption = option as SelectOptionProps;
        const hasOption = options.find(o => o.value === singleOption?.value);
        newValue = singleOption?.value;
        const hasValue = newValue !== undefined && newValue !== null;

        if (createable && !hasOption && hasValue) {
          onOptionsChange?.([...options, singleOption]);
        }

        if (closeOnSelect && hasOption) {
          setOpen(false);
        }
      }

      setInternalValue(newValue);
      resetInput();
      onChange?.(newValue);
    },
    [
      closeOnSelect,
      createable,
      multiple,
      onChange,
      onOptionsChange,
      options,
      resetInput,
      toggleSelectedMultiOption
    ]
  );

  const onEnterKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const inputElement = event.target as HTMLInputElement;
      const inputValue = inputElement.value.trim().toLowerCase();

      if (index === -1 && createable && !inputValue) {
        return;
      }

      if (index > -1 || createable) {
        const newSelection = {
          value: createable ? result[index]?.value : inputValue,
          children: createable ? result[index]?.value : inputValue,
        };

        toggleSelectedOption(newSelection);
      }
    },
    [createable, index, result, toggleSelectedOption]
  );

  const onInputKeyedUp = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const key = event.key;

      if (key === 'ArrowUp') {
        onArrowUpKeyUp(event);
      } else if (key === 'ArrowDown') {
        onArrowDownKeyUp(event);
      } else if (key === 'Escape') {
        resetSelect();
      } else if (key === 'Enter' || key === 'Tab') {
        onEnterKeyUp(event);
      }

      onInputKeyUp?.(event);
    },
    [onArrowDownKeyUp, onArrowUpKeyUp, onEnterKeyUp, onInputKeyUp, resetSelect]
  );

  const onInputBlured = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const inputElement = event.target as HTMLInputElement;
      const inputValue = inputElement.value.trim();
      if (menuDisabled && createable && inputValue) {
        const newSelection = {
          value: inputValue,
          children: inputValue
        };

        toggleSelectedOption(newSelection);
      }

      onInputBlur?.(event);
    },
    [createable, menuDisabled, onInputBlur, toggleSelectedOption]
  );

  const onMenuSelectedChange = useCallback(
    (option: SelectValue) => {
      toggleSelectedOption(option);

      if (closeOnSelect) {
        setOpen(false);
      } else {
        inputRef.current?.focus();
      }
    },
    [closeOnSelect, toggleSelectedOption]
  );

  const onOverlayClose = useCallback(() => {
    const inputValue = keyword.trim();
    if (createable && inputValue) {
      const newSelection = {
        value: inputValue,
        children: inputValue
      };

      toggleSelectedOption(newSelection);
    }

    resetSelect();
  }, [createable, keyword, resetSelect, toggleSelectedOption]);

  return (
    <ConnectedOverlay
      open={open}
      closeOnBodyClick={true}
      closeOnEscape={true}
      appendToBody={true}
      placement={menuPlacement}
      reference={inputRef?.current?.containerRef}
      ref={overlayRef}
      onClose={onOverlayClose}
      content={() => (
        <CloneElement<SelectMenuProps>
          element={menu}
          id={`${internalId}-menu`}
          style={{ width: menuWidth }}
          selectedOption={selectedOption}
          createable={createable}
          disabled={disabled}
          options={result}
          groups={groups}
          index={index}
          multiple={multiple}
          inputSearchText={keyword}
          loading={loading}
          filterable={filterable}
          onSelectedChange={onMenuSelectedChange}
        />
      )}
    >
      <CloneElement<SelectInputProps>
        element={input}
        id={`${internalId}-input`}
        name={name}
        disabled={disabled}
        reference={inputRef}
        menuOpen={open}
        autoFocus={autoFocus}
        options={options}
        error={error}
        closeOnSelect={closeOnSelect}
        inputText={keyword}
        multiple={multiple}
        createable={createable}
        filterable={filterable}
        refreshable={refreshable}
        className={className}
        required={required}
        loading={loading}
        placeholder={placeholder}
        selectedOption={selectedOption}
        clearable={clearable}
        menuDisabled={menuDisabled}
        onSelectedChange={toggleSelectedOption}
        onExpandClick={onInputExpanded}
        onKeyDown={onInputKeydown}
        onKeyUp={onInputKeyedUp}
        onInputChange={onInputChanged}
        onBlur={onInputBlured}
        onFocus={onInputFocused}
        onRefresh={onRefresh}
      />
    </ConnectedOverlay>
  );
};

Select.defaultProps = {
  clearable: true,
  filterable: true,
  menuPlacement: 'bottom-start',
  closeOnSelect: true,
  menuDisabled: false,
  refreshable: false,
  input: <SelectInput />,
  menu: <SelectMenu />
};
