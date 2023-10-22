import toast from "react-hot-toast";

export function useToast() {
  return (msg: string, type = "success") => {
    if (type === "warn") {
      toast.loading(msg, {
        duration: 3000,
        position: "top-right",
      });
    } else if (type === "error") {
      toast.error(msg, {
        duration: 1500,
        position: "top-right",
      });
    } else {
      toast.success(msg, {
        duration: 1500,
        position: "top-right",
      });
    }
  };
}
