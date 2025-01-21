import { Loader } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <Loader className="animate-spin h-8 w-8 text-gray-500" />
    </div>
  );
};

export default LoadingSpinner;
