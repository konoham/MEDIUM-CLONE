import { axiosInstence } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export const usePublishStory = () => {
  return useMutation({
    mutationFn: async (value) => {
      const request = await axiosInstence.post(
        "/feature/publish/new-story",
        value,
      );
      return request;
    },
  });
};
