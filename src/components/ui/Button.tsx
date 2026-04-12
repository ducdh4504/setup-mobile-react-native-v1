import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';

type Variant = 'primary' | 'secondary' | 'ghost';

type Props = PressableProps & {
  title: string;
  variant?: Variant;
  loading?: boolean;
};

const variantClasses: Record<Variant, string> = {
  primary: 'bg-slate-900 active:bg-slate-800',
  secondary: 'bg-slate-100 active:bg-slate-200',
  ghost: 'bg-transparent',
};

const textVariantClasses: Record<Variant, string> = {
  primary: 'text-white font-semibold',
  secondary: 'text-slate-900 font-semibold',
  ghost: 'text-slate-900 font-semibold',
};

export function Button({ title, variant = 'primary', loading, disabled, className, ...rest }: Props) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      className={`min-h-[48px] items-center justify-center rounded-xl px-4 py-3 ${variantClasses[variant]} ${isDisabled ? 'opacity-50' : ''} ${className ?? ''}`}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#ffffff' : '#0f172a'} />
      ) : (
        <Text className={`text-base ${textVariantClasses[variant]}`}>{title}</Text>
      )}
    </Pressable>
  );
}
