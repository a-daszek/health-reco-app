import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as apiClient from "../api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";

export type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInFormData>();

  const mutation = useMutation<unknown, Error, SignInFormData>({
    mutationFn: apiClient.signIn,
    onSuccess: async () => {
      showToast({ message: "Zalogowano się pomyślnie", type: "SUCCESS" });
      await queryClient.invalidateQueries({ queryKey: ["validateToken"] });
      navigate(location.state?.from?.pathname || "/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-6 p-4" onSubmit={onSubmit}>
      <label className="text-sm font-bold flex-1">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 font-normal text-black"
          {...register("email", { required: "To pole jest wymagane." })}
        ></input>
        {errors.email && (
          <span className="text-blue-500">{errors.email.message}</span>
        )}
      </label>
      <label className="text-sm font-bold flex-1">
        Hasło
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal text-black"
          {...register("password", {
            required: "To pole jest wymagane.",
            minLength: {
              value: 15,
              message: "Hasło musi składać się z co najmniej 15 znaków.",
            },
          })}
        ></input>
        {errors.password && (
          <span className="text-blue-500">{errors.password.message}</span>
        )}
      </label>
      <span className="flex items-center justify-between">
        <span className="text-sm">
          Nie masz konta?{" "}
          <Link className="underline" to="/register">
            Stwórz je tutaj
          </Link>
        </span>
        <button type="submit">Zaloguj się</button>
      </span>
    </form>
  );
};

export default SignIn;
