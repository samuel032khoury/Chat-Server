"use client";

import { FC, useState } from "react";
import Button from "@/components/ui/Button";
import { addFriendValidator } from "@/lib/validations/add-friend";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddFriendFormProps {}

const AddFriendForm: FC<AddFriendFormProps> = ({}) => {
  const [stateOK, setStateOK] = useState<boolean>(false);

  type FormData = z.infer<typeof addFriendValidator>;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    resetField,
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });

  const addFriend = async (email: string) => {
    try {
      const validatedEmail = addFriendValidator.parse({ email });
      await axios.post("/api/friending/add", {
        email: validatedEmail,
      });
      setStateOK(true);
    } catch (error) {
      setStateOK(false);
      if (error instanceof z.ZodError) {
        setError("email", { message: error.message });
        return;
      }
      if (error instanceof AxiosError) {
        setError("root", { message: error.response?.data });
        return;
      }
      setError("root", { message: "Something went wrong!" });
    } finally {
      resetField("email");
    }
  };
  const submitAction = async (data: FormData) => {
    await addFriend(data.email);
  };

  return (
    <form className={"max-w-sm"} onSubmit={handleSubmit(submitAction)}>
      <label
        htmlFor={"email"}
        className={"block text-sm font-medium leading-6 text-gray-900"}
      >
        Add friend by Email
      </label>
      <div className={"mt-2 flex gap-4"}>
        <input
          {...register("email")}
          type={"text"}
          className={
            "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm " +
            "placeholder:text-gray-400 sm:text-sm sm:leading-6 " +
            "ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
          }
          placeholder={"john@example.com"}
        />
        <Button>Add</Button>
      </div>
      {stateOK ? (
        <p className={"mt-1 text-sm text-green-600"}>Friend request sent!</p>
      ) : (
        <p className={"mt-1 text-sm text-red-600"}>
          {errors.email?.message || errors.root?.message}
        </p>
      )}
    </form>
  );
};

export default AddFriendForm;
