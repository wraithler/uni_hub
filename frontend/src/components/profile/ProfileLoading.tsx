export const ProfileLoading = () => (
    <p className="text-center text-muted-foreground">Loading profile...</p>
  );
  
  export const ProfileError = ({ message }: { message: string }) => (
    <p className="text-center text-destructive">{message}</p>
  );