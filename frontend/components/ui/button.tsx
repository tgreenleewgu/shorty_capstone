import React from 'react';
import { Pressable, Text, StyleSheet, PressableProps } from 'react-native';

interface ButtonProps extends PressableProps {
  title: string;
  color?: string;
}

export const Button: React.FC<ButtonProps> = ({ title, color = '#007bff', ...props }) => {
  return (
    <Pressable style={[styles.button, { backgroundColor: color }]} {...props}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  text: {
    color: '#fff',
    fontWeight: '600',
  },
});
