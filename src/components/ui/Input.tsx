import { forwardRef } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

type Props = TextInputProps & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<TextInput, Props>(function Input(
  { label, error, className, ...rest },
  ref,
) {
  return (
    <View className="mb-4">
      {label ? <Text className="mb-1.5 text-sm font-medium text-slate-600">{label}</Text> : null}
      <TextInput
        ref={ref}
        placeholderTextColor="#94a3b8"
        className={`rounded-xl border bg-white px-4 py-3 text-base text-slate-900 ${error ? 'border-red-400' : 'border-slate-200'} ${className ?? ''}`}
        {...rest}
      />
      {error ? <Text className="mt-1 text-sm text-red-500">{error}</Text> : null}
    </View>
  );
});
