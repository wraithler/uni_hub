import { useNavigate } from 'react-router-dom';
import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Flex,
  Group,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { upperFirst, useToggle } from '@mantine/hooks';
import api from '@/api';
import { GoogleButton } from '@/components/Buttons/GoogleButton';
import { MicrosoftButton } from '@/components/Buttons/MicrosoftButton';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants';

export function AuthenticationForm(props: PaperProps) {
  const [type, toggle] = useToggle(['login', 'register']);
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      email: '',
      first_name: '',
      last_name: '',
      username: '',
      password: '',
      terms: true,
    },

    // TODO: SETUP VALIDATION & PASSWORD STRENGTH INDICATOR
    // validate: {
    //     email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
    //     username: (val) => (val.length < 6 && type === 'register' ? 'Username must be longer than 6 characters' : null),
    //     password: (val) => (val.length < 8 ? 'Password must be longer than 8 characters' : null),
    // },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const endPoint = type === 'login' ? '/auth/token/' : '/users/create/';
      const response = await api.post(endPoint, values);
      if (type === 'login') {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        navigate('/');
      } else {
        toggle();
      }
    } catch (error: any) {
      form.setErrors({ password: error.response?.data?.message || 'Something went wrong' });
    }
  };

  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" fw={500}>
        Welcome to Uni Hub, {type} with
      </Text>

      <Group grow mb="md" mt="md">
        <GoogleButton radius="xl">Google</GoogleButton>
        <MicrosoftButton radius="xl">Microsoft</MicrosoftButton>
      </Group>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {type === 'register' && (
            <>
              <Flex gap="sm">
                <TextInput
                  required
                  label="First Name"
                  placeholder="Your first name"
                  value={form.values.first_name}
                  onChange={(event) => form.setFieldValue('first_name', event.currentTarget.value)}
                  radius="md"
                  error={form.errors.first_name && form.errors.first_name}
                />

                <TextInput
                  required
                  label="Last Name"
                  placeholder="Your last name"
                  value={form.values.last_name}
                  onChange={(event) => form.setFieldValue('last_name', event.currentTarget.value)}
                  radius="md"
                  error={form.errors.last_name && form.errors.last_name}
                />
              </Flex>

              <TextInput
                required
                label="Email"
                placeholder="Your email"
                value={form.values.email}
                onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                error={form.errors.email && form.errors.email}
                radius="md"
              />
            </>
          )}

          <TextInput
            required
            label="Username"
            placeholder="Your username"
            value={form.values.username}
            onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
            radius="md"
            error={form.errors.username && form.errors.username}
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && form.errors.password}
            radius="md"
          />

          {type === 'register' && (
            <Checkbox
              label="I agree to the terms and conditions"
              checked={form.values.terms}
              onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
            />
          )}
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
            {type === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Anchor>
          <Button type="submit" radius="xl">
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
