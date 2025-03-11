import { Button, ButtonProps } from '@mantine/core';

function MicrosoftIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="24"
      height="24"
      viewBox="0 0 48 48"
    >
      <path fill="#ff5722" d="M6 6H22V22H6z" transform="rotate(-180 14 14)" />
      <path fill="#4caf50" d="M26 6H42V22H26z" transform="rotate(-180 34 14)" />
      <path fill="#ffc107" d="M26 26H42V42H26z" transform="rotate(-180 34 34)" />
      <path fill="#03a9f4" d="M6 26H22V42H6z" transform="rotate(-180 14 34)" />
    </svg>
  );
}

export function MicrosoftButton(props: ButtonProps & React.ComponentPropsWithoutRef<'button'>) {
  return <Button leftSection={<MicrosoftIcon />} variant="default" {...props} />;
}
