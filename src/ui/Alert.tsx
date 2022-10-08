import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Button } from "./Button";

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  trigger: React.ReactNode;
  callback: () => void;
  loading?: boolean;
  title: string;
  description: string;
}

export default ({
  trigger,
  open,
  onClose,
  callback,
  loading,
  title,
  description,
}: AlertDialogProps) => {
  return (
    <AlertDialog.Root open={open}>
      <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-20 bg-black/50" />
        <AlertDialog.Content className="fixed z-50 max-w-lg rounded-lg p-6 bg-white top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
          <AlertDialog.Title className="text-xl font-medium text-gray-900 tracking-wide">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-md font-normal text-gray-700 dark:text-gray-400">
            {description}
          </AlertDialog.Description>
          <div className="mt-8 flex justify-end space-x-2">
            <Button className="rounded-md" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="rounded-md"
              variant="primary"
              onClick={callback}
              isLoading={loading}
            >
              Submit
            </Button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
