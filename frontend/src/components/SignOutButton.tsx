import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as apiClient from "../api";
import { useAppContext } from "../../contexts/AppContext";

const SignOutButton = () => {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const mutation = useMutation({
    mutationFn: apiClient.signOut,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["validateToken"] });
      queryClient.removeQueries({ queryKey: ["validateToken"] });
      showToast({ message: "Wylogowano pomyślnie", type: "SUCCESS" });
    },
    onError: (error: Error) => {
      showToast({ message: `Coś poszło nie tak: ${error}`, type: "ERROR" });
    },
  });

  const handleClick = () => {
    mutation.mutate();
  };

  return (
    <button
      onClick={handleClick}
      className="block justify-self-end mr-6 mb-4 underline text-white"
    >
      Wyloguj się
    </button>
  );
};

export default SignOutButton;
