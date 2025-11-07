import Icn from "@/assets/Icons";

interface BootPageProps {
  onBoot: () => void;
}

const BootPage = ({ onBoot }: BootPageProps) => {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-1 text-white">
      <button
        onClick={onBoot}
        className="flex items-center justify-center rounded-full bg-gray-3 p-8 hover:bg-gray-600"
      >
        <Icn.PowerBig className="h-16 w-16" />
      </button>
    </div>
  );
};

export default BootPage;
