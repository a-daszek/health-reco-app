import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as apiClient from "../api";
import { toast } from "sonner";

const SignOutButton = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: apiClient.signOut,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["validateToken"] });
      queryClient.removeQueries({ queryKey: ["validateToken"] });
      toast.success("Wylogowano pomyślnie");
    },
    onError: (error: Error) => {
      toast.error(`Coś poszło nie tak: ${error}`);
    },
  });

  const handleClick = () => {
    mutation.mutate();
  };

  return <button onClick={handleClick}>Wyloguj się</button>;
};

export default SignOutButton;
