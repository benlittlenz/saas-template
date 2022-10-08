import { Check, Info } from "react-feather";
import toast from "react-hot-toast";

const icon = {
  success: <Check className="h-4 w-4 text-green-500" />,
  warning: <Info className="text-blue-500" />,
  error: <Info className="h-4 w-4 text-red-500" />,
};

export default function showToast(message: string, variant: keyof typeof icon) {
  return toast.custom(
    () => (
      <div className="flex items-start bg-white shadow-md px-8 py-2 mb-2 h-9 space-x-2 rounded-md">
        {icon[variant]}
        <p className="text-sm font-medium text-gray-900">{message}</p>
      </div>
    ),
    { duration: 5000 },
  );
}
