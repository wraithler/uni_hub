import { Box } from '@mantine/core';
import { AuthenticationForm } from '@/components/LoginForm';

export function AuthPage() {
  return (
    <Box
      style={{
        display: 'flex', // Flexbox for centering
        justifyContent: 'center', // Horizontal centering
        alignItems: 'center', // Vertical centering
        height: '100vh', // Full viewport height
        maxWidth: 450,
        margin: '0 auto', // Center horizontally based on maxWidth
        padding: '1rem', // Consistent padding
      }}
    >
      <AuthenticationForm />
    </Box>
  );
}
