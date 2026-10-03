import type { ComponentProps, ReactNode } from 'react'
import { Dialog as Primitive, Slot, Switch as SwitchPrimitive } from 'radix-ui'
import { cva, type VariantProps } from 'class-variance-authority'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { X, LoaderCircle } from 'lucide-react'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

// Source-owned shadcn/Radix pattern, adapted from Vagabond UI (see THIRD_PARTY_NOTICES).
const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md border text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-40 [&_svg]:shrink-0 [&_svg]:size-4',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-white hover:bg-primary-hover',
        secondary: 'border-border bg-raised text-foreground hover:bg-hover',
        outline: 'border-border bg-transparent text-foreground hover:bg-raised',
        ghost: 'border-transparent text-muted-foreground hover:bg-raised hover:text-foreground',
        destructive: 'border-danger/30 bg-danger/10 text-danger hover:bg-danger/20',
      },
      size: { sm: 'h-8 px-3 text-xs', default: 'h-10 px-4', lg: 'h-12 px-5', icon: 'size-9 p-0' },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export function Button({
  className,
  variant,
  size,
  asChild,
  loading,
  disabled,
  children,
  type = 'button',
  ...props
}: ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean; loading?: boolean }) {
  const Component = asChild ? Slot.Root : 'button'
  return (
    <Component
      type={asChild ? undefined : type}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {loading && <LoaderCircle className="animate-spin" aria-hidden="true" />}
          {children}
        </>
      )}
    </Component>
  )
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  children: ReactNode
  className?: string
}) {
  return (
    <Primitive.Root open={open} onOpenChange={onOpenChange}>
      <Primitive.Portal>
        <Primitive.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" />
        <Primitive.Content
          className={cn(
            'modal-content fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100%-32px)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-xl border border-border bg-surface p-6 shadow-2xl',
            className,
          )}
        >
          <Primitive.Title className="pr-8 font-heading text-xl font-semibold">
            {title}
          </Primitive.Title>
          <Primitive.Description className="mb-6 mt-2 pr-5 text-sm leading-relaxed text-muted-foreground">
            {description}
          </Primitive.Description>
          {children}
          <Primitive.Close asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-3"
              aria-label="Close dialog"
            >
              <X />
            </Button>
          </Primitive.Close>
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  )
}

export function Switch({
  label,
  ...props
}: ComponentProps<typeof SwitchPrimitive.Root> & { label: string }) {
  return (
    <SwitchPrimitive.Root
      aria-label={label}
      className="h-6 w-11 shrink-0 rounded-full bg-border transition-colors data-[state=checked]:bg-primary"
      {...props}
    >
      <SwitchPrimitive.Thumb className="block size-4 translate-x-1 rounded-full bg-white transition-transform data-[state=checked]:translate-x-6" />
    </SwitchPrimitive.Root>
  )
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded border border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground',
        className,
      )}
    >
      {children}
    </span>
  )
}
