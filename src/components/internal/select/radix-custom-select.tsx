import React from 'react'
import * as RadixSelect from '@radix-ui/react-select'
import classnames from 'classnames'
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import { CheckIcon } from '@heroicons/react/20/solid'

interface Item {
    icon?: React.ReactNode,
    value: string,
    triggerPlaceholder?: string
}

const RadixCustomSelect = (p: { items: Item[], trigger?: Item, defaultValue?: string, value?: string, onValueChange?: (newValue: string) => void, disabled?: boolean, roundedFull?: boolean }) => (
    <RadixSelect.Root onValueChange={p.onValueChange} defaultValue={p.defaultValue} value={p.value} disabled={p?.disabled}>
        <RadixSelect.Trigger
            className={`inline-flex items-center justify-center ${p?.roundedFull ? "rounded-full" : "rounded"} p-2 px-4 text-xs leading-none gap-1 bg-surface dark:bg-surface-dark hover:bg-floating hover:dark:bg-floating-dark text-surface-foreground dark:text-surface-foreground-dark border border-border dark:border-border-dark shadow-[0_2px_10px] shadow-black/10 focus:shadow-[0_0_0_2px] focus:shadow-black dark:focus:shadow-white data-[placeholder]:text-surface-foreground/50 data-[placeholder]:dark:text-surface-foreground-dark/50 outline-none`}
        >
            {p.trigger?.icon && <RadixSelect.Icon>{p.trigger.icon}</RadixSelect.Icon>}
            <RadixSelect.Value placeholder={p.trigger?.triggerPlaceholder} defaultValue={p?.defaultValue} />
            <RadixSelect.Icon className="text-surface-foreground dark:text-surface-foreground-dark">
                <ChevronDownIcon />
            </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
            <RadixSelect.Content className="overflow-hidden bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
                <RadixSelect.ScrollUpButton className="flex items-center justify-center h-[25px] bg-surface dark:bg-surface-dark text-surface-foreground dark:text-surface-foreground-dark cursor-default">
                    <ChevronUpIcon />
                </RadixSelect.ScrollUpButton>
                <RadixSelect.Viewport className="p-[5px]">
                    {p.items.map((item) => (
                        <SelectItem icon={item.icon} value={item.value} />
                    ))}
                </RadixSelect.Viewport>
                <RadixSelect.ScrollDownButton className="flex items-center justify-center h-[25px] bg-surface dark:bg-surface-dark text-surface-foreground dark:text-surface-foreground-dark cursor-default">
                    <ChevronDownIcon />
                </RadixSelect.ScrollDownButton>
            </RadixSelect.Content>
        </RadixSelect.Portal>
    </RadixSelect.Root>
)

const SelectItem = (p: { children?: React.ReactNode, className?: string, icon: React.ReactNode, value: string }) => (
    <RadixSelect.Item
        className={classnames(
            'flex space-x-1 items-center relative p-3 px-6 text-xs leading-none text-surface-foreground dark:text-surface-foreground-dark rounded-sm select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground dark:data-[highlighted]:bg-primary-dark dark:data-[highlighted]:text-primary-foreground-dark cursor-default',
            p.className
        )}
        value={p.value}
    >
        {p.icon && <RadixSelect.Icon>{p.icon}</RadixSelect.Icon>}
        <RadixSelect.ItemText>{p.children ?? p.value}</RadixSelect.ItemText>
        <RadixSelect.ItemIndicator className="absolute left-0 w-4 inline-flex items-center justify-center">
            <CheckIcon className='flex w-3.5 h-3.5' />
        </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
)

export default RadixCustomSelect