import { clsx } from 'clsx';

type Spacing = 'none' | 'sm' | 'md' | 'lg' | 'xl';

// eslint-disable-next-line valid-jsdoc
/**
 * This component supports various CSS variables for theming. Here's a comprehensive list, along
 * with their default values:
 *
 * ```css
 * :root {
 *   --section-max-width-medium: 768px;
 *   --section-max-width-lg: 1024px;
 *   --section-max-width-xl: 1280px;
 *   --section-max-width-2xl: 1536px;
 * }
 * ```
 */
export function StickySidebarLayout({
  className,
  sidebar,
  children,
  sidebarSize = '1/3',
  sidebarPosition = 'before',
  containerSize = '2xl',
  hideOverflow = false,
  padding = 'lg',
  columnGap = 'lg',
  rowGap = 'md',
  stickyTop = 'md',
}: {
  className?: string;
  sidebar: React.ReactNode;
  children: React.ReactNode;
  containerSize?: 'md' | 'lg' | 'xl' | '2xl' | 'wide' | 'full';
  sidebarSize?:
    | '1/5'
    | '1/4'
    | '3/8'
    | '1/3'
    | '2/5'
    | '1/2'
    | 'x-small'
    | 'small'
    | 'medium'
    | 'large'
    | 'x-large';
  sidebarPosition?: 'before' | 'after';
  hideOverflow?: boolean;
  padding?: Spacing;
  columnGap?: Spacing;
  rowGap?: Spacing;
  stickyTop?: Spacing;
}) {
  const paddingClass = {
    none: 'px-0 py-0',
    sm: 'px-2 py-3 @xl:px-3 @xl:py-4 @4xl:px-4 @4xl:py-6',
    md: 'px-3 py-5 @xl:px-4 @xl:py-7 @4xl:px-6 @4xl:py-10',
    lg: 'px-4 py-10 @xl:px-6 @xl:py-14 @4xl:px-8 @4xl:py-20',
    xl: 'px-6 py-14 @xl:px-10 @xl:py-20 @4xl:px-12 @4xl:py-28',
  }[padding];

  const columnGapClass = {
    none: 'gap-x-0',
    sm: 'gap-x-4',
    md: 'gap-x-8',
    lg: 'gap-x-16',
    xl: 'gap-x-24',
  }[columnGap];

  const rowGapClass = {
    none: 'gap-y-0',
    sm: 'gap-y-3',
    md: 'gap-y-6',
    lg: 'gap-y-10',
    xl: 'gap-y-16',
  }[rowGap];

  const stickyTopClass = {
    none: 'top-0',
    sm: 'top-4',
    md: 'top-10',
    lg: 'top-16',
    xl: 'top-24',
  }[stickyTop];

  const containerClass = {
    md: 'max-w-[var(--section-max-width-md,768px)]',
    lg: 'max-w-[var(--section-max-width-lg,1024px)]',
    xl: 'max-w-[var(--section-max-width-xl,1280px)]',
    '2xl': 'max-w-[var(--section-max-width-2xl,1536px)]',
    wide: 'max-w-[1760px]',
    full: 'max-w-none',
  }[containerSize];

  return (
    <section
      className={clsx('group/pending @container', hideOverflow && 'overflow-hidden', className)}
    >
      <div
        className={clsx(
          'mx-auto flex flex-col items-stretch @4xl:flex-row',
          paddingClass,
          columnGapClass,
          rowGapClass,
          containerClass,
        )}
      >
        <div
          className={clsx(
            'min-w-0',
            sidebarPosition === 'after' ? 'order-2' : 'order-1',
            {
              '1/5': '@4xl:w-1/5',
              '1/4': '@4xl:w-1/4',
              '3/8': '@4xl:w-[37.5%]',
              '1/3': '@4xl:w-1/3',
              '2/5': '@4xl:w-2/5',
              '1/2': '@4xl:w-1/2',
              'x-small': '@4xl:w-40',
              small: '@4xl:w-48',
              medium: '@4xl:w-60',
              large: '@4xl:w-80',
              'x-large': '@4xl:w-96',
            }[sidebarSize],
          )}
        >
          <div className={clsx('sticky', stickyTopClass)}>{sidebar}</div>
        </div>
        <div
          className={clsx(
            'min-w-0',
            sidebarPosition === 'after' ? 'order-1' : 'order-2',
            {
              '1/5': '@4xl:w-4/5',
              '1/4': '@4xl:w-3/4',
              '3/8': '@4xl:w-[62.5%]',
              '1/3': '@4xl:w-2/3',
              '2/5': '@4xl:w-3/5',
              '1/2': '@4xl:w-1/2',
              'x-small': '@4xl:flex-1',
              small: '@4xl:flex-1',
              medium: '@4xl:flex-1',
              large: '@4xl:flex-1',
              'x-large': '@4xl:flex-1',
            }[sidebarSize],
          )}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
